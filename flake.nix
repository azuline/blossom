{
  description = "blossom development environment";

  inputs = {
    nixpkgs.url = github:nixos/nixpkgs/nixos-unstable;
    # dprint is broken on latest unstable.
    nixpkgs-dprint-pin.url = github:nixos/nixpkgs?rev=1b1f50645af2a70dc93eae18bfd88d330bfbcf7f;
    flake-utils.url = github:numtide/flake-utils;
  };

  outputs =
    { self
    , nixpkgs
    , nixpkgs-dprint-pin
    , flake-utils
    }:
    flake-utils.lib.eachDefaultSystem (system:
    let
      pkg-pins = {
        dprint = (import nixpkgs-dprint-pin { inherit system; }).dprint;
      };
      pkgs = import ./nix/pkgs { inherit nixpkgs system pkg-pins; };
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
        default = makeDevShell (toolchains.all ++ [ packages.blossom-dev-cli ]);
        backend = makeDevShell (toolchains.backend ++ [ packages.blossom-dev-cli ]);
        frontend = makeDevShell toolchains.frontend;
        deployments = makeDevShell toolchains.deployments;
      };
      packages = {
        backend-image = builds.backend;
        blossom-dev-cli = pkgs.writeShellScriptBin "blossom" ''
          cd $BLOSSOM_ROOT/backend
          python -m cli $@
        '';
      };
    }
    );
}
