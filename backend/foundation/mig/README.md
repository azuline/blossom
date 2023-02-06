# mig

The `mig` package runs database migrations. It is a light facade around
`yoyo-migrations`, nothing special.

This package also contains comprehensive tests against the database schema,
designed to detect database migrations that do not meet standards. Read
`schema_test.py` to see the schema standards.
