from __future__ import annotations

import dataclasses
import random
from http import HTTPStatus
from typing import Literal

from slack_sdk.web.async_client import AsyncWebClient

from foundation.env import ENV
from foundation.observability.errors import ConfigurationError
from foundation.observability.logs import get_logger
from foundation.observability.metrics import metric_count_and_time

logger = get_logger()

SlackChannelEnum = Literal["#eng-testing"]
CHANNEL_TO_IDS: dict[SlackChannelEnum, str] = {
    "#eng-testing": "CXXXXXXXXXX",
}
IDS_TO_CHANNELS: dict[str, SlackChannelEnum] = {v: k for k, v in CHANNEL_TO_IDS.items()}


class CSlack:
    def __init__(self, *, _fake_client: FakeSlackClient | None = None):
        if _fake_client:
            self.client = _fake_client
        else:
            if ENV.slack_token is None:
                raise ConfigurationError("SLACK_TOKEN is not set")
            self.client = AsyncWebClient(token=ENV.slack_token)

    async def send_message(
        self,
        channel: SlackChannelEnum | str,
        text: str,
        thread_ts: str | None = None,
    ) -> str | None:
        with metric_count_and_time("external.slack.send_message"):
            resp = await self.client.chat_postMessage(
                channel=channel,
                text=text,
                unfurl_links=False,
                unfurl_media=False,
                thread_ts=thread_ts,
            )
            if resp.status_code != HTTPStatus.OK:
                logger.error("slack post failed", channel=channel, text=text)

            return resp["ts"]


def link(url: str, text: str) -> str:
    return f"<{url}|{text}>"


@dataclasses.dataclass(slots=True)
class FakeSlackMessage:
    channel: str
    text: str


@dataclasses.dataclass(slots=True)
class FakeSlackResponse:
    status_code: HTTPStatus

    def __getitem__(self, key: str) -> str | None:
        if key == "ts":
            return str(random.randint(100, 100000000))
        raise KeyError(key)


class FakeSlackClient:
    def __init__(self) -> None:
        self.messages: list[FakeSlackMessage] = []

    async def chat_postMessage(self, channel: str, text: str, **_) -> FakeSlackResponse:
        self.messages.append(FakeSlackMessage(channel, text))
        return FakeSlackResponse(status_code=HTTPStatus.OK)
