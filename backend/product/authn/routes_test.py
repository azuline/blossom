import pytest

from foundation.rpc.route import SESSION_ID_KEY
from foundation.test.fixture import TFix
from product.authn.routes import (
    AuthTenantNotFoundError,
    InvalidCredentialsError,
    LoginIn,
)


@pytest.mark.asyncio
async def test_auth_login_success(t: TFix) -> None:
    user = await t.f.user()
    resp = await t.rpc.execute(
        "Login",
        LoginIn(
            email=user.email,
            password="password",
            permanent=True,
            tenant_external_id=None,
        ),
    )
    t.rpc.assert_success(resp)
    session = await (await t.db.conn_admin()).q.authn_fetch_session_by_user(user_id=user.id)
    assert session is not None
    assert session.user_id == user.id
    assert session.tenant_id is None
    async with (await t.rpc.client()).session_transaction() as quart_sess:
        assert quart_sess[SESSION_ID_KEY] == session.external_id
        assert quart_sess.permanent


@pytest.mark.asyncio
async def test_auth_login_success_impermanent(t: TFix) -> None:
    user = await t.f.user()
    resp = await t.rpc.execute(
        "Login",
        LoginIn(
            email=user.email,
            password="password",
            permanent=False,
            tenant_external_id=None,
        ),
    )
    t.rpc.assert_success(resp)
    async with (await t.rpc.client()).session_transaction() as quart_sess:
        assert not quart_sess.permanent


@pytest.mark.asyncio
async def test_auth_login_external_tenant_id(t: TFix) -> None:
    user = await t.f.user()
    # Make multiple tenants.
    tenant1 = await t.f.tenant()
    await t.f.tenant_user_create(user_id=user.id, tenant_id=tenant1.id)
    tenant2 = await t.f.tenant()
    await t.f.tenant_user_create(user_id=user.id, tenant_id=tenant2.id)

    resp = await t.rpc.execute(
        "Login",
        LoginIn(
            email=user.email,
            password="password",
            permanent=True,
            tenant_external_id=tenant2.external_id,
        ),
    )
    t.rpc.assert_success(resp)
    session = await (await t.db.conn_admin()).q.authn_fetch_session_by_user(user_id=user.id)
    assert session is not None
    assert session.user_id == user.id
    # Ignore the default (oldest tenant) and fetch the passed-in tenant.
    assert session.tenant_id == tenant2.id


@pytest.mark.asyncio
async def test_auth_login_nonexistent_tenant_id(t: TFix) -> None:
    user = await t.f.user()

    resp = await t.rpc.execute(
        "Login",
        LoginIn(
            email=user.email,
            password="password",
            permanent=True,
            tenant_external_id="garbage",
        ),
    )
    await t.rpc.assert_error(resp, AuthTenantNotFoundError)


@pytest.mark.asyncio
async def test_auth_login_default_tenant_most_recent(t: TFix) -> None:
    user = await t.f.user()
    # Make multiple tenants.
    tenant1 = await t.f.tenant()
    await t.f.tenant_user_create(user_id=user.id, tenant_id=tenant1.id)
    tenant2 = await t.f.tenant()
    await t.f.tenant_user_create(user_id=user.id, tenant_id=tenant2.id)
    await t.f.session(user_id=user.id, tenant_id=tenant2.id)

    resp = await t.rpc.execute(
        "Login",
        LoginIn(
            email=user.email,
            password="password",
            permanent=True,
            tenant_external_id=None,
        ),
    )
    t.rpc.assert_success(resp)
    session = await (await t.db.conn_admin()).q.authn_fetch_session_by_user(user_id=user.id)
    assert session is not None
    assert session.user_id == user.id
    # Default to the most recently accessed tenant since one has had a previous login.
    assert session.tenant_id == tenant2.id


@pytest.mark.asyncio
async def test_auth_login_default_tenant_oldest(t: TFix) -> None:
    user = await t.f.user()
    # Make multiple tenants.
    tenant1 = await t.f.tenant()
    await t.f.tenant_user_create(user_id=user.id, tenant_id=tenant1.id)
    tenant2 = await t.f.tenant()
    await t.f.tenant_user_create(user_id=user.id, tenant_id=tenant2.id)

    resp = await t.rpc.execute(
        "Login",
        LoginIn(
            email=user.email,
            password="password",
            permanent=True,
            tenant_external_id=None,
        ),
    )
    t.rpc.assert_success(resp)
    session = await (await t.db.conn_admin()).q.authn_fetch_session_by_user(user_id=user.id)
    assert session is not None
    assert session.user_id == user.id
    # Default to the oldest tenant because no tenants have been accessed.
    assert session.tenant_id == tenant1.id


@pytest.mark.asyncio
async def test_auth_login_nonexistent_email(t: TFix) -> None:
    resp = await t.rpc.execute(
        "Login",
        LoginIn(
            email=t.rand.email(),
            password="password",
            permanent=True,
            tenant_external_id=None,
        ),
    )
    await t.rpc.assert_error(resp, InvalidCredentialsError)


@pytest.mark.asyncio
async def test_auth_login_incomplete_signup(t: TFix) -> None:
    user = await t.f.user_not_signed_up()
    resp = await t.rpc.execute(
        "Login",
        LoginIn(
            email=user.email,
            password="password",
            permanent=True,
            tenant_external_id=None,
        ),
    )
    await t.rpc.assert_error(resp, InvalidCredentialsError)


@pytest.mark.asyncio
async def test_auth_login_wrong_password(t: TFix) -> None:
    user = await t.f.user()
    resp = await t.rpc.execute(
        "Login",
        LoginIn(
            email=user.email,
            password="badpassword",
            permanent=True,
            tenant_external_id=None,
        ),
    )
    await t.rpc.assert_error(resp, InvalidCredentialsError)


@pytest.mark.asyncio
async def test_auth_logout(t: TFix) -> None:
    user = await t.f.user()
    await t.rpc.login_as(user)
    resp = await t.rpc.execute("Logout")
    t.rpc.assert_success(resp)

    async with (await t.rpc.client()).session_transaction() as sess:
        assert SESSION_ID_KEY not in sess
