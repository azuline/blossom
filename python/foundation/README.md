# Foundation

The `foundation` package provides an integrated set of utilities and library facades for building robust programs.

See [CLAUDE.md](./CLAUDE.md) for best practices and conventions.

# Environment

[`env.py`](./env.py) loads all environment variables for configuration. For each expected variable, it first searches in the environment variables, then the `.env.local` file, and then the `.env.example` file. All variables are exposed on `ENV`, which can be used like so:

```python
if foundation.env.ENV.environment == "production":
    print(ENV.slack_token)
```

# Standard Library

The `stdlib` package extends the standard types and Python standard library.

[`stdlib/convert.py`](./stdlib/convert.py) has data conversions and type casts for native types. [`stdlib/decorators.py`](./stdlib/decorators.py) has the useful decorators `@memoize` and `@run_once`. [`stdlib/identifiers.py`](./stdlib/identifiers.py) generates random IDs, emails, and strings. [`stdlib/paths.py`](./stdlib/paths.py) provides references to the paths of other projects in the monorepo.

[`stdlib/clock.py`](./stdlib/clock.py) provides a `CLOCK` for getting the current time, replacing use of `datetime.now`. The clock can be set or frozen. Use it like so:

```python
time = foundation.stdlib.clock.CLOCK.now()
# Testing utilities:
foundation.stdlib.clock.CLOCK.TESTING_set(time)  # Clock will keep on ticking.
foundation.stdlib.clock.CLOCK.TESTING_freeze(time)  # Clock will stop ticking.
```

[`stdlib/parse.py`](./stdlib/parse.py) parses dictionaries into Python dataclasses with Pydantic. We encapsulate Pydantic inside this file.

```python
dc = foundation.stdlib.parse.parse_dataclass(DataclassType, data_dict)
```

[`stdlib/jsonschema.py`](./stdlib/jsonschema.py) converts dataclass types to OpenAI structured responses-compliant JSONSchema:

```python
jsonschema = foundation.stdlib.jsonschema.dataclass_to_jsonschema(DataclassType, "schema_name")
```

[`stdlib/retry.py`](./stdlib/retry.py) is a higher order function that retries asynchronous functions with backoff and jitter:

```python
retryer = foundation.stdlib.retry.AsyncRetryer(name="get_external_data")  # Parametrize the executor here.
await retryer.execute(get_external_data_fn, arg1, arg2=val2)
```

[`stdlib/tasks.py`](./stdlib/tasks.py) provides a supervisor for structured concurrency and a fire-and-forget unsupervised task tracker. Each task starts a child span in the active trace.

```python
foundation.stdlib.tasks.create_unsupervised_task("task_name", task_function)
# Testing utilities:
await foundation.stdlib.tasks.wait_for_unsupervised_tasks()
```

# Crypto

Secrets

Vault

# Webserver

Quart

Observability pieces

RPCs (use case)

# External

`EXT` globals

Fakes pattern, responsibility split.

# Testing

t fixture philosophy

conftest

each testing class

# Feature Flags

Todo

# Observability

datadog & sentry

## Logging

logs - structlog

log level setting

## Error Handling

errors - taxonomy

sentry

raising errors practices

suppressing and reporting errors

logger.exception as reporting alias (how exc_info works)

extra data on errors

dataclass errors, namely for rpcs

## Metrics

metrics - statsd through datadog

cardinality reduction

abnormal pattern

count_and_time special - tag accumulation

## Traces

traces & spans - ddtrace

same cardinality reduction applies

spans parent nesting

span tagging

span context passing

places that start a span: transaction (todo move to count and time), web request. generally aim for
sensible instrumentation across the foundation so that product code is in the green on the 80/20.
