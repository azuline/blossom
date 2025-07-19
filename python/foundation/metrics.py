# flake8: noqa

"""Stub module that we will implement later."""

SAMPLE_RATE = 1

TagValue = int | float | str | bool | None


def increment(name: str, value: int = 1, sample_rate: float = SAMPLE_RATE, **kwargs: TagValue):
    pass


def increment_abnormal(name: str, value: int = 1, **kwargs: TagValue):
    pass


def decrement(name: str, value: int = 1, sample_rate: float = SAMPLE_RATE, **kwargs: TagValue):
    pass


def decrement_abnormal(name: str, value: int = 1, **kwargs: TagValue):
    pass


def gauge(name: str, value: int, sample_rate: float = SAMPLE_RATE, **kwargs: TagValue):
    pass


def timing(name: str, value: float, sample_rate: float = SAMPLE_RATE, **kwargs: TagValue):
    pass


def distribution(name: str, value: float, sample_rate: float = SAMPLE_RATE, **kwargs: TagValue):
    pass
