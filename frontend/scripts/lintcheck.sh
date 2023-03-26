#!/usr/bin/env bash

pnpm eslint --ext .js,.cjs,.ts,.tsx --max-warnings=0 .
dprint check --config "$BLOSSOM_ROOT/frontend/dprint.json"
semgrep . --config "$BLOSSOM_ROOT/frontend/.semgrep"
# TODO: Figure this out.
# pnpm unimported
