from __future__ import annotations

from dataclasses import dataclass

from database.codegen.models import Tenant
from database.access import conn_admin
from foundation.rpc.route import Req, route


@dataclass
class GetPageLoadInfoTenant:
    external_id: str
    name: str

    @classmethod
    def from_model(cls: type[GetPageLoadInfoTenant], t: Tenant) -> GetPageLoadInfoTenant:
        return cls(
            external_id=t.external_id,
            name=t.name,
        )


@dataclass
class GetPageLoadInfoOut:
    external_id: str | None
    name: str | None
    email: str | None
    tenant: GetPageLoadInfoTenant | None
    available_tenants: list[GetPageLoadInfoTenant]


@route(authorization="public", method="GET", errors=[])
async def get_page_load_info(req: Req[None]) -> GetPageLoadInfoOut:
    """
    Fetch the information needed at time of page load to identify the logged in user and
    display the application-wide page architecture.
    """
    if req.user is None:
        return GetPageLoadInfoOut(
            external_id=None,
            name=None,
            email=None,
            tenant=None,
            available_tenants=[],
        )

    # By default, our Row Level Security only allow for the active tenant to be read. So we need to
    # drop to admin to read all available tenants.
    async with conn_admin(req.pg_pool) as cq_admin:
        available_tenants = [x async for x in cq_admin.q.tenant_fetch_all(user_id=req.user.id)]

    return GetPageLoadInfoOut(
        external_id=req.user.external_id,
        name=req.user.name,
        email=req.user.email,
        tenant=GetPageLoadInfoTenant.from_model(req.tenant) if req.tenant else None,
        available_tenants=[GetPageLoadInfoTenant.from_model(t) for t in available_tenants],
    )
