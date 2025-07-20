import pytest

from foundation.env import ENV
from foundation.errors import BlossomError, suppress_error


class Test1Error(BlossomError):
    __test__ = False


class Test1ChildError(Test1Error):
    __test__ = False


class Test2Error(BlossomError):
    __test__ = False


def test_suppress_error():
    assert ENV.environment == "development", "this test only works in development"

    with suppress_error(BlossomError):
        raise BlossomError
    with suppress_error(BlossomError):
        raise Test1Error

    # Test nothing happens when no error.
    with suppress_error(BlossomError):
        pass

    # Test error subclass filtering.
    with suppress_error(Test1Error):
        raise Test1Error
    with suppress_error(Test1Error):
        raise Test1ChildError

    # Test sibling error non-filtering.
    with pytest.raises(Test1Error), suppress_error(Test2Error):
        raise Test1Error

    # Test environment filtering.
    with suppress_error(BlossomError, environments=("development",)):
        raise BlossomError
    with suppress_error(BlossomError, environments=("production", "development")):
        raise BlossomError

    # Test environment non-filtering.
    with pytest.raises(BlossomError), suppress_error(BlossomError, environments=("production",)):
        raise BlossomError
