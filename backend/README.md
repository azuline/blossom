# Backend

The backend is written in Python with the sole rationale that Python is my most
efficient and comfortable language. I don't recommend Python in production.

# Doing Things

See the `Makefile` for a list of common dev tool commands.

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
