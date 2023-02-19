from codegen.sqlc.models import Tenant, TenantsInboundSource, TenantsUser
from foundation.database import ConnQuerier


class TenantNotFoundError(Exception):
    pass


class UserNotFoundError(Exception):
    pass


async def tenant_create(
    *,
    cq: ConnQuerier,
    name: str,
    inbound_source: TenantsInboundSource,
) -> Tenant:
    tenant = await cq.q.tenant_create(name=name, inbound_source=inbound_source)
    assert tenant is not None
    return tenant


async def tenant_add_user(
    *,
    cq: ConnQuerier,
    tenant_id: str,
    user_id: str,
) -> TenantsUser:
    tenant = await cq.q.tenant_fetch_ext(external_id=tenant_id)
    if not tenant:
        raise TenantNotFoundError
    user = await cq.q.user_fetch_ext(external_id=user_id)
    if not user:
        raise UserNotFoundError
    tu = await cq.q.tenant_add_user(tenant_id=tenant.id, user_id=user.id)
    assert tu is not None
    return tu
