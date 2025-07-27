import asyncio

import dagster
import sqlalchemy

from database.xact import xact_admin
from foundation.observability.metrics import metric_count_and_time
from pipeline.analytics import impressions_asset
from pipeline.framework.dag import ORG_PARTITION
from pipeline.product import datasource_ext_asset, datasource_raw_asset, ext_datasource_sensor


@dagster.sensor(default_status=dagster.DefaultSensorStatus.RUNNING)
def dynamic_partition_sensor() -> dagster.SensorResult:
    # We define one partition per external data sources that a customer may have. Dynamically
    # populate each partition with the organizations that depend on each partition's data source.
    async def _dynamic_partition_sensor_coro() -> dagster.SensorResult:
        async with xact_admin() as conn:
            # TODO: Replace with generated query function when available
            result = await conn.execute(sqlalchemy.text("SELECT id FROM organizations ORDER BY id"))
            organization_ids = [row[0] for row in result.fetchall()]
        return dagster.SensorResult(dynamic_partitions_requests=[ORG_PARTITION.build_add_request(organization_ids)])

    with metric_count_and_time("pipeline.org_partition.sensor"):
        return asyncio.run(_dynamic_partition_sensor_coro())


@dagster.definitions
def defs() -> dagster.Definitions:
    # All assets and sensors must be defined in this list, or Dagster won't know they exist and therefore cannot
    # schedule them.
    return dagster.Definitions(
        assets=[
            datasource_ext_asset,
            datasource_raw_asset,
            impressions_asset,
        ],
        sensors=[
            dynamic_partition_sensor,
            ext_datasource_sensor,
        ],
    )
