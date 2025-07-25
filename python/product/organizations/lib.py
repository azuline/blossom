from database.__codegen__ import models
from database.enums import OrganizationsInboundSourceEnum
from database.xact import DBQuerier
from foundation.observability.errors import BaseError
from foundation.stdlib.convert import cast_notnull


class OrganizationNotFoundError(BaseError):
    pass


class UserNotFoundError(BaseError):
    pass


async def organization_create(q: DBQuerier, *, name: str, inbound_source: OrganizationsInboundSourceEnum) -> models.Organization:
    organization = await q.orm.organization_create(name=name, inbound_source=inbound_source)
    assert organization is not None
    return organization


async def organization_add_user(q: DBQuerier, *, organization_id: str, user_id: str) -> models.OrganizationsUser:
    organization = await q.orm.organization_fetch(id=organization_id)
    if not organization:
        raise OrganizationNotFoundError
    user = await q.orm.user_fetch(id=user_id)
    if not user:
        raise UserNotFoundError
    return cast_notnull(await q.orm.organization_add_user(organization_id=organization.id, user_id=user.id))
