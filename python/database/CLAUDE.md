> [!NOTE]
> All paths assume `cwd == python/`.

# Schema sources

- **`database/schema.sql`:** definitive schema snapshot. *Read, never edit.*
- **`database/schema_annotations.yaml`:** — table / column comments. Query a comment:

  ```bash
  yq '.{table}.{column}' database/schema_annotations.yaml
  ```

Add a comment whenever a column’s purpose is not obvious.

# Migrations

```bash
just new-migration <name>          # scaffold
just test database/schema_test.py  # test
just migrate                       # apply
```

- Never create a migration file by hand, always use `just new-migrate`.
- Never modify the `-- depends:` header in migration files.
- Never change a migration from another branch.
- We do **not** support down‑migrations.

Create at most one migration per branch. Find migrations created in the current branch with `just check-for-migration`.

## Table conventions

Create tables using the following template:

```sql
CREATE TABLE new_table (
  id TEXT COLLATE "C" PRIMARY KEY DEFAULT generate_id('ntn') CHECK (id LIKE 'ntn_%'), -- ntn = 2–3 lowercase letter prefix
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  storytime JSONB,
  organization_id TEXT COLLATE "C" NOT NULL REFERENCES organizations(id) -- Scope data to organizations.
);
CREATE TRIGGER updated_at BEFORE UPDATE ON new_table FOR EACH ROW EXECUTE PROCEDURE updated_at();
```

Enable Row Level Security for all tables. First decide whether a table "belongs" to an organization or a user, and then:

```sql
ALTER TABLE new_table ENABLE ROW LEVEL SECURITY;
CREATE POLICY new_table_self_all ON new_table USING (organization_id = current_organization_id());
-- Or, if the table is "user-scoped":
CREATE POLICY new_table_self_all ON new_table USING (user_id = current_user_id());
```

Express enums as enum tables:

```sql
CREATE TABLE new_enum (value TEXT PRIMARY KEY);
INSERT INTO new_enum (value) VALUES ('value1'), ('value2');
-- Usage: new_column TEXT REFERENCES new_enum(value)
```

Follow these column conventions:

- Use `BIGINT` instead of `INT`.
- Use `TIMESTAMPTZ` instead of `TIMESTAMP`.
- All ID columns must be `COLLATE "C"`.
- All foreign keys must have an index.
- Third-party IDs end with `_extid`; `_id` is reserved for first-party foreign key IDs.

Validate these rules with:

```bash
just test database/schema_test.py
```

## Safe NOT NULL column addition

```sql
ALTER TABLE tbl ADD COLUMN col TEXT NOT NULL DEFAULT '';
ALTER TABLE tbl ALTER COLUMN col DROP DEFAULT;
```

# ORM & queries (SQLC)

Write SQL queries in `database/queries.sql`, then regenerate the ORM:

```bash
just codegen-db
```

Access the queries with:

```python
async with xact() as q:
    await q.orm.query_name(**kwargs)
```

Follow these conventions:

- Avoid `q.conn` and raw SQL except in SQLc edge cases.
- Prefix test‑only query names with `Test`.
- Serialize JSONB with `foundation.jsonenc:serialize_json_pg`.
- Never set `created_at` or `updated_at` in code; DB triggers handle them.
- Name queries as `{Resource}{Action}{Filter}`. For example, `BunniesListAll`, `BunniesGetByID`, `BunniesGetByName`, etc.
