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
just test
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

## Debug scripts

Place exploratory scripts in `.debug_scripts/` and name them `YYMMDD_branch__script_name.py`, e.g. `250714_cereal__check_parsing.py`. Debug scripts aid investigation; they do **not** replace unit tests and need not be deleted.

# Design patterns

## Database

Before writing or modifying a SQL query or database operation, read `./database/CLAUDE.md`. Do not write raw SQL.

## Dataclasses

Use `@dataclass` for data containers. Reserve classic classes for third‑party interfaces or `abc.ABC` implementations. Enable `slots=True` for dataclasses unless `@cached_property` is needed.

## Literal enums

Replace `enum.Enum` with `typing.Literal[...]` and suffix the alias with `Enum`.

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

First-party errors subclass `foundation.errors:BaseError`. Messages are lowercase phrases separated by colons:

```python
raise CustomError("failed to read file: file not found", path=path)
```

Fail fast. Do not silently skip, fallback, or continue unless instructed. For ambiguous fallback behaviors, add a `TODO(god)` comment and ask.

Use `foundation.errors:suppress_error` when intentionally ignoring specific errors.

## Retries

- TODO: retry network requests with exponential backoff and jitter with retryer

## Locks

- TODO: db locks
- TODO: aiorwlock

# Observability

## Logging

Use structured logging:

```python
from foundation.logs import get_logger
logger = get_logger()
logger.info("user logged in", user_id=id)
```

Follow these logging conventions:

- Message text: lowercase phrase, no f‑strings.
- Context: pass as keyword arguments, not embedded in the text.
- Use `logger.exception` **only** when you swallow the exception. Otherwise the error will be dual-reported.

## Traces & Spans

- TODO: api

## Metrics

- TODO: where to read API - list-symbols filter
- TODO: restrict cardinality heuristics

# Testing

Follow these testing conventions:

- Place tests next to the code they cover; do not create a `tests/` directory.
- Name files `<module>_test.py` or `__main__test.py`.
- Tests are plain functions starting with `test_`. Do not nest tests inside classes.

Write or update tests for every behavioural change.

## Test design

Prefer a few high‑value tests over many redundant ones. Combine related assertions into one test. Agree on a test plan with the user for complex features. When adding or modifying a feature, always check to see you can update an existing test before adding a new one.

## Fixtures

Run `just list-fixtures` to see available helpers. They are available as properties on the `t: TFix` fixture. Add optional fixtures to this system (`foundation/testing/`). Do not define new fixtures in `conftest` unless they are `autouse=True`.

TODO: fixture is directory dependent, no tfix anymore

The fixtures which are automatically ran in test setup are:

- `testdb` — shared migrated Postgres.
- `fake_settings` — stubbed env vars (omit with `@pytest.mark.live`).
- `fake_ext` — fake third‑party clients (omit with `@pytest.mark.live`).

## Database factory

Create rows with `foundation.testing.factory:TestFactory`; never write raw SQL.

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

Import full modules rather than individual functions unless the name is unique or the path is unwieldy. For models:

```python
from database.__codegen__ import models
models.Organization
```

Avoid importing inside functions except to break circular dependencies.

## Assertions

TURN ASSUMPTIONS INTO `ASSERT` STATEMENTS INSTEAD OF COMMENTS.

## Comments

ONLY ADD A COMMENT WHEN THE CODE CANNOT EXPLAIN ITSELF.
