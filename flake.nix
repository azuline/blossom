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
        builds = import ./nix/builds { inherit pkgs; };
        toolchains = import ./nix/toolchains { inherit pkgs; };
        shellHook = ''
          find-up () {
            path=$(pwd)
            while [[ "$path" != "" && ! -e "$path/$1" ]]; do
              path=''${path%/*}
            done
            echo "$path"
          }

          export ENVIRONMENT=development
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
          default = makeDevShell (toolchains.all ++ [ apps.blossom-dev-cli ]);
          backend = makeDevShell (toolchains.backend ++ [ apps.blossom-dev-cli ]);
          frontend = makeDevShell toolchains.frontend;
        };
        packages = {
          backend-image = builds.backend;
        };
        apps = {
          # Blossom is the backend CLI in development mode. In production, use
          # the built backend package.
          blossom-dev-cli = {
            type = "app";
            program = pkgs.writeShellScriptBin "blossom" ''
              cd $BLOSSOM_ROOT/backend
              python -m cli $@
            '';
          };
        };
      }
    );
}
