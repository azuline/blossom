from __future__ import annotations

from datetime import datetime

from database.access.xact import xact_admin
from database.codegen import models
from foundation.identifiers import generate_email, generate_name
from foundation.time import CLOCK
from foundation.types import UNSET, Unset, cast_notnull

# password='password'
DEFAULT_PASSWORD_HASH = "pbkdf2:sha256:260000$q7moIpBgn1qWGg6Q$110299a9e14a5d29d21a4d22bfa43e81587380bc0e3a607bd5b3222f27d47973"


class TestFactory:
    __test__ = False

    async def tenant(
        self,
        *,
        name: str | None = None,
        inbound_source: models.TenantsInboundSource = models.TenantsInboundSource.ORGANIC,
    ) -> models.Tenant:
        name = name or generate_name()
        async with xact_admin() as q:
            return cast_notnull(await q.orm.test_tenant_create(name=name, inbound_source=inbound_source))

    async def user(
        self,
        name: str | None = None,
        email: str | None = None,
        password_hash: str | Unset = UNSET,
        signup_step: models.UserSignupStep = models.UserSignupStep.COMPLETE,
        is_enabled: bool = True,
    ) -> models.User:
        if isinstance(password_hash, Unset):
            password_hash = DEFAULT_PASSWORD_HASH
        async with xact_admin() as q:
            return cast_notnull(
                await q.orm.test_user_create(
                    name=name or generate_name(),
                    email=email or generate_email(),
                    password_hash=password_hash,
                    signup_step=signup_step,
                    is_enabled=is_enabled,
                )
            )

    async def customer(self) -> tuple[models.User, models.Tenant]:
        """A convenience function for creating a user, tenant, and user_tenant."""
        tenant = await self.tenant()
        user = await self.user()
        await self.tenant_user_create(user_id=user.id, tenant_id=tenant.id)
        return user, tenant

    async def tenant_user_create(self, *, user_id: str, tenant_id: str) -> models.TenantsUser:
        async with xact_admin() as q:
            return cast_notnull(await q.orm.test_tenant_user_create(user_id=user_id, tenant_id=tenant_id))

    async def session(
        self,
        *,
        user_id: str,
        tenant_id: str | None = None,
        expired_at: datetime | None = None,
        last_seen_at: datetime | None = None,
    ) -> models.Session:
        async with xact_admin() as q:
            return cast_notnull(
                await q.orm.test_session_create(
                    user_id=user_id,
                    tenant_id=tenant_id,
                    expired_at=expired_at,
                    last_seen_at=last_seen_at or CLOCK.now(),
                )
            )
