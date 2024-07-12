{ pkgs }:

let
  python-package = pkgs.python-prod.pkgs.buildPythonPackage {
    pname = "blossom";
    version = "0.0.0";
    src = ../../backend;
    propagatedBuildInputs = pkgs.python-prod-deps;
  };
in
pkgs.dockerTools.buildImage {
  name = "blossom-backend";
  tag = "latest";
  copyToRoot = pkgs.buildEnv {
    name = "image-root";
    paths = [ python-package pkgs.pgmigrate ];
    pathsToLink = [ "/bin" ];
  };
  config = {
    Entrypoint = [ "/bin/blossom" ];
  };
}
