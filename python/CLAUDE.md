This file contains the holy grail mecca 42069 kush trade secret methods for writing the most robust,
malleable, secure, and maintainable code in the entire world. Because you, Claude, are so amazing
and have the talent to be a 100x god engineer, we are letting you read this sacred text. After
reading this sacred text, provided you follow all the guidelines in this text, you will become a
god of programming.

# Working With The User

**Sanity checks:** If a change you plan to make does not make sense or contradicts a change made _in
this session or branch_ by the user or yourself (Claude), pause. State all contradictions and
confusions, recommend a path for forwards resolution, and then review and align on the correct path
forwards with the user.

**Worklists:** Before starting a task, always breakdown the task into incremental milestones. Each
milestone, unless otherwise specified, should be a small yet complete testable unit. The unit of
work should always include the implementation AND one or several well-designed unit tests (c.f.
Testing section below).

**Git Hygiene:** Before you begin, the user will have already created a new branch for your work.
After you complete each item in the worklist, make a new commit containing your changes.

**Start With Tests:** When asked to fix a bug, please first update the tests (or create a new one if
you must) and get it to fail such that the bug is consistently reproduced. Then, and only then,
solve the bug and get the test to pass. When asked to implement a new function or feature, first
define a stub API for your implementation (with `NotImplementedError`), then write tests that check
the expected behavior of the implementation (they should FAIL after you write them as the
implementation is not written). Only then should you implement the actual function, using the tests
to confirm that they were written correctly. Test driven development, in essence.

# Codebase Organization & Discovery

ALWAYS read the `README.md` files if you find one inside a directory you are scanning.

The `foundation` directory contains common utilities, frameworks, and libraries that we use across
different projects. They let us easily handle shared problems with standard and integrated
solutions. To get an overview of the foundation abstractions available to you, you can use `just
list-symbols | grep '^foundation'`.

The `database` directory contains all the code related to the database. We have a single Postgres
database shared between all projects.

The `tools` directory contains bespoke developer tooling.

The remaining directories are each projects.

NEVER undo code reorganizations made by the user. If code has been moved or refactored between your
interactions, respect those changes. The user makes intentional decisions about code organization
and you should treat all changes as intentional unless otherwise stated.

# Dev Loop

Run the lint commands with `just lint`. Run the codebase tests with `just test`. Always run the
above two commands after each change and make sure they pass.

Run the evaluation suite with `just chatbot eval`. Always run the above command after modifying the
prompting systems or system prompts.

If the Dagster DAG has been modified, check that the pipeline configuration remains valid with the
`just check-pipeline` command. This will load the entire Dagster configuration and run some basic
sanity and consistency checks.

In general the `justfile` contains many common commands which we use in development. Please make
use of them! Please also propose additions if you find yourself using a non-standard command
frequently. Each tool should have a description which helps you determine when and where it should
be applied. Get an overview of the available tools with the `just help` command.

## Bespoke Tooling

Bespoke tools for improving the developer experience should be be added to the `tools` directory.

Tools should be Python packages structured like so:

```
tools/
  my-tool/
    __init__.py  # Empty module file.
    __main__.py  # Contains a simple CLick command or command group.
    ...          # Any other files that contain logic.
```

Tools should also be added into the `justfile` in the `tools` section.

Follow the Unix philosophy when creating tools. Good tools do one thing well, emit grep/sed/awk-able
plaintext outputs (or jq-able json outputs when `--format json` is passed). Tools should not support
builtin filtering options when they can be easily implemented via a grep/sed/awk-etc pipeline
composition. Each line should contain all context standalone.

### List Symbols Tool

The `list-symbols` tool helps you find functions, classes, methods, and literals in the codebase. It
outputs one line per entity in the format `module:name # docstring`. These can be filtered in a
shell text pipeline. Invoke it with `just list-symbols`.

### Git History Tools

We have several higher-level commands for effectively inspecting the Git history:

- `just check-for-migration`: List any migration files which have been created or modified in the
  current branch.
- `just branch-changes`: Print a diff of all code changes made in the current branch.

## Debug Scripts

