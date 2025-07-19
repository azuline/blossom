from dataclasses import dataclass
from datetime import timedelta

from quart import Blueprint, Quart

from foundation.conftest import FoundationFixture
from foundation.rpc.route import (
    SESSION_ID_KEY,
    Authorization,
    DataMismatchError,
    InputValidationError,
    Req,
    ServerJSONDeserializeError,
    UnauthorizedError,
    route,
)
from foundation.time import CLOCK


@dataclass
class SpecTestIn:
    cherry: str


@dataclass
class SpecTestOut:
    data: SpecTestIn
    user_id: str | None
    organization_id: str | None


async def make_test_route(
    app: Quart,
    authorization: Authorization,
) -> None:
    @route(errors=[], authorization=authorization, mount=False)
    async def test(req: Req[SpecTestIn]) -> SpecTestOut:
        return SpecTestOut(
            data=req.data,
            user_id=req.user.id if req.user else None,
            organization_id=req.organization.id if req.organization else None,
        )

    bp = Blueprint("test_route_e2e", __name__, url_prefix="/api")
    bp.route("/Test", methods=["POST"])(test)
    app.register_blueprint(bp)


async def test_route_auth_public(t: FoundationFixture) -> None:
    await make_test_route(await t.rpc.app(), "public")

    resp = await t.rpc.execute("Test", SpecTestIn(cherry="blossom"))
    out = await t.rpc.parse_response(resp, SpecTestOut)

    assert out.data.cherry == "blossom"
    assert out.user_id is None
    assert out.organization_id is None


async def test_route_auth_organization(t: FoundationFixture) -> None:
    user, organization = await t.factory.customer()
    await make_test_route(await t.rpc.app(), "organization")

    await t.rpc.login_as(user, organization)
    resp = await t.rpc.execute("Test", SpecTestIn(cherry="blossom"))
    out = await t.rpc.parse_response(resp, SpecTestOut)

    assert out.data.cherry == "blossom"
    assert out.user_id == user.id
    assert out.organization_id == organization.id


async def test_route_auth_user(t: FoundationFixture) -> None:
    user = await t.factory.user()
    await make_test_route(await t.rpc.app(), "user")

    await t.rpc.login_as(user)
    resp = await t.rpc.execute("Test", SpecTestIn(cherry="blossom"))
    out = await t.rpc.parse_response(resp, SpecTestOut)

    assert out.data.cherry == "blossom"
    assert out.user_id == user.id
    assert out.organization_id is None


async def test_route_auth_user_fail(t: FoundationFixture) -> None:
    await make_test_route(await t.rpc.app(), "user")
    resp = await t.rpc.execute("Test", SpecTestIn(cherry="blossom"))
    await t.rpc.assert_error(resp, UnauthorizedError)


async def test_route_auth_organization_fail(t: FoundationFixture) -> None:
    await make_test_route(await t.rpc.app(), "organization")
    resp = await t.rpc.execute("Test", SpecTestIn(cherry="blossom"))
    await t.rpc.assert_error(resp, UnauthorizedError)


async def test_route_invalid_session(t: FoundationFixture) -> None:
    async with (await t.rpc.client()).session_transaction() as sess:
        sess[SESSION_ID_KEY] = "1234"

    await make_test_route(await t.rpc.app(), "organization")
    resp = await t.rpc.execute("Test", SpecTestIn(cherry="blossom"))
    await t.rpc.assert_error(resp, UnauthorizedError)


async def test_route_expired_session_expired_at(t: FoundationFixture) -> None:
    user = await t.factory.user()
    session = await t.factory.session(user=user, expired_at=CLOCK.now())

    async with (await t.rpc.client()).session_transaction() as sess:
        sess[SESSION_ID_KEY] = session.id

    await make_test_route(await t.rpc.app(), "organization")
    resp = await t.rpc.execute("Test", SpecTestIn(cherry="blossom"))
    await t.rpc.assert_error(resp, UnauthorizedError)


async def test_route_expired_session_last_seen_at(t: FoundationFixture) -> None:
    user = await t.factory.user()
    session = await t.factory.session(user=user, last_seen_at=CLOCK.now() - timedelta(days=20))

    async with (await t.rpc.client()).session_transaction() as sess:
        sess[SESSION_ID_KEY] = session.id

    await make_test_route(await t.rpc.app(), "organization")
    resp = await t.rpc.execute("Test", SpecTestIn(cherry="blossom"))
    await t.rpc.assert_error(resp, UnauthorizedError)


async def test_route_invalid_json_data(t: FoundationFixture) -> None:
    await make_test_route(await t.rpc.app(), "public")
    resp = await (await t.rpc.client()).post("/api/Test", data="aaoejfawpokl")
    await t.rpc.assert_error(resp, ServerJSONDeserializeError)


async def test_route_different_input_schema(t: FoundationFixture) -> None:
    await make_test_route(await t.rpc.app(), "public")
    resp = await (await t.rpc.client()).post("/api/Test", json={"strawberry": "blossoms"})
    await t.rpc.assert_error(resp, InputValidationError)


async def test_route_data_wrong_type(t: FoundationFixture) -> None:
    await make_test_route(await t.rpc.app(), "public")
    resp = await (await t.rpc.client()).post("/api/Test", json={"cherry": {"a": "b"}})
    await t.rpc.assert_error(resp, InputValidationError)
    out = await t.rpc.parse_error(resp, InputValidationError)
    assert out.fields["cherry"] == "Input should be a valid string"


async def test_route_no_data(t: FoundationFixture) -> None:
    await make_test_route(await t.rpc.app(), "public")
    resp = await t.rpc.execute("Test")
    await t.rpc.assert_error(resp, DataMismatchError)
