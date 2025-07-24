from __future__ import annotations

from datetime import datetime

from database.__codegen__ import models
from database.enums import OrganizationsInboundSourceEnum, UserSignupStepEnum
from database.xact import xact_admin
from foundation.stdlib.convert import cast_notnull
from foundation.stdlib.identifiers import generate_email, generate_name
from foundation.stdlib.clock import CLOCK
from foundation.stdlib.unset import UNSET, Unset

# password='password'
DEFAULT_PASSWORD_HASH = "pbkdf2:sha256:260000$q7moIpBgn1qWGg6Q$110299a9e14a5d29d21a4d22bfa43e81587380bc0e3a607bd5b3222f27d47973"


class TestFactory:
    __test__ = False

    @staticmethod
    async def organization(*, name: str | None = None, inbound_source: OrganizationsInboundSourceEnum = "organic") -> models.Organization:
        name = name or generate_name()
        async with xact_admin() as q:
            return cast_notnull(await q.orm.test_organization_create(name=name, inbound_source=inbound_source))

    @staticmethod
    async def user(
        *,
        name: str | None = None,
        email: str | None = None,
        password_hash: str | Unset | None = UNSET,
        signup_step: UserSignupStepEnum = "complete",
        is_enabled: bool = True,
    ) -> models.User:
        if isinstance(password_hash, Unset):
            password_hash = DEFAULT_PASSWORD_HASH if signup_step == "complete" else None
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

    @staticmethod
    async def customer() -> tuple[models.User, models.Organization]:
        """A convenience function for creating a user, organization, and user_organization."""
        organization = await TestFactory.organization()
        user = await TestFactory.user()
        await TestFactory.organization_user_create(user_id=user.id, organization_id=organization.id)
        return user, organization

    @staticmethod
    async def organization_user_create(*, user_id: str, organization_id: str) -> models.OrganizationsUser:
        async with xact_admin() as q:
            return cast_notnull(await q.orm.test_organization_user_create(user_id=user_id, organization_id=organization_id))

    @staticmethod
    async def session(
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
