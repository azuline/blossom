from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from codegen.sqlc.models import Session, Tenant, TenantsInboundSource, TenantsUser, User

from database.access.xact import xact
from foundation.identifiers import generate_name
from foundation.organizations.organizations import (
    Organization,
    OrganizationIngest,
    OrganizationSheets,
    OrganizationSlack,
)

if TYPE_CHECKING:  # pragma: no cover
    pass

# password='password'
DEFAULT_PASSWORD_HASH = "pbkdf2:sha256:260000$q7moIpBgn1qWGg6Q$110299a9e14a5d29d21a4d22bfa43e81587380bc0e3a607bd5b3222f27d47973"

# pas


class TestFactory:
    __test__ = False

    async def organization(
        self,
        *,
        name: str | None = None,
        storytime: str | None = None,
        slack_config: OrganizationSlack | None = None,
        sheets_config: OrganizationSheets | None = None,
        ingest_config: OrganizationIngest | None = None,
    ) -> Organization:
        name = name or generate_name()

        async with xact() as q:
            org_m = await q.orm.test_insert_organization(name=name, storytime=storytime)
            assert org_m is not None

            # Create the full Organization object with configuration
            org = Organization(
                id=org_m.id,
                name=org_m.name,
                slack=slack_config or OrganizationSlack(channel_ids=[]),
                sheets=sheets_config or OrganizationSheets(arr=None, headcount=None, expenses=None),
                ingest=ingest_config or OrganizationIngest(expenses=None, headcount=None),
            )
            return org

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
        await self.tenant_user_create(user_id=user.id, tenant_id=tenant.id)
        return user, tenant

    async def tenant(
        self,
        *,
        inbound_source: TenantsInboundSource = TenantsInboundSource.ORGANIC,
    ) -> Tenant:
        rv = await self._query.test_tenant_create(
            name=self._t.rand.string(),
            inbound_source=inbound_source,
        )
        return await self.__finalizer(rv)

    async def user(self) -> User:
        rv = await self._query.test_user_create(
            name=self._t.rand.string(),
            email=self._t.rand.email(),
            password_hash=DEFAULT_PASSWORD_HASH,
        )
        return await self.__finalizer(rv)

    async def user_disabled(self) -> User:
        rv = await self._query.test_user_create_disabled(
            name=self._t.rand.string(),
            email=self._t.rand.email(),
            password_hash=DEFAULT_PASSWORD_HASH,
        )
        return await self.__finalizer(rv)

    async def user_not_signed_up(self) -> User:
        rv = await self._query.test_user_create_not_signed_up(
            name=self._t.rand.string(),
            email=self._t.rand.email(),
        )
        return await self.__finalizer(rv)

    async def tenant_user_create(
        self,
        *,
        user_id: int,
        tenant_id: int,
    ) -> TenantsUser:
        rv = await self._query.test_tenant_user_create(
            user_id=user_id,
            tenant_id=tenant_id,
        )
        return await self.__finalizer(rv)

    async def session(
        self,
        *,
        user_id: int,
        tenant_id: int | None = None,
        expired_at: datetime | None = None,
        last_seen_at: datetime | None = None,
    ) -> Session:
        rv = await self._query.test_session_create(
            user_id=user_id,
            tenant_id=tenant_id,
            expired_at=expired_at,
            last_seen_at=last_seen_at or datetime.now(),
        )
        return await self.__finalizer(rv)
