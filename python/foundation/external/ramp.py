from __future__ import annotations

import asyncio
import json
import random
from collections.abc import AsyncIterator, Callable
from typing import Any
from urllib.parse import parse_qs, urlparse

import aiohttp

from foundation.env import ENV
from foundation.errors import BlossomError, ImpossibleError
from foundation.logs import get_logger

logger = get_logger()


class RampError(BlossomError):
    pass


class RampAPIError(RampError):
    pass


class CRamp:
    def __init__(self, *, _fake_client: FakeRampClient | None = None):
        self.client = _fake_client or RealRampClient()

    async def authenticate(self, client_id: str, client_secret: str) -> str:
        """Exchange client credentials for an ephemeral access token."""
        return await self.client.authenticate(client_id, client_secret)

    async def get_transactions(self, filters: list[tuple[str, str]]) -> AsyncIterator[list[dict[str, Any]]]:
        start: str | None = ""
        while start is not None:
            params = [("order_by_date_asc", "true"), ("page_size", "100"), *filters]
            if start:
                params.append(("start", start))

            async def request(p=params):
                return await self.client.get_transactions(p)

            data = await self._request_with_retries(request)
            yield data["items"]
            start = self._extract_start_param(data.get("page", {}).get("next"))

    async def get_bills(self, filters: list[tuple[str, str]]) -> AsyncIterator[list[dict[str, Any]]]:
        start: str | None = ""
        while start is not None:
            params = [("page_size", "100"), *filters]
            if start:
                params.append(("start", start))

            async def request(p=params):
                return await self.client.get_bills(p)

            data = await self._request_with_retries(request)
            yield data["items"]
            start = self._extract_start_param(data.get("page", {}).get("next"))

    async def get_reimbursements(self, filters: list[tuple[str, str]]) -> AsyncIterator[list[dict[str, Any]]]:
        start: str | None = ""
        while start is not None:
            params = [("page_size", "100"), *filters]
            if start:
                params.append(("start", start))

            async def request(p=params):
                return await self.client.get_reimbursements(p)

            data = await self._request_with_retries(request)
            yield data["items"]
            start = self._extract_start_param(data.get("page", {}).get("next"))

    async def get_departments(self, filters: list[tuple[str, str]]) -> AsyncIterator[list[dict[str, Any]]]:
        start: str | None = ""
        while start is not None:
            params = [("page_size", "100"), *filters]
            if start:
                params.append(("start", start))

            async def request(p=params):
                return await self.client.get_departments(p)

            data = await self._request_with_retries(request)
            yield data["items"]
            start = self._extract_start_param(data.get("page", {}).get("next"))

    async def get_users(self, filters: list[tuple[str, str]]) -> AsyncIterator[list[dict[str, Any]]]:
        start: str | None = ""
        while start is not None:
            params = [("page_size", "100"), *filters]
            if start:
                params.append(("start", start))

            async def request(p=params):
                return await self.client.get_users(p)

            data = await self._request_with_retries(request)
            yield data["items"]
            start = self._extract_start_param(data.get("page", {}).get("next"))

    async def _request_with_retries(self, request_func: Callable[[], Any], max_retries: int = 3) -> dict[str, Any]:
        retry = 0

        while retry < max_retries:
            try:
                return await request_func()
            except Exception as e:
                retry += 1
                if retry == max_retries:
                    raise RampAPIError("failed to complete ramp request after retries", error=str(e)) from e
                wait = 4**retry + (random.random() * 10)
                logger.exception("failed to complete ramp request, backing off before retrying", retry=retry, wait=wait)
                await asyncio.sleep(wait)
                logger.info("finished waiting for backoff period, retrying", wait=wait)

        raise ImpossibleError

    def _extract_start_param(self, next_url: str | None) -> str | None:
        """Extract the 'start' parameter from a URL or return None."""
        if not next_url:
            return None
        parsed = urlparse(next_url)
        query_params = parse_qs(parsed.query)
        start_values = query_params.get("start", [])
        return start_values[0] if start_values else None


