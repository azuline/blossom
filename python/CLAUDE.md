# Codebase Organization & Discovery

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

If the `pipeline` DAG has been modified, check that the pipeline configuration remains valid with
the `just dag-check` command. This loads the Dagster configuration and checks its consistency.

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

You do not need to delete debug scripts after you are finished. AND DEBUG SCRIPTS DO NOT REPLACE
UNIT TESTS.

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

Environment variables are part of the `foundation.env:ENV` object. All environment
variables should be located there.

When adding an environment variable, ALWAYS add it to ENV and `.env`. NEVER access os.environ
outside of ENV.

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

For example:

```python
async def test_clock_permutations():
    # Test now().
    assert CLOCK.now().date() == datetime.now(UTC).date()

    # Test set().
    with CLOCK.TESTING_set(datetime(2024, 2, 3, tzinfo=UTC)):
        assert CLOCK.now().date() == date(2024, 2, 3)
        t = CLOCK.now()
        await asyncio.sleep(0.01)
        assert t != CLOCK.now()

    # Test freeze().
    with assert CLOCK.TESTING_freeze(datetime(2024, 2, 3, tzinfo=UTC)):
        assert CLOCK.now().date() == date(2024, 2, 3)
        t = CLOCK.now()
        await asyncio.sleep(0.01)
        assert t == CLOCK.now()
```

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
from database.__codegen__ import models
models.Organization  # DO THIS
```


Do NOT do this:

```python
from database.__codegen__.models import Organization  # DO NOT DO THIS.
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

<!-- Your (Claude's) suggestions go here. -->

## rpc

The `rpc` package provides abstractions for defining and implementing RPC
routes. This package also generates TypeScript bindings from the RPC
definitions.

The `webserver` package mounts all declared routes when starting up.

## Defining Routes

The `rpc` package exposes the decorator `route` for defining RPC routes. This
decorator:

1. Registers the RPC route into the _RPC catalog_. The RPC catalog is used
   downstream by the [webserver](../webserver) and RPC codegen script.
2. Wraps the RPC route in the shared middlewares, which handle traces,
   authentication, authorization, data parsing, database connections, and
   exception handling.

Visit the RPC declaration for additional documentation.

To ensure that the catalog is fully seeded at runtime, all files that define
routes should be imported in `catalog.py`'s `get_catalog` function.

The `route` decorator's usage is as follows:

```python
# Handlers define dataclasses for input and output data. The `route` decorator
# handles parsing to and from these dataclasses.
@dataclass
class ReqIn:
    num_bunnies: int
    acceptable_colors: list[str] | None


@dataclass
class Bunny:
    id: str
    color: Color
    name: str
    cuteness_level: int


@dataclass
class ReqOut:
    bunnies: list[Bunny]


# Errors should subclass from APIError. Errors should also be dataclasses.
@dataclass
class CannotMakeBunniesError(APIError):
    pass


# The route decorator has two parameters that must be specified:
#
# - Authorization determines whether the route is public or restricted to a
#   subset of requesters.
# - Errors declares the set of errors that this handler raises. This is used to
#   generate the set of possible errors on the frontend. It must be maintained by
#   hand.
#
# The input and output types are inferred from the function type signature. The
# RPC name is inferred from the function name.
@route(authorization="organization", errors=[CannotMakeBunniesError])
async def generate_bunnies(req: Req[ReqIn]) -> ReqOut:
    # The `req` parameter contains many useful attributes for writing handlers.
    # Visit it in the code for additional documentation.
    if req.user is None:
        raise CannotMakeBunniesError

    return ReqOut(bunnies=await req.cq.q.fetch_bunnies(organization_id=req.organization.id))
```
