{ pkgs }:

let
  python = pkgs.python310;
  quart = python.pkgs.buildPythonPackage rec {
    pname = "Quart";
    version = "0.18.3";
    src = python.pkgs.fetchPypi {
      inherit pname;
      inherit version;
      hash = "sha256-3E3ll9XUaTYnyQkEsjPXKVMfayfBFk92BHbTlnruKko=";
    };
    propagatedBuildInputs = with python.pkgs; [
      aiofiles
      blinker
      click
      hypercorn
      importlib-metadata
      itsdangerous
      jinja2
      markupsafe
      pydata-sphinx-theme
      typing-extensions
      werkzeug
    ];
  };
  runtime-deps = with python.pkgs; [
    click
    jinja2
    psycopg
    psycopg.pool
    pydantic
    python-dotenv
    quart
    werkzeug
    yoyo-migrations
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
