from __future__ import annotations

import abc
import dataclasses


@dataclasses.dataclass
class EvalResult:
    """Result of an evaluation execution."""

    result: bool  # All evaluations return unambiguous true/false
    trace: str  # Optional debugging information


class EvalExecutor[In](abc.ABC):
    """Abstract base class for evaluation executors."""

    @abc.abstractmethod
    async def execute(self, input: In) -> EvalResult:
        """Override this method with the evaluation logic for the given input."""


@dataclasses.dataclass
class EvalCase[In]:
    """One evaluation test case."""

    evaluator: EvalExecutor[In]
    input: In


@dataclasses.dataclass
class EvalCaseGroup[In]:
    """A group of related evaluation test cases that are grouped in result reports."""

    slug: str
    cases: list[EvalCase[In]]
