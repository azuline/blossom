# Product API

The main customer-facing web application built with Quart (async Flask), implementing authentication, organization management, and RPC endpoints.

## Overview

The product application provides:
- 🔐 **Session-based authentication** with secure cookie management
- 🏢 **Multi-organization support** with seamless switching
- 🚀 **Type-safe RPC framework** with TypeScript code generation
- 🛡️ **Row Level Security** integration for data isolation
- ⚡ **Async-first design** using Quart and asyncio

## Architecture

```
product/
├── __init__.py          # Package initialization
├── __main__.py          # CLI entry point
├── app.py               # Application factory and RPC routing
├── framework/           # RPC framework customization
│   └── rpc.py          # Product-specific RPC wrapper
├── authn/               # Authentication module
│   ├── __init__.py
│   ├── login.py        # Login/logout endpoints
│   └── login_test.py   # Authentication tests
├── users/               # User management
│   ├── __init__.py
│   └── users.py        # User-related operations
├── organizations/       # Organization management
│   ├── __init__.py
│   └── organizations.py # Org-related operations
└── conftest.py          # Test fixtures and utilities
```

## RPC Framework

### Authorization Levels

The product uses a custom RPC decorator that wraps the foundation RPC framework:

```python
from product.framework.rpc import rpc_product

@rpc_product(authorization="public")
async def public_endpoint(req: Req[InputType]) -> OutputType:
    # Anyone can access this endpoint
    pass

@rpc_product(authorization="user")
async def user_endpoint(req: Req[InputType]) -> OutputType:
    # Requires authenticated user
    # req.user is guaranteed to be non-None
    pass

@rpc_product(authorization="organization")
async def org_endpoint(req: Req[InputType]) -> OutputType:
    # Requires authenticated user with organization
    # req.user and req.organization are guaranteed to be non-None
    pass
```

### Request Context

All RPC handlers receive a `Req[T]` object with:
- `req.body`: The parsed request body of type T
- `req.user`: Current authenticated user (if any)
- `req.organization`: Current organization (if any)
- `req.cq`: Database query context with RLS applied

## Available Endpoints

### Authentication

#### `POST /login`
Authenticates a user and creates a session.

**Input:**
```python
@dataclass
class LoginIn:
    email: str
    password: str
    remember_me: bool = False
    organization_id: str | None = None  # Optional org selection
```

**Output:**
```python
@dataclass
class LoginOut:
    user: UserOut
    organization: OrganizationOut | None
    organizations: list[OrganizationOut]  # Available orgs
```

**Errors:**
- `InvalidCredentialsError`: Wrong email/password
- `NoOrganizationsError`: User has no organization access

#### `POST /logout`
Expires the current session.

**Input:** None

**Output:**
```python
@dataclass
class LogoutOut:
    success: Literal[True]
```

### Initialization

#### `GET /init`
Returns current session information for page initialization.

**Input:** None

**Output:**
```python
@dataclass
class InitOut:
    user: UserOut | None
    organization: OrganizationOut | None
    organizations: list[OrganizationOut]  # If authenticated
```

## Authentication System

### Sessions

Sessions are stored in the database with:
- Secure random tokens
- Configurable expiration (default: 30 days)
- HTTP-only, secure cookies
- Organization association

### Password Security

- PBKDF2 hashing with SHA256
- 600,000 iterations (following OWASP guidelines)
- Timing attack protection in login
- Secure password generation for new users

### Cookie Management

```python
# Session cookie configuration
cookie_config = {
    "key": "session",
    "httponly": True,
    "secure": True,  # HTTPS only in production
    "samesite": "lax",
    "max_age": 30 * 24 * 60 * 60  # 30 days
}
```

## Organization Management

### Multi-Organization Support

Users can belong to multiple organizations:
- One active organization per session
- Organization switching via new login
- RLS automatically filters data by organization

### User-Organization Association

```python
# User can have multiple organizations
user_organizations = await q.orm.get_user_organizations(user_id=user.id)

# Session is tied to one organization
session = await q.orm.create_session(
    user_id=user.id,
    organization_id=selected_org.id
)
```

## Testing

### Test Client

Use the custom test client for RPC testing:

