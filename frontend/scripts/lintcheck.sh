#!/usr/bin/env bash

pnpm eslint --ext .js,.cjs,.ts,.tsx --max-warnings=0 .
dprint check
semgrep .
pnpm unimported
