# Blossom Python Backend

A modern, multi-tenant SaaS backend built with Python, featuring robust authentication, organization management, and a custom RPC framework with TypeScript code generation.

## Overview

This codebase implements a production-ready backend system with:
- 🔐 Multi-tenant architecture with Row Level Security (RLS)
- 🚀 Async-first design using asyncio and Quart
- 📦 Type-safe RPC framework with automatic TypeScript generation
- 🗄️ PostgreSQL with advanced features (custom ID generation, JSONB, migrations)
- 🧪 Comprehensive testing infrastructure with database isolation
- 🛠️ Developer-friendly tooling and code generation

## Architecture

```
python/
├── database/        # Database layer with migrations and query generation
├── foundation/      # Core utilities and shared infrastructure
├── product/         # Main customer-facing web application
├── panopticon/      # Admin/monitoring application
├── pipeline/        # Dagster-based data processing
└── tools/           # Developer tooling and code generation
```

### Key Components

#### Foundation Layer
The `foundation/` directory provides core abstractions used throughout the codebase:
- **External Services**: Centralized clients for OpenAI, Slack, Google Sheets, etc.
- **RPC Framework**: Type-safe RPC implementation with middleware
- **Testing Utilities**: Fixtures, factories, and test helpers
- **Common Utilities**: Logging, errors, cryptography, time management

#### Database Layer
PostgreSQL-based persistence with advanced features:
- **Row Level Security**: Automatic data isolation by user/organization
- **Custom ID Generation**: Type-safe prefixed IDs (e.g., `usr_abc123`)
- **SQLc Integration**: Type-safe query generation from SQL
- **Yoyo Migrations**: Version-controlled schema management

#### Applications
- **Product**: Customer-facing API with authentication and organization management
- **Panopticon**: Administrative interface (minimal implementation)

## Getting Started

### Prerequisites
- Python 3.13+
- PostgreSQL (via Docker Compose)
- Just command runner

### Setup
```bash
# Install dependencies
poetry install

# Start PostgreSQL
docker compose up -d

# Run migrations
just migrate

# Run tests
just test

# Start development server
just dev
```

### Common Commands
```bash
just lint           # Run linters (ruff, pyright)
just test          # Run test suite
just migrate       # Apply database migrations
just new-migration # Create new migration
just codegen-db    # Generate database query code
just codegen-rpc   # Generate TypeScript bindings
just list-symbols  # List all public symbols
```

## Development Workflow

### Writing Code
1. Follow conventions in `CLAUDE.md`
2. Use type hints everywhere
3. Write tests alongside implementation
4. Use the foundation abstractions

### Database Changes
1. Create migration: `just new-migration <name>`
2. Edit the generated SQL file
3. Apply: `just migrate`
4. Update queries in `database/queries.sql`
5. Regenerate: `just codegen-db`

### Adding RPC Endpoints
1. Define endpoint in relevant module using `@route` decorator
2. Run `just codegen-rpc` to generate TypeScript types
3. Frontend can now use the typed endpoint

### Testing
- Tests live next to code (`module_test.py`)
- Use `TFix` fixture for test utilities
- Database isolation per test
- LLM responses are cached for determinism

## Project Structure Details

### `/database`
Database abstraction layer with connection pooling, migrations, and query generation. See [database/README.md](database/README.md) for details.

### `/foundation`
Core utilities and infrastructure shared across all applications. Key modules:
- `external/`: Third-party service integrations
- `rpc/`: RPC framework implementation
- `testing/`: Test fixtures and utilities
- `parse.py`: Type-safe parsing utilities

### `/product`
Main web application implementing user authentication and organization management. See [product/README.md](product/README.md) for API documentation.

### `/tools`
Developer tooling:
- `codegen-db/`: Generates Python code from SQL queries
- `codegen-rpc/`: Generates TypeScript from Python RPC definitions
- `list-symbols/`: Lists all public symbols for discovery

## Security

- Session-based authentication with HTTP-only cookies
- PBKDF2 password hashing
- Row Level Security at database level
- Timing attack protection in authentication
- Automatic user/organization context isolation

## Contributing

1. Read `CLAUDE.md` for coding guidelines
2. Write tests for all new functionality
3. Run `just lint` and `just test` before committing
4. Use conventional commit messages
5. Create focused, single-purpose commits

## Architecture Decisions

### Why Custom RPC Framework?
- Type safety from backend to frontend
- Automatic TypeScript generation
- Consistent error handling
- Built-in authentication/authorization

### Why SQLc?
- Type-safe database queries
- No ORM overhead
- SQL-first approach
- Compile-time query validation

### Why Row Level Security?
- Database-enforced data isolation
- Protection against programming errors
- Simplified application code
- Multi-tenant security by default

## License

[Your license here]
