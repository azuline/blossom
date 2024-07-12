{ pkgs }:

rec {
  general = with pkgs; [
    coreutils
    fd
    gnumake
    fail-on-dirty-diff
  ];
  backend = general ++ (with pkgs; [
    black
    docker
    dprint # needed for typescript codegen
    pgmigrate
    pip-audit
    pyright
    python-dev
    ruff
    semgrep
    sqlc-gen-python
    sqlc-py
  ]);
  frontend = general ++ (with pkgs; [
    docker
    dprint
    nodejs_20
    nodePackages.pnpm
    semgrep
  ]);
  deployments = general ++ (with pkgs; [
    gnutar
    nomad
    levant
    jq
  ]);
  interactive = with pkgs; [
    postgresql_15
  ];
  all = general ++ backend ++ frontend ++ deployments ++ interactive;
}
