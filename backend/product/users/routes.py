from __future__ import annotations

from dataclasses import dataclass

from codegen.sqlc.models import Tenant
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
    external_id: str
    name: str
    email: str
    tenant: GetPageLoadInfoTenant | None
    available_tenants: list[GetPageLoadInfoTenant]


@route(name="GetPageLoadInfo", authorization="user", in_=None, out=GetPageLoadInfoOut, errors=[])
async def page_load_info(req: Req[None]) -> GetPageLoadInfoOut:
    """
    Fetch the information needed at time of page load to identify the logged in user and
    display the application-wide page architecture.
    """
    assert req.user is not None

    return GetPageLoadInfoOut(
        external_id=req.user.external_id,
        name=req.user.name,
        email=req.user.email,
        tenant=GetPageLoadInfoTenant.from_model(req.tenant) if req.tenant is not None else None,
        available_tenants=[
            GetPageLoadInfoTenant.from_model(t) async for t in req.q.tenant_fetch_all()
        ],
    )
