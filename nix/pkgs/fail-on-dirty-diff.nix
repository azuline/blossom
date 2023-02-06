{ pkgs }:

pkgs.writeShellScriptBin "fail-on-dirty-diff" ''
  #!/usr/bin/env bash

  # Show the state of the repo before failing.
  ${pkgs.git}/bin/git diff
  ${pkgs.git}/bin/git status
  # Then fail if dirty.
  [[ -z $(${pkgs.git}/bin/git status -s) ]] || (exit 1)
''
