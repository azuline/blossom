import dagster

from foundation.data.dag import dag_asset
from foundation.observability.logs import get_logger

logger = get_logger()


@dag_asset(name="impressions", kinds={"postgres"})
async def impressions_asset(context: dagster.AssetExecutionContext) -> None:
    # Stub for an analytics asset that does not operate per-organization.
    # TODO: OLAP store, cohort slicing.
    del context
