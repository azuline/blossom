{ pkgs }:

let
  python = pkgs.python312;
  runtime-deps = with python.pkgs; [
    click
    cryptography
    jinja2
    psycopg
    psycopg.pool
    pydantic
    python-dotenv
    quart
    werkzeug
  ];
  development-deps = runtime-deps ++ (with python.pkgs; [
    dacite
    mypy # mypy must be here so it can check the types of the dependencies
    pip
    pytest
    pytest-asyncio
    pytest-cov
    pytest-xdist
  ]);
in
{
  dev = python.buildEnv.override { extraLibs = development-deps; };
  dev-deps = development-deps;
  prod = python.buildEnv.override { extraLibs = runtime-deps; };
  prod-deps = runtime-deps;
}
