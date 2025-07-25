import tempfile
from pathlib import Path

from tools.list_errors.__main__ import inspect_error_classes, _build_inheritance_tree, _format_tree_output


def test_list_errors_end_to_end():
    """Test the complete list_errors functionality from file parsing to tree output."""
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
        
        # Extract error classes and build tree
        error_classes = inspect_error_classes(root)
        tree = _build_inheritance_tree(error_classes)
        output = _format_tree_output(tree)
        
        # Verify the complete tree structure
        lines = output.strip().split('\n')
        
        # Should contain Exception as root with proper children
        assert any("Exception" in line for line in lines)
        assert any("foundation.errors.BaseError" in line for line in lines)
        assert any("foundation.errors.ConfigurationError" in line for line in lines)
        assert any("app.models.ValidationError" in line for line in lines)
        assert any("app.models.NetworkError" in line for line in lines)
        assert any("app.auth.AuthenticationError" in line for line in lines)
        
        # Should not include excluded files
        assert not any("ToolError" in line for line in lines)
        assert not any("TestError" in line for line in lines)
        
        # Verify hierarchical structure (deeper errors are more indented)
        auth_error_line = next(line for line in lines if "AuthenticationError" in line)
        base_error_line = next(line for line in lines if "foundation.errors.BaseError" in line)
        
        # AuthenticationError should be more indented than BaseError (it's deeper in hierarchy)
        auth_indent = len(auth_error_line) - len(auth_error_line.lstrip())
        base_indent = len(base_error_line) - len(base_error_line.lstrip())
        assert auth_indent > base_indent