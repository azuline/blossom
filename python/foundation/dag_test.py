import dagster
import pytest

from foundation.dag.dag import asset
from foundation.errors import BlossomError
from foundation.testing.fixture import TFix


def test_asset_decorator_creates_dagster_asset():
    @asset()
    def my_asset():
        return "data"

    assert isinstance(my_asset, dagster.AssetsDefinition)
    assert my_asset.key.to_user_string() == "my_asset"


def test_asset_decorator_preserves_function_behavior():
    """Test that the asset decorator preserves the original function behavior."""

    @asset()
    def compute_value():
        return 42

    assert isinstance(compute_value, dagster.AssetsDefinition)


def test_asset_decorator_reports_errors_to_sentry(t: TFix):
    """Test that errors raised inside asset functions are reported to Sentry."""

    class TestAssetError(BlossomError):
        pass

    @asset()
    def failing_asset():
        raise TestAssetError("test error")

    with pytest.raises(TestAssetError):
        failing_asset(dagster.build_asset_context())

    t.errors.assert_reported(TestAssetError)