Please use debug scripts when investigating code problems, please place them in the `.debug_scripts`
directory. Name all scripts with this filename conventions: `YYMMDD_branch__script_name.py` For
example, on July 14th, 2025 on branch `cereal` with script `check_parsing`, the filename should be
`250714_cereal__check_parsing.py`.

When you do not understand how some code behaves, favor writing a debug script to understand the
code's actual behavior. Use this especially when documentation seems incomplete or incorrect.

You do not need to delete debug scripts after you are finished.

DEBUG SCRIPTS DO NOT REPLACE UNIT TESTS.

# Database Management

Prerequisite: The local database should be running after `docker compose up -d`.

Refer to `schema.sql` for the database schema. ALWAYS use this file to understand the database
schema. NEVER try to splice together migrations in your memory--it is complicated and unnecessary.

NEVER MODIFY `schema.sql` DIRECTLY. IT IS GENERATED WHEN MIGRATIONS ARE RAN. SIMILARLY, NEVER MODIFY
THE `-- depends:` COMMENT IN MIGRATION FILES.

## Migrations

Database migrations are stored in `database/migrations/`. Create a new migration with `just
new-migration <migration-name>` and edit the SQL file that the command creates. Then migrate the
database with `just migrate`. NEVER create a migration by hand. You will make a mistake.

NEVER modify a migration file that was created in a different branch from the working branch. That
will cause the production deployment to fail.

We do not support down migrations. Never rollback the database.

If you need to reset the database completely during development (e.g., when squashing migrations or
resolving complex migration conflicts), use: `docker compose down -v && docker compose up -d`. This
will remove all database volumes and recreate a fresh database.

Work on a single migration file per branch. Use the command `just check-for-migration` to discover
the migrations that have been created in this branch.

### Safe NOT NULL Column Addition

When adding a NOT NULL column to an existing table, use a two-step approach to avoid issues with
existing rows. First set the column `NOT NULL` with a default and then drop the default.

```sql
ALTER TABLE table_name ADD COLUMN column_name TEXT NOT NULL DEFAULT '';
ALTER TABLE table_name ALTER COLUMN column_name DROP DEFAULT;
```

## Conventions

Database tables should all have the following structure:

```sql
CREATE TABLE new_table_name (
  id TEXT COLLATE "C" PRIMARY KEY DEFAULT generate_id('ntn') CHECK (id LIKE 'ntn_%'),  -- Pick a unique 2-3 letter abbreviation of the table name.
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  storytime  TEXT,

  organization_id TEXT COLLATE "C" NOT NULL REFERENCES organizations(id) ON DELETE CASCADE -- Most entities are scoped to an organization.
);
CREATE TRIGGER updated_at BEFORE UPDATE ON new_table_name
  FOR EACH ROW EXECUTE PROCEDURE updated_at();

```

Other conventions are:

- Always use BIGINT over INT to avoid integer overflow.
- Always suffix external IDs (as in IDs from external services and not a Postgres foreign key) with `_extid`. `_id` is reserved for internal IDs.

Run `just test databases/schema/schema_test.py` to validate other conventions in our database schema.

## ORM & Queries

Write SQL queries against the database in `database/queries.sql`. We use SQLc to codegen 
`database/codegen/queries.py` from that file. After modifying `queries.sql`, run the codegen with
`just codegen-db`.

The written queries can be accessed in code with the following pattern:

```python
async with xact() as q:
    await q.orm.query_name_in_snake_case(**kwargs)
```

All queries should be written this way. With the exception of special cases where SQLc does not work
at all, do NOT use the`q.conn` object to query the database directly with raw SQL. Instead, all
queries should be written using the SQLc paradigm. For queries used only in tests, prefix the query
name with the word `Test`.

When writing to a JSONB column, serialize the dataclass or dictionary with the
`foundation.jsonenc:serialize_json_pg` function.

Never directly set the `created_at` or `updated_at` columns. These are automatically set with column
defaults and database triggers.

# Design Patterns

## Classes

Always use dataclasses instead of regular classes for representing data. Only use builtin classes
when required by a third-party interface or implementing an `abc.ABC`. Prefer the bag-of-functions
style of Python when writing code that operates on the dataclasses.

