import ast
import contextlib
import dataclasses
import json
from pathlib import Path

import click


@dataclasses.dataclass(slots=True)
class CodeEntity:
    name: str
    type: str
    module: str
    docstring: str | None = None


def _inspect_codebase(root_dir: Path) -> list[CodeEntity]:
    exclude_dirs = {"tools", "claude", "__pycache__", ".git", ".venv", "venv", "env"}
    python_files = [
        path
        for path in root_dir.rglob("*.py")
        if not any(excluded in path.parts for excluded in exclude_dirs) and not path.name.startswith(".") and not path.name.endswith("_test.py")
    ]

    entities: list[CodeEntity] = []
    for file_path in python_files:
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

            # Process only top-level nodes to avoid duplicating methods
            for node in tree.body:
                docstring = None
                if (
                    isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef))
                    and node.body
                    and isinstance(node.body[0], ast.Expr)
                    and isinstance(node.body[0].value, ast.Constant)
                    and isinstance(node.body[0].value.value, str)
                ):
                    docstring = node.body[0].value.value.strip()

                if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                    if not node.name.startswith("_"):
                        entity_type = "async_function" if isinstance(node, ast.AsyncFunctionDef) else "function"
                        entities.append(CodeEntity(name=node.name, type=entity_type, module=module_path, docstring=docstring))
                elif isinstance(node, ast.ClassDef) and not node.name.startswith("_"):
                    entities.append(CodeEntity(name=node.name, type="class", module=module_path, docstring=docstring))

                    # Check if this is a dataclass
                    is_dataclass = any(
                        (isinstance(dec, ast.Name) and dec.id == "dataclass")
                        or (isinstance(dec, ast.Attribute) and dec.attr == "dataclass")
                        or (
                            isinstance(dec, ast.Call)
                            and ((isinstance(dec.func, ast.Name) and dec.func.id == "dataclass") or (isinstance(dec.func, ast.Attribute) and dec.func.attr == "dataclass"))
                        )
                        for dec in node.decorator_list
                    )

                    for item in node.body:
                        if isinstance(item, (ast.FunctionDef, ast.AsyncFunctionDef)) and not item.name.startswith("_"):
                            item_docstring = None
                            if item.body and isinstance(item.body[0], ast.Expr) and isinstance(item.body[0].value, ast.Constant) and isinstance(item.body[0].value.value, str):
                                item_docstring = item.body[0].value.value.strip()
                            method_type = "async_method" if isinstance(item, ast.AsyncFunctionDef) else "method"
                            entities.append(CodeEntity(name=f"{node.name}.{item.name}", type=method_type, module=module_path, docstring=item_docstring))
                        elif is_dataclass and isinstance(item, ast.AnnAssign) and isinstance(item.target, ast.Name) and not item.target.id.startswith("_"):
                            entities.append(CodeEntity(name=f"{node.name}.{item.target.id}", type="property", module=module_path, docstring=None))
                elif (
                    isinstance(node, ast.AnnAssign)
                    and isinstance(node.target, ast.Name)
                    and node.target.id.isupper()
                    and isinstance(node.annotation, ast.Subscript)
                    and (
                        (isinstance(node.annotation.value, ast.Name) and node.annotation.value.id == "Literal")
                        or (isinstance(node.annotation.value, ast.Attribute) and node.annotation.value.attr == "Literal")
                    )
                ):
                    entities.append(CodeEntity(name=node.target.id, type="literal", module=module_path, docstring=None))
    return entities


def _format_output(entities: list[CodeEntity], format: str) -> str:
    if format == "json":
        return json.dumps([{"name": e.name, "type": e.type, "module": e.module, "docstring": e.docstring} for e in entities], indent=2)
    lines: list[str] = []
    for entity in sorted(entities, key=lambda e: (e.module, e.type, e.name)):
        if entity.docstring:
            first_line = entity.docstring.split("\n")[0].strip()
            lines.append(f"{entity.module}:{entity.name} # {first_line}")
        else:
            lines.append(f"{entity.module}:{entity.name}")
    return "\n".join(lines)


@click.command()
@click.option("--root", "-r", type=click.Path(exists=True, path_type=Path), default=Path.cwd(), help="Root directory to inspect")
@click.option("--format", "-f", type=click.Choice(["text", "json"]), default="text", help="Output format")
def main(root: Path, format: str):
    """List all public functions, classes, methods, and literals in the codebase."""
    entities = _inspect_codebase(root)
    output = _format_output(entities, format)
    click.echo(output)


if __name__ == "__main__":
    main()
