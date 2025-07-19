from __future__ import annotations

from collections.abc import Awaitable, Callable
from dataclasses import asdict
from typing import TYPE_CHECKING, Any, TypeVar

import quart
from dacite import from_dict
from quart import Quart, Response, json

from database.codegen.models import Organization, User
from foundation.logs import get_logger
from foundation.rpc.catalog import Method, get_catalog
from foundation.rpc.route import SESSION_ID_KEY
from foundation.testing.factory import TestFactory

if TYPE_CHECKING:  # pragma: no cover
    from quart.typing import TestClientProtocol

E = TypeVar("E", bound=Exception)

logger = get_logger()


class TestRPC:
    """
    The WebApp+RPC subset of fixtures on TFix.
    """

    _factory: TestFactory
    _app: Quart | None
    _client: TestClientProtocol | None
    # This variable stores which organization to make future RPC requests as.
    #
    # This is purely for the convenience of not having to pass organization into the
    # `execute()` function, because it makes more intuitive sense to log in as both the
    # user and organization in `login_as()`.
    #
    # We have to store this as state because the organization is authed via a request header,
    # not via the session. So we need to store this until we make the actual request, at
    # which time we inject this value into the request headers.
    _logged_in_as_organization_external_id: str | None

    def __init__(self, factory: TestFactory, create_app: Callable[[], Awaitable[quart.Quart]]) -> None:
        self._factory = factory
        self._create_app = create_app
        self._app = None
        self._client = None
        self._logged_in_as_organization_external_id = None
        self._catalog = get_catalog()

    def _get_rpc_method(self, path: str) -> Method:
        for rpc in self._catalog.rpcs:
            if rpc.name == path:
                return rpc.method
        return "POST"

    async def app(self) -> quart.Quart:
        if self._app is not None:
            return self._app
        self._app = await self._create_app()
        return self._app

    async def client(self) -> TestClientProtocol:
        if self._client is not None:
            return self._client
        self._client = (await self.app()).test_client()
        return self._client

    async def login_as(self, user: User, organization: Organization | None = None) -> None:
        logger.debug(f"Setting session to user {user.id} - {user.email}.")
        async with (await self.client()).session_transaction() as quart_sess:
            session = await self._factory.session(user=user, organization=organization)
            quart_sess[SESSION_ID_KEY] = session.id

    async def execute(
        self,
        path: str,
        # data should be an input dataclass
        data: Any = None,
    ) -> Response:
        logger.debug(f"Executing request to {path} with {data}.")
        method = self._get_rpc_method(path)
        if method == "GET":
            resp = await (await self.client()).get(
                f"/api/{path}",
                query_string=asdict(data) if data else None,
            )
        else:
            resp = await (await self.client()).post(
                f"/api/{path}",
                json=asdict(data) if data else None,
            )

        logger.debug(f"Request completed with {resp.status_code=} {(await resp.get_data())=}.")
        return resp

    def assert_success(self, resp: Response) -> None:
        # Though this doesn't seem like a useful abstraction, abstract away "success
        # criteria" in case we want to make further assertions later around what success
        # means.
        __tracebackhide__ = True
        assert resp.status_code == 200

    def assert_failed(self, resp: Response) -> None:
        # Though this doesn't seem like a useful abstraction, abstract away "failure
        # criteria" in case we want to make further assertions later around what failure
        # means.
        __tracebackhide__ = True
        assert resp.status_code == 400

    async def assert_error(self, resp: Response, error: type[Exception]) -> None:
        """
        This function subsumes assert_failed; if calling this, no need to call
        assert_failed above.
        """
        __tracebackhide__ = True
        self.assert_failed(resp)
        data = json.loads(await resp.get_data())
        assert data["error"] == error.__name__

    async def parse_response[T](self, resp: Response, dclass: type[T]) -> T:
        logger.debug(f"Attemping to parse response {(await resp.get_data())=}.")
        return from_dict(dclass, json.loads(await resp.get_data()))

    async def parse_error(self, resp: Response, dclass: type[E]) -> E:
        # E is both a dataclass and an exception. Errors are returned as
        # {"name": "ErrorName", "data": {errordata}}.
        logger.debug(f"Attemping to parse error {(await resp.get_data())=}.")
        return from_dict(dclass, json.loads(await resp.get_data())["data"])
