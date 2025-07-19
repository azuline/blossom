import dagster
import pytest

from foundation.dag import dag_asset
from foundation.errors import BlossomError
from foundation.conftest import FoundationFixture


def test_asset_decorator_creates_dagster_asset():
    @dag_asset()
    def my_asset():
        return "data"

    assert isinstance(my_asset, dagster.AssetsDefinition)
    assert my_asset.key.to_user_string() == "my_asset"


def test_asset_decorator_preserves_function_behavior():
    """Test that the asset decorator preserves the original function behavior."""

    @dag_asset()
    def compute_value():
        return 42

    assert isinstance(compute_value, dagster.AssetsDefinition)


def test_asset_decorator_reports_errors_to_sentry(t: FoundationFixture):
    """Test that errors raised inside asset functions are reported to Sentry."""

    class TestAssetError(BlossomError):
        pass

    @dag_asset()
    def failing_asset():
        raise TestAssetError("test error")

    with pytest.raises(TestAssetError):
        failing_asset(dagster.build_asset_context())

    t.errors.assert_reported(TestAssetError)
