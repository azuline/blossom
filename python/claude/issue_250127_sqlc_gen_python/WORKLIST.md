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
- [ ] Implement standalone query function generation
  - Parse `queries[]` from protobuf input
  - Extract query name, SQL text, parameters, and return columns
  - Generate async function signatures with `DBConn` parameter
  - Handle different query types (`:one`, `:many`, `:exec`)
  - Generate parameter mapping from `:pN` placeholders to kwargs
  - Generate return type construction from result rows
  - Write unit test with sample query definitions

## Milestone 5: Code Assembly and Output
- [ ] Combine generated components into final output files
  - Assemble models.py with all dataclass definitions
  - Assemble queries.py with SQL constants and functions
  - Generate proper import statements and file headers
  - Create `GenerateResponse` with generated file contents
  - Write integration test with complete protobuf input/output

## Milestone 6: CLI Integration and Testing
- [ ] Complete CLI tool and comprehensive testing
  - Implement `main()` function as Click CLI entry point  
  - Add error handling and validation
  - Write end-to-end test using actual database schema
  - Test integration with existing `just codegen-db` workflow
  - Validate generated code matches current output format

Each milestone includes focused unit tests and can be completed independently.