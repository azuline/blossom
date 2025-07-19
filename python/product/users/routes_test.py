from product.conftest import ProductFixture
from product.users.routes import GetPageLoadInfoOrganization, GetPageLoadInfoOut, GetPageLoadInfoUser


async def test_page_load_info_logged_in_with_organization(t: ProductFixture) -> None:
    user, organization = await t.factory.customer()
    # Make a second organization that the user belongs to..
    organization2 = await t.factory.organization()
    await t.factory.organization_user_create(user_id=user.id, organization_id=organization2.id)
    # Make a third organization that the user does not belong to.
    await t.factory.organization()
    await t.rpc.login_as(user, organization)
    resp = await t.rpc.execute("GetPageLoadInfo")
    t.rpc.assert_success(resp)

    out = await t.rpc.parse_response(resp, GetPageLoadInfoOut)
    assert out == GetPageLoadInfoOut(
        user=GetPageLoadInfoUser(id=user.id, name=user.name, email=user.email),
        organization=GetPageLoadInfoOrganization(id=organization.id, name=organization.name),
        available_organizations=[
            GetPageLoadInfoOrganization(id=organization.id, name=organization.name),
            GetPageLoadInfoOrganization(id=organization2.id, name=organization2.name),
        ],
    )


async def test_page_load_info_logged_in_without_organization(t: ProductFixture) -> None:
    user = await t.factory.user()
    await t.rpc.login_as(user)
    resp = await t.rpc.execute("GetPageLoadInfo")
    t.rpc.assert_success(resp)

    out = await t.rpc.parse_response(resp, GetPageLoadInfoOut)
    assert out == GetPageLoadInfoOut(
        user=GetPageLoadInfoUser(id=user.id, name=user.name, email=user.email),
        organization=None,
        available_organizations=[],
    )


async def test_page_load_info_not_logged_in(t: ProductFixture) -> None:
    resp = await t.rpc.execute("GetPageLoadInfo")
    t.rpc.assert_success(resp)
    out = await t.rpc.parse_response(resp, GetPageLoadInfoOut)
    assert out == GetPageLoadInfoOut(user=None, organization=None, available_organizations=[])
