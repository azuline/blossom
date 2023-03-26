#!/usr/bin/env bash

exitcode=0

pnpm eslint --ext .js,.cjs,.ts,.tsx --max-warnings=0 . || exitcode=$?
dprint check --config "$BLOSSOM_ROOT/frontend/dprint.json" || exitcode=$?
semgrep . --disable-version-check --strict --error --config "$BLOSSOM_ROOT/frontend/.semgrep" || exitcode=$?
pnpm unimported || exitcode=$?
exit $exitcode
