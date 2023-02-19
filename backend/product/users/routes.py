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
    external_id: str | None
    name: str | None
    email: str | None
    available_tenants: list[GetPageLoadInfoTenant]


@route(
    name="GetPageLoadInfo",
    authorization="public",
    in_=None,
    out=GetPageLoadInfoOut,
    method="GET",
    errors=[],
)
async def page_load_info(req: Req[None]) -> GetPageLoadInfoOut | None:
    """
    Fetch the information needed at time of page load to identify the logged in user and
    display the application-wide page architecture.
    """
    if req.user is None:
        return GetPageLoadInfoOut(
            external_id=None,
            name=None,
            email=None,
            available_tenants=[],
        )

    return GetPageLoadInfoOut(
        external_id=req.user.external_id,
        name=req.user.name,
        email=req.user.email,
        available_tenants=[
            GetPageLoadInfoTenant.from_model(t) async for t in req.cq.q.tenant_fetch_all()
        ],
    )
