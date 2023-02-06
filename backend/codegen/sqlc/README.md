# codegen/sqlc

We use `sqlc` as our ORM. `sqlc`'s documentation can be found [here](https://docs.sqlc.dev/en/latest/tutorials/getting-started-postgresql.html).

Sqlc works by reading in SQL migrations and SQL queries, and then using them to
codegen typed Python bindings. This package contains sqlc's codegenned outputs.
