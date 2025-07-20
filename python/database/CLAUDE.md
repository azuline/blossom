# Database

> [!NOTE]
> All paths in this file are written assuming that the cwd is `python/`.

Prerequisite: The local database should be running after `docker compose up -d`.

Refer to `database/schema.sql` for the database schema. ALWAYS use this file to understand the
database schema. NEVER try to splice together migrations in your memory--it is complicated and
unnecessary.

NEVER MODIFY `database/schema.sql` DIRECTLY. IT IS GENERATED WHEN MIGRATIONS ARE RAN. SIMILARLY,
NEVER MODIFY THE `-- depends:` COMMENT IN MIGRATION FILES.

Refer to `database/schema_annotations.yaml` for column comments. We do not use database column
comments because they are hard to modify. Instead, `database/schema_annotations.yaml` has a mapping
of `table -> column -> comments`. Read column comments with the following command:
`yq '.{table}.{column}' database/schema_annotations.yaml`. This will print null if the column does
not exist or has no comment. When adding a column with nuance not evident by the table and column
name, please describe it in this file.

## Migrations

Database migrations are stored in `database/migrations/`. Create a new migration with `just
new-migration <migration-name>` and edit the SQL file that the command creates. Then migrate the
database with `just migrate`. NEVER create a migration by hand. You will make a mistake.

NEVER modify a migration file that was created in a different branch from the working branch. That
will cause the production deployment to fail.

We do not support down migrations. Never rollback the database.

If you need to reset the database completely during development (e.g., when squashing migrations or
resolving complex migration conflicts), use: `docker compose down -v && docker compose up -d`. This
will remove all database volumes and recreate a fresh database.

Work on a single migration file per branch. Use the command `just check-for-migration` to discover
the migrations that have been created in this branch.

### Safe NOT NULL Column Addition

When adding a NOT NULL column to an existing table, use a two-step approach to avoid issues with
existing rows. First set the column `NOT NULL` with a default and then drop the default.

```sql
ALTER TABLE table_name ADD COLUMN column_name TEXT NOT NULL DEFAULT '';
ALTER TABLE table_name ALTER COLUMN column_name DROP DEFAULT;
```

## Conventions

Database tables should all have the following structure:

```sql
CREATE TABLE new_table_name (
  id TEXT COLLATE "C" PRIMARY KEY DEFAULT generate_id('ntn') CHECK (id LIKE 'ntn_%'),  -- Pick a unique 2-3 letter abbreviation of the table name.
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  storytime  JSONB,

  organization_id TEXT COLLATE "C" NOT NULL REFERENCES organizations(id) ON DELETE CASCADE -- Most entities are scoped to an organization.
);
CREATE TRIGGER updated_at BEFORE UPDATE ON new_table_name
  FOR EACH ROW EXECUTE PROCEDURE updated_at();

```

Other conventions are:

- Always use BIGINT over INT to avoid integer overflow.
- Always suffix external IDs (as in IDs from external services and not a Postgres foreign key) with `_extid`. `_id` is reserved for internal IDs.

Run `just test databases/schema/schema_test.py` to validate other conventions in our database schema.

## ORM & Queries

Write SQL queries against the database in `database/queries.sql`. We use SQLc to codegen
`database/__codegen__/queries.py` from that file. After modifying `queries.sql`, run the codegen
with `just codegen-db`.

The written queries can be accessed in code with the following pattern:

```python
async with xact() as q:
    await q.orm.query_name_in_snake_case(**kwargs)
```

All queries should be written this way. With the exception of special cases where SQLc does not work
at all, do NOT use the`q.conn` object to query the database directly with raw SQL. Instead, all
queries should be written using the SQLc paradigm. For queries used only in tests, prefix the query
name with the word `Test`.

When writing to a JSONB column, serialize the dataclass or dictionary with the
`foundation.jsonenc:serialize_json_pg` function.

Never directly set the `created_at` or `updated_at` columns. These are automatically set with column
defaults and database triggers.
