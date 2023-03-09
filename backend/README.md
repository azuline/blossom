# Backend

# Developer Commands

See the `Makefile` for a list of common dev commands.

Run `blossom` to see the available developer CLI commands.

# Directories

- `cli/` contains the backend CLI definition for service operations and
  developer tooling. This wraps logic from `foundation/` and `product/`.
- `codegen/` contains the outputs of codegen systems.
- `foundation/` contains the developer platform.
- `migrations/` contains Postgres database migrations.
- `product/` contains the product-specific code.

# Stack

- Language: Python+mypy
- Builds: Nix
- Package Manager: Nix
- Database: Postgres
- ORM: sqlc (w/ psycopg engine)
- Web Framework: Quart
- Migrations: yoyo-migrations
- Background Jobs: Procrastinate (TODO)
- Logging/Tracing: OpenTelemetry (TODO)
- Data Validation: pydantic
- Linters/Formatters: black+Ruff+Semgrep
- Test Runner: pytest
