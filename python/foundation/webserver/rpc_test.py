import dataclasses

from foundation.conftest import FoundationFixture
from foundation.testing.rpc import TestRPCResponse
from foundation.webserver.rpc import InputValidationError, ReqCommon, ServerJSONDeserializeError, rpc_common


@dataclasses.dataclass(slots=True)
class SpecTestIn:
    cherry: str


@dataclasses.dataclass(slots=True)
class SpecTestOut:
    data: SpecTestIn


@rpc_common("test", errors=[])
async def test_route(req: ReqCommon[SpecTestIn]) -> SpecTestOut:
    return SpecTestOut(data=req.data)


async def test_route_invalid_json_data(t: FoundationFixture) -> None:
    await t.rpc.manually_mount_route(test_route)
    resp = await (await t.rpc.underlying_client()).post("/rpc/test", data="aaoejfawpokl")
    await t.rpc.parse_error(TestRPCResponse(raw=resp, route=test_route), ServerJSONDeserializeError)


async def test_route_different_input_schema(t: FoundationFixture) -> None:
    await t.rpc.manually_mount_route(test_route)
    resp = await t.rpc.call(test_route, {"strawberry": "blossom"})
    await t.rpc.parse_error(resp, InputValidationError)


async def test_route_data_wrong_type(t: FoundationFixture) -> None:
    await t.rpc.manually_mount_route(test_route)
    resp = await t.rpc.call(test_route, {"cherry": {"a": "b"}})
    out = await t.rpc.parse_error(resp, InputValidationError)
    assert out.fields["cherry"] == "Input should be a valid string"


async def test_route_no_data(t: FoundationFixture) -> None:
    await t.rpc.manually_mount_route(test_route)
    resp = await t.rpc.call(test_route, None)
    await t.rpc.parse_error(resp, InputValidationError)


@rpc_common("test_error", errors=[])
async def test_route_error(req: ReqCommon[SpecTestIn]) -> SpecTestOut:
    del req
    raise ValueError("Unhandled test error")


async def test_route_unhandled_error_sentry(t: FoundationFixture) -> None:
    await t.rpc.manually_mount_route(test_route_error)
    resp = await t.rpc.call(test_route_error, {"cherry": "test"})
    assert resp.raw.status_code == 500
    t.error.assert_reported(ValueError)
