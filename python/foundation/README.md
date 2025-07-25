# Foundation

The `foundation` package provides an integrated set of high-level utilities and library facades for all projects.

See [CLAUDE.md](./CLAUDE.md) for best practices and conventions.

## Environment

[`env.py`](./env.py) loads all environment variables for configuration. For each expected variable, it first searches in the environment variables, then the `.env.local` file, and then the `.env.example` file. All variables are exposed on `ENV`, which can be used like so:

```python
if foundation.env.ENV.environment == "production":
    print(ENV.slack_token)
```

## Standard Library

The `stdlib` package extends the standard types and Python standard library.

[`stdlib/convert.py`](./stdlib/convert.py) has data conversions and type casts for native types.

[`stdlib/decorators.py`](./stdlib/decorators.py) has the useful decorators `@memoize` and `@run_once`.

[`stdlib/identifiers.py`](./stdlib/identifiers.py) generates random IDs, emails, and strings.

[`stdlib/paths.py`](./stdlib/paths.py) provides references to the paths of other projects in the monorepo.

[`stdlib/clock.py`](./stdlib/clock.py) provides a `CLOCK` for getting the current time, replacing use of `datetime.now`. The clock can be set or frozen. Use it like so:

```python
time = foundation.stdlib.clock.CLOCK.now()
## Testing utilities:
with foundation.stdlib.clock.CLOCK.TESTING_set(time):  # Clock will keep on ticking.
    ...
with foundation.stdlib.clock.CLOCK.TESTING_freeze(time):  # Clock will stop ticking.
    ...
```

[`stdlib/parse.py`](./stdlib/parse.py) parses dictionaries into Python dataclasses with Pydantic. We encapsulate Pydantic inside this file.

```python
dc = foundation.stdlib.parse.parse_dataclass(DataclassType, data_dict)
```

[`stdlib/jsonschema.py`](./stdlib/jsonschema.py) converts dataclass types to OpenAI structured responses-compliant JSONSchema:

```python
completion = await EXT.openai.complete(
    ...,
    response_format=foundation.stdlib.jsonschema.dataclass_to_jsonschema(DataclassType, "schema_name"),
)
```

[`stdlib/retry.py`](./stdlib/retry.py) is a higher order function that retries asynchronous functions with backoff and jitter:

```python
retryer = foundation.stdlib.retry.AsyncRetryer(name="get_external_data")  # Parametrize the executor here.
await retryer.execute(get_external_data_fn, arg1, arg2=val2)
```

[`stdlib/tasks.py`](./stdlib/tasks.py) provides a supervisor for structured concurrency and a fire-and-forget unsupervised task tracker. Each task starts a child span in the active trace.

```python
foundation.stdlib.tasks.create_unsupervised_task("task_name", task_function)
## Testing utilities:
await foundation.stdlib.tasks.wait_for_unsupervised_tasks()
```

## Crypto

[`crypto/crypt.py`](./crypto/crypt.py) provides `encrypt_symmetric` and `decrypt_symmetric` functions for symmetric AEAD.

[`crypto/vault.py`](./crypto/vault.py) provides the `vault_secret`, `fetch_vaulted_secret`, and `delete_vaulted_secret` functions for storing encrypted secrets in the database.

## Webserver

The `webserver/` package provides a high-level abstraction for building a backend API for a web application. It follows the Backend-For-Frontend pattern, where each endpoint is tailored made for a specific frontend feature.

[`webserver/rpc.py`](./webserver/rpc.py) provides `RPCRouter` and `rpc_common` for defining RPCs. Each application (e.g. product and panopticon) extends `rpc_common` with application-specific logic. So for an application `x`:

```python
@rpc_x("list_bunnies", errors=[BunniesAreAsleep])  # Errors is used in the generated TypeScript bindings.
async def list_bunnies(req: ReqX[InputDataclassType]) -> OutputDataclassType:
    ...
    if ...:
        raise BunniesAreAsleep
    return OutputDataclassType(...)


def create_x_router() -> RPCRouter:
    router = RPCRouter()
    router.add_route(list_bunnies)
    return router
```

