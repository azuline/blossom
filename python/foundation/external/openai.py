from __future__ import annotations

import contextlib
import json
import os
import re
from collections.abc import Iterable
from pathlib import Path

import aiorwlock
import openai
from openai._types import NOT_GIVEN, NotGiven
from openai.types.chat import ChatCompletion
from openai.types.chat.chat_completion_message_param import ChatCompletionMessageParam
from openai.types.shared_params.response_format_json_schema import ResponseFormatJSONSchema

from foundation.env import ENV
from foundation.errors import BaseError, ConfigurationError
from foundation.logs import get_logger

logger = get_logger()


class COpenAI:
    def __init__(self, *, _fake_client: FakeOpenAIClient | None = None) -> None:
        self._fake_client = _fake_client
        if _fake_client:
            self.client = _fake_client
        else:
            if ENV.openai_api_key is None:
                raise ConfigurationError("OPENAI_API_KEY is not set")
            self.client = openai.AsyncOpenAI(api_key=ENV.openai_api_key)

    async def complete(
        self,
        *,
        model: str,
        messages: Iterable[ChatCompletionMessageParam],
        temperature: float = 0.0,
        seed: int | None = None,
        response_format: ResponseFormatJSONSchema | None = None,
    ) -> ChatCompletion:
        return await self.client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=temperature,
            seed=seed,
            response_format=response_format if response_format is not None else NOT_GIVEN,
        )


class FakeOpenAIClient:
    """Fake OpenAI client that caches real API responses for tests."""

    class FakeOpenAICompletions:
        def __init__(self) -> None:
            self.cache = OpenAICache()

        async def create(
            self,
            *,
            model: str,
            messages: Iterable[ChatCompletionMessageParam],
            temperature: float = 0.0,
            seed: int | NotGiven | None = None,
            response_format: ResponseFormatJSONSchema | NotGiven | None = None,
        ) -> ChatCompletion:
            return await self.cache.complete(
                model=model,
                messages=messages,
                temperature=temperature,
                seed=seed,
                response_format=response_format,
            )

    class FakeOpenAIChat:
        def __init__(self) -> None:
            self.completions = FakeOpenAIClient.FakeOpenAICompletions()

    def __init__(self) -> None:
        self.chat = FakeOpenAIClient.FakeOpenAIChat()


class LLMTestCacheError(BaseError):
    pass


class OpenAICache:
    # There is one instance of the cache per test. All state resets for each new test run.

    def __init__(self, cache_dir: Path | None = None) -> None:
        if ENV.openai_api_key is None:
            raise ConfigurationError("OPENAI_API_KEY is not set")
        self.real_client = openai.AsyncOpenAI(api_key=ENV.openai_api_key)

        # TODO: We shouldn't depend on this, figure out how to get the path properly later.
        pytest_current_test = os.environ.get("PYTEST_CURRENT_TEST")
        if not pytest_current_test:
            raise LLMTestCacheError("PYTEST_CURRENT_TEST not set - are you running in pytest?")
        # Format: path/to/test_file.py::test_function_name[params] (call)
        # We want: path.to.test_file__test_function_name
        if " (call)" in pytest_current_test:
            pytest_current_test = pytest_current_test.split(" (call)")[0]
        cache_dir = cache_dir or Path(pytest_current_test.split("::")[0]).parent / "__llmshots__"
        self._test_name = re.sub(r"[^A-Za-z0-9_\-]", "_", pytest_current_test)
        self._cache_path = cache_dir / f"{self._test_name}.json"

        update_snapshot = bool(os.environ.get("UPDATE_SNAPSHOT"))
        if self._cache_path.exists() and not update_snapshot:
            with contextlib.suppress(OSError, json.JSONDecodeError), self._cache_path.open("r") as f:
                self._cache_data = json.load(f)
                self._allow_updates = False
        else:
            self._cache_data = {}
            self._allow_updates = True

        self._mutex = aiorwlock.RWLock()

    async def complete(
        self,
        *,
        model: str,
        messages: Iterable[ChatCompletionMessageParam],
        temperature: float = 0.0,
        seed: int | NotGiven | None = None,
        response_format: ResponseFormatJSONSchema | NotGiven | None = None,
    ) -> ChatCompletion:
        # We often schedule multiple asynchronous complete calls at the same time for performance,
        # so we must make sure that we aren't overwriting data from other concurrent runs of
        # complete.

        messages_list = list(messages)
        normalized_inputs = {
            "model": model,
            "messages": messages_list,
            "temperature": temperature,
            "seed": seed if seed is not NOT_GIVEN else None,
            "response_format": response_format if response_format is not NOT_GIVEN else None,
        }
        completion_cache_key = json.dumps(normalized_inputs, sort_keys=True, separators=(",", ":"))

        if resp := self._cache_data.get(completion_cache_key):
            logger.info("returning cached llm response", test=self._test_name, cache_key_prefix=completion_cache_key[:50])
            return ChatCompletion.model_validate(resp)

        if not self._allow_updates:
            # Extract first 100 chars of each key for display
            existing_keys = list(self._cache_data.keys())
            new_key_preview = completion_cache_key
            raise LLMTestCacheError(
                f"""\
New LLM inputs detected for test {self._test_name}.
Run 'just test-snapshot' to update snapshots.

New key:

  - {new_key_preview}

Expected keys ({len(existing_keys)}):

  - {"\n  - ".join(existing_keys)}"""
            )

        logger.info("making real openai api call", test=self._test_name)
        response = await self.real_client.chat.completions.create(
            model=model,
            messages=messages_list,
            temperature=temperature,
            seed=seed if seed not in (None, NOT_GIVEN) else NOT_GIVEN,
            response_format=response_format if response_format not in (None, NOT_GIVEN) else NOT_GIVEN,
        )

        logger.info("caching llm response", test=self._test_name, cache_key_prefix=completion_cache_key[:50])
        async with self._mutex.writer_lock:
            self._cache_data[completion_cache_key] = response.model_dump()
            self._cache_path.unlink(missing_ok=True)
            with self._cache_path.open("w") as f:
                json.dump(self._cache_data, f, indent=2, sort_keys=True)

        logger.info("returning llm response", test=self._test_name)
        return response