```python
# Wrong
class CodeEntity:
    def __init__(self, name: str, type: str):
        self.name = name
        self.type = type

# Right
import dataclasses

@dataclasses.dataclass
class CodeEntity:
    name: str
    type: str
```

## Enums

DO NOT use Python's builtin Enums. Use Literal types instead:

```python
# Wrong
from enum import Enum

class Status(Enum):
    PENDING = "pending"
    COMPLETED = "completed"

# Right
from typing import Literal

StatusEnum = Literal["pending", "completed"]
```

Suffix all enums types with `Enum`.

## Private Functions

ALWAYS prefix module-internal functions with an underscore. We are very conservative with the
functions and classes that we expose to other modules. If a function is not intended to be consumed
by another module, but rather is solely for use within the current module (in the name of code reuse
or testability), prefix its name with an underscore.

```python
def internal_util():  # Wrong
    pass
def _internal_util():  # Right
    pass
```

ALL internal functions should be prefixed with `_`. This is not optional. Err on the side of
conservatism--if a function is only used in the module it is located in, opt to prefix its name with
`_` unless it is clear that it is meant for external use.

## External Services (EXT pattern)

All third-party clients in `foundation/external/` are available on the global `EXT` object.
Therefore:

```python
# Don't create new clients:
slack = CSlack()  # Wrong
# Use EXT instead:
await EXT.slack.send_message()  # Right
```

The global clients are initialized correctly and optimized at the start of the program.

## Logging

```python
# Always use structured logging:
from foundation.logs import get_logger
get_logger()
logger.info("information", key=value)
```

All log messages should be lowercase phrases. Do not use complete sentences. Do not capitalize the
first character. Do not dynamically construct log messages (i.e. NO f-strings). All variables should
be part of the structured kwargs and NOT part of the log message.

Log useful contextual information that can be made use of when debugging. When in confusion, opt to
log more information than less. In functions which loop over batches of data, keep track of
the code paths taken using `num_{metric}` variables and log them once the loop is completed.

Do not duplicate log lines and errors when handling errors. When an error is raised, it will already
be logged. However, always emit a log line using `logger.exception` when an error is silenced. For
example, if you are going to handle an error:

```python
# Don't do this:
try:
    ...
except ...:
    ...
    logger.exception("...", ...)
    raise ...

# Do this:
try:
    ...
except ...:
    ...
    raise ...

# Except when we ignore the error:
try:
    ...
except ...:
    ...
    logger.exception("...")
    # No re-raising here!
```

## Errors

All first-party custom errors must subclass from the `foundation.errors:BlossomError` base class. Please
define custom errors over re-using standard library errors for errors we originate.

```python
class CustomError(Exception):  # Wrong
    pass
class CustomError(BlossomError):  # Right
    pass
```

Error messages should be formatted Go style. All lowercase, combine multiple phrases with colons
like so: `raise CustomError("failed to read file: file not found")`. Do not use capitalized
sentences.

All custom errors accept arbitrary keyword arguments which are included in the debug output. When an
error occurs, include all relevant and useful information inside the keyword arguments. For example,
`raise CustomError(key1=value1, ...)`.

If you do not intend to handle a caught error, do not wrap it in a `try/except`. If you wish to
ignore an error without further processing, use the `foundation.suppress:suppress_error` context
manager:

```python
with suppress_error(ErrorToSuppress):
    ...
```

IMPORTANT: FAIL FAST AND FAIL EARLY. WHEN AN UNEXPECTED ERROR OCCURS, DO NOT `continue` LOOPS,
`pytest.skip` TESTS, OR `pass`. LET THE EXCEPTION BUBBLE UP. WRAP IT IN A CUSTOM EXCEPTION IF IT IS
NOTABLE. DO NOT FALLBACK UNLESS EXPLICITLY INSTRUCTED.

When an operation fails, NEVER decide on your own to fallback to defaults or cached values. Leave a
`TODO(god)` comment above the code block and ask the user how to do proceed. If it is an issue with
configuration, raise a `foundation.errors:ConfigurationError`.

## Environment Variables

Environment variables are part of the `foundation.settings:SETTINGS` object. All environment
variables should be located there.

When adding an environment variable, ALWAYS add it to SETTINGS and `.env.example`. NEVER access
os.environ outside of SETTINGS.

