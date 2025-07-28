# Codebase organization

The codebase is split by purpose:

- `foundation`: Shared utilities, frameworks, and libraries. Discover them with: `just list-symbols | grep '^foundation'`.
- `database`: All Postgres‑related code.
- `tools`: Bespoke developer utilities.
- Every other top‑level directory represents a project.

# Dev loop

Run linting and tests after **every** change:

```bash
just lint
just test [-vv]  # Use -vv when debugging test failures.
```

If the Dagster pipeline (`pipeline` DAG) changes, validate it:

```bash
just dag-check
```

`just help` lists common commands. If you often repeat a shell snippet, propose adding it to the `justfile` with a concise description.

Manage dependencies using `uv`.

## Bespoke tooling

Add tools under `tools/` as Python packages:

```
tools/my_tool/
  __init__.py
  __main__.py
  __main__test.py  # Contains one comprehensive end-to-end test using Click testing utilities.
  ...
```

Register each tool in the `justfile`.

Tools should follow the Unix philosophy: do one thing well and emit grep/sed/awk‑able text (or JSON when `--format json` is passed). Avoid built‑in filters that a shell pipeline can handle.

Existing tools are:

- `just branch-changes` — Diff the current branch against `master`.
- `just check-for-migration` List migration files touched in the current branch.
- `just list-errors` prints a tree of the first-party error taxonomy.
- `just list-symbols` prints one line per symbol as `module:name # docstring`. Combine it with shell filters to explore the codebase.

## Logs

Logs from development and test are written to the `./claude/logs` directory. Tail those logs when debugging.

# Design patterns

## Database queries

Write SQL queries in a `queries.sql` files adjacent to the module that uses the query. After editing `queries.sql`, regenerate the ORM with:

```bash
just codegen-db
```

Access the queries by importing the generated functions and passing a connection:

```python
from directory.__codegen_db__.queries import query_name
from database.xact import xact_admin

async with xact_admin() as conn:
    result = await query_name(conn, **kwargs)
```

Follow these conventions:

- Never use raw SQL in Python, always use the ORM.
- Prefix test‑only query names with `test_`.
- Serialize JSONB with `foundation.jsonenc:serialize_json_pg`.
- Never set `created_at` or `updated_at` in code; DB triggers handle them.
- Name queries as `{resource}_{action}_{filter}`. For example, `user_create`, `user_get_by_id`, `user_list_by_organization`, etc.
- Never directly modify anything in a `__codegen_db__` directory, as they are generated artifacts.

## Enums

`foundation.__codegen_db__.enums` is generated from the `%_enum` database tables and used in database models.

Do not use `enum.Enum` for any enums. Instead, use `typing.Literal[...]` and suffix the alias with `Enum`.

## Dataclasses

Use `@dataclass` for data containers. Reserve classic classes for third‑party interfaces or `abc.ABC` implementations. Enable `slots=True` for dataclasses unless `@cached_property` is needed.

## Private functions

Prefix all module‑private symbols with `_`. When unsure, mark it private.

## External services (`EXT`)

Every third‑party client under `foundation/external/` is exposed via the global `EXT` object. Use them like so:

```python
await EXT.slack.send_message(...)
```

Do **not** instantiate new clients.

## Environment variables

Access variables exclusively through `foundation.env:ENV`, and declare them in `.env.example`. Test overrides live in `conftest.py`.

## Errors

First-party errors subclass `foundation.observability.errors:BaseError`. Messages are lowercase phrases separated by colons:

```python
raise CustomError("failed to read file: file not found", path=path)
```

Fail fast. Do not silently skip, fallback, or continue unless instructed. For ambiguous fallback behaviors, add a `TODO(god)` comment and ask.

Use `foundation.observability.errors:suppress_error` when intentionally ignoring specific error

## Retries

Wrap all external network requests in `foundation.stdlib.retry:AsyncRetryer` to enable exponential backoff and jitter:

```python
retryer = AsyncRetryer(name="request_fn_name")
await retryer.execute(request_fn, arg1, arg2=val2)
```

## Locks

If necessary, linearize operations by taking out a Postgres advisory lock:

```python
async with pg_advisory_lock("lock_name"):
    ...
```

# Observability

## Logging

Use structured logging:

```python
from foundation.observability.logs import get_logger
logger = get_logger()
logger.info("user logged in", user_id=id)
```

Follow these logging conventions:

- Message text: lowercase phrase, no f‑strings.
- Context: pass as keyword arguments, not embedded in the text.
- Use `logger.exception` **only** when you swallow the exception. Otherwise the error will be dual-reported.

## Traces & Spans

Start a new span in a trace like so:

