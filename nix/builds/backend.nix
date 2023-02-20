{ pkgs, poetry2nix }:

let
  env = poetry2nix.mkPoetryEnv {
    projectDir = ../../backend;
    python = pkgs.python;
    preferWheels = true;
    extraPackages = ps: [
      ps.pip
      # yoyo-migrations depends on pkg_resources from setuptools
      ps.setuptools
    ];
    overrides = poetry2nix.defaultPoetryOverrides.extend (self: super: {
      procrastinate = super.quart.overridePythonAttrs (old: {
        buildInputs = (old.buildInputs or [ ]) ++ [ super.poetry ];
      });
      psycopg-pool = super.psycopg-pool.overridePythonAttrs (old: {
        buildInputs = (old.buildInputs or [ ]) ++ [ super.setuptools ];
      });
      quart = super.quart.overridePythonAttrs (old: {
        buildInputs = (old.buildInputs or [ ]) ++ [ super.poetry ];
      });
    });
  };
  python-package = pkgs.python-prod.pkgs.buildPythonPackage {
    pname = "blossom";
    version = "0.0.0";
    src = ../../backend;
    vendorSha256 = "sha256-O9u8ThzGOcfWrDjA87RaOPez8pfqUo+AcciSSAw2sfk=";
    propagatedBuildInputs = pkgs.python-prod-deps;
  };
in
{
  inherit env;
  # TODO: Docker image
}
