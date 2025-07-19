from __future__ import annotations

from dataclasses import dataclass

from database.codegen.models import Organization
from database.access import conn_admin
from foundation.rpc.route import Req, route


@dataclass
class GetPageLoadInfoOrganization:
    external_id: str
    name: str

    @classmethod
    def from_model(cls: type[GetPageLoadInfoOrganization], t: Organization) -> GetPageLoadInfoOrganization:
        return cls(
            external_id=t.external_id,
            name=t.name,
        )


@dataclass
class GetPageLoadInfoOut:
    external_id: str | None
    name: str | None
    email: str | None
    organization: GetPageLoadInfoOrganization | None
    available_organizations: list[GetPageLoadInfoOrganization]


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
            organization=None,
            available_organizations=[],
        )

    # By default, our Row Level Security only allow for the active organization to be read. So we need to
    # drop to admin to read all available organizations.
    async with conn_admin(req.pg_pool) as cq_admin:
        available_organizations = [x async for x in cq_admin.q.organization_fetch_all(user_id=req.user.id)]

    return GetPageLoadInfoOut(
        external_id=req.user.external_id,
        name=req.user.name,
        email=req.user.email,
        organization=GetPageLoadInfoOrganization.from_model(req.organization) if req.organization else None,
        available_organizations=[GetPageLoadInfoOrganization.from_model(t) for t in available_organizations],
    )
