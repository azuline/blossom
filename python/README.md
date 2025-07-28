# Python

The projects in this directory are:

- [`foundation` (Foundation Libraries)](./foundation)
- [`database` (Database Management)](./database)
- [`product` (Customer-Facing Web Backend)](./product)
- [`panopticon` (Internal-Facing Web Backend)](./panopticon)
- [`publicapi` (Developer-Facing Public API)](./publicapi)
- [`pipeline` (Data Pipeline)](./pipeline)

Refer to each project for its feature list.

## Developer Loop

Run `docker compose up -d` to start the local database. Refer to the [`justfile`](./justfile) for the remaining commands for entering the developer loop. A typical loop goes something like:

```bash
$ docker compose up -d  # Start local database.
$ just install          # Install python dependencies.
$ just migrate          # Migrate local database.
$ just dev              # Run all development servers.
```

Environment variables default to the values in `.env.example`, which is checked into git. Add your overrides to `.env.local`.

Refer to [`foundation`](./foundation) and [CLAUDE.md](./CLAUDE.md) for best practices and patterns.

## Vendors

- Database: [PostgreSQL](https://www.postgresql.org/)
- Email Sending: [Postmark](https://postmarkapp.com/)
- Error Triage: [Sentry](https://sentry.io/)
- Feature Flags: [PostHog](https://posthog.com/)
- Large Language Model: [OpenAI](https://openai.com/)
- Observability: [Datadog](https://www.datadoghq.com/)

See [`.env.example`](./env.example) for instructions on provisioning API keys.

## Major Dependencies

- Background Jobs: [dramatiq](https://github.com/Bogdanp/dramatiq)
- Data Pipelines: [dagster](https://dagster.io/)
- Data Validation: [pydantic](https://github.com/pydantic/pydantic)
- Linter/Formatter: [ruff](https://github.com/astral-sh/ruff) + [semgrep](https://github.com/semgrep/semgrep) + [tach](https://github.com/gauge-sh/tach)
- Logs: [structlog](https://github.com/hynek/structlog)
- Metrics: [datadog](https://github.com/DataDog/datadogpy)
- Migrations: [yoyo-migrations](https://sr.ht/~olly/yoyo/)
- ORM: [sqlc](https://github.com/sqlc-dev/sqlc) + [sqlalchemy](https://www.sqlalchemy.org/) + [psycopg](https://github.com/psycopg/psycopg)
- Package Manager: [uv](https://github.com/astral-sh/uv)
- Test Runner: [pytest](https://github.com/pytest-dev/pytest)
- Traces: [ddtrace](https://github.com/DataDog/dd-trace-py)
- Type Checker: [pyright](https://github.com/microsoft/pyright)
- Web Framework: [quart](https://github.com/pallets/quart) + [hypercorn](https://github.com/pgjones/hypercorn)
