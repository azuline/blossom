import contextlib
import dataclasses
import os
import re
import socket
import time
from collections.abc import Generator
from typing import LiteralString

import datadog
from datadog.dogstatsd.base import statsd

from foundation.env import ENV
from foundation.observability.errors import ConfigurationError
from foundation.observability.logs import get_logger

logger = get_logger()

type MetricTagValue = int | float | str | bool | None
type MetricTagDict = dict[str, MetricTagValue]

DEFAULT_SAMPLE_RATE = 1


def initialize_metrics():
    if not ENV.datadog_enabled:
        return

    if not os.getenv("DD_AGENT_HOST") or not os.getenv("DD_API_KEY"):
        raise ConfigurationError("DD_AGENT_HOST/DD_API_KEY not set: provision these keys or set DD_TRACE_ENABLED to false")

    datadog.initialize(host_name=socket.gethostname(), api_key=ENV.datadog_api_key, statsd_host=ENV.datadog_agent_host)


def metric_increment(name: LiteralString, value: int = 1, sample_rate: float = DEFAULT_SAMPLE_RATE, **kwargs: MetricTagValue):
    """Increment a counter metric."""
    if ENV.datadog_enabled:
        statsd.increment(f"{name}.count", value, tags=_construct_tags(kwargs), sample_rate=sample_rate)


def metric_increment_abnormal(name: LiteralString, value: int = 1, **kwargs: MetricTagValue):
    """Increment a counter metric without sampling."""
    if ENV.datadog_enabled:
        statsd.increment(f"{name}.count", value, tags=_construct_tags(kwargs), sample_rate=1)


def metric_decrement(name: LiteralString, value: int = 1, sample_rate: float = DEFAULT_SAMPLE_RATE, **kwargs: MetricTagValue):
    """Decrement a counter metric."""
    if ENV.datadog_enabled:
        statsd.decrement(f"{name}.count", value, tags=_construct_tags(kwargs), sample_rate=sample_rate)


def metric_decrement_abnormal(name: LiteralString, value: int = 1, **kwargs: MetricTagValue):
    """Decrement a counter metric without sampling."""
    if ENV.datadog_enabled:
        statsd.decrement(f"{name}.count", value, tags=_construct_tags(kwargs), sample_rate=1)


def metric_gauge(name: LiteralString, value: int, sample_rate: float = DEFAULT_SAMPLE_RATE, **kwargs: MetricTagValue):
    """Set a gauge metric value."""
    if ENV.datadog_enabled:
        statsd.gauge(f"{name}.gauge", value, tags=_construct_tags(kwargs), sample_rate=sample_rate)


def metric_timing(name: LiteralString, value: float, sample_rate: float = DEFAULT_SAMPLE_RATE, **kwargs: MetricTagValue):
    """Record a timing metric."""
    if ENV.datadog_enabled:
        statsd.timing(name, value, tags=_construct_tags(kwargs), sample_rate=sample_rate)


def metric_distribution(name: LiteralString, value: float, sample_rate: float = DEFAULT_SAMPLE_RATE, **kwargs: MetricTagValue):
    """Record a distribution metric."""
    if ENV.datadog_enabled:
        statsd.distribution(name, value, tags=_construct_tags(kwargs), sample_rate=sample_rate)


@dataclasses.dataclass(slots=True)
class TagAccumulator:
    accumulated_tags: MetricTagDict

    def tag(self, **kwargs: MetricTagValue) -> None:
        for key, value in kwargs.items():
            self.accumulated_tags[key] = value


@contextlib.contextmanager
def metric_count_and_time(name: LiteralString, **kwargs: MetricTagValue) -> Generator[TagAccumulator]:
    """Context manager that counts invocations and times duration. Use the yielded accumulator to add tags during execution."""
    start_time = time.time()
    acc = TagAccumulator(accumulated_tags=kwargs)
    try:
        yield acc
    finally:
        t = _construct_tags(acc.accumulated_tags)
        if ENV.datadog_enabled:
            statsd.increment(f"{name}.count", 1, tags=t)
            statsd.timing(f"{name}.duration", time.time() - start_time, tags=t)


def _sanitize_tag(tag: str) -> str:
    # https://docs.datadoghq.com/getting_started/tagging
    tag = tag.lower()
    tag = re.sub(r"[^a-z0-9_:\-./]", "_", tag)
    if not tag[0].isalpha():
        tag = "x_" + tag
    return tag[:200]


def _construct_tags(kwargs: MetricTagDict) -> list[str]:
    tags = [f"env:{ENV.environment}", f"service:{ENV.service}", f"version:{ENV.version}"]
    tags.extend(_sanitize_tag(f"{k}:{v}") for k, v in kwargs.items() if v is not None)
    return tags
