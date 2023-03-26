#!/usr/bin/env bash

pnpm eslint --ext .js,.cjs,.ts,.tsx --max-warnings=0 --fix .
dprint fmt --config "$BLOSSOM_ROOT/frontend/dprint.json"
semgrep . --config "$BLOSSOM_ROOT/frontend/.semgrep" --autofix
# TODO: Figure this out.
# pnpm unimported
