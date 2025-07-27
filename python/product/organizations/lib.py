from database.__codegen_db__.models import OrganizationModel, OrganizationsUserModel
from database.conn import DBConn
from database.enums import OrganizationsInboundSourceEnum
from foundation.observability.errors import BaseError, NotFoundError
from product.organizations.__codegen_db__.queries import query_organization_create, query_organization_fetch, query_organization_user_add
from product.users.__codegen_db__.queries import query_user_fetch


class OrganizationNotFoundError(BaseError):
    pass


class UserNotFoundError(BaseError):
    pass


async def organization_create(conn: DBConn, *, name: str, inbound_source: OrganizationsInboundSourceEnum) -> OrganizationModel:
    return await query_organization_create(conn, name=name, inbound_source=inbound_source)


async def organization_add_user(conn: DBConn, *, organization_id: str, user_id: str) -> OrganizationsUserModel:
    try:
        await query_organization_fetch(conn, id=organization_id)
    except NotFoundError:
        raise OrganizationNotFoundError from None
    try:
        await query_user_fetch(conn, id=user_id)
    except NotFoundError:
        raise UserNotFoundError from None
    return await query_organization_user_add(conn, organization_id=organization_id, user_id=user_id)
