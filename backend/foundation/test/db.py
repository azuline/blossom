from __future__ import annotations

from typing import TYPE_CHECKING

from codegen.sqlc.models import Tenant, User
from codegen.sqlc.queries import AsyncQuerier
from foundation.database import ConnPool, ConnQuerier, set_row_level_security

if TYPE_CHECKING:
    from foundation.test.fixture import TFix


class TestDB:
    """
    The database subset of fixtures on TFix.
    """

    pg_pool: ConnPool

    _t: TFix
    _conn_admin: ConnQuerier | None
    _conn_customer: ConnQuerier | None
    _user_tenant: tuple[User, Tenant | None] | None

    def __init__(self, t: TFix, *, pg_pool: ConnPool) -> None:
        self._t = t
        self.pg_pool = pg_pool
        self._conn_admin = None
        self._conn_customer = None
        self._user_tenant = None

    async def conn_admin(self) -> ConnQuerier:
        if self._conn_admin:
            return self._conn_admin
        # Generally unsafe, but TFix calls `putconn()` for us in `__aexit__` so it's ok.
        conn = await self.pg_pool.getconn()
        self._conn_admin = ConnQuerier(c=conn, q=AsyncQuerier(conn))
        return self._conn_admin

    async def conn_customer(
        self,
        with_tenant: bool = True,
    ) -> tuple[ConnQuerier, User, Tenant | None]:
        if self._conn_customer and self._user_tenant:
            return self._conn_customer, *self._user_tenant

        user = await self._t.f.user()
        tenant = None
        if with_tenant:
            tenant = await self._t.f.tenant()
            await self._t.f.tenant_user_create(user_id=user.id, tenant_id=tenant.id)
        # Generally unsafe, but TFix calls `putconn()` for us in `__aexit__` so it's ok.
        conn = await self.pg_pool.getconn()
        self._conn_customer = ConnQuerier(c=conn, q=AsyncQuerier(conn))
        await set_row_level_security(self._conn_customer.c, user, tenant)
        self._user_tenant = (user, tenant)
        return self._conn_customer, *self._user_tenant

    async def cleanup(self) -> None:
        if self._conn_admin:
            await self.pg_pool.putconn(self._conn_admin.c)
        if self._conn_customer:
            await self.pg_pool.putconn(self._conn_customer.c)
