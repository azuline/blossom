from foundation.rpc.catalog import RPCCatalog
from foundation.webserver import create_app_from_catalog


async def create_app():
    catalog = RPCCatalog(global_errors=[], rpcs=[], raw_routes=[])
    return await create_app_from_catalog(catalog)
