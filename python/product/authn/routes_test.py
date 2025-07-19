from foundation.rpc.route import SESSION_ID_KEY
from foundation.test.fixture import TFix
from product.authn.routes import (
    AuthOrganizationNotFoundError,
    InvalidCredentialsError,
    LoginIn,
)


async def test_auth_login_success(t: TFix) -> None:
    user = await t.f.user()
    resp = await t.rpc.execute(
        "Login",
        LoginIn(
            email=user.email,
            password="password",
            permanent=True,
            organization_external_id=None,
        ),
    )
    t.rpc.assert_success(resp)
    session = await (await t.db.conn_admin()).q.authn_fetch_session_by_user(user_id=user.id)
    assert session is not None
    assert session.user_id == user.id
    assert session.organization_id is None
    async with (await t.rpc.client()).session_transaction() as quart_sess:
        assert quart_sess[SESSION_ID_KEY] == session.external_id
        assert quart_sess.permanent


async def test_auth_login_success_impermanent(t: TFix) -> None:
    user = await t.f.user()
    resp = await t.rpc.execute(
        "Login",
        LoginIn(
            email=user.email,
            password="password",
            permanent=False,
            organization_external_id=None,
        ),
    )
    t.rpc.assert_success(resp)
    async with (await t.rpc.client()).session_transaction() as quart_sess:
        assert not quart_sess.permanent


async def test_auth_login_external_organization_id(t: TFix) -> None:
    user = await t.f.user()
    # Make multiple organizations.
    organization1 = await t.f.organization()
    await t.f.organization_user_create(user_id=user.id, organization_id=organization1.id)
    organization2 = await t.f.organization()
    await t.f.organization_user_create(user_id=user.id, organization_id=organization2.id)

    resp = await t.rpc.execute(
        "Login",
        LoginIn(
            email=user.email,
            password="password",
            permanent=True,
            organization_external_id=organization2.external_id,
        ),
    )
    t.rpc.assert_success(resp)
    session = await (await t.db.conn_admin()).q.authn_fetch_session_by_user(user_id=user.id)
    assert session is not None
    assert session.user_id == user.id
    # Ignore the default (oldest organization) and fetch the passed-in organization.
    assert session.organization_id == organization2.id


async def test_auth_login_nonexistent_organization_id(t: TFix) -> None:
    user = await t.f.user()

    resp = await t.rpc.execute(
        "Login",
        LoginIn(
            email=user.email,
            password="password",
            permanent=True,
            organization_external_id="garbage",
        ),
    )
    await t.rpc.assert_error(resp, AuthOrganizationNotFoundError)


async def test_auth_login_default_organization_most_recent(t: TFix) -> None:
    user = await t.f.user()
    # Make multiple organizations.
    organization1 = await t.f.organization()
    await t.f.organization_user_create(user_id=user.id, organization_id=organization1.id)
    organization2 = await t.f.organization()
    await t.f.organization_user_create(user_id=user.id, organization_id=organization2.id)
    await t.f.session(user_id=user.id, organization_id=organization2.id)

    resp = await t.rpc.execute(
        "Login",
        LoginIn(
            email=user.email,
            password="password",
            permanent=True,
            organization_external_id=None,
        ),
    )
    t.rpc.assert_success(resp)
    session = await (await t.db.conn_admin()).q.authn_fetch_session_by_user(user_id=user.id)
    assert session is not None
    assert session.user_id == user.id
    # Default to the most recently accessed organization since one has had a previous login.
    assert session.organization_id == organization2.id


async def test_auth_login_default_organization_oldest(t: TFix) -> None:
    user = await t.f.user()
    # Make multiple organizations.
    organization1 = await t.f.organization()
    await t.f.organization_user_create(user_id=user.id, organization_id=organization1.id)
    organization2 = await t.f.organization()
    await t.f.organization_user_create(user_id=user.id, organization_id=organization2.id)

    resp = await t.rpc.execute(
        "Login",
        LoginIn(
            email=user.email,
            password="password",
            permanent=True,
            organization_external_id=None,
        ),
    )
    t.rpc.assert_success(resp)
    session = await (await t.db.conn_admin()).q.authn_fetch_session_by_user(user_id=user.id)
    assert session is not None
    assert session.user_id == user.id
    # Default to the oldest organization because no organizations have been accessed.
    assert session.organization_id == organization1.id


async def test_auth_login_nonexistent_email(t: TFix) -> None:
    resp = await t.rpc.execute(
        "Login",
        LoginIn(
            email=t.rand.email(),
            password="password",
            permanent=True,
            organization_external_id=None,
        ),
    )
    await t.rpc.assert_error(resp, InvalidCredentialsError)


async def test_auth_login_incomplete_signup(t: TFix) -> None:
    user = await t.f.user_not_signed_up()
    resp = await t.rpc.execute(
        "Login",
        LoginIn(
            email=user.email,
            password="password",
            permanent=True,
            organization_external_id=None,
        ),
    )
    await t.rpc.assert_error(resp, InvalidCredentialsError)


async def test_auth_login_wrong_password(t: TFix) -> None:
    user = await t.f.user()
    resp = await t.rpc.execute(
        "Login",
        LoginIn(
            email=user.email,
            password="badpassword",
            permanent=True,
            organization_external_id=None,
        ),
    )
    await t.rpc.assert_error(resp, InvalidCredentialsError)


async def test_auth_logout(t: TFix) -> None:
    user = await t.f.user()
    await t.rpc.login_as(user)
    resp = await t.rpc.execute("Logout")
    t.rpc.assert_success(resp)

    async with (await t.rpc.client()).session_transaction() as sess:
        assert SESSION_ID_KEY not in sess
