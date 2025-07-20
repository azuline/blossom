## Miscellaneous

- We cannot use `from __future__ import annotations` in files that define Dagster assets. See
  <https://github.com/dagster-io/dagster/issues/28342>.
- Whenever you add a new Dagster asset, sensor, or job inside `pipeline`, you must add it to
  `pipeline.definitions`.
- When working with Dagster assets, DO NOT use `context.log`. Always use the `logger` from
  `foundation.logs:get_logger` instead for consistent logging across the codebase.

