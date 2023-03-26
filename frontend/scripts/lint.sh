#!/usr/bin/env bash

pnpm eslint --ext .js,.cjs,.ts,.tsx --max-warnings=0 --fix .
dprint fmt
semgrep --autofix .
pnpm unimported
