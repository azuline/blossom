# Database

The `database` package contains database management abstractions and developer tooling.

## Postgres (OLTP)

We connect to Postgres using a [SQLAlchemy connection pool](./conn.py).

- Row Level Security
- Advisory Locks
- Transaction by default
- SQLC Orm + codegen
- Schema contexts
- Schema conventions & tests
- Yoyo migrations
- Enums
- Test database
