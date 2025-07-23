import importlib.util
import tempfile
from pathlib import Path

# Import from __main__ in the same directory
spec = importlib.util.spec_from_file_location("code_inspector", Path(__file__).parent / "__main__.py")
assert spec is not None
assert spec.loader is not None
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

_get_python_files = module._get_python_files  # noqa: SLF001
_path_to_module = module._path_to_module  # noqa: SLF001
inspect_codebase = module.inspect_codebase


def test_path_to_module():
    root = Path("/home/test/project")
    assert _path_to_module(Path("/home/test/project/module.py"), root) == "module"
    assert _path_to_module(Path("/home/test/project/subdir/module.py"), root) == "subdir.module"
    assert _path_to_module(Path("/home/test/project/subdir/__init__.py"), root) == "subdir"


def test_get_python_files_excludes_tools_and_debug_scripts():
    with tempfile.TemporaryDirectory() as tmpdir:
        root = Path(tmpdir)

        (root / "main.py").write_text("# main")
        (root / "tools").mkdir()
        (root / "tools" / "tool.py").write_text("# tool")
        (root / ".debug_scripts").mkdir()
        (root / ".debug_scripts" / "debug.py").write_text("# debug")
        (root / ".hidden.py").write_text("# hidden")
        (root / "src").mkdir()
        (root / "src" / "module.py").write_text("# module")

        files = _get_python_files(root)
        file_names = {f.relative_to(root) for f in files}

        assert Path("main.py") in file_names
        assert Path("src/module.py") in file_names
        assert Path("tools/tool.py") not in file_names
        assert Path(".debug_scripts/debug.py") not in file_names
        assert Path(".hidden.py") not in file_names


def test_inspect_codebase_extracts_entities():
    with tempfile.TemporaryDirectory() as tmpdir:
        root = Path(tmpdir)

        test_code = '''\
from typing import Literal
import dataclasses

def regular_function():
    """A regular function."""
    pass

async def async_function():
    """An async function."""
    pass

class MyClass:
    """A test class."""

    def method(self):
        """A method."""
        pass

    async def async_method(self):
        """An async method."""
        pass

    def _private_method(self):
        """Should not be included."""
        pass

    def __init__(self):
        """Constructor should be included."""
        pass

@dataclasses.dataclass
class MyDataclass:
    """A dataclass with properties."""
    name: str
    value: int
    _private: str = "hidden"

GLOBAL_LITERAL: Literal["A", "B"] = "A"

def _private_function():
    """Should not be included."""
    pass
'''

        (root / "test_module.py").write_text(test_code)

        entities = inspect_codebase(root)

        entity_dict = {(e.name, e.type): e for e in entities}

        assert ("regular_function", "function") in entity_dict
        assert entity_dict["regular_function", "function"].docstring == "A regular function."

        assert ("async_function", "async_function") in entity_dict
        assert entity_dict["async_function", "async_function"].docstring == "An async function."

        assert ("MyClass", "class") in entity_dict
        assert entity_dict["MyClass", "class"].docstring == "A test class."

        assert ("MyClass.method", "method") in entity_dict
        assert ("MyClass.async_method", "async_method") in entity_dict
        assert ("method",) not in entity_dict, "`method` leaked into module scope"

        assert ("_private_function", "function") not in entity_dict
        assert ("MyClass._private_method", "method") not in entity_dict
        assert ("MyClass.__init__", "method") not in entity_dict

        assert ("GLOBAL_LITERAL", "literal") in entity_dict

        # Dataclass tests
        assert ("MyDataclass", "class") in entity_dict
        assert ("MyDataclass.name", "property") in entity_dict
        assert ("MyDataclass.value", "property") in entity_dict
        assert ("MyDataclass._private", "property") not in entity_dict  # Private fields excluded


def test_nested_classes_and_functions():
    """Test that nested classes and functions are not extracted."""
    with tempfile.TemporaryDirectory() as tmpdir:
        root = Path(tmpdir)

        test_code = '''
def outer_function():
    """Outer function."""
    def inner_function():
        """Should not be extracted."""
        pass

    class InnerClass:
        """Should not be extracted."""
        def inner_method(self):
            """Should not be extracted."""
            pass

    return inner_function

class OuterClass:
    """Outer class."""

    class NestedClass:
        """Should not be extracted as top-level."""
        def nested_method(self):
            """Should not be extracted."""
            pass

    def method(self):
        """Regular method."""
        def method_inner():
            """Should not be extracted."""
            pass
        return method_inner
'''

        (root / "test_nested.py").write_text(test_code)
        entities = inspect_codebase(root)

        entity_names = {e.name for e in entities}

        # Only outer entities should be found
        assert "outer_function" in entity_names
        assert "OuterClass" in entity_names
        assert "OuterClass.method" in entity_names

        # Nested entities should NOT be found
        assert "inner_function" not in entity_names
        assert "InnerClass" not in entity_names
        assert "InnerClass.inner_method" not in entity_names
        assert "OuterClass.NestedClass" not in entity_names
        assert "NestedClass" not in entity_names
        assert "NestedClass.nested_method" not in entity_names
        assert "nested_method" not in entity_names
        assert "method_inner" not in entity_names
