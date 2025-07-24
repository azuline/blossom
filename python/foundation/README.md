# Foundation

The `foundation` package provides an integrated set of utilities and library facades for building robust programs. 

See [CLAUDE.md](./CLAUDE.md) for best practices and conventions.

# Environment

The [`env.py`](./env.py) file loads configuration parameters, first looking at environment variables, then the `.env.local` file, and then the `.env.example` file. It makes all the configuration parameters available through the `ENV` export, which can be used like so:

```python
if foundatione.env.ENV.environment == "production":
    send_slack_message(token=ENV.slack_token)
```

# Standard Library

The `stdlib` package contains pure functions related to standard types and standard library functions.

- [`bytes.py`](./bytes.py), [`markup.py`](./markup.py), and [`str.py`](./str.py) have simple yet convenient native type conversions.

foundation.stdlib.bytes:int_to_bytes
foundation.stdlib.funcs:memoize
foundation.stdlib.funcs:run_once
foundation.stdlib.identifiers:generate_email
foundation.stdlib.identifiers:generate_id
foundation.stdlib.identifiers:generate_name
foundation.stdlib.identifiers:generate_shortcode
foundation.stdlib.identifiers:generate_slug
foundation.stdlib.jsonenc:PostgresJSONDecoder
foundation.stdlib.jsonenc:PostgresJSONEncoder
foundation.stdlib.jsonenc:dump_json_pg
foundation.stdlib.jsonenc:load_json_pg
foundation.stdlib.jsonenc:PostgresJSONDecoder.decode # Override decode to handle bytes input.
foundation.stdlib.jsonenc:PostgresJSONEncoder.default
foundation.stdlib.markup:markdown_to_slack_markup
foundation.stdlib.parse:NotADataclassError
foundation.stdlib.parse:make_pydantic_validator
foundation.stdlib.parse:parse_dataclass
foundation.stdlib.parse:parse_dataclass_list
foundation.stdlib.retry:AsyncRetryer.execute
foundation.stdlib.retry:AsyncRetryer # Allows retrying asynchronous coroutines with exponential backoff and jitter.
foundation.stdlib.retry:MaxRetriesExceededError
foundation.stdlib.retry:AsyncRetryer.backoff_unit_sec
foundation.stdlib.retry:AsyncRetryer.max_retries
foundation.stdlib.retry:AsyncRetryer.metric_tags
foundation.stdlib.retry:AsyncRetryer.name
foundation.stdlib.str:snake_case_to_pascal_case
foundation.stdlib.struct:dataclass_to_jsonschema
foundation.stdlib.tasks:wait_for_unsupervised_tasks
foundation.stdlib.tasks:UnsupervisedTasksTimeoutError
foundation.stdlib.tasks:create_unsupervised_task
foundation.stdlib.time:Clock
foundation.stdlib.time:Clock.TESTING_freeze # A contextmanager that freezes the clock so it always returns the value of the `time` parameter from `now()`.
foundation.stdlib.time:Clock.TESTING_set # A context manager that sets the "current time" of the clock. The clock will continue ticking.
foundation.stdlib.time:Clock.now # Get the current time in UTC.
foundation.stdlib.time:Clock.time # Get the current time as a Unix timestamp.
foundation.stdlib.types:Unset
foundation.stdlib.types:cast_notnull


# Crypto

# Webserver

# Data

# External

# Testing

# Observability