```python
from foundation.observability.spans import span
with span("span_name", **tags):
    ...
```

Use spans to divide the trace of a large feature into smaller pieces. Spans should reflect important sub-operations.

Logs emitted within a span inherit the tags of the span. Add tags to the active span with `tag_current_span(key=value, **kwargs)`.

Keep the cardinality of span names and tags (both keys and values) low. Do not use any per-user or per-organization values in tags (e.g. NO `organization_id`).

## Metrics

Emit metrics with the following functions (import from `foundation.observability.metrics`):

- Count Metric: `metric_increment`, `metric_increment_abnormal`, `metric_decrement`, `metric_decrement_abnormal`.
- Gauge Metric: `metric_gauge`.
- Timing Metric: `metric_timing`.
- Distribution Metric: `metric_distribution`.
- Count + Time Metric: `count_and_time` context manager.

# Testing

Treat tests as first-class citizens of the codebase. They are equal in importance to the implementation.

Follow these testing conventions:

- Place tests next to the code they cover; do not create a `tests/` directory.
- Name files `<module>_test.py` or `__main__test.py`.
- Tests are plain functions starting with `test_`. Do not nest tests inside classes.
- You do not need to mark asynchronous tests with `@pytest.mark.asyncio`, they are automatically handled.
- Express the test's expectations in the fewest number of asserts possible. If possible, assert on an entire structure rather than each individual field, or a multi-line string instead of individual lines.

Write or update tests for every behavioural change.

## Test design

Prefer a few high‑value tests over many redundant ones. Combine related assertions into one test. Agree on a test plan with the user for complex features. When adding or modifying a feature, always check to see you can update an existing test before adding a new one.

## Fixtures

Run `just list-fixtures` to see available helpers. They are available as properties on the `t: XFixture` fixture. Add optional fixtures to the fixtures sub-objects in `foundation/testing/` (or make a new one). Do not define new fixtures in `conftest` unless they are `autouse=True`.

Each project defines its own `t` fixture (`FoundationFixture`, `ProductFixture`, `PanopticonFixture`, `PipelineFixture`) in `{project}/conftest.py`. Import the correct type for each project.

The fixtures which are automatically ran in test setup are:

- `testdb` — shared migrated Postgres.
- `fake_settings` — stubbed env vars (omit with `@pytest.mark.live`).
- `fake_ext` — fake third‑party clients (omit with `@pytest.mark.live`).

## Test data

Each test should create a new organization and scope test data to it. Data creation should be concise; create abstractions for generating test data to spec.

For seeding database data, use the test factory:

```python
org = await t.factory.organization()  # or any other table in the database.
```

For seeding third-party data into fakes, TODO.

## Fakes & mocks

Prefer writing and using typed fakes with minimal behavior reimplementations in `foundation/external/`. Do not use magic mocks and monkey‑patching.

Each external service has a `client` field which is set to a fake client in tests (via `fake_ext`). Access them in a test via `client = cast(FakeServiceClient, EXT.service.client)`. Afterwards, keep on using `EXT.service`.

## LLM caching

OpenAI calls are cached across unit tests runs for determinism. If you change the inputs to the LLM call, run:

```bash
just test-snapshot <test>
```

# Legibility

## Module layout

Each top‑level module exposes a `__main__.py` Click CLI. Keep `__init__.py` empty. put module‑level code in a file that matches the package name, e.g. `cookies/cookies.py`.

In modules with `__main__.py`, add an `initialize_instrumentation()` call to the `__init__.py` to set up the infrastructure first thing.

Place public exports at the top of the file; helpers go at the bottom.

## Function size

Inline private helper functions that are only used once to keep code readable. FAVOR A FEW WELL‑NAMED FUNCTIONS, EVEN IF LARGE, OVER MANY NOISY TRIVIAL SMALL ONES. DO NOT CREATE SMALL FUNCTIONS FOR THE SAKE OF CREATING SMALL FUNCTIONS.

## Docstrings

Type hints make `Args:`/`Returns:` redundant so do not include them. If nuance is needed, add an inline comment above the parameter.

## Variable naming

Follow these variable naming conventions:

- Skip the `is_` prefix for booleans.
- Disambiguate database model instances from other dataclasses with an `_m` suffix when there is a collision.

## Imports

Import full modules rather than individual functions unless the name is unique or the path is unwieldy.

Avoid importing inside functions except to break circular dependencies.

## Assertions

TURN ASSUMPTIONS INTO `ASSERT` STATEMENTS INSTEAD OF COMMENTS.

## Comments

ONLY ADD A COMMENT WHEN THE CODE CANNOT EXPLAIN ITSELF.
