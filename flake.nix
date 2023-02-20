{
  description = "blossom development environment";

  inputs = {
    nixpkgs.url = github:nixos/nixpkgs/nixos-unstable;
    flake-utils.url = github:numtide/flake-utils;
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import ./nix/pkgs { inherit nixpkgs system; };
        toolchains = import ./nix/toolchains { inherit pkgs; };
        builds = import ./nix/builds { inherit nixpkgs; };
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
        makeDevShell = chain: pkgs.mkShell {
          inherit shellHook;
          buildInputs = [
            (pkgs.buildEnv {
              name = "blossom dev shell";
              paths = chain;
            })
          ];
        };
      in
      rec {
        devShells = {
          default = makeDevShell (toolchains.all ++ [ apps.blossom ]);
          backend = makeDevShell (toolchains.backend ++ [ apps.blossom ]);
          frontend = makeDevShell toolchains.frontend;
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
