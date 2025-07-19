import asyncio
import tempfile
from pathlib import Path
from unittest.mock import AsyncMock

import coolname
from openai.types.chat import ChatCompletion
from openai.types.chat.chat_completion import Choice
from openai.types.chat.chat_completion_message import ChatCompletionMessage
from openai.types.completion_usage import CompletionUsage

from foundation.external.openai import OpenAICache


def _create_mock_response(id_suffix: str, content: str) -> ChatCompletion:
    """Create a mock OpenAI response."""
    return ChatCompletion(
        id=f"chatcmpl-{id_suffix}",
        object="chat.completion",
        created=1234567890,
        model="gpt-4",
        choices=[
            Choice(
                index=0,
                message=ChatCompletionMessage(
                    role="assistant",
                    content=content,
                ),
                finish_reason="stop",
            )
        ],
        usage=CompletionUsage(prompt_tokens=10, completion_tokens=20, total_tokens=30),
    )


async def test_basic_caching():
    with tempfile.TemporaryDirectory() as tmpdir:
        response1 = _create_mock_response("first", " ".join(coolname.generate_slug(4)))
        response2 = _create_mock_response("second", " ".join(coolname.generate_slug(4)))

        cache = OpenAICache(cache_dir=Path(tmpdir))
        cache.real_client = AsyncMock()
        cache.real_client.chat.completions.create = AsyncMock(side_effect=[response1, response2])

        result1 = await cache.complete(model="gpt-4", messages=[{"role": "user", "content": "Hello"}])
        assert result1 == response1
        result2 = await cache.complete(model="gpt-4", messages=[{"role": "user", "content": "Hello"}])
        assert result2 == response1
        result3 = await cache.complete(model="gpt-4", messages=[{"role": "user", "content": "Goodbye"}])
        assert result3 == response2


async def test_concurrent_caching():
    with tempfile.TemporaryDirectory() as tmpdir:
        response1 = _create_mock_response("first", " ".join(coolname.generate_slug(4)))
        response2 = _create_mock_response("second", " ".join(coolname.generate_slug(4)))
        response3 = _create_mock_response("second", " ".join(coolname.generate_slug(4)))

        cache = OpenAICache(cache_dir=Path(tmpdir))
        cache.real_client = AsyncMock()
        cache.real_client.chat.completions.create = AsyncMock(side_effect=[response1, response2, response3])

        results1 = await asyncio.gather(
            cache.complete(model="gpt-4", messages=[{"role": "user", "content": "Message 0"}]),
            cache.complete(model="gpt-4", messages=[{"role": "user", "content": "Message 1"}]),
            cache.complete(model="gpt-4", messages=[{"role": "user", "content": "Message 2"}]),
        )
        results2 = await asyncio.gather(
            cache.complete(model="gpt-4", messages=[{"role": "user", "content": "Message 0"}]),
            cache.complete(model="gpt-4", messages=[{"role": "user", "content": "Message 1"}]),
            cache.complete(model="gpt-4", messages=[{"role": "user", "content": "Message 2"}]),
        )

        # Check that cached results match original results
        for i in range(3):
            assert results1[i].id == results2[i].id