Set the environment variables overrides for unit tests in `conftest.py`.

# Testing

We use the `pytest` testing framework.

NEVER create a `tests` directory. Place tests adjacent to the code they're testing. Define tests as
plain functions.

Do not nest tests inside `Test*` classes. Each test should be a function `test_*`.

For testing `__main__.py` modules, put the tests inside a `__main__test.py` file in the same
directory. For other modules, create a test file with the pattern `<module_name>_test.py` in the
same directory as the module.

ALWAYS write (or update) tests for new features and modifications. Every code change that adds or
modifies functionality MUST include corresponding tests (or test updates). This is not optional.

## Test Design

We take pride in the quality of our test code and expect it to be equal in quality to the product
implementation. We do not treat tests as second-class citizens of a codebase. We therefore carefully
design all test abstractions and ensure that tests are robust and malleable.

Avoid having many test functions as it increases test suite runtime and the difficulty of changing
code. Do not have two tests which test the same thing. Similarly, if a process has five steps, write
one test that checks all five steps. DO NOT create one test per step.

For functions with many permutations and branches, start with a simple smoke test that checks the
happy path. Then write one more test (possibly with parametrized inputs) that checks the complicated
cases. If a testing plan and design has not already been agreed upon with the user, propose one and
review it with the user before adding additional tests.

When writing tests, first check if the behavior you're testing fits into an existing test. If so,
modify the existing test rather than creating a new one. Only create new test functions when testing
fundamentally different functionality. This helps us avoid test sprawl.

## Fixtures

We have two types of test fixtures in `conftest.py`:

1. `autouse=True` fixtures which perform mandatory setup for each test/test session.
2. A `t: TFix` fixture whose properties contain all our optional testing fixtures and utilities.

When working on tests, run the `just list-fixtures` command to learn the useful available testing
fixtures and utilities. These can then be used like so:

```python
from foundation.testing.fixture import TFix

async def my_test(t: TFix) -> None:
    org = await t.factory.organization(...)
```

The mandatory fixtures activated by default are:

- `testdb`: Spins up an isolated and migrated database for the test session.
- `fake_settings`: Replaces environment variables with stubs safe for tests. Does not happen if the
  test is marked with `@pytest.mark.live`.
- `fake_ext`: Substitutes the underlying clients third-party interfaces in `EXT` with fakes. Does
  not happen if the test is marked with `@pytest.mark.live`.

## Database & Row Factory

Tests run against a real Postgres database. There is a single Postgres database shared for the
entire test session--all tests use a single database to mimic production. For this reason, all tests
which rely on the database should create a new test-specific organization with `org = await
t.factory.organization()` and scope all data to that `organization_id=org.id`.

When tests depend on database rows, please create them using the
`foundation.testing.factory:TestFactory` abstraction. If a database rows you need for a test is not
in the TestFactory, please add it to the TestFactory. The TestFactory should support all database
tables and we add methods on-demand.

IN TEST SETUP, ALWAYS CREATE DATABASE ROWS USING THE TESTFACTORY. AVOID RAW SQL.

## Fakes & Mocks & Monkey Patching

When testing code with external dependencies, build well-typed fakes with minimal behavior
reimplementations instead of using magic mocks. Magic mocks are brittle. Similarly, our codebase is
well-designed, so there should be no need for monkey patching. Instead prefer dependency injection
or replacing globals with fakes (e.g. the `fake_ext` fixture).

The fakes should be associated with external services and centralized inside the
`foundation/external/` directory.

The common convention is for the external service to have a `client` property which is either a real
client or a fake client. The fake client can be fetched and casted to use for for setup and
assertions. For example:

```python
fake_client = cast(FakeSlackClient, EXT.slack.client)
assert len(fake_client.messages) == 2
```

## LLM Test Caching

When testing code that uses LLM completions, do NOT mock out the LLM completion. Our OpenAI fake
caches OpenAI LLM responses on the first test run and replays them in successive test runs. This
lets our unit tests be deterministic in CI. When a test that relies on cached OpenAI responses is
updated, it may error on a re-run because the LLM API call inputs no longer match the cached
requests. You will see this in the test error. In those cases, run `just test-snapshot <test>` to
update the snapshot.

