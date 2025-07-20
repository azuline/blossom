from __future__ import annotations

import asyncio
import dataclasses
import datetime
import json
from typing import Any, TypeVar, cast

import quart

from foundation.logs import get_logger
from foundation.parse import parse_dataclass
from foundation.rpc import RPCRoute, RPCRouter
from foundation.testing.factory import TestFactory
from foundation.types import Unset
from foundation.webserver import create_webserver

Err = TypeVar("Err", bound=Exception)

logger = get_logger()


class RPCInputJSONEncoder(json.JSONEncoder):
    """This mimics the encoding done by the frontend using JSON.stringify."""

    def default(self, o):
        if isinstance(o, datetime.datetime):
            return o.isoformat()
        elif isinstance(o, Unset):
            raise ValueError("unset type should never exist in incoming RPC payloads")
        return super().default(o)  # pragma: no cover


class TestRPC:
    """These fixtures make it easy to spin up a webapp for testing, send requests, and parse their output."""

    __test__ = False

    def __init__(self, factory: TestFactory, router: RPCRouter) -> None:
        self._factory: TestFactory = factory
        self._router: RPCRouter = router
        self._cached_app: quart.Quart | None = None
        self._cached_client: quart.typing.TestClientProtocol | None = None

    async def underlying_app(self) -> quart.Quart:
        if self._cached_app is not None:
            return self._cached_app
        self._cached_app = create_webserver(self._router)
        return self._cached_app

    async def underlying_client(self) -> quart.typing.TestClientProtocol:
        if self._cached_client is not None:
            return self._cached_client
        self._cached_client = (await self.underlying_app()).test_client()
        return self._cached_client

    async def manually_mount_route[In, Out](self, route: RPCRoute[In, Out]) -> None:
        logger.debug("mounting route onto app", route=route.name)
        route.mount(await self.underlying_app())

    async def call[In, Out](self, route: RPCRoute[In, Out], in_: In, *, headers: dict[str, Any] | None = None) -> quart.Response:
        client = await self.underlying_client()
        logger.debug("executing request", route=route.name, in_=in_, headers=headers)
        query_string = self.jsonify_input(in_) if in_ and route.method == "GET" else None
        json_ = self.jsonify_input(in_) if in_ and route.method != "GET" else None
        resp = await asyncio.wait_for(client.open(f"/rpc/{route.name}", method=route.method, query_string=query_string, json=json_, headers=headers), timeout=5)
        logger.debug("request completed", status_code=resp.status_code, text=await resp.get_data())
        return resp

    async def assert_success(self, resp: quart.Response) -> None:
        __tracebackhide__ = True
        assert resp.status_code == 200, await resp.get_data()

    async def assert_failed(self, resp: quart.Response) -> None:
        __tracebackhide__ = True
        assert resp.status_code == 400, await resp.get_data()

    async def parse_response[Out](self, resp: quart.Response, out: type[Out]) -> Out:
        text = await resp.get_data()
        logger.debug("attemping to parse response", text=text)
        return parse_dataclass(out, self.parse_output(json.loads(text)))

    async def parse_error(self, resp: quart.Response, out: type[Err]) -> Err:
        # E is both a dataclass and an exception. Errors are returned as {"name": "ErrorName", "data": {errordata}}.
        text = await resp.get_data()
        logger.debug("attemping to parse error", text=text)
        data = json.loads(text)
        assert out.__name__ == data["error"], f"returned error is {data['error']} not {out.__name__}"
        return parse_dataclass(out, self.parse_output(data["data"]))

    @staticmethod
    def jsonify_input(data: Any) -> dict[str, Any]:
        """
        jsonify_input serializes data in the same way the frontend serializes request data.

        But when testing input, we want to serialize all our types too. We want to convert the input as
        if it were from frontend to backend. The `dest` parameter controls the intended recipient of the
        jsonification. By default, it is `ts`, but when crafting testing input for handlers, it should
        be `py`.
        """

        def _rec(data: Any) -> Any:
            if dataclasses.is_dataclass(data) and not isinstance(data, type):
                data = _rec(dataclasses.asdict(cast(Any, data)))
            elif isinstance(data, datetime.datetime | datetime.date):
                return data.isoformat()
            elif isinstance(data, list):
                return [_rec(v) for v in data if not isinstance(v, Unset)]
            elif isinstance(data, dict):
                return {k: _rec(v) for k, v in data.items() if not isinstance(v, Unset)}
            return data

        return json.loads(json.dumps(_rec(data), cls=RPCInputJSONEncoder))

    @staticmethod
    def parse_output(data: Any) -> Any:
        """
        The webserver serializes data for frontend consumption, meaning that special types are
        serialized to a special (sentinel-augmented) format so that the frontend can differentiate
        their types. This function converts the frontend serialization to Python objects.
        """
        if isinstance(data, dict):
            if data.get("__sentinel") == "timestamp":
                return data["value"]
            return {k: TestRPC.parse_output(v) for k, v in data.items()}
        elif isinstance(data, list):
            return [TestRPC.parse_output(v) for v in data]
        return data