class RealRampClient:
    async def authenticate(self, client_id: str, client_secret: str) -> str:
        """Exchange client credentials for an ephemeral access token using OAuth2 client credentials flow."""
        # Use basic auth instead of including credentials in form data
        auth = aiohttp.BasicAuth(client_id, client_secret)
        headers = {"Accept": "application/json", "Content-Type": "application/x-www-form-urlencoded"}
        data = {"grant_type": "client_credentials", "scope": "transactions:read bills:read reimbursements:read departments:read users:read"}

        async with (
            aiohttp.ClientSession() as session,
            session.post("https://api.ramp.com/developer/v1/token", auth=auth, headers=headers, data=data) as resp,
        ):
            logger.info("exchanging ramp credentials for token", status_code=resp.status)
            body = await resp.text()
            try:
                resp.raise_for_status()
                data = json.loads(body)
                logger.info("successfully obtained ramp access token")
                return data["access_token"]
            except Exception as e:
                logger.error(
                    "failed to exchange ramp credentials for token",
                    status_code=resp.status,
                    body=body[:1000],
                )
                raise RampAPIError(
                    "failed to exchange credentials for token",
                    status_code=resp.status,
                    body=body[:1000],
                ) from e

    async def get_transactions(self, params: list[tuple[str, str]]) -> dict[str, Any]:
        return await self._make_request_for_page("https://api.ramp.com/developer/v1/transactions", params, "transactions")

    async def get_bills(self, params: list[tuple[str, str]]) -> dict[str, Any]:
        return await self._make_request_for_page("https://api.ramp.com/developer/v1/bills", params, "bills")

    async def get_reimbursements(self, params: list[tuple[str, str]]) -> dict[str, Any]:
        return await self._make_request_for_page("https://api.ramp.com/developer/v1/reimbursements", params, "reimbursements")

    async def get_departments(self, params: list[tuple[str, str]]) -> dict[str, Any]:
        return await self._make_request_for_page("https://api.ramp.com/developer/v1/departments", params, "departments")

    async def get_users(self, params: list[tuple[str, str]]) -> dict[str, Any]:
        return await self._make_request_for_page("https://api.ramp.com/developer/v1/users", params, "users")

    async def _make_request_for_page(self, url: str, params: list[tuple[str, str]], resource_type: str) -> dict[str, Any]:
        async with (
            aiohttp.ClientSession() as session,
            session.get(url, headers={"Authorization": f"Bearer {ENV.ramp_token}"}, params=params) as resp,
        ):
            logger.info(f"received start of {resource_type} response, parsing body into json", status_code=resp.status, resource_type=resource_type)
            headers = resp.headers
            body = await resp.text()
            try:
                resp.raise_for_status()
                data = json.loads(body)
                logger.info(
                    f"received {resource_type} response data",
                    resource_type=resource_type,
                    num_items=len(data.get("data", [])),
                    has_next_page=bool(data.get("page", {}).get("next")),
                )
                return data
            except Exception as e:
                raise RampAPIError(
                    f"failed to get {resource_type} from ramp",
                    resource_type=resource_type,
                    status_code=resp.status,
                    headers=dict(headers),
                    body=body[:1000],
                ) from e


class FakeRampClient:
    def __init__(self):
        self._transactions: list[dict[str, Any]] = []
        self._bills: list[dict[str, Any]] = []
        self._reimbursements: list[dict[str, Any]] = []
        self._departments: list[dict[str, Any]] = []
        self._users: list[dict[str, Any]] = []

    async def authenticate(self, client_id: str, client_secret: str) -> str:
        """Return a fake token for testing."""
        del client_id, client_secret
        return "fake-ramp-token-123"

    def TEST_add_transaction(self, transaction: dict[str, Any]) -> None:
        self._transactions.append(transaction)

    def TEST_add_bill(self, bill: dict[str, Any]) -> None:
        self._bills.append(bill)

    def TEST_add_reimbursement(self, reimbursement: dict[str, Any]) -> None:
        self._reimbursements.append(reimbursement)

    def TEST_add_department(self, department: dict[str, Any]) -> None:
        self._departments.append(department)

    def TEST_add_user(self, user: dict[str, Any]) -> None:
        self._users.append(user)

    def TEST_reset(self) -> None:
        """Reset all test data."""
        self._transactions.clear()
        self._bills.clear()
        self._reimbursements.clear()
        self._departments.clear()
        self._users.clear()

    async def get_transactions(self, params: list[tuple[str, str]]) -> dict[str, Any]:
        return await self._get_paginated_data(params, self._transactions)

    async def get_bills(self, params: list[tuple[str, str]]) -> dict[str, Any]:
        return await self._get_paginated_data(params, self._bills)

    async def get_reimbursements(self, params: list[tuple[str, str]]) -> dict[str, Any]:
        return await self._get_paginated_data(params, self._reimbursements)

    async def get_departments(self, params: list[tuple[str, str]]) -> dict[str, Any]:
        return await self._get_paginated_data(params, self._departments)

    async def get_users(self, params: list[tuple[str, str]]) -> dict[str, Any]:
        return await self._get_paginated_data(params, self._users)

    async def _get_paginated_data(self, params: list[tuple[str, str]], data_list: list[dict[str, Any]]) -> dict[str, Any]:
        start = next((value for key, value in params if key == "start"), None)
        page_size = next((int(value) for key, value in params if key == "page_size"), 100)
        if start:
            return {"data": [], "page": {"next": None}}
        items = data_list[:page_size]
        next_start = "fake_start_1" if len(data_list) > page_size else None
        return {"data": items, "page": {"next": next_start}}
