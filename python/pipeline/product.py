import dagster

from foundation.dag import ORG_PARTITION, dag_asset
from foundation.logs import get_logger

logger = get_logger()

datasource_ext_asset = dagster.AssetSpec("datasource_ext", kinds={"external"}, description="Stub for remote third-party data.")


@dagster.sensor(default_status=dagster.DefaultSensorStatus.RUNNING, minimum_interval_seconds=4 * 3600)
def ext_datasource_sensor() -> dagster.SensorResult:
    """Mark the external data source stale every 4 hours, triggering downstream re-materializations."""
    return dagster.SensorResult(asset_events=[dagster.AssetMaterialization(asset_key=datasource_ext_asset.key)])


@dag_asset(
    name="datasource_raw",
    partitions_def=ORG_PARTITION,
    deps=[datasource_ext_asset],
    kinds={"postgres"},
    automation_condition=dagster.AutomationCondition.eager(),
)
async def datasource_raw_asset(context: dagster.AssetExecutionContext) -> None:
    # 1. Pull data from EXT.datasource.
    # 2. Dump data to `datasource_raw_asset` table.
    # 3. Return materialized result summary.
    del context
