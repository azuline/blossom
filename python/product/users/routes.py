from __future__ import annotations

from dataclasses import dataclass

from database.xact import xact_admin
from product.framework.rpc import ReqProduct, rpc_product


@dataclass
class GetPageLoadInfoUser:
    id: str
    name: str
    email: str


@dataclass
class GetPageLoadInfoOrganization:
    id: str
    name: str


@dataclass
class GetPageLoadInfoOut:
    user: GetPageLoadInfoUser | None
    organization: GetPageLoadInfoOrganization | None
    available_organizations: list[GetPageLoadInfoOrganization]


@rpc_product("init", authorization="public", method="GET", errors=[])
async def init(req: ReqProduct[None]) -> GetPageLoadInfoOut:
    """
    Fetch the information needed at time of page load to identify the logged in user and
    display the application-wide page architecture.
    """
    if req.user is None:
        return GetPageLoadInfoOut(user=None, organization=None, available_organizations=[])

    # By default, our Row Level Security only allow for the active organization to be read. So we need to
    # drop to admin to read all available organizations.
    async with xact_admin() as q:
        available_organizations = [x async for x in q.orm.organization_fetch_all(user_id=req.user.id)]

    return GetPageLoadInfoOut(
        user=GetPageLoadInfoUser(id=req.user.id, name=req.user.name, email=req.user.email),
        organization=GetPageLoadInfoOrganization(id=req.organization.id, name=req.organization.name) if req.organization else None,
        available_organizations=[GetPageLoadInfoOrganization(id=o.id, name=o.name) for o in available_organizations],
    )
