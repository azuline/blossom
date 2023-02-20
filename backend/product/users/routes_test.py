import pytest

from foundation.test.fixture import TFix
from product.users.routes import GetPageLoadInfoOut, GetPageLoadInfoTenant


@pytest.mark.asyncio
async def test_page_load_info_logged_in_with_tenant(t: TFix) -> None:
    user, tenant = await t.f.customer()
    # Make a second tenant that the user belongs to..
    tenant2 = await t.f.tenant()
    await t.f.tenant_user_create(user_id=user.id, tenant_id=tenant2.id)
    # Make a third tenant that the user does not belong to.
    await t.f.tenant()
    await t.rpc.login_as(user, tenant)
    resp = await t.rpc.execute("GetPageLoadInfo")
    t.rpc.assert_success(resp)

    out = await t.rpc.parse_response(resp, GetPageLoadInfoOut)
    assert out == GetPageLoadInfoOut(
        external_id=user.external_id,
        name=user.name,
        email=user.email,
        tenant=GetPageLoadInfoTenant(
            external_id=tenant.external_id,
            name=tenant.name,
        ),
        available_tenants=[
            GetPageLoadInfoTenant(
                external_id=tenant.external_id,
                name=tenant.name,
            ),
            GetPageLoadInfoTenant(
                external_id=tenant2.external_id,
                name=tenant2.name,
            ),
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
        tenant=None,
        available_tenants=[],
    )


@pytest.mark.asyncio
async def test_page_load_info_not_logged_in(t: TFix) -> None:
    resp = await t.rpc.execute("GetPageLoadInfo")
    t.rpc.assert_success(resp)
    out = await t.rpc.parse_response(resp, GetPageLoadInfoOut)
    assert out == GetPageLoadInfoOut(
        external_id=None,
        name=None,
        email=None,
        tenant=None,
        available_tenants=[],
    )
