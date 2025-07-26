# Database

The `database` package contains database management abstractions and developer tooling.

See [CLAUDE.md](./CLAUDE.md) for best practices, conventions, and patterns.

# Postgres (OLTP)

## Migrations & Schema

The database schema is defined as a tree of migrations in [`./migrations`](./migrations). We use [yoyo-migrations](https://sr.ht/~olly/yoyo/) to apply the migrations. Run `just migrate` to apply the migrations and `just new-migration` to generate a new empty migration file.

`just codegen-db` uses [pgmigrate](https://github.com/peterldowns/pgmigrate) to generate the [`schema.sql`](./schema.sql) file, which contains the up-to-date materialized/squashed schema.

We annotate the schema in [`schema_annotations.yaml`](./schema_annotations.yaml). We provide Claude with both schema files to optimize its understanding of the data model.

### Schema Conventions

All tables are expected to follow the following conventions:

```sql
CREATE TABLE new_table (
   id TEXT COLLATE "C" PRIMARY KEY DEFAULT generate_id('ntn') CHECK (id LIKE 'ntn_%'),  -- Collate C text primary keys generated from the `generate_id` function.
   created_at TIMESTAMPTZ NOT NULL DEFAULT now(),  -- Use timestamptz, not timestamp. Always have created_at, updated_at, and storytime.
   updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
   storytime JSONB,
   organization_id TEXT COLLATE "C" NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,  -- Scope data to organizations.
   datasource_extid TEXT COLLATE "C"  -- Third party IDs that are not foreign key should be named `*_extid` instead of `_id`.
   count BIGINT -- All integers should be BIGINT and not INT to avoid overflows.
);
CREATE TRIGGER updated_at BEFORE UPDATE ON new_table FOR EACH ROW EXECUTE PROCEDURE updated_at();  -- Update updated_at via trigger.
CREATE INDEX ON new_table(organization_id);  -- All foreign keys must have an index.
```

The schema conventions are automatically tested in [`schema_test.py`](./schema_test.py).

### Enums

Database enums are defined as enum tables (suffixed `_enum`) like so:

```sql
CREATE TABLE x_enum (value TEXT PRIMARY KEY);
INSERT INTO x_enum (value) VALUES ('a', 'b');

CREATE TABLE new_table (
    ...
    x TEXT NOT NULL REFERENCES x_enum(value);
    ...
);
```

TODO: non-db enums + rpc integration

## Accessing the Database

We connect to Postgres using a [SQLAlchemy connection pool](./conn.py) and the [psycopg](https://github.com/psycopg/psycopg) driver. A default global pool is created on first connection. A raw connection to the database can be opened like so:

```python
async with database.conn.connect_db_admin() as conn:
    cursor = conn.execute(text("SELECT * FROM organizations"))
```

We have a Row Level Security setup that allows scoping a connection only to the data owned by a user and organization combination. A connection restricted by Row Level Security can be opened like so:

```python
async with database.conn.connect_db_customer(user_id, organization_id) as conn:
    cursor = conn.execute(text("SELECT * FROM organizations"))  # Only returns the active organization.
```

As working with raw database connections is unwieldy, we have the `xact` context manager which begins and commits a transaction with the context manager's enter and exit.

```python
async with database.xact.xact_admin() as q:  # or `xact_customer`
    cursor = await q.orm.organizations_list()   # Raw connection is available on `q.conn`, but use is discouraged.
```

`xact` exposes our [sqlc](https://sqlc.dev/) ORM on `q.orm`. The ORM is generated from the [`queries.sql`](./queries.sql) file with the `just codegen-db` command. The ORM contains one type-safe Python function for each query in [`queries.sql`](./queries.sql). `sqlc` connects to the local Postgres instance to validate each query. We spin up and migrate an ephemeral database for each invocation of `just codegen-db` using [`testdb.py`](./testdb.py).

All static queries are managed by `sqlc`. Dynamic queries can be built using [SQLAlchemy core](https://docs.sqlalchemy.org/en/20/core/).

### JSON Serialization

We preserve semantic type information when [serializing to JSON](./jsonenc.py) by:

- Serializing `datetime.datetime` to `{ "__sentinel": "timestamp", "value": "<isoformat>" }`.
- Serializing `datetime.date` to `{ "__sentinel": "date", "value": "<isoformat>" }`.

## Test DB

[`testdb.py`](./testdb.py) efficiently creates a new database for tests and codegen. This allows migrations to be tested without affecting the local database. This also allows working on multiple migrations simultaneously (e.g. with Claude).

We spin up a new Test DB for each test session and share it between every test run in the session. As all test data is scoped under an organization per test, tests should not see each others data.

## Locking

[Advisory locks](https://www.postgresql.org/docs/current/explicit-locking.html#ADVISORY-LOCKS) can be taken out with the `pg_advisory_lock` context manager, like so:

```python
async with database.lock.pg_advisory_lock("lock_name"):
    ...
```
