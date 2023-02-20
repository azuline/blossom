{
  description = "blossom development environment";

  inputs = {
    nixpkgs.url = github:nixos/nixpkgs/nixos-unstable;
    flake-utils.url = github:numtide/flake-utils;
    poetry2nix-src = {
      url = "github:nix-community/poetry2nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };
  outputs = { self, nixpkgs, flake-utils, poetry2nix-src }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        # see https://github.com/nix-community/poetry2nix/tree/master#api for more functions and examples.
        poetry2nix = poetry2nix-src.legacyPackages.${system};
        pkgs = import ./nix/pkgs { inherit nixpkgs system; };
        builds = import ./nix/builds { inherit pkgs poetry2nix; };
        toolchains = import ./nix/toolchains { inherit pkgs builds; };
        shellHook = ''
          find-up () {
            path=$(pwd)
            while [[ "$path" != "" && ! -e "$path/$1" ]]; do
              path=''${path%/*}
            done
            echo "$path"
          }

          export BLOSSOM_ROOT="$(find-up .monorepo-root)"

          # We intentionally do not allow installing Python packages to the
          # global Python environment. Mutable Python installations should be
          # handled via a virtualenv.
          export PIP_CONFIG_FILE="$BLOSSOM_ROOT"/.pip
        '';
      in
      rec {
        devShells = {
          default = pkgs.mkShell {
            inherit shellHook;
            buildInputs = [
              toolchains.all
              (pkgs.buildEnv {
                name = "blossom app";
                paths = [ apps.blossom ];
              })
            ];
          };
          backend = pkgs.mkShell {
            inherit shellHook;
            buildInputs = [
              toolchains.backend
              (pkgs.buildEnv {
                name = "blossom app";
                paths = [ apps.blossom ];
              })
            ];
          };
          frontend = pkgs.mkShell {
            inherit shellHook;
            buildInputs = [ toolchains.frontend ];
          };
        };
        packages = {
          backend = builds.backend;
        };
        apps = {
          # Blossom is the backend CLI in development mode. In production, use
          # the built backend package.
          blossom = pkgs.writeShellScriptBin "blossom" ''
            cd $BLOSSOM_ROOT/backend
            python -m cli $@
          '';
        };
      }
    );
}
