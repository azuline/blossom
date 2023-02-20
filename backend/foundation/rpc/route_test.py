from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Any

from pytest_asyncio.plugin import pytest
from quart import Blueprint, Quart, json

from foundation.rpc.error import APIError
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
from foundation.test.fixture import TFix


@dataclass
class SpecTestIn:
    cherry: str


@dataclass
class SpecTestOut:
    data: SpecTestIn
    user_id: int | None
    tenant_id: int | None


async def make_test_route(
    app: Quart,
    authorization: Authorization,
    *,
    in_: Any = SpecTestIn,
    out: Any = SpecTestOut,
    errors: list[type[APIError]] | None = None,
) -> None:
    @route(
        name="Test",
        in_=in_,
        out=out,
        errors=errors or [],
        authorization=authorization,
        mount=False,
    )
    async def handler(req: Req[Any]) -> SpecTestOut:
        return SpecTestOut(
            data=req.data,
            user_id=req.user.id if req.user else None,
            tenant_id=req.tenant.id if req.tenant else None,
        )

    bp = Blueprint("test_route_e2e", __name__, url_prefix="/api")
    bp.route("/Test", methods=["POST"])(handler)
    app.register_blueprint(bp)


@pytest.mark.asyncio
async def test_route_auth_public(t: TFix) -> None:
    await make_test_route(await t.rpc.app(), "public")

    resp = await t.rpc.execute("Test", SpecTestIn(cherry="blossom"))
    out = await t.rpc.parse_response(resp, SpecTestOut)

    assert out.data.cherry == "blossom"
    assert out.user_id is None
    assert out.tenant_id is None


@pytest.mark.asyncio
async def test_route_auth_tenant(t: TFix) -> None:
    user, tenant = await t.f.customer()
    await make_test_route(await t.rpc.app(), "tenant")

    await t.rpc.login_as(user, tenant)
    resp = await t.rpc.execute("Test", SpecTestIn(cherry="blossom"))
    out = await t.rpc.parse_response(resp, SpecTestOut)

    assert out.data.cherry == "blossom"
    assert out.user_id == user.id
    assert out.tenant_id == tenant.id


@pytest.mark.asyncio
async def test_route_auth_user(t: TFix) -> None:
    user = await t.f.user()
    await make_test_route(await t.rpc.app(), "user")

    await t.rpc.login_as(user)
    resp = await t.rpc.execute("Test", SpecTestIn(cherry="blossom"))
    out = await t.rpc.parse_response(resp, SpecTestOut)

    assert out.data.cherry == "blossom"
    assert out.user_id == user.id
    assert out.tenant_id is None


@pytest.mark.asyncio
async def test_route_auth_user_fail(t: TFix) -> None:
    await make_test_route(await t.rpc.app(), "user")
    resp = await t.rpc.execute("Test", SpecTestIn(cherry="blossom"))
    await t.rpc.assert_error(resp, UnauthorizedError)


@pytest.mark.asyncio
async def test_route_auth_tenant_fail(t: TFix) -> None:
    await make_test_route(await t.rpc.app(), "tenant")
    resp = await t.rpc.execute("Test", SpecTestIn(cherry="blossom"))
    await t.rpc.assert_error(resp, UnauthorizedError)


@pytest.mark.asyncio
async def test_route_invalid_session(t: TFix) -> None:
    async with (await t.rpc.client()).session_transaction() as sess:
        sess[SESSION_ID_KEY] = "1234"

    await make_test_route(await t.rpc.app(), "tenant")
    resp = await t.rpc.execute("Test", SpecTestIn(cherry="blossom"))
    await t.rpc.assert_error(resp, UnauthorizedError)


@pytest.mark.asyncio
async def test_route_expired_session_expired_at(t: TFix) -> None:
    user = await t.f.user()
    session = await t.f.session(user_id=user.id, expired_at=datetime.now())

    async with (await t.rpc.client()).session_transaction() as sess:
        sess[SESSION_ID_KEY] = session.external_id

    await make_test_route(await t.rpc.app(), "tenant")
    resp = await t.rpc.execute("Test", SpecTestIn(cherry="blossom"))
    await t.rpc.assert_error(resp, UnauthorizedError)


@pytest.mark.asyncio
async def test_route_expired_session_last_seen_at(t: TFix) -> None:
    user = await t.f.user()
    session = await t.f.session(user_id=user.id, last_seen_at=datetime.now() - timedelta(days=20))

    async with (await t.rpc.client()).session_transaction() as sess:
        sess[SESSION_ID_KEY] = session.external_id

    await make_test_route(await t.rpc.app(), "tenant")
    resp = await t.rpc.execute("Test", SpecTestIn(cherry="blossom"))
    await t.rpc.assert_error(resp, UnauthorizedError)


@pytest.mark.asyncio
async def test_route_invalid_json_data(t: TFix) -> None:
    await make_test_route(await t.rpc.app(), "public")
    resp = await (await t.rpc.client()).post("/api/Test", data="aaoejfawpokl")
    await t.rpc.assert_error(resp, ServerJSONDeserializeError)


@pytest.mark.asyncio
async def test_route_different_input_schema(t: TFix) -> None:
    await make_test_route(await t.rpc.app(), "public")
    resp = await (await t.rpc.client()).post("/api/Test", json={"strawberry": "blossoms"})
    await t.rpc.assert_error(resp, DataMismatchError)


@pytest.mark.asyncio
async def test_route_data_wrong_type(t: TFix) -> None:
    await make_test_route(await t.rpc.app(), "public")
    resp = await (await t.rpc.client()).post("/api/Test", json={"cherry": {"a": "b"}})
    await t.rpc.assert_error(resp, InputValidationError)
    out = await t.rpc.parse_error(resp, InputValidationError)
    assert out.fields["cherry"] == "str type expected"


@pytest.mark.asyncio
async def test_route_no_data(t: TFix) -> None:
    await make_test_route(await t.rpc.app(), "public", in_=None)
    resp = await t.rpc.execute("Test")
    t.rpc.assert_success(resp)

    outdata = json.loads(await resp.get_data())
    assert outdata["data"] is None
