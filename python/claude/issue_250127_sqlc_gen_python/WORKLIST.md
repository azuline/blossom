# SQLC Python Code Generation Tool - Work List

## Milestone 1: Core Infrastructure
- [x] Set up protobuf parsing infrastructure
  - Install/import required protobuf libraries
  - Create protobuf message classes from `codegen.proto`
  - Implement `deserialize_request()` function to read from stdin
  - Implement `serialize_response()` function to write to stdout
  - Write unit test for protobuf round-trip serialization

## Milestone 2: Type Mapping System  
- [x] Create PostgreSQL to Python type mapping
  - Define `POSTGRES_TO_PYTHON_TYPES` mapping constant in `__main__.py`
  - Handle nullable types with `T | None` union syntax
  - Handle array types with appropriate Python collections
  - Support special types like `jsonb` → `Any | None`
  - Write unit tests for type conversion logic

## Milestone 3: Model Generation
- [x] Implement database model dataclass generation
  - Parse `Catalog.schemas[].tables[]` from protobuf input
  - Generate `@dataclasses.dataclass(slots=True)` definitions
  - Handle column types, nullability with `T | None`, and comments
  - Generate proper imports (`datetime`, `typing`, etc.)
  - Generate file header with SQLc version info
  - Write unit test with sample table schema

## Milestone 4: Query Function Generation  
- [x] Implement standalone query function generation
  - Parse `queries[]` from protobuf input
  - Extract query name, SQL text, parameters, and return columns
  - Generate async function signatures with `DBConn` parameter
  - Handle different query types (`:one`, `:many`, `:exec`)
  - Generate parameter mapping from `:pN` placeholders to kwargs
  - Generate return type construction from result rows
  - Write unit test with sample query definitions

## Milestone 5: Code Assembly and Output
- [x] Combine generated components into final output files
  - Assemble models.py with all dataclass definitions
  - Assemble queries.py with SQL constants and functions
  - Generate proper import statements and file headers
  - Create `GenerateResponse` with generated file contents
  - Write integration test with complete protobuf input/output

## Milestone 6: CLI Integration and Testing
- [x] Complete CLI tool and comprehensive testing
  - Implement `main()` function as Click CLI entry point  
  - Add error handling and validation
  - Write end-to-end test using actual database schema
  - Test integration with existing `just codegen-db` workflow
  - Validate generated code matches current output format

## ✅ BONUS: Jinja Template Refactoring
- [x] Refactor code generation to use Jinja2 templates
  - Replace string concatenation with clean template-based approach
  - Create `MODELS_TEMPLATE` and `QUERIES_TEMPLATE` constants
  - Implement template data preparation functions
  - Maintain exact same output format for backward compatibility
  - All tests pass with deterministic string comparisons

## ✅ BONUS: Schema Filtering and Name De-pluralization
- [x] Filter out non-public schema tables from code generation
  - Only include tables from "public" schema in generated models
  - Skip all tables from other schemas (internal, etc.)
- [x] De-pluralize table names for model class names
  - Implement `_depluralize_table_name()` with common English patterns
  - Handle: companies→Company, users→User, boxes→Box, etc.
  - Apply de-pluralization to both model generation and query inference
- [x] Update tests to reflect schema filtering and de-pluralization
  - Updated existing tests to expect singular model names
  - Added comprehensive test for both filtering and de-pluralization features

## ✅ Milestone 7: Error Handling Enhancement
- [x] Replace None returns with NotFoundError for :one queries
  - Import `NotFoundError` from `foundation.observability.errors`
  - Update `:one` query template to raise `NotFoundError` instead of returning `None`
  - Update return type annotations to remove `| None` for `:one` queries
  - Update tests to expect `NotFoundError` when no row is found

## ✅ Milestone 8: Enum Type Generation
- [x] Generate enum types from _enum suffixed tables
  - Detect tables with `_enum` suffix in model generation
  - Connect to database using `connect_db_admin()` and query enum values
  - Generate `enums.py` file with `Literal` types and value lists
  - Format: `type XEnum = Literal["a", "b"]` and `X_ENUM_VALUES = ["a", "b"]`
  - Exclude `_enum` tables from regular model generation
  - Add comprehensive tests for enum generation functionality

## ✅ Milestone 9: Type System Improvements
- [x] Update JSON/JSONB types to dict[str, Any]
  - Change `POSTGRES_TO_PYTHON_TYPES` mapping for `json` and `jsonb`
  - Update from `Any` to `dict[str, Any]` for better type safety
  - Update tests to reflect the new JSON type mapping

## ✅ Milestone 10: SQLAlchemy Parameter Binding Fix
- [x] Fix SQLAlchemy parameter binding by escaping colons in SQL queries
  - Escape all colons in SQL query text with `\:` before parameter substitution
  - Prevent SQLAlchemy from treating PostgreSQL syntax like `::INTERVAL` as parameters
  - Use raw strings (`r"""`) for proper escape sequence handling
  - Update tests to match new escaping behavior

## ✅ Milestone 11: COPY FROM Support (:copy)
- [x] Add support for `COPY FROM` using psycopg (drop down to psycopg connection) to implement `:copy` for sqlc
  - Parse `:copy` query annotations from sqlc input
  - Generate functions that drop down to psycopg connection for bulk data loading
  - Implement `copy()` functionality using psycopg's copy operations
  - Add conditional psycopg import only when `:copy` queries are present
  - Generate proper function signatures with `data: AsyncIterator[tuple[Any, ...]]` parameter
  - Use `conn.get_raw_connection().driver_connection` to access underlying psycopg connection
  - Implement row-by-row data insertion using `copy.write_row(row)` within copy context
  - Add comprehensive tests for COPY operations including generated code structure validation
  - Reference: https://www.psycopg.org/psycopg3/docs/basic/copy.html and https://docs.sqlc.dev/en/latest/howto/insert.html

## ✅ Milestone 12: Partial Model Support for Subset Queries
- [x] Generate custom dataclasses for queries that don't return full models
  - Detect queries that select only a subset of table columns using column comparison with catalog
  - Generate custom dataclasses with names like `GetUserSummaryResult` based on query names
  - Only use the full Model class when ALL columns from the table are selected
  - Handle queries with JOINs and computed columns by generating custom dataclasses
  - Support queries with computed columns, aggregates, or expressions (no table association)
  - Generate appropriate imports and type annotations for custom dataclasses in queries.py
  - Add unit tests for partial model generation with various query patterns
  - Ensure backward compatibility with existing full-model queries (test passes)

## Milestone 13: Batch Operations Support (:batch*)
- [ ] Add support for `executemany` using psycopg (drop down) to implement `:batch*` for sqlc
  - Parse `:batchexec`, `:batchone`, `:batchmany` query annotations
  - Generate functions that use psycopg's `executemany()` for batch operations
  - Handle parameter lists for batch operations
  - Implement proper return types for each batch operation type
  - Add comprehensive tests for all batch operation variants
  - Reference: https://docs.sqlc.dev/en/latest/reference/query-annotations.html#batchexec

Each milestone includes focused unit tests and can be completed independently.