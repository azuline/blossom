{ pkgs }:

rec {
  general = with pkgs; [
    coreutils
    docker
    gnumake
    gnutar
    semgrep
    fail-on-dirty-diff
  ];
  backend = general ++ (with pkgs; [
    # mypy is defined as a part of python-dev so it can read the dependencies
    black
    pip-audit
    python-dev
    ruff
    sqlc-py
    sqlc-gen-python
    dprint # needed for typescript codegen
  ]);
  frontend = general ++ (with pkgs; [
    dprint
    nodejs-18_x
    nodePackages.pnpm
  ]);
  deployments = general ++ (with pkgs; [
    nomad
    jq
  ]);
  interactive = with pkgs; [
    postgresql_15
  ];
  all = general ++ backend ++ frontend ++ interactive;
}
