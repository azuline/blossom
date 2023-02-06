from pytest_asyncio.plugin import pytest

from foundation.rpc.route import SESSION_USER_ID_KEY
from foundation.test.fixture import TFix
from product.authn.routes import InvalidCredentialsError, LoginIn


@pytest.mark.asyncio
async def test_auth_login_success(t: TFix) -> None:
    user = await t.f.user()
    resp = await t.rpc.execute(
        "Login",
        LoginIn(
            email=user.email,
            password="password",
            permanent=True,
        ),
    )
    t.rpc.assert_success(resp)
    async with (await t.rpc.client()).session_transaction() as sess:
        assert sess[SESSION_USER_ID_KEY] == user.external_id
        assert sess.permanent


@pytest.mark.asyncio
async def test_auth_login_success_impermanent(t: TFix) -> None:
    user = await t.f.user()
    resp = await t.rpc.execute(
        "Login",
        LoginIn(
            email=user.email,
            password="password",
            permanent=False,
        ),
    )
    t.rpc.assert_success(resp)
    async with (await t.rpc.client()).session_transaction() as sess:
        assert sess[SESSION_USER_ID_KEY] == user.external_id
        assert not sess.permanent


@pytest.mark.asyncio
async def test_auth_login_nonexistent_email(t: TFix) -> None:
    resp = await t.rpc.execute(
        "Login",
        LoginIn(
            email=t.f.email(),
            password="password",
            permanent=True,
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
        assert SESSION_USER_ID_KEY not in sess
