# Database Layer

The `database` package provides a comprehensive PostgreSQL abstraction layer with advanced features including Row Level Security (RLS), custom ID generation, and type-safe query generation using SQLc.

## Overview

This package exposes abstractions for:
- 🔒 **Multi-tenant data isolation** via Row Level Security
- 🆔 **Custom ID generation** with type-safe prefixes
- 📝 **Type-safe queries** generated from SQL via SQLc
- 🔄 **Schema migrations** using Yoyo
- 🏭 **Connection pooling** with admin/customer separation

## Architecture

```
database/
├── __init__.py           # Connection pool and transaction management
├── __codegen__/          # SQLc-generated code (do not edit)
│   ├── models.py        # Database models from schema
│   └── queries.py       # Type-safe query functions
├── migrations/           # Yoyo migration files
├── queries.sql          # SQLc query definitions
├── schema.sql           # Current schema (auto-generated)
├── schema_annotations.yaml  # Column documentation
└── schema_test.py       # Schema convention tests
```

## Connection Types

Two connection types are provided for different access levels:

### Admin Connection
```python
async with xact() as q:
    # Full unrestricted access to all rows
    result = await q.orm.get_all_users()
```

### Customer Connection
```python
async with xact(user=user, organization=org) as q:
    # Automatically filtered by RLS policies
    # Only sees data for the specified user/organization
    result = await q.orm.get_user_data()
```

The `customer` connection enforces Row Level Security (RLS) based on the passed User and Organization, automatically filtering all queries to only return rows with matching `user_id` or `organization_id`.

## Working with Queries

### Defining Queries

All queries are defined in `queries.sql` using SQLc annotations:

```sql
-- name: GetUserById :one
SELECT * FROM users WHERE id = $1;

-- name: ListOrganizationUsers :many
SELECT u.* FROM users u
JOIN user_organizations uo ON u.id = uo.user_id
WHERE uo.organization_id = $1
ORDER BY u.created_at DESC;

-- name: CreateUser :one
INSERT INTO users (name, email, organization_id)
VALUES ($1, $2, $3)
RETURNING *;
```

### Using Queries

After defining queries, generate the code:
```bash
just codegen-db
```

Then use the generated functions:
```python
from database import xact

async with xact() as q:
    user = await q.orm.get_user_by_id(user_id="usr_123")
    org_users = await q.orm.list_organization_users(organization_id="org_456")
```

### JSONB Handling

When writing to JSONB columns, use the serialization helper:
```python
from foundation.jsonenc import serialize_json_pg

async with xact() as q:
    await q.orm.update_user_metadata(
        user_id="usr_123",
        metadata=serialize_json_pg({"key": "value"})
    )
```

## Schema Management

### Creating Migrations

Never create migration files manually. Use the provided command:
```bash
just new-migration <migration-name>
```

This creates a properly formatted migration file in `database/migrations/`.

### Migration Best Practices

1. **Adding NOT NULL columns to existing tables**:
   ```sql
   -- Use two-step approach to avoid issues
   ALTER TABLE users ADD COLUMN status TEXT NOT NULL DEFAULT 'active';
   ALTER TABLE users ALTER COLUMN status DROP DEFAULT;
   ```

2. **Foreign Keys**:
   ```sql
   -- Always use CASCADE or SET NULL for user/org references
   ALTER TABLE documents 
   ADD COLUMN owner_id TEXT REFERENCES users(id) ON DELETE CASCADE;
   ```

3. **Indexes**:
   ```sql
   -- Always index foreign key columns
   CREATE INDEX idx_documents_owner_id ON documents(owner_id);
   ```

### Applying Migrations

```bash
just migrate
```

The current schema is automatically generated in `schema.sql` after migrations run. Never edit this file directly.

## Schema Conventions

Our schema follows strict conventions enforced by tests in `schema_test.py`:

### Table Structure
Every table must have:
```sql
CREATE TABLE example_table (
  id TEXT COLLATE "C" PRIMARY KEY DEFAULT generate_id('ext') CHECK (id LIKE 'ext_%'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  storytime  JSONB,
  
  -- Organization scoping (for multi-tenant tables)
  organization_id TEXT COLLATE "C" NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Your columns here...
);

-- Required trigger for updated_at
CREATE TRIGGER updated_at BEFORE UPDATE ON example_table
  FOR EACH ROW EXECUTE PROCEDURE updated_at();
```

