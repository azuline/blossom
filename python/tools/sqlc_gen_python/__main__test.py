"""Tests for sqlc_gen_python tool."""

import subprocess
from click.testing import CliRunner

from tools.sqlc_gen_python.plugin import GenerateRequest, GenerateResponse, Settings, Catalog, Schema, Table, Query, Column, Identifier
from tools.sqlc_gen_python.__main__ import main, deserialize_request, serialize_response, map_postgres_type_to_python, generate_models


def test_protobuf_serialization_roundtrip():
    """Test that we can serialize and deserialize protobuf messages correctly."""
    # Create a sample GenerateRequest
    request = GenerateRequest(
        sqlc_version="1.0.0",
        settings=Settings(
            version="1.0.0",
            engine="postgresql"
        ),
        catalog=Catalog(
            name="test_db",
            default_schema="public",
            schemas=[
                Schema(
                    name="public",
                    tables=[
                        Table(
                            rel=Identifier(name="users", schema="public"),
                            columns=[
                                Column(
                                    name="id",
                                    not_null=True,
                                    type=Identifier(name="bigint")
                                ),
                                Column(
                                    name="name", 
                                    not_null=True,
                                    type=Identifier(name="text")
                                )
                            ]
                        )
                    ]
                )
            ]
        ),
        queries=[
            Query(
                name="get_user",
                text="SELECT id, name FROM users WHERE id = $1",
                cmd=":one"
            )
        ]
    )
    
    # Test serialization
    serialized = bytes(request)
    assert len(serialized) > 0
    
    # Test deserialization
    deserialized = GenerateRequest().parse(serialized)
    
    # Verify the data was preserved
    assert deserialized.sqlc_version == "1.0.0"
    assert deserialized.settings.version == "1.0.0"
    assert deserialized.catalog.name == "test_db"
    assert len(deserialized.catalog.schemas) == 1
    assert deserialized.catalog.schemas[0].name == "public"
    assert len(deserialized.catalog.schemas[0].tables) == 1
    assert deserialized.catalog.schemas[0].tables[0].rel.name == "users"
    assert len(deserialized.catalog.schemas[0].tables[0].columns) == 2
    assert len(deserialized.queries) == 1
    assert deserialized.queries[0].name == "get_user"


def test_cli_basic_functionality():
    """Test that the CLI tool can handle basic protobuf input/output."""
    runner = CliRunner()
    
    # Create a minimal GenerateRequest
    request = GenerateRequest(
        sqlc_version="1.0.0",
        settings=Settings(
            version="1.0.0",
            engine="postgresql"
        ),
        catalog=Catalog(name="test")
    )
    
    # Serialize request
    input_data = bytes(request)
    
    # Run the CLI tool
    result = runner.invoke(main, input=input_data)
    
    # Check that it ran without errors
    assert result.exit_code == 0
    
    # Parse the output as a GenerateResponse
    response = GenerateResponse().parse(result.stdout_bytes)
    
    # Verify response structure
    assert len(response.files) == 2
    assert response.files[0].name == "models.py"
    assert response.files[1].name == "queries.py"
    assert len(response.files[0].contents) > 0
    assert len(response.files[1].contents) > 0


def test_type_mapping():
    """Test PostgreSQL to Python type mapping."""
    # Test basic types
    text_col = Column(name="name", not_null=True, type=Identifier(name="text"))
    assert map_postgres_type_to_python(text_col) == "str"
    
    # Test nullable types
    nullable_text_col = Column(name="name", not_null=False, type=Identifier(name="text"))
    assert map_postgres_type_to_python(nullable_text_col) == "str | None"
    
    # Test array types
    array_col = Column(name="tags", not_null=True, is_array=True, type=Identifier(name="text"))
    assert map_postgres_type_to_python(array_col) == "list[str]"
    
    # Test nullable array types
    nullable_array_col = Column(name="tags", not_null=False, is_array=True, type=Identifier(name="text"))
    assert map_postgres_type_to_python(nullable_array_col) == "list[str] | None"
    
    # Test numeric types
    int_col = Column(name="count", not_null=True, type=Identifier(name="bigint"))
    assert map_postgres_type_to_python(int_col) == "int"
    
    float_col = Column(name="price", not_null=True, type=Identifier(name="numeric"))
    assert map_postgres_type_to_python(float_col) == "float"
    
    # Test datetime types
    timestamp_col = Column(name="created_at", not_null=True, type=Identifier(name="timestamptz"))
    assert map_postgres_type_to_python(timestamp_col) == "datetime.datetime"
    
    # Test boolean type
    bool_col = Column(name="active", not_null=True, type=Identifier(name="boolean"))
    assert map_postgres_type_to_python(bool_col) == "bool"
    
    # Test JSON types
    json_col = Column(name="metadata", not_null=False, type=Identifier(name="jsonb"))
    assert map_postgres_type_to_python(json_col) == "Any | None"
    
    # Test unknown type fallback
    unknown_col = Column(name="custom", not_null=True, type=Identifier(name="custom_type"))
    assert map_postgres_type_to_python(unknown_col) == "Any"


def test_model_generation():
    """Test database model dataclass generation."""
    # Create a sample catalog with a table
    catalog = Catalog(
        name="test_db",
        schemas=[
            Schema(
                name="public",
                tables=[
                    Table(
                        rel=Identifier(name="users", schema="public"),
                        columns=[
                            Column(
                                name="id",
                                not_null=True,
                                type=Identifier(name="bigint")
                            ),
                            Column(
                                name="name", 
                                not_null=True,
                                type=Identifier(name="text")
                            ),
                            Column(
                                name="email",
                                not_null=False,
                                type=Identifier(name="text")
                            ),
                            Column(
                                name="created_at",
                                not_null=True,
                                type=Identifier(name="timestamptz")
                            ),
                            Column(
                                name="tags",
                                not_null=False,
                                is_array=True,
                                type=Identifier(name="text")
                            )
                        ]
                    )
                ]
            )
        ]
    )
    
    # Generate models
    models_code = generate_models(catalog)
    
    # Verify the generated code structure
    assert "# Code generated by sqlc. DO NOT EDIT." in models_code
    assert "import dataclasses" in models_code
    assert "import datetime" in models_code
    assert "from typing import Any" in models_code
    assert "@dataclasses.dataclass(slots=True)" in models_code
    assert "class Users:" in models_code
    assert "id: int" in models_code
    assert "name: str" in models_code
    assert "email: str | None" in models_code
    assert "created_at: datetime.datetime" in models_code
    assert "tags: list[str] | None" in models_code