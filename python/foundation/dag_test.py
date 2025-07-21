from collections.abc import Callable
from typing import cast

import dagster
import pytest

from foundation.conftest import FoundationFixture
from foundation.dag import dag_asset
from foundation.errors import BlossomError


def test_asset_decorator_creates_dagster_asset():
    @dag_asset()
    def my_asset():
        return "data"

    assert isinstance(my_asset, dagster.AssetsDefinition)
    assert my_asset.key.to_user_string() == "my_asset"

    with dagster.build_asset_context() as context:
        assert cast(Callable, my_asset(context)) == "data"


def test_asset_decorator_reports_errors_to_sentry(t: FoundationFixture):
    """Test that errors raised inside asset functions are reported to Sentry."""

    class TestAssetError(BlossomError):
        pass

    @dag_asset()
    def failing_asset():
        raise TestAssetError("test error")

    with dagster.build_asset_context() as context, pytest.raises(TestAssetError):
        failing_asset(context)

    t.error.assert_reported(TestAssetError)
