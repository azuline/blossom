# flake8: noqa

"""Stub module that we will implement later."""

SAMPLE_RATE = 1

TagValue = int | float | str | bool | None


def metric_increment(name: str, value: int = 1, sample_rate: float = SAMPLE_RATE, **kwargs: TagValue):
    pass


def metric_increment_abnormal(name: str, value: int = 1, **kwargs: TagValue):
    pass


def metric_decrement(name: str, value: int = 1, sample_rate: float = SAMPLE_RATE, **kwargs: TagValue):
    pass


def metric_decrement_abnormal(name: str, value: int = 1, **kwargs: TagValue):
    pass


def metric_gauge(name: str, value: int, sample_rate: float = SAMPLE_RATE, **kwargs: TagValue):
    pass


def metric_timing(name: str, value: float, sample_rate: float = SAMPLE_RATE, **kwargs: TagValue):
    pass


def metric_distribution(name: str, value: float, sample_rate: float = SAMPLE_RATE, **kwargs: TagValue):
    pass
