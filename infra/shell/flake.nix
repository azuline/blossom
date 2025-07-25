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
  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
      pgmigrate-src,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs {
          inherit system;
          config.allowUnfree = true;
          overlays = [ (self: super: { pgmigrate = pgmigrate-src.packages.${system}.default; }) ];
        };
        makeDevShell =
          {
            name,
            packages,
            shellHook ? "",
          }:
          pkgs.mkShell {
            inherit name packages;
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
              export UV_PYTHON="${pkgs.python313}/bin/python"
              ${shellHook}
            '';
            LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath [ pkgs.stdenv.cc.cc ];
          };
        toolchains = with pkgs; {
          general = [
            coreutils
            moreutils
            findutils
            docker
            fd
            gnutar
            jq
            just
            ripgrep
            (lib.hiPrio parallel-full) # parallel is also part of moreutils; have GNU parallel take priority.
          ];
          python = [
            biome # For frontend codegen.
            pgmigrate
            postgresql_16
            pyright
            python313
            ruff
            semgrep
            sqlc
            uv
          ];
          typescript = [
            biome
            nodejs_22
            nodePackages.pnpm
            semgrep
          ];
          infra = [
            nomad
            levant
          ];
        };
      in
      {
        devShells = {
          default = makeDevShell {
            name = "blossom-default";
            packages = with toolchains; general ++ python ++ typescript ++ infra;
          };
          python = makeDevShell {
            name = "blossom-python";
            packages = with toolchains; general ++ python;
          };
          typescript = makeDevShell {
            name = "blossom-typescript";
            packages = with toolchains; general ++ typescript;
          };
          infra = makeDevShell {
            name = "blossom-infra";
            packages = with toolchains; general ++ infra;
          };
        };
      }
    );
}
