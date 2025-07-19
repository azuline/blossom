from __future__ import annotations

import asyncio
import json
import random
from collections.abc import AsyncIterator, Callable
from typing import Any

import aiohttp

from foundation.env import ENV
from foundation.errors import BlossomError, ImpossibleError
from foundation.logs import get_logger

logger = get_logger()


class BrexError(BlossomError):
    pass


class CBrex:
    def __init__(self, *, _fake_client: FakeBrexClient | None = None):
        self.client = _fake_client or RealBrexClient()

    async def get_expenses(self, filters: list[tuple[str, str]]) -> AsyncIterator[list[dict[str, Any]]]:
        cursor: str | None = ""

        while cursor is not None:
            params = [
                ("limit", "1000"),
                ("expand[]", "location"),
                ("expand[]", "department"),
                ("expand[]", "merchant"),
                ("expand[]", "user"),
                ("expand[]", "budget"),
                ("expand[]", "payment"),
                *filters,
            ]
            if cursor:
                params.append(("cursor", cursor))

            async def request(p=params):
                return await self.client.get_expenses(p)

            data = await self._request_with_retries(request)
            yield data["items"]
            cursor = data.get("next_cursor")

    async def get_vendors(self) -> AsyncIterator[list[dict[str, Any]]]:
        cursor: str | None = ""

        while cursor is not None:
            params = [("limit", "1000")]
            if cursor:
                params.append(("cursor", cursor))

            async def request(p=params):
                return await self.client.get_vendors(p)

            data = await self._request_with_retries(request)
            yield data["items"]
            cursor = data.get("next_cursor")

    async def _request_with_retries(self, request_func: Callable[[], Any], max_retries: int = 3) -> dict[str, Any]:
        retry = 0
        last_error = None

        while retry < max_retries:
            try:
                return await request_func()
            except Exception as e:
                retry += 1
                last_error = e
                if retry == max_retries:
                    raise BrexError("failed to complete brex request after retries", error=str(e)) from e
                # Exponential backoff and jitter
                wait = 4**retry + (random.random() * 10)
                logger.exception("failed to complete brex request, backing off before retrying", retry=retry, wait=wait)
                await asyncio.sleep(wait)
                logger.info("finished waiting for backoff period, retrying", wait=wait)

        raise ImpossibleError("unexpected retry logic failure", last_error=str(last_error))


class RealBrexClient:
    async def get_expenses(self, params: list[tuple[str, str]]) -> dict[str, Any]:
        async with (
            aiohttp.ClientSession() as session,
            session.get(
                "https://platform.brexapis.com/v1/expenses",
                headers={"Authorization": f"Bearer {ENV.brex_token}"},
                params=params,
            ) as resp,
        ):
            logger.info("received start of response, parsing body into json", status_code=resp.status)
            headers = resp.headers
            body = await resp.text()
            try:
                resp.raise_for_status()
                data = json.loads(body)
                logger.info(
                    "received response data",
                    brex_trace_id=headers.get("X-Brex-Trace-Id"),
                    num_items=len(data.get("items", [])),
                    has_next_cursor=bool(data.get("next_cursor")),
                )
                return data
            except Exception as e:
                logger.error(
                    "failed to parse brex expenses response",
                    status_code=resp.status,
                    headers=dict(headers),
                    body=body[:1000],  # Log first 1000 chars of body
                )
                raise BrexError("failed to get expenses from brex", status_code=resp.status, headers=dict(headers), body=body[:1000]) from e

    async def get_vendors(self, params: list[tuple[str, str]]) -> dict[str, Any]:
        async with (
            aiohttp.ClientSession() as session,
            session.get("https://platform.brexapis.com/v1/vendors", headers={"Authorization": f"Bearer {ENV.brex_token}"}, params=params) as resp,
        ):
            logger.info("received start of response, parsing body into json", status_code=resp.status)
            headers = resp.headers
            body = await resp.text()
            try:
                resp.raise_for_status()
                data = json.loads(body)
                logger.info(
                    "received vendor data",
                    brex_trace_id=headers.get("X-Brex-Trace-Id"),
                    num_items=len(data.get("items", [])),
                    has_next_cursor=bool(data.get("next_cursor")),
                )
                return data
            except Exception as e:
                raise BrexError("failed to get vendors from brex", status_code=resp.status, headers=dict(headers), body=body[:1000]) from e


class FakeBrexClient:
    def __init__(self):
        self._expenses: list[dict[str, Any]] = []
        self._vendors: list[dict[str, Any]] = []

    def TEST_add_expense(self, expense: dict[str, Any]) -> None:
        self._expenses.append(expense)

    def TEST_add_vendor(self, vendor: dict[str, Any]) -> None:
        self._vendors.append(vendor)

    def TEST_reset(self) -> None:
        """Reset all test data."""
        self._expenses.clear()
        self._vendors.clear()

    async def get_expenses(self, params: list[tuple[str, str]]) -> dict[str, Any]:
        cursor = next((value for key, value in params if key == "cursor"), None)
        limit = next((int(value) for key, value in params if key == "limit"), 100)

        # Simulate pagination: page 2 is empty.
        if cursor:
            return {"items": [], "next_cursor": None}
        return {"items": self._expenses[:limit], "next_cursor": "fake_cursor_1" if len(self._expenses) > limit else None}

    async def get_vendors(self, params: list[tuple[str, str]]) -> dict[str, Any]:
        cursor = next((value for key, value in params if key == "cursor"), None)
        limit = next((int(value) for key, value in params if key == "limit"), 100)

        # Simulate pagination: page 2 is empty.
        if cursor:
            return {"items": [], "next_cursor": None}
        return {"items": self._vendors[:limit], "next_cursor": "fake_cursor_1" if len(self._vendors) > limit else None}