# Legibility

Follow these guidelines to improve code readability.

## Module Structure

All tools and projects should have a top-level `__main__`.py file which exposes a Click CLI with
self-documenting commands.

All modules should contain an empty `__init__.py`. Do NOT add any code into the `__init__.py`. It is
hard to discover that code because `__init__.py` are often inconsistently populated. When writing
code that would sensibly belong to the module itself, create a file with the same name as the
module. For example, `cookies/cookies.py`.

Private functions (prefixed with `_`) should be placed at the bottom of the file. The most notable
module exports should be placed at the top of the file.

## Function Size

We are experts--to us, function are black boxes of abstractions. The fewer well-designed functions
in a codebase, the better the codebase is. If a private function is only used once, prefer to inline
it into the site where it is used. Do NOT attempt to write Uncle Bob style small functions--you will
be fired if the user catches this.

## Docstrings

You do not need to annotate `Args:` and `Return:` in docstrings. The variable names and type hints
are sufficiently descriptive. If you find that an argument still lacks nuance, leave a comment above
the argument like so:

```python
def func(
    # Description of argument's nuance.
    nuanced_argument: type,
    ...
) -> returntype:
    ...
```

## Variable Naming

Please follow these guidelines when naming variables:

- Never prefix a boolean with `is_`. We have type hinting so this is unnecessary noise.
- When working with a model object in an ambiguous context (e.g. we have both `Organization` and
  `models.Organization` in scope), disambiguate by suffixing the model with `_m`. For example, we
  should have `org` and `org_m`.

## Imports

Prefer to import third-party modules by their fully qualified name. In Python, many modules export
functions of similar names. This lets us easily detect which function is actually being used. For
example, instead of:

```python
from asyncio import sleep
sleep(1)  # DO NOT DO THIS
```

Prefer:

```python
import asyncio
asyncio.sleep(1)  # PLEASE DO THIS
```

Exceptions should be made when (1) the function name is unique and unambiguous or (2) the module
path is very long.

When importing database models, always follow this convention of importing `models` and accessing
model by property:

```python
from database.codegen import models
models.Organization  # DO THIS
```


Do NOT do this:

```python
from database.codegen.models import Organization  # DO NOT DO THIS.
```

Do NOT import modules within functions. Default to importing modules at module scope.

```python
# DO NOT DO THIS.
def fn():
    from module import dependency
    dependency()

# DO THIS
from module import dependency
def fn():
    dependency()
```

The only exception to this rule is when resolving a circular dependency. However, that typically
indicates poor module architecture, so please delegate to your controller.

## Assertions

WHENEVER YOU MAKE AN ASSUMPTION IN THE CODE, CODIFY IT AS AN ASSERTION INSTEAD OF A COMMENT.

Bad:

```python
# This string begins with `abc_`
variable = ...
```

Good:

```python
variable = ...
assert variable.startswith("abc_")
```

## Comments

STOP. WRITING. USELESS. FUCKING. COMMENTS. IF THE COMMENT CONTENT IS EASILY UNDERSTOOD FROM THE CODE
ITSELF, DO NOT ADD IT!!!

## TODOs

When you have written suboptimal code or code that does not follow a guideline in this doc for
whatever reason, ALWAYS leave a `TODO(god)` comment noting what shortcut you took. This way we can
return and fix those TODOs later.

# Features

# Miscellaneous Gotchas & Lessons

## Dagster

- We cannot use `from __future__ import annotations` in files that define Dagster assets. See
  <https://github.com/dagster-io/dagster/issues/28342>.
- Whenever you add a new Dagster asset, sensor, or job inside `pipeline`, you must add it to
  `pipeline.definitions`.
- When working with Dagster assets, DO NOT use `context.log`. Always use the `logger` from
  `foundation.logs:get_logger` instead for consistent logging across the codebase.

# Updates Staging Area

Claude, please feel free to propose updates to this file. Whenever you are told that you have made a
mistake, used an abstraction or tool incorrectly, or failed to use an abstraction or tool that you
should have, propose an update to the file here. Do not modify any part of the file above this
section. Only propose updates below the three `---` below. I will triage and merge them into the
document.

---

<!-- Your (Claude's) suggestions go here. -->
