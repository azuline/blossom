import tempfile
from pathlib import Path

from click.testing import CliRunner

from tools.list_symbols.__main__ import main


def test_list_symbols_end_to_end():
    """Test the complete list_symbols CLI functionality."""
    with tempfile.TemporaryDirectory() as tmpdir:
        root = Path(tmpdir)

        # Create test files with various code entities
        (root / "app").mkdir()
        (root / "app" / "__init__.py").write_text("")
        (root / "app" / "models.py").write_text('''
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
''')

        # Files that should be excluded
        (root / "tools").mkdir()
        (root / "tools" / "test.py").write_text("def tool_function(): pass")
        (root / "app" / "models_test.py").write_text("def test_function(): pass")

        # Run the CLI command
        runner = CliRunner()
        result = runner.invoke(main, ["--root", str(root)])

        # Verify the command succeeded
        assert result.exit_code == 0

        # Verify the output contains expected symbols
        output = result.output
        assert "app.models:regular_function" in output
        assert "app.models:async_function" in output
        assert "app.models:MyClass" in output
        assert "app.models:MyClass.method" in output
        assert "app.models:MyClass.async_method" in output
        assert "app.models:MyDataclass" in output
        assert "app.models:MyDataclass.name" in output
        assert "app.models:MyDataclass.value" in output
        assert "app.models:GLOBAL_LITERAL" in output

        # Verify private symbols are excluded
        assert "_private_function" not in output
        assert "_private_method" not in output
        assert "_private" not in output

        # Verify excluded files are not included
        assert "tools" not in output
        assert "test_function" not in output


def test_nested_entities_excluded():
    """Test that nested classes and functions are not extracted."""
    with tempfile.TemporaryDirectory() as tmpdir:
        root = Path(tmpdir)

        (root / "nested.py").write_text('''
def outer_function():
    """Outer function."""
    def inner_function():
        """Should not be extracted."""
        pass

    class InnerClass:
        """Should not be extracted."""
        def inner_method(self):
            pass

    return inner_function

class OuterClass:
    """Outer class."""

    class NestedClass:
        """Should not be extracted as top-level."""
        def nested_method(self):
            pass

    def method(self):
        """Regular method."""
        def method_inner():
            pass
        return method_inner
''')

        runner = CliRunner()
        result = runner.invoke(main, ["--root", str(root)])

        assert result.exit_code == 0

        output = result.output

        # Should include outer entities
        assert "nested:outer_function" in output
        assert "nested:OuterClass" in output
        assert "nested:OuterClass.method" in output

        # Should not include nested entities
        assert "inner_function" not in output
        assert "InnerClass" not in output
        assert "NestedClass" not in output
        assert "method_inner" not in output