`rpc_common` handles parsing the input data into `InputDataclassType` and makes it available on `req.data`. The raw request is available on `req.raw`. `rpc_common` also instruments the request with a trace and an `X-Request-ID` header,

The [`../tools/codegen_rpc`](../tools/codegen_rpc) script uses the Router's metadata to generate TypeScript type bindings for each RPC.

The `RPCRouter` can be converted into a [Quart](https://github.com/pallets/quart) app with [`webserver/webserver.py`](./webserver/webserver.py) like so:

```python
def create_x_app() -> quart.Quart:
    router = create_x_router()
    app = foundation.webserver.webserver.create_webserver(router)
    return app
```

## External

The `external/` package centralizes all third-party integrations. The `EXT` global in [`external/external.py`](./external/external.py) lazily initializes each integration on first access. In tests, `EXT` allows substituting fakes. For example:

```python
completion = await foundation.external.external.EXT.openai.complete(...)
```

TODO: list of external services bundled in the template

Each external integration is implemented in the following pattern:

```python
## A facade over the third-party's SDK or HTTP requests.
class CService:
    def __init__(self, *, _fake_client: FakeServiceClient | None = None):
        self.client = _fake_client or service_sdk_client

    async def list_bunnies(self, ...) -> ...:
        ...
        return await self.client.x.y.list_bunnies(...)


## A fake that matches the API of the third-party's SDK API with stub behavior.
class FakeServiceClient:
    ...


## A test that uses the FakeServiceClient.
def test_functionality_that_depends_on_service():
    client = cast(FakeServiceClient, EXT.service.client)
    client.TEST_add_bunnies(...)
    bunnies = await EXT.service.list_bunnies(...)
```

A [`../conftest.py`](../conftest.py) fixture substitutes the fake clients before tests run.

## Feature Flags

TODO:

## Observability

We send logs, metrics, and traces to [Datadog](https://www.datadoghq.com/).

### Logging

[`observability/logs.py`](./observability/logs.py) configures a structured logger which can be fetched like so:

```python
logger = foundation.observability.logs.get_logger()
```

The structured logger emits JSON in production and a human-readable console output in development.

The logger defaults to the `DEBUG` level in tests and the `INFO` level in development and production. The `LOG_LEVEL` keyword parameter overrides this. `get_logger(debug=True)` sets a single module's logger to always log in debug level.

The logger integrates with error handling: `logger.exception()`, `logger.error(..., exc_info=True)`, and `logger.error(..., exc_info=exc)` call `report_error` during log processing.

The logger also integrates with tracing: tags on the active span are inherited in log fields.

### Error Handling

[`observability/errors.py`](./observability/errors.py) defines an error taxonomy starting with `BaseError`. All first-party errors defined in the codebase subclass from `BaseError` like so:

```python
class BunnyOverflowError(BaseError):
    pass
```

`BaseError` and its subclasses support arbitrary keyword arguments that are printed to console and/or reported to Sentry as extra data. By example:

```python
raise BunnyOverflowError("too many bunnies", last_bunny="Minji")
## Traceback (most recent call last):
##   BunnyOverflowError: too many bunnies
## 
##   Data:
##   - last_bunny: Minji
```

Error classes can specify expected fields by becoming a dataclass:

```python
@dataclasses.dataclass
class BunnyOverflowErrorTyped(BaseError):
    last_bunny: str
```

All RPC errors must be dataclasses, so that their fields are typed for TypeScript codegen.

#### Error Triage

Unhandled errors are reported to [Sentry](https://sentry.io/). Handled errors can be reported in two ways:

```python
foundation.errors.report_error(exc)  # Just report the error.
# Or...
logger.exception("log message", exc_info=exc)  # Report the error with a log line.
# Inside a except block, the `exc_info` can be omitted:
try:
    ...
except ...:
    logger.exception("log message")
```

Error classes can be marked transient like so:

```python
class BunnyExpectedlyHiccuppedError(BaseError):
    transient: ClassVar[bool] = False
```

Transient errors are never reported to Sentry, even when unhandled.

Non-transient errors can be suppressed like so:

```python
with suppress_error(BunnyFellOverError, environments=("production",)):  # Omit environments to suppress in every environment.
    ...
```

### Metrics

[`observability/metrics.py`](./observability/metrics.py) provides metric functions which forward to the statsd agent. The available metric functions are:

- Count Metric: `metric_increment`, `metric_increment_abnormal`, `metric_decrement`, `metric_decrement_abnormal`
- Gauge Metric: `metric_gauge`
- Timing Metric: `metric_timing`
- Distribution Metric: `metric_distribution`

Each metric accepts a `LiteralString` metric name and tags. Metric names should be static and tag keys should be of low cardinality to keep costs under control. The `_abnormal` variants of count metrics force the sample rate to 1 and so are always captured.

The `metric_count_and_time` context manager makes it easy to count and time a block of code:

```python
with count_and_time("name", **tags) as ct:
    ...
    ct.tag(name=value, **kwargs)  # Add tags to the count and time metrics during execution.
    ...
```

### Traces & Spans

[`observability/spans.py`](./observability/spans.py) provides functions for managing traces & spans. A root span begins a trace; child spans are nested within. Like metrics, each span has a name and tags. Like metrics, the cardinality should be minimized to keep costs under control. Begin a span like so:

```python
with span("span_name", **tags) as cspan:  # The resource and span_type params have special meanings in Datadog APM.
    ...
    cspan = current_span()  # Access the current span object. Useful in nested functions.
    tag_current_span(key=value, **kwargs)  # Add tags to the current span during execution.
```

When working with code that spans contextual boundaries (e.g. processes, threads, asynchronous tasks), preserve trace context like so:

```python
sdump = span_dump()  # This is serializable.
...
# In the new context, restore the span:
with span_restore("name_of_child_span", sdump):
    ...
```

Context passing is handled for you in the asynchronous task abstractions provided in [`stdlib/tasks.py`](./stdlib/tasks.py).

## Testing

The `testing/` package provides test fixtures. By convention, each project has a `conftest.py` (e.g. [`conftest.py`](./conftest.py) that provides a project-specific `t` pytest fixture, upon which every optional fixture and test utility is available as a typed property. In comparison to pytest fixtures, this pattern improves discoverability, typo resistance, and repeated type annotations. So:

```python
def test_something(t: FoundationFixture):  # or ProductFixture, PanopticonFixture, PipelineFixture.
    ...
```

[`testing/errors.py`](./testing/errors.py) contains assertions on errors that were reported to Sentry. By example:

```python
t.errors.assert_reported(CustomError)
t.errors.assert_not_reported(CustomError)
```

[`testing/factory.py`](./testing/factory.py) provides methods for generating database rows for test setup. By example:

```python
org = await t.factory.organization()  # or any other table in the database.
```

[`testing/rpc.py`](./testing/rpc.py) provides methods for testing RPC endpoints. By example:

```python
resp = await t.rpc.call(rpc_function, DataIn(...))
await t.rpc.assert_success(resp)  # or t.rpc.assert_failed(resp)
parsed_out_data = await t.rpc.parse_response(resp)  # or t.rpc.parse_error(resp, ExpectedRPCErrorType)
```

[`testing/snapshots.py`](./testing/snapshots.py) is a straight wrapper over [syrupy](https://github.com/syrupy-project/syrupy) for convenience.

```python
t.snapshot.assert_snapshot(value)
```

## Evals

TODO: currently at basic prototype system, will evolve