```python
from product.conftest import TestRPCProduct

async def test_login(t: TFix):
    client = TestRPCProduct(t)
    
    # Create test user
    org = await t.factory.organization()
    user = await t.factory.user(
        organization_id=org.id,
        password="test123"
    )
    
    # Test login
    response = await client.rpc(
        "login",
        email=user.email,
        password="test123"
    )
    
    assert response.user.id == user.id
    assert response.organization.id == org.id
```

### Authentication Helper

```python
# Login as a specific user in tests
await client.login_as(user, organization=org)

# Now authenticated requests work
response = await client.rpc("some_protected_endpoint")
```

## Security Best Practices

1. **Never store passwords in plain text**
   - Always use the password hashing utilities
   - Generate secure random passwords when needed

2. **Use appropriate authorization levels**
   - `public`: Only for truly public endpoints
   - `user`: For user-specific data
   - `organization`: For org-scoped operations

3. **Let RLS handle data filtering**
   - Don't manually filter by organization in queries
   - The database connection handles it automatically

4. **Session security**
   - Sessions expire after inactivity
   - Tokens are cryptographically secure
   - Cookies are HTTP-only and secure

## Common Patterns

### Creating New Endpoints

1. Define input/output dataclasses:
```python
@dataclass
class CreateWidgetIn:
    name: str
    description: str | None = None

@dataclass
class CreateWidgetOut:
    widget: WidgetOut
```

2. Implement the handler:
```python
@rpc_product(authorization="organization")
async def create_widget(req: Req[CreateWidgetIn]) -> CreateWidgetOut:
    # Organization is guaranteed by authorization level
    widget = await req.cq.orm.create_widget(
        name=req.body.name,
        description=req.body.description,
        organization_id=req.organization.id  # Automatic scoping
    )
    return CreateWidgetOut(widget=to_widget_out(widget))
```

3. Generate TypeScript types:
```bash
just codegen-rpc
```

### Error Handling

Define custom errors as dataclasses:
```python
@dataclass
class WidgetNotFoundError(APIError):
    widget_id: str
    
@rpc_product(
    authorization="organization",
    errors=[WidgetNotFoundError]
)
async def get_widget(req: Req[GetWidgetIn]) -> GetWidgetOut:
    widget = await req.cq.orm.get_widget_by_id(req.body.widget_id)
    if not widget:
        raise WidgetNotFoundError(widget_id=req.body.widget_id)
    return GetWidgetOut(widget=to_widget_out(widget))
```

## Development Workflow

### Adding New Features

1. **Create the database schema**:
   ```bash
   just new-migration add-widgets-table
   # Edit the migration file
   just migrate
   ```

2. **Define queries** in `database/queries.sql`:
   ```sql
   -- name: CreateWidget :one
   INSERT INTO widgets (name, description, organization_id)
   VALUES ($1, $2, $3)
   RETURNING *;
   ```

3. **Generate query code**:
   ```bash
   just codegen-db
   ```

4. **Implement RPC endpoints** in appropriate module

5. **Generate TypeScript types**:
   ```bash
   just codegen-rpc
   ```

6. **Write tests** alongside implementation

### Running the Application

```bash
# Development mode with auto-reload
just dev

# Production mode
python -m product serve

# Run tests
just test product/
```

## Configuration

The application reads configuration from environment variables:

- `PRODUCT_HOST`: Server host (default: localhost)
- `PRODUCT_PORT`: Server port (default: 8000)
- `COOKIE_DOMAIN`: Domain for session cookies
- `COOKIE_SECURE`: Whether to use secure cookies

See `foundation/env.py` for all configuration options.

## Integration with Frontend

The generated TypeScript client provides type-safe RPC calls:

```typescript
import { rpc } from '@/lib/rpc'

// Login
const { user, organization } = await rpc.login({
  email: 'user@example.com',
  password: 'password123',
  remember_me: true
})

// Make authenticated requests
const widgets = await rpc.list_widgets({
  page: 1,
  limit: 20
})
```

## Monitoring and Observability

- Structured logging via `foundation.logs`
- Request tracing with correlation IDs
- Error tracking with full context
- Performance metrics for RPC calls

## Related Documentation

- See `/foundation/rpc/` for RPC framework details
- See `/database/` for database and query documentation
- See `/tools/codegen-rpc/` for TypeScript generation
- See `CLAUDE.md` for coding guidelines