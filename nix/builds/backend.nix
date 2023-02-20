{ pkgs }:

let
  python-package = pkgs.python-prod.pkgs.buildPythonPackage {
    pname = "blossom";
    version = "0.0.0";
    src = ../../backend;
    vendorSha256 = "sha256-O9u8ThzGOcfWrDjA87RaOPez8pfqUo+AcciSSAw2sfk=";
    propagatedBuildInputs = pkgs.python-prod-deps;
  };
in
# TODO: Docker image
python-package
