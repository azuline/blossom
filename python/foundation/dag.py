import inspect
from collections.abc import Callable, Mapping, Sequence
from typing import Any

import dagster

from foundation.errors import report_error

ORG_PARTITION = dagster.DynamicPartitionsDefinition(name="organizations")
DEFAULT_POOL = "default"


def dag_asset(
    *,
    name: str | None = None,
    key_prefix: str | Sequence[str] | None = None,
    deps: Sequence[dagster.AssetDep | dagster.AssetsDefinition | dagster.SourceAsset | dagster.AssetKey | dagster.AssetSpec | str] | None = None,
    metadata: dict[str, Any] | None = None,
    tags: Mapping[str, str] | None = None,
    partitions_def: dagster.PartitionsDefinition | None = None,
    automation_condition: dagster.AutomationCondition | None = None,
    backfill_policy: dagster.BackfillPolicy | None = None,
    retry_policy: dagster.RetryPolicy | None = None,
    pool: str | None = DEFAULT_POOL,
) -> Callable[[Callable[..., Any]], Any] | Any:
    """
    Facade over dagster.asset decorator that integrates Dagster with our tooling.

    Only a limited number of kwargs in use have been added. Add more kwargs as needed.
    """

    def decorator(func: Callable[..., Any]) -> Any:
        has_args = bool(inspect.signature(func).parameters)
        if inspect.iscoroutinefunction(func):

            async def wrapper(context: dagster.AssetExecutionContext):  # type: ignore
                try:
                    return await func(context) if has_args else func()
                except Exception as e:
                    report_error(e)
                    raise

        else:

            def wrapper(context: dagster.AssetExecutionContext):  # type: ignore
                try:
                    return func(context) if has_args else func()
                except Exception as e:
                    report_error(e)
                    raise

        wrapper.__name__ = func.__name__
        wrapper.__qualname__ = func.__qualname__

        return dagster.asset(  # noqa: TID251
            name=name,
            key_prefix=key_prefix,
            deps=deps,
            metadata=metadata,
            tags=tags,
            partitions_def=partitions_def,
            automation_condition=automation_condition,
            backfill_policy=backfill_policy,
            retry_policy=retry_policy,
            pool=pool,
        )(wrapper)

    return decorator
