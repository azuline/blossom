from __future__ import annotations

import os
import subprocess
from dataclasses import dataclass, fields, is_dataclass
from pathlib import Path
from typing import Any, get_args, get_origin, get_type_hints

from jinja2 import BaseLoader, Environment

from foundation.rpc.catalog import Catalog, Method, get_catalog
from foundation.rpc.error import APIError

# nosemgrep
TEMPLATE = """\
export type RPCErrors = {
  {% for errname, err in catalog.errors.items() %}
  {% if err.data %}
  {{ errname }}: {{ err.data }};
  {% else %}
  {{ errname }}: null;
  {% endif %}
  {% endfor %}
  // These are errors that the frontend RPC executor can raise.
  NetworkError: null;
  InternalServerError: null;
  RPCNotFoundError: null;
  ClientJSONDecodeError: null;
  UncaughtRPCError: null;
};

export type RPCSystemErrors =
  | "NetworkError"
  | "InternalServerError"
  | "RPCNotFoundError"
  | "ClientJSONDecodeError"
  | "UncaughtRPCError"
  {% for errname in catalog.global_error_names %}
  | "{{ errname }}"
  {% endfor %}
  ;


export type RPCs = {
  {% for rpcname, rpc in catalog.rpcs.items() %}
  {{ rpcname }}: {
    in: {{ rpc.in_ }};
    out: {{ rpc.out }};
    {% if rpc.error_names %}
    errors: 
      {% for errname in rpc.error_names %}
      | "{{ errname }}"
      {% endfor %}
      ;
    {% else %}
    errors: never;
    {% endif %}
  },
  {% endfor %}
};

export const RPCMethods: Record<keyof RPCs, "GET" | "POST"> = {
  {% for rpcname, rpc in catalog.rpcs.items() %}
  {{ rpcname }}: "{{ rpc.method }}",
  {% endfor %}
};
"""


def codegen_typescript() -> None:
    catalog = convert_catalog_to_codegen_schema(get_catalog())

    env = Environment(loader=BaseLoader(), trim_blocks=True)
    tmpl = env.from_string(TEMPLATE)  # nosemgrep
    code = tmpl.render(catalog=catalog)

    code_path = Path(os.environ["BLOSSOM_ROOT"]) / "frontend" / "codegen" / "rpc" / "src" / "index.ts"
    code_path.parent.mkdir(parents=True, exist_ok=True)
    with code_path.open("w") as fptr:
        fptr.write(code)

    os.chdir(Path(os.environ["BLOSSOM_ROOT"]) / "frontend")
    subprocess.run(["dprint", "fmt", str(code_path)])


@dataclass
class RPCSchema:
    in_: str | None
    out: str | None
    method: Method
    error_names: list[str]


@dataclass
class ErrorSchema:
    data: str | None


@dataclass
class CodegenSchema:
    errors: dict[str, ErrorSchema]
    rpcs: dict[str, RPCSchema]
    global_error_names: list[str]


class UnsupportedTypeError(Exception):
    pass


class ErrorNameCollisionError(Exception):
    pass


def convert_catalog_to_codegen_schema(catalog: Catalog) -> CodegenSchema:
    """
    Convert the RPC schema with its dataclass type annotations into a string form
    that can be used to construct a TypeScript equivalent version.
    """
    schema = CodegenSchema(errors={}, rpcs={}, global_error_names=[])

    def add_error_to_schema(e: type[APIError]) -> None:
        """Raises an error if the error has the same name but a duplicate schema."""
        name = e.__name__
        esch = ErrorSchema(data=dataclass_to_str(e))
        if name in schema.errors and schema.errors[name] != esch:
            raise ErrorNameCollisionError(f"The error name {name} has multiple definitions with different schemas.")
        schema.errors[name] = esch

    for e in catalog.global_errors:
        add_error_to_schema(e)
        schema.global_error_names.append(e.__name__)

    for r in catalog.rpcs:
        for e in r.errors:
            add_error_to_schema(e)
        schema.rpcs[r.name] = RPCSchema(
            in_=dataclass_to_str(r.in_) if r.in_.__name__ != "NoneType" else "null",
            out=dataclass_to_str(r.out) if r.out.__name__ != "NoneType" else "null",
            method=r.method,
            error_names=[e.__name__ for e in r.errors],
        )

    return schema


def dataclass_to_str(d: type[Any]) -> str:
    schema = {}
    type_hints = get_type_hints(d)
    for f in fields(d):
        schema[f.name] = type_to_str(type_hints[f.name])

    if not schema:
        return "null"

    out = f"{{\n"
    for k, v in schema.items():
        out += f'"{k}": {v};\n'
    out += f"}}"

    return out


def type_to_str(t: Any) -> str:
    if is_dataclass(t) and isinstance(t, type):
        return dataclass_to_str(t)

    t_name = getattr(t, "__name__", None)

    if t_name == "str":
        return "string"
    if t_name == "int" or t_name == "float":
        return "number"
    if t_name == "bool":
        return "boolean"
    if t_name == "NoneType":
        return "null"
    if t_name == "Any":
        return "unknown"

    origin = get_origin(t)
    args = get_args(t)

    origin_name = getattr(origin, "__name__", None)

    if origin_name == "list":
        return type_to_str(args[0]) + "[]"
    if origin_name == "tuple":
        return "[" + ", ".join([type_to_str(a) for a in args]) + "]"
    if origin_name == "dict":
        return "Record<" + type_to_str(args[0]) + ", " + type_to_str(args[1]) + ">"
    if origin_name == "UnionType":
        return " | ".join([type_to_str(a) for a in args])

    raise UnsupportedTypeError(f"Failed to convert type {t=} {origin=} {args=}.")
