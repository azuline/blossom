{ pkgs }:

rec {
  general = with pkgs; [
    coreutils
    fd
    gnumake
    fail-on-dirty-diff
  ];
  backend = general ++ (with pkgs; [
    # mypy is defined as a part of python-dev so it can read the dependencies
    black
    docker
    pip-audit
    python-dev
    ruff
    semgrep
    sqlc-py
    sqlc-gen-python
    dprint # needed for typescript codegen
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
