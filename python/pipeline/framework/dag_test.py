from collections.abc import Callable
from typing import cast

import dagster
import pytest

from foundation.observability.errors import BaseError
from pipeline.conftest import PipelineFixture
from pipeline.framework.dag import dag_asset


def test_asset_decorator_creates_dagster_asset():
    @dag_asset(name="my_asset")
    def my_asset():
        return "data"

    assert isinstance(my_asset, dagster.AssetsDefinition)
    assert my_asset.key.to_user_string() == "my_asset"

    with dagster.build_asset_context() as context:
        assert cast(Callable, my_asset(context)) == "data"


def test_asset_decorator_reports_errors_to_sentry(t: PipelineFixture):
    """Test that errors raised inside asset functions are reported to Sentry."""

    class TestAssetError(BaseError):
        pass

    @dag_asset(name="failing_asset")
    def failing_asset():
        raise TestAssetError("test error")

    with dagster.build_asset_context() as context, pytest.raises(TestAssetError):
        failing_asset(context)

    t.error.assert_reported(TestAssetError)
