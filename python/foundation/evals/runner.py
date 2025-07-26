from __future__ import annotations

import asyncio
import itertools
import traceback

import click
import structlog

from foundation.env import ENV
from foundation.evals.types import EvalCase, EvalCaseGroup, EvalResult

type RunResult[In] = tuple[EvalCase[In], EvalResult | None, Exception | None]


async def _parallel_executor[In](case: EvalCase[In], group_results: list[RunResult[In]]) -> None:
    """Execute a single evaluation case and store the result."""
    try:
        result = await case.evaluator.execute(case.input)
    except Exception as e:
        group_results.append((case, None, e))
        click.secho("E", fg="red", bold=True, nl=False)
        return
    group_results.append((case, result, None))
    if result.result:
        click.echo(".", nl=False)
    else:
        click.secho("F", fg="red", nl=False)


async def run_evals[In](case_groups: list[EvalCaseGroup[In]], group_slugs: list[str], only_group: str | None = None) -> dict[str, list[RunResult[In]]]:
    """Run evaluation cases with parallel execution and progress reporting."""
    results: dict[str, list[RunResult[In]]] = {}

    cases = case_groups
    if only_group:
        if only_group not in group_slugs:
            raise click.ClickException(f"Invalid --group/-g {only_group}, must be one of: {', '.join(group_slugs)}")
        cases = [g for g in cases if g.slug == only_group]

    num_groups = len(cases)
    num_cases = sum(len(g.cases) for g in cases)

    click.echo()
    click.secho(_banner("Beginning Evaluator"), bold=True)
    click.echo()
    click.echo(f"Running {num_groups} group{'s' if num_groups != 1 else ''} with {num_cases} test case{'s' if num_cases != 1 else ''}.")
    click.echo()

    try:
        with structlog.testing.capture_logs():
            for group in cases:
                click.secho(f"{group.slug} ", nl=False)
                group_results = results.setdefault(group.slug, [])
                iterator = iter(group.cases)
                while cases_batch := list(itertools.islice(iterator, ENV.eval_concurrency)):
                    await asyncio.wait([asyncio.create_task(_parallel_executor(case, group_results)) for case in cases_batch])
            click.echo()
    except asyncio.CancelledError:
        click.echo()
        click.echo()
        click.secho("Received interrupt, aborting...")

    click.echo()
    click.secho(_banner("Finished Evaluator"), bold=True)
    click.echo()

    for group, cases in results.items():
        num_passing_group = sum(r is not None and r.result for _, r, _ in cases)
        num_failing_group = len(cases) - num_passing_group
        click.secho(_banner(f"Group {group}: {num_passing_group} passed, {num_failing_group} failed"), bold=True)
        click.echo()
        printed = False
        for case, result, exc in cases:
            if exc:
                click.secho(f"ERR  | {case.input}", bold=True, fg="yellow")
                click.secho(_indent("\n".join(traceback.format_exception(exc))))
                printed = True
                click.echo()
            elif result and not result.result:
                click.secho(f"FAIL | {case.input}", bold=True, fg="red")
                click.secho(_indent(result.trace))
                printed = True
                click.echo()
        if printed:
            click.echo()

    num_cases = sum(len(cases) for cases in results.values())
    num_passing = sum(sum(r is not None and r.result for _, r, _ in cases) for cases in results.values())
    num_failing = num_cases - num_passing
    click.secho(_banner(f"{num_passing} passed, {num_failing} failed"), italic=True)

    return results


def _banner(text: str, width: int = 80) -> str:
    """Generate a banner string with the given text."""
    size = ((width - 2) - len(text)) // 2
    return "=" * size + " " + text + " " + "=" * size


def _indent(text: str, space: int = 4) -> str:
    """Indent multi-line text with the given number of spaces."""
    return " " * space + ("\n" + " " * space).join(text.split("\n"))
