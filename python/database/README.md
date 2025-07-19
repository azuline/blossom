# database

The `database` package exposes abstractions for creating a Postgres connection
pool and spawning connections from it.

Two functions are exposed for creating connections, one for `admin` connections
and another for `customer` connections. The `admin` connection has unrestricted
access to all rows. The `customer` connection enforces Row Level Security (RLS)
based on the passed in User and Organization, which means that only rows with a
matching `user_id` or `organization_id` can be accessed, and should be used for all
queries originating from a customer request.

To learn more about the schema that enables Row Level Security, please read the
database migrations.

## Schema Conventions

This package also contains comprehensive tests against the database schema,
designed to detect database migrations that do not meet standards. Visit
`schema_test.py` to see the test definitions and queries.

These tests enforce that:

1. All tables define a primary key as `id bigint GENERATED ALWAYS AS IDENTITY
   PRIMARY KEY`.
2. All tables define an `external_id` column that is `NOT NULL UNIQUE`.
3. All `external_id` columns default to a unique prefix that's 3 lowercase
   letters.
4. All timestamp columns are timezone-aware.
5. All tables define `created_at` and `updated_at` columns that are `NOT NULL
   DEFAULT NOW()`.
6. All `updated_at` columns have an update trigger that updates `updated_at`.
7. All integer columns should be bigints.
8. All foreign keys columns should be indexed.
9. All tables have a row level security policy defined to restrict access.
10. All views are defined with `security_invoker = true`.
11. All foreign keys to users and organizations are either `ON DELETE CASCADE` or `ON
    DELETE SET NULL`.
