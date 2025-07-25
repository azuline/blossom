import ast
import contextlib
import dataclasses
from pathlib import Path

import click


@dataclasses.dataclass(slots=True)
class ErrorClass:
    name: str
    module: str
    base_classes: list[str]
    docstring: str | None = None


def _inspect_error_classes(root_dir: Path) -> list[ErrorClass]:
    """Inspect codebase and extract all error classes."""
    error_classes: list[ErrorClass] = []

    exclude_dirs = {"tools", ".debug_scripts", "__pycache__", ".git", ".venv", "venv", "env"}
    python_files = [
        path
        for path in root_dir.rglob("*.py")
        if not any(excluded in path.parts for excluded in exclude_dirs) and not path.name.startswith(".") and not path.name.endswith("_test.py")
    ]

    for file_path in python_files:
        # Convert file path to module path
        relative_path = file_path.relative_to(root_dir)
        module_parts = [*relative_path.parts[:-1], relative_path.stem]
        if module_parts and module_parts[-1] == "__init__":
            module_parts = module_parts[:-1]
        module_path = ".".join(module_parts) if module_parts else file_path.stem

        with contextlib.suppress(Exception):
            with file_path.open(encoding="utf-8") as f:
                content = f.read()

            try:
                tree = ast.parse(content)
            except SyntaxError:
                continue

            for node in tree.body:
                if isinstance(node, ast.ClassDef):
                    # Extract base class names
                    base_names = []
                    for base in node.bases:
                        if isinstance(base, ast.Name):
                            base_names.append(base.id)
                        elif isinstance(base, ast.Attribute):
                            # Handle qualified names like module.BaseError
                            parts = []
                            current = base
                            while isinstance(current, ast.Attribute):
                                parts.append(current.attr)
                                current = current.value
                            if isinstance(current, ast.Name):
                                parts.append(current.id)
                            base_names.append(".".join(reversed(parts)))

                    # Check if this class inherits from BaseError or other Error classes
                    if any("BaseError" in base_name or "Error" in base_name or base_name in ["Exception", "ValueError", "TypeError", "RuntimeError"] for base_name in base_names):
                        # Extract docstring
                        docstring = None
                        if node.body and isinstance(node.body[0], ast.Expr) and isinstance(node.body[0].value, ast.Constant) and isinstance(node.body[0].value.value, str):
                            docstring = node.body[0].value.value.strip()

                        error_classes.append(ErrorClass(name=node.name, module=module_path, base_classes=base_names, docstring=docstring))
    return error_classes


def _build_inheritance_tree(error_classes: list[ErrorClass]) -> dict[str, list[str]]:
    """Build a tree structure showing inheritance relationships."""
    # Create a mapping of class name to full qualified name
    class_registry = {}
    for error_class in error_classes:
        full_name = f"{error_class.module}.{error_class.name}"
        class_registry[error_class.name] = full_name
        class_registry[full_name] = full_name

    # Build parent -> children mapping
    tree: dict[str, list[str]] = {}

    for error_class in error_classes:
        full_name = f"{error_class.module}.{error_class.name}"

        for base_class in error_class.base_classes:
            # Resolve base class to full name if possible
            parent = class_registry.get(base_class, base_class)

            if parent not in tree:
                tree[parent] = []
            tree[parent].append(full_name)

    return tree


def _format_tree_output(tree: dict[str, list[str]]) -> str:
    """Format the inheritance tree in a tree-like structure."""
    # Find root classes (those that appear as parents but not as children)
    all_children = set()
    for children in tree.values():
        all_children.update(children)
    root_classes = [parent for parent in tree if parent not in all_children]
    root_classes.sort()

    lines: list[str] = []

    # Use a stack to avoid recursion and inline the subtree formatting
    stack = [(root, "", i == len(root_classes) - 1) for i, root in enumerate(root_classes)]

    while stack:
        class_name, prefix, is_last = stack.pop()

        # Format current class
        connector = "└── " if is_last else "├── "
        lines.append(f"{prefix}{connector}{class_name}")

        # Add children to stack (in reverse order so they're processed in correct order)
        children = tree.get(class_name, [])
        children.sort()

        for i, child in enumerate(reversed(children)):
            child_is_last = i == 0  # First in reversed order means last child
            child_prefix = prefix + ("    " if is_last else "│   ")
            stack.append((child, child_prefix, child_is_last))

    return "\n".join(lines)


@click.command()
@click.option("--root", "-r", type=click.Path(exists=True, path_type=Path), default=Path.cwd(), help="Root directory to inspect")
def main(root: Path):
    """List all error classes in the codebase in a tree format showing inheritance."""
    error_classes = _inspect_error_classes(root)
    tree = _build_inheritance_tree(error_classes)
    output = _format_tree_output(tree)
    click.echo(output)


if __name__ == "__main__":
    main()
