# Foundation

The `foundation` package provides an integrated set of utilities and library facades for building robust programs. 

See [CLAUDE.md](./CLAUDE.md) for best practices and conventions.

# Environment

The [`env.py`](./env.py) file loads configuration parameters, first looking at environment variables, then the `.env.local` file, and then the `.env.example` file. It makes all the configuration parameters available through the `ENV` export, which can be used like so:

```python
if foundatione.env.ENV.environment == "production":
    print(ENV.slack_token)
```

# Standard Library

The `stdlib` package contains pure functions related to standard types and standard library functions.

Modules which require little description are:

- [`convert.py`](./convert.py) has data conversions and type casts for native types.
- [`decorators.py`](./decorators.py) has the useful decorators `@memoize` and `@run_once`.
- [`identifiers.py`](./identifiers.py) has functions that generate random IDs, emails, and strings.

## JSON Serde

## JSON Schemas

## Data Parsing & Validation

## Unset

## Network Retries

## Asynchronous Tasks

## Clock

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
