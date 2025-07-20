import dataclasses
from datetime import timedelta

from foundation.rpc import RPCRoute, UnauthorizedError
from foundation.time import CLOCK
from product.conftest import ProductFixture
from product.foundation.rpc import SESSION_ID_KEY, Authorization, ReqProduct, rpc_product


@dataclasses.dataclass
class SpecTestIn:
    cherry: str


@dataclasses.dataclass
class SpecTestOut:
    data: SpecTestIn
    user_id: str | None
    organization_id: str | None


def make_test_route(authorization: Authorization) -> RPCRoute:
    @rpc_product("test", errors=[], authorization=authorization)
    async def route(req: ReqProduct[SpecTestIn]) -> SpecTestOut:
        return SpecTestOut(
            data=req.data,
            user_id=req.user.id if req.user else None,
            organization_id=req.organization.id if req.organization else None,
        )

    return route


async def test_route_auth_public(t: ProductFixture) -> None:
    await t.rpc.add_route(make_test_route("public"))

    resp = await t.rpc.execute("Test", SpecTestIn(cherry="blossom"))
    out = await t.rpc.parse_response(resp, SpecTestOut)

    assert out.data.cherry == "blossom"
    assert out.user_id is None
    assert out.organization_id is None


async def test_route_auth_organization(t: ProductFixture) -> None:
    user, organization = await t.factory.customer()
    await t.rpc.add_route(make_test_route("organization"))

    await t.rpc.login_as(user, organization)
    resp = await t.rpc.execute("Test", SpecTestIn(cherry="blossom"))
    out = await t.rpc.parse_response(resp, SpecTestOut)

    assert out.data.cherry == "blossom"
    assert out.user_id == user.id
    assert out.organization_id == organization.id


async def test_route_auth_user(t: ProductFixture) -> None:
    user = await t.factory.user()
    await t.rpc.add_route(make_test_route("user"))

    await t.rpc.login_as(user)
    resp = await t.rpc.execute("Test", SpecTestIn(cherry="blossom"))
    out = await t.rpc.parse_response(resp, SpecTestOut)

    assert out.data.cherry == "blossom"
    assert out.user_id == user.id
    assert out.organization_id is None


async def test_route_auth_user_fail(t: ProductFixture) -> None:
    await t.rpc.add_route(make_test_route("user"))
    resp = await t.rpc.execute("Test", SpecTestIn(cherry="blossom"))
    await t.rpc.assert_error(resp, UnauthorizedError)


async def test_route_auth_organization_fail(t: ProductFixture) -> None:
    await t.rpc.add_route(make_test_route("organization"))
    resp = await t.rpc.execute("Test", SpecTestIn(cherry="blossom"))
    await t.rpc.assert_error(resp, UnauthorizedError)


async def test_route_invalid_session(t: ProductFixture) -> None:
    async with (await t.rpc.client()).session_transaction() as sess:
        sess[SESSION_ID_KEY] = "1234"

    await t.rpc.add_route(make_test_route("organization"))
    resp = await t.rpc.execute("Test", SpecTestIn(cherry="blossom"))
    await t.rpc.assert_error(resp, UnauthorizedError)


async def test_route_expired_session_expired_at(t: ProductFixture) -> None:
    user = await t.factory.user()
    session = await t.factory.session(user=user, expired_at=CLOCK.now())

    async with (await t.rpc.client()).session_transaction() as sess:
        sess[SESSION_ID_KEY] = session.id

    await t.rpc.add_route(make_test_route("organization"))
    resp = await t.rpc.execute("Test", SpecTestIn(cherry="blossom"))
    await t.rpc.assert_error(resp, UnauthorizedError)


async def test_route_expired_session_last_seen_at(t: ProductFixture) -> None:
    user = await t.factory.user()
    session = await t.factory.session(user=user, last_seen_at=CLOCK.now() - timedelta(days=20))

    async with (await t.rpc.client()).session_transaction() as sess:
        sess[SESSION_ID_KEY] = session.id

    await t.rpc.add_route(make_test_route("organization"))
    resp = await t.rpc.execute("Test", SpecTestIn(cherry="blossom"))
    await t.rpc.assert_error(resp, UnauthorizedError)
