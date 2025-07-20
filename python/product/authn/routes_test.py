from database.xact import xact_admin
from foundation.identifiers import generate_email
from product.authn.routes import (
    AuthOrganizationNotFoundError,
    InvalidCredentialsError,
    LoginIn,
)
from product.conftest import ProductFixture
from product.foundation.rpc import SESSION_ID_KEY


async def test_auth_login_success(t: ProductFixture) -> None:
    user = await t.factory.user()
    resp = await t.rpc.execute("Login", LoginIn(email=user.email, password="password", permanent=True, organization_id=None))
    t.rpc.assert_success(resp)
    async with xact_admin() as q:
        session = await q.orm.authn_session_fetch_by_user(user_id=user.id)
    assert session is not None
    assert session.user_id == user.id
    assert session.organization_id is None
    async with (await t.rpc.client()).session_transaction() as quart_sess:
        assert quart_sess[SESSION_ID_KEY] == session.id
        assert quart_sess.permanent


async def test_auth_login_success_impermanent(t: ProductFixture) -> None:
    user = await t.factory.user()
    resp = await t.rpc.execute("Login", LoginIn(email=user.email, password="password", permanent=False, organization_id=None))
    t.rpc.assert_success(resp)
    async with (await t.rpc.client()).session_transaction() as quart_sess:
        assert not quart_sess.permanent


async def test_auth_login_external_organization_id(t: ProductFixture) -> None:
    user = await t.factory.user()
    # Make multiple organizations.
    organization1 = await t.factory.organization()
    await t.factory.organization_user_create(user_id=user.id, organization_id=organization1.id)
    organization2 = await t.factory.organization()
    await t.factory.organization_user_create(user_id=user.id, organization_id=organization2.id)

    resp = await t.rpc.execute("Login", LoginIn(email=user.email, password="password", permanent=True, organization_id=organization2.id))
    t.rpc.assert_success(resp)
    async with xact_admin() as q:
        session = await q.orm.authn_session_fetch_by_user(user_id=user.id)
    assert session is not None
    assert session.user_id == user.id
    # Ignore the default (oldest organization) and fetch the passed-in organization.
    assert session.organization_id == organization2.id


async def test_auth_login_nonexistent_organization_id(t: ProductFixture) -> None:
    user = await t.factory.user()
    resp = await t.rpc.execute("Login", LoginIn(email=user.email, password="password", permanent=True, organization_id="garbage"))
    await t.rpc.assert_error(resp, AuthOrganizationNotFoundError)


async def test_auth_login_default_organization_most_recent(t: ProductFixture) -> None:
    user = await t.factory.user()
    # Make multiple organizations.
    organization1 = await t.factory.organization()
    await t.factory.organization_user_create(user_id=user.id, organization_id=organization1.id)
    organization2 = await t.factory.organization()
    await t.factory.organization_user_create(user_id=user.id, organization_id=organization2.id)
    await t.factory.session(user=user, organization=organization2)

    resp = await t.rpc.execute("Login", LoginIn(email=user.email, password="password", permanent=True, organization_id=None))
    t.rpc.assert_success(resp)
    async with xact_admin() as q:
        session = await q.orm.authn_session_fetch_by_user(user_id=user.id)
    assert session is not None
    assert session.user_id == user.id
    # Default to the most recently accessed organization since one has had a previous login.
    assert session.organization_id == organization2.id


async def test_auth_login_default_organization_oldest(t: ProductFixture) -> None:
    user = await t.factory.user()
    # Make multiple organizations.
    organization1 = await t.factory.organization()
    await t.factory.organization_user_create(user_id=user.id, organization_id=organization1.id)
    organization2 = await t.factory.organization()
    await t.factory.organization_user_create(user_id=user.id, organization_id=organization2.id)

    resp = await t.rpc.execute("Login", LoginIn(email=user.email, password="password", permanent=True, organization_id=None))
    t.rpc.assert_success(resp)
    async with xact_admin() as q:
        session = await q.orm.authn_session_fetch_by_user(user_id=user.id)
    assert session is not None
    assert session.user_id == user.id
    # Default to the oldest organization because no organizations have been accessed.
    assert session.organization_id == organization1.id


async def test_auth_login_nonexistent_email(t: ProductFixture) -> None:
    resp = await t.rpc.execute("Login", LoginIn(email=generate_email(), password="password", permanent=True, organization_id=None))
    await t.rpc.assert_error(resp, InvalidCredentialsError)


async def test_auth_login_incomplete_signup(t: ProductFixture) -> None:
    user = await t.factory.user(signup_step="created")
    resp = await t.rpc.execute("Login", LoginIn(email=user.email, password="password", permanent=True, organization_id=None))
    await t.rpc.assert_error(resp, InvalidCredentialsError)


async def test_auth_login_wrong_password(t: ProductFixture) -> None:
    user = await t.factory.user()
    resp = await t.rpc.execute("Login", LoginIn(email=user.email, password="badpassword", permanent=True, organization_id=None))
    await t.rpc.assert_error(resp, InvalidCredentialsError)


async def test_auth_logout(t: ProductFixture) -> None:
    user = await t.factory.user()
    await t.rpc.login_as(user)
    resp = await t.rpc.execute("Logout")
    t.rpc.assert_success(resp)
    async with (await t.rpc.client()).session_transaction() as sess:
        assert SESSION_ID_KEY not in sess
