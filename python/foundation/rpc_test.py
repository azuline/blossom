import dataclasses

from foundation.conftest import FoundationFixture
from foundation.rpc import DataMismatchError, InputValidationError, ReqCommon, ServerJSONDeserializeError, rpc_common


@dataclasses.dataclass
class SpecTestIn:
    cherry: str


@dataclasses.dataclass
class SpecTestOut:
    data: SpecTestIn


@rpc_common("test", errors=[])
async def test_route(req: ReqCommon[SpecTestIn]) -> SpecTestOut:
    return SpecTestOut(data=req.data)


async def test_route_invalid_json_data(t: FoundationFixture) -> None:
    await t.rpc.add_route(test_route)
    resp = await (await t.rpc.client()).post("/api/Test", data="aaoejfawpokl")
    await t.rpc.assert_error(resp, ServerJSONDeserializeError)


async def test_route_different_input_schema(t: FoundationFixture) -> None:
    await t.rpc.add_route(test_route)
    resp = await (await t.rpc.client()).post("/api/Test", json={"strawberry": "blossoms"})
    await t.rpc.assert_error(resp, InputValidationError)


async def test_route_data_wrong_type(t: FoundationFixture) -> None:
    await t.rpc.add_route(test_route)
    resp = await (await t.rpc.client()).post("/api/Test", json={"cherry": {"a": "b"}})
    await t.rpc.assert_error(resp, InputValidationError)
    out = await t.rpc.parse_error(resp, InputValidationError)
    assert out.fields["cherry"] == "Input should be a valid string"


async def test_route_no_data(t: FoundationFixture) -> None:
    await t.rpc.add_route(test_route)
    resp = await t.rpc.execute("Test")
    await t.rpc.assert_error(resp, DataMismatchError)
