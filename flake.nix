{
  description = "blossom development environment";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    pgmigrate-src = {
      url = "github:peterldowns/pgmigrate";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { self, nixpkgs, flake-utils, pgmigrate-src }: flake-utils.lib.eachDefaultSystem (system:
    let
      pkgs = import nixpkgs {
        inherit system;
        config.allowUnfree = true;
        overlays = [
          (self: super: {
            pgmigrate = pgmigrate-src.packages.${system}.default;
            python-pin = super.python313;
            # Fork of sqlc-gen-python.
            sqlc-gen-python =
              let
                module = super.buildGoModule {
                  pname = "sqlc-gen-python";
                  version = "1.0.0";
                  src = super.fetchFromGitHub {
                    owner = "azuline";
                    repo = "sqlc-gen-python";
                    rev = "6ff33dbf7603b5646bf288161fed47a1432cdb57";
                    sha256 = "sha256-f/mgrWdpkZjAI5MpmuHdcT6R2XspLKqPvTdvpz3tY5c=";
                  };
                  vendorHash = "sha256-fXmdjclFzxhv5EhP1OYi9Ek0ZrSGt6ETsLrka+N4M1c=";
                };
              in
              super.writeShellScriptBin "sqlc-gen-python" ''
                #!/usr/bin/env sh
                ${module}/bin/plugin
              '';
          })
        ];
      };
      shellHook = ''
        find-up () {
          path=$(pwd)
          while [[ "$path" != "" && ! -e "$path/$1" ]]; do
            path=''${path%/*}
          done
          echo "$path"
        }
        export BLOSSOM_ROOT="$(find-up flake.nix)"
        # Default biome binary is dynamically linked.
        export BIOME_BINARY="${pkgs.biome}/bin/biome"
        export UV_PYTHON="${pkgs.python-pin}/bin/python"
      '';
      makeDevShell = name: chain: pkgs.mkShell {
        inherit shellHook;
        buildInputs = [ (pkgs.buildEnv { name = "blossom-" + name; paths = chain; }) ];
        LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath [ pkgs.stdenv.cc.cc ];
      };
      toolchains = rec {
        general = with pkgs; [
          coreutils
          moreutils
          findutils
          docker
          fd
          jq
          just
          ripgrep
        ];
        python = general ++ (with pkgs; [
          pgmigrate
          postgresql_16
          pyright
          python-pin
          ruff
          semgrep
          sqlc
          sqlc-gen-python
          uv
        ]);
        typescript = general ++ (with pkgs; [
          biome
          nodejs_22
          nodePackages.pnpm
          semgrep
        ]);
        infra = general ++ (with pkgs; [
          gnutar
          nomad
          levant
        ]);
        all = general ++ python ++ typescript ++ infra;
      };
    in
    {
      devShells = {
        default = makeDevShell "default" toolchains.all;
        python = makeDevShell "python" toolchains.python;
        typescript = makeDevShell "typescript" toolchains.typescript;
        infra = makeDevShell "infra" toolchains.infra;
      };
    }
  );
}
