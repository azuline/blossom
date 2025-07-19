from __future__ import annotations

from datetime import datetime

from database.access.xact import xact_admin
from database.codegen import models
from foundation.identifiers import generate_email, generate_name
from foundation.time import CLOCK
from foundation.types import UNSET, Unset, cast_notnull

# password='password'
DEFAULT_PASSWORD_HASH = "pbkdf2:sha256:260000$q7moIpBgn1qWGg6Q$110299a9e14a5d29d21a4d22bfa43e81587380bc0e3a607bd5b3222f27d47973"

# TODO(enum): Replace.
OrganizationsInboundSourceEnum = str
UserSignupStepEnum = str


class TestFactory:
    __test__ = False

    async def organization(
        self,
        *,
        name: str | None = None,
        inbound_source: OrganizationsInboundSourceEnum = "organic",
    ) -> models.Organization:
        name = name or generate_name()
        async with xact_admin() as q:
            return cast_notnull(await q.orm.test_organization_create(name=name, inbound_source=inbound_source))

    async def user(
        self,
        name: str | None = None,
        email: str | None = None,
        password_hash: str | Unset = UNSET,
        signup_step: UserSignupStepEnum = "complete",
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

    async def customer(self) -> tuple[models.User, models.Organization]:
        """A convenience function for creating a user, organization, and user_organization."""
        organization = await self.organization()
        user = await self.user()
        await self.organization_user_create(user_id=user.id, organization_id=organization.id)
        return user, organization

    async def organization_user_create(self, *, user_id: str, organization_id: str) -> models.OrganizationsUser:
        async with xact_admin() as q:
            return cast_notnull(await q.orm.test_organization_user_create(user_id=user_id, organization_id=organization_id))

    async def session(
        self,
        *,
        user: models.User,
        organization: models.Organization | None = None,
        expired_at: datetime | None = None,
        last_seen_at: datetime | None = None,
    ) -> models.Session:
        async with xact_admin() as q:
            return cast_notnull(
                await q.orm.test_session_create(
                    user_id=user.id,
                    organization_id=organization.id if organization else None,
                    expired_at=expired_at,
                    last_seen_at=last_seen_at or CLOCK.now(),
                )
            )
