{ nixpkgs, system }:

import nixpkgs {
  inherit system;
  overlays = [
    (self: super:
      let
        python = import ./python.nix { pkgs = super; };
      in
      {
        python-dev = python.dev;
        python-dev-deps = python.dev-deps;
        python-prod = python.prod;
        python-prod-deps = python.prod-deps;
        fail-on-dirty-diff = import ./fail-on-dirty-diff.nix { pkgs = super; };
        sqlc-py = import ./sqlc-py.nix { pkgs = super; };
        sqlc-gen-python = import ./sqlc-gen-python.nix { pkgs = super; };
      }
    )
  ];
}
