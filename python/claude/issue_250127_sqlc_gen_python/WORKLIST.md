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

Each milestone includes focused unit tests and can be completed independently.