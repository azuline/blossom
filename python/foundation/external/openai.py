from __future__ import annotations

import contextlib
import json
import os
import re
from collections.abc import Iterable
from pathlib import Path

import filelock
import openai
from openai._types import NOT_GIVEN, NotGiven
from openai.types.chat import ChatCompletion
from openai.types.chat.chat_completion_message_param import ChatCompletionMessageParam
from openai.types.shared_params.response_format_json_schema import ResponseFormatJSONSchema

from foundation.env import ENV
from foundation.errors import BlossomError, ConfigurationError
from foundation.logs import get_logger
from foundation.paths import PYTHON_ROOT

DEFAULT_LLM_CACHE_DIR = PYTHON_ROOT / ".llm_testcache"

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


class LLMTestCacheError(BlossomError):
    pass


class OpenAICache:
    def __init__(self, cache_dir: Path = DEFAULT_LLM_CACHE_DIR) -> None:
        if ENV.openai_api_key is None:
            raise ConfigurationError("OPENAI_API_KEY is not set")
        self.real_client = openai.AsyncOpenAI(api_key=ENV.openai_api_key)
        self.cache_dir = cache_dir
        self.cache_dir.mkdir(exist_ok=True)
        self.cache_is_new: dict[str, bool] = {}

    async def complete(
        self,
        *,
        model: str,
        messages: Iterable[ChatCompletionMessageParam],
        temperature: float = 0.0,
        seed: int | NotGiven | None = None,
        response_format: ResponseFormatJSONSchema | NotGiven | None = None,
    ) -> ChatCompletion:
        messages_list = list(messages)
        normalized_inputs = {
            "model": model,
            "messages": messages_list,
            "temperature": temperature,
            "seed": seed if seed is not NOT_GIVEN else None,
            "response_format": response_format if response_format is not NOT_GIVEN else None,
        }

        pytest_current_test = os.environ.get("PYTEST_CURRENT_TEST")
        if not pytest_current_test:
            raise LLMTestCacheError("PYTEST_CURRENT_TEST not set - are you running in pytest?")
        # Format: path/to/test_file.py::test_function_name[params] (call)
        # We want: path.to.test_file__test_function_name
        if " (call)" in pytest_current_test:
            pytest_current_test = pytest_current_test.split(" (call)")[0]
        test_name = re.sub(r"[^A-Za-z0-9_\-]", "_", pytest_current_test)

        cache_file = self.cache_dir / f"{test_name}.json"
        cache_file_lock = self.cache_dir / f"{test_name}.lock"
        cache_key = json.dumps(normalized_inputs, sort_keys=True, separators=(",", ":"))
        update_snapshot = bool(os.environ.get("UPDATE_SNAPSHOT"))
        cache_data = {}
        if cache_file.exists():
            with contextlib.suppress(OSError, json.JSONDecodeError), cache_file.open("r") as f:
                cache_data = json.load(f)
            # We can call this function multiple times over a test. Keep track of whether this file is "new".
            self.cache_is_new.setdefault(test_name, False)
        else:
            self.cache_is_new.setdefault(test_name, True)

        if cache_key in cache_data and not update_snapshot:
            logger.info("returning cached llm response", test=test_name, cache_key=cache_key[:50])
            return ChatCompletion.model_validate(cache_data[cache_key])

        if cache_data and not update_snapshot and not self.cache_is_new[test_name]:
            # Extract first 100 chars of each key for display
            existing_keys = list(cache_data.keys())
            new_key_preview = cache_key

            raise LLMTestCacheError(
                f"New LLM inputs detected for test {test_name}.\n"
                f"Run 'just test-snapshot' to update snapshots.\n\n"
                f"New key:\n  {new_key_preview}\n\n"
                f"Expected keys ({len(existing_keys)}):\n" + "\n".join(f"  {key}" for key in existing_keys)
            )

        logger.info("making real openai api call", test=test_name, update_snapshot=update_snapshot)
        response = await self.real_client.chat.completions.create(
            model=model,
            messages=messages_list,
            temperature=temperature,
            seed=seed if seed not in (None, NOT_GIVEN) else NOT_GIVEN,
            response_format=response_format if response_format not in (None, NOT_GIVEN) else NOT_GIVEN,
        )
        # Atomic write to cache file.
        with filelock.FileLock(cache_file_lock):
            if cache_file.exists():
                with contextlib.suppress(OSError, json.JSONDecodeError), cache_file.open("r") as f:
                    cache_data = json.load(f)
            cache_data[cache_key] = response.model_dump()
            with cache_file.open("w") as f:
                json.dump(cache_data, f, indent=2, sort_keys=True)
        logger.info("cached llm response", test=test_name, cache_key=cache_key[:50])
        return response
