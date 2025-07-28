{
  description = "blossom development environment";
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    pgmigrate-src = {
      url = "github:peterldowns/pgmigrate";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    sqlc-src = {
      url = "github:azuline/sqlc";
      flake = false;
    };
    mcp-language-server-src = {
      url = "github:isaacphi/mcp-language-server";
      flake = false;
    };
  };
  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
      pgmigrate-src,
      sqlc-src,
      mcp-language-server-src,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs {
          inherit system;
          config.allowUnfree = true;
          overlays = [
            (self: super: {
              pgmigrate = pgmigrate-src.packages.${system}.default;
              sqlc = super.sqlc.overrideAttrs {
                src = sqlc-src;
                vendorHash = "sha256-JIbSagv5JP7pMaGpy/2y1LvMGv2WKjPLxUOirZOcpL0=";
              };
              mcp-language-server = super.buildGoModule {
                pname = "mcp-language-server";
                version = "0.1.0";
                src = mcp-language-server-src;
                vendorHash = "sha256-5YUI1IujtJJBfxsT9KZVVFVib1cK/Alk73y5tqxi6pQ=";
                proxyVendor = true;
                subPackages = [ "." ];
              };
              sqlc-gen-python = super.writeShellScriptBin "sqlc-gen-python" ''
                #!/usr/bin/env bash
                cd "$MONOREPO_ROOT/python"
                uv run -- python -m tools.codegen_db_plugin $@
              '';
            })
          ];
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
              export MONOREPO_ROOT="$(find-up .monorepo-root)"
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
            gnutar
            jq
            just
            (lib.hiPrio parallel-full) # parallel is also part of moreutils; have GNU parallel take priority.
          ];
          local = [
            fd
            mcp-language-server
            ripgrep
            protobuf
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
            sqlc-gen-python
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
          python-ci = makeDevShell {
            name = "blossom-python";
            packages = with toolchains; general ++ python;
          };
          typescript-ci = makeDevShell {
            name = "blossom-typescript";
            packages = with toolchains; general ++ typescript;
          };
          infra-ci = makeDevShell {
            name = "blossom-infra";
            packages = with toolchains; general ++ infra;
          };
        };
      }
    );
}