### Conventions Enforced by Tests

1. **Primary Keys**: `id TEXT COLLATE "C" PRIMARY KEY DEFAULT generate_id('prefix')`
2. **ID Prefixes**: 2-3 lowercase letters unique to each table
3. **Timestamps**: Always use `TIMESTAMPTZ`, never `TIMESTAMP`
4. **Created/Updated**: Required `created_at` and `updated_at` columns
5. **Update Trigger**: Automatic `updated_at` trigger on all tables
6. **Integers**: Always use `BIGINT`, never `INT`
7. **Foreign Keys**: Must be indexed for performance
8. **RLS Policies**: All tables must have Row Level Security policies
9. **Views**: Must use `security_invoker = true`
10. **Cascade Behavior**: User/org FKs must use `CASCADE` or `SET NULL`
11. **External IDs**: Suffix with `_extid` for IDs from external systems

### Column Documentation

Column comments are stored in `schema_annotations.yaml`:

```yaml
users:
  status: "User account status: active, suspended, or deleted"
  metadata: "Arbitrary JSON data for user preferences and settings"
```

Read comments:
```bash
yq '.users.status' database/schema_annotations.yaml
```

## Row Level Security (RLS)

RLS automatically filters data based on the connection context:

### Policy Example
```sql
-- Users can only see their own data
CREATE POLICY users_isolation ON users
  FOR ALL
  TO customer
  USING (id = current_setting('app.user_id', true)::text);

-- Users can see data from their organization
CREATE POLICY org_data_isolation ON documents
  FOR ALL
  TO customer
  USING (organization_id = current_setting('app.organization_id', true)::text);
```

### How It Works
1. Customer connections set session variables for user/organization
2. RLS policies automatically filter all queries
3. No need for WHERE clauses in application code
4. Database-enforced security that can't be bypassed

## Testing

### Factory Pattern

Use the test factory for creating test data:
```python
from foundation.testing.fixture import TFix

async def test_user_creation(t: TFix):
    org = await t.factory.organization()
    user = await t.factory.user(organization_id=org.id)
    
    # Test with isolated organization
    assert user.organization_id == org.id
```

### Database Isolation

Each test runs in the same database but with isolated organizations:
```python
async def test_isolation(t: TFix):
    # Each test gets its own organization
    org = await t.factory.organization()
    
    # All data created should be scoped to this org
    # This prevents test interference
```

## Common Patterns

### Transactions
```python
# Simple transaction
async with xact() as q:
    await q.orm.create_user(...)

# With explicit rollback
async with xact() as q:
    try:
        await q.orm.create_user(...)
    except:
        await q.conn.rollback()
        raise
```

### Batch Operations
```python
async with xact() as q:
    # Use a single transaction for multiple operations
    user = await q.orm.create_user(...)
    await q.orm.create_user_settings(user_id=user.id, ...)
    await q.orm.log_user_activity(user_id=user.id, ...)
```

### Complex Queries

For queries that SQLc can't handle, define them in `queries.sql` with special syntax:
```sql
-- name: ComplexQuery :many
-- This is a complex query that SQLc might struggle with
SELECT /* your complex SQL here */;
```

## Troubleshooting

### Migration Conflicts
If you encounter migration conflicts:
1. Check which migrations were added: `just check-for-migration`
2. Never modify migrations from other branches
3. Rebase and resolve conflicts in migration order

### Schema Test Failures
Run schema tests to validate conventions:
```bash
just test database/schema/schema_test.py
```

### Connection Pool Exhaustion
- Check for unclosed transactions
- Ensure all `async with xact()` blocks complete
- Monitor with connection pool metrics

## Best Practices

1. **Always use SQLc** for queries when possible
2. **Scope data to organizations** for multi-tenancy
3. **Let RLS handle filtering** instead of WHERE clauses
4. **Use transactions** for related operations
5. **Test with factories** for consistent test data
6. **Document columns** in schema_annotations.yaml
7. **Follow conventions** to pass schema tests
8. **Version migrations** properly with Yoyo

## Related Documentation

- See `/foundation/testing/` for test factory documentation
- See `/product/` for RPC endpoint usage examples
- See `CLAUDE.md` for general coding guidelines
