import tempfile
from pathlib import Path

from click.testing import CliRunner

from tools.list_errors.__main__ import main


def test_list_errors_end_to_end():
    """Test the complete list_errors CLI functionality."""
    with tempfile.TemporaryDirectory() as tmpdir:
        root = Path(tmpdir)

        # Create test files with various error class scenarios
        (root / "foundation").mkdir()
        (root / "foundation" / "__init__.py").write_text("")
        (root / "foundation" / "errors.py").write_text('''
class BaseError(Exception):
    """Base error for all custom errors."""
    pass

class ConfigurationError(BaseError):
    """Configuration-related errors."""
    pass
''')

        (root / "app").mkdir()
        (root / "app" / "__init__.py").write_text("")
        (root / "app" / "models.py").write_text('''
from foundation.errors import BaseError

class ValidationError(BaseError):
    """Data validation errors."""
    pass

class NetworkError(Exception):
    """Network-related errors."""
    pass
''')

        (root / "app" / "auth.py").write_text('''
from app.models import ValidationError

class AuthenticationError(ValidationError):
    """Authentication failures."""
    pass
''')

        # Files that should be excluded
        (root / "tools").mkdir()
        (root / "tools" / "test.py").write_text("class ToolError(Exception): pass")
        (root / "app" / "models_test.py").write_text("class TestError(Exception): pass")

        # Run the CLI command
        runner = CliRunner()
        result = runner.invoke(main, ["--root", str(root)])

        # Verify the command succeeded
        assert result.exit_code == 0

        # Verify the output contains expected error classes
        output = result.output
        assert "Exception" in output
        assert "foundation.errors.BaseError" in output
        assert "foundation.errors.ConfigurationError" in output
        assert "app.models.ValidationError" in output
        assert "app.models.NetworkError" in output
        assert "app.auth.AuthenticationError" in output

        # Verify excluded files are not included
        assert "ToolError" not in output
        assert "TestError" not in output

        # Verify tree structure (indentation indicates hierarchy)
        lines = output.strip().split("\n")

        # Find lines with specific classes
        auth_error_line = next((line for line in lines if "AuthenticationError" in line), None)
        base_error_line = next((line for line in lines if "foundation.errors.BaseError" in line), None)

        assert auth_error_line is not None
        assert base_error_line is not None

        # AuthenticationError should be more indented than BaseError (deeper in hierarchy)
        auth_indent = len(auth_error_line) - len(auth_error_line.lstrip())
        base_indent = len(base_error_line) - len(base_error_line.lstrip())
        assert auth_indent > base_indent
