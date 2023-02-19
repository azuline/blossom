from pytest_asyncio.plugin import pytest

from foundation.test.fixture import TFix
from product.users.routes import GetPageLoadInfoOut, GetPageLoadInfoTenant


@pytest.mark.asyncio
async def test_page_load_info_logged_in_with_tenant(t: TFix) -> None:
    user, tenant = await t.f.customer()
    await t.rpc.login_as(user, tenant)
    resp = await t.rpc.execute("GetPageLoadInfo")
    t.rpc.assert_success(resp)

    out = await t.rpc.parse_response(resp, GetPageLoadInfoOut)
    assert out == GetPageLoadInfoOut(
        external_id=user.external_id,
        name=user.name,
        email=user.email,
        available_tenants=[
            GetPageLoadInfoTenant(
                external_id=tenant.external_id,
                name=tenant.name,
            )
        ],
    )


@pytest.mark.asyncio
async def test_page_load_info_logged_in_without_tenant(t: TFix) -> None:
    user = await t.f.user()
    await t.rpc.login_as(user)
    resp = await t.rpc.execute("GetPageLoadInfo")
    t.rpc.assert_success(resp)

    out = await t.rpc.parse_response(resp, GetPageLoadInfoOut)
    assert out == GetPageLoadInfoOut(
        external_id=user.external_id,
        name=user.name,
        email=user.email,
        available_tenants=[],
    )
