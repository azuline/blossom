from __future__ import annotations

import random
from string import ascii_letters
from typing import TYPE_CHECKING, TypeVar

from codegen.sqlc.models import Tenant, TenantsInboundSource, User, UsersTenant
from codegen.sqlc.queries import AsyncQuerier
from foundation.database import Conn

if TYPE_CHECKING:
    from foundation.test.fixture import TFix

# password='password'
DEFAULT_PASSWORD_HASH = "pbkdf2:sha256:260000$q7moIpBgn1qWGg6Q$110299a9e14a5d29d21a4d22bfa43e81587380bc0e3a607bd5b3222f27d47973"  # noqa

T = TypeVar("T")


class TestFactory:
    """
    The testfactory generates test data for testing purposes!
    """

    _t: TFix
    _conn: Conn
    _query: AsyncQuerier

    def __init__(self, t: TFix, *, conn: Conn) -> None:
        self._t = t
        self._conn = conn
        self._query = AsyncQuerier(conn)

    # Utility factory.

    def rand_str(self, length: int = 12) -> str:
        return "".join(random.choice(ascii_letters) for _ in range(length))

    def email(self) -> str:
        return self.rand_str() + "@sunsetglow" + self.rand_str(4) + ".net"

    # Model factory.

    async def __finalizer(self, rv: T | None) -> T:
        await self._conn.commit()
        assert rv is not None
        return rv

    async def customer(self) -> tuple[User, Tenant]:
        """
        A convenience wrapper around creating a user, tenant, and user_tenant.
        """
        user = await self.user()
        tenant = await self.tenant()
        await self.user_tenant_create(user_id=user.id, tenant_id=tenant.id)
        return user, tenant

    async def tenant(
        self,
        *,
        inbound_source: TenantsInboundSource = TenantsInboundSource.ORGANIC,
    ) -> Tenant:
        rv = await self._query.test_tenant_create(
            name=self.rand_str(),
            inbound_source=inbound_source,
        )
        return await self.__finalizer(rv)

    async def user(self) -> User:
        rv = await self._query.test_user_create(
            name=self.rand_str(),
            email=self.email(),
            password_hash=DEFAULT_PASSWORD_HASH,
        )
        return await self.__finalizer(rv)

    async def user_disabled(self) -> User:
        rv = await self._query.test_user_create_disabled(
            name=self.rand_str(),
            email=self.email(),
            password_hash=DEFAULT_PASSWORD_HASH,
        )
        return await self.__finalizer(rv)

    async def user_not_signed_up(self) -> User:
        rv = await self._query.test_user_create_not_signed_up(
            name=self.rand_str(),
            email=self.email(),
        )
        return await self.__finalizer(rv)

    async def user_tenant_create(
        self,
        *,
        user_id: int,
        tenant_id: int,
    ) -> UsersTenant:
        rv = await self._query.test_user_tenant_create(
            user_id=user_id,
            tenant_id=tenant_id,
        )
        return await self.__finalizer(rv)
