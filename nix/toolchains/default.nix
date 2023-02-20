{ pkgs, builds }:

rec {
  general = pkgs.buildEnv {
    name = "blossom general";
    paths = with pkgs; [
      coreutils
      docker
      gnumake
      semgrep
      fail-on-dirty-diff
    ];
  };
  backend = pkgs.buildEnv {
    name = "blossom backend";
    paths = with pkgs; [
      general
      builds.backend.env
      # Python developer tools.
      black
      pip-audit
      ruff
      sqlc-py
      sqlc-gen-python
      dprint # needed for typescript codegen
    ];
  };
  frontend = pkgs.buildEnv {
    name = "blossom frontend";
    paths = with pkgs; [
      general
      dprint
      nodejs-18_x
      nodePackages.pnpm
    ];
  };
  interactive = pkgs.buildEnv {
    name = "blossom interactive";
    paths = with pkgs; [
      postgresql_15
    ];
  };
  all = pkgs.buildEnv {
    name = "blossom all";
    paths = [
      general
      backend
      frontend
      interactive
    ];
  };
}
