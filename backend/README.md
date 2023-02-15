# Backend

The backend is written in Python for the sole reason that I am most experienced
and efficient in it. I have worries about Python at scale.

# Doing Things

See the `Makefile` for a list of common dev commands.

# Directories

- `cli/` contains the backend entrypoint CLI. This CLI contains everything from
  developer commands to production operations.
- `codegen/` contains the outputs of codegen systems.
- `foundation/` contains the developer platform.
- `migrations/` contains Postgres database migrations.
- `product/` contains the product-specific code.

# Stack

- Language: Python + mypy
- Builds: Nix
- Package Manager: Nix
- Database: Postgres
- ORM: sqlc (w/ psycopg engine)
- Web Framework: Quart
- Migrations: yoyo-migrations
- Background Jobs: Procrastinate [TODO]
- Logging/Tracing: OpenTelemetry [TODO]
- Data Validation: pydantic
- Linters/Formatters: black + Ruff + Semgrep
- Test Runner: pytest
