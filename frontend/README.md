# Frontend

# Doing Things

See the `Makefile` for a list of common dev tool commands.

This directory contains a multipackage setup with the Turborepo monorepo build
tool. For the best developer experience:

1. Run `make install` whenever the `dependencies` change in a `package.json`.
2. Run `make typewatch` in a shell when developing. This protects you from
   seeing stale types from old code.
3. Run `make start` to run dev servers for the app and the stories.

# Directories

- `codegen/` contains the outputs of codegen systems.
- `configs/` contains tooling configurations shared between packages.
- `foundation/` contains the developer platform.
- `patches/` contains override patches for third-party dependencies.
- `product/` contains the product-specific code.
- `public/` contains static assets.
- `scripts/` contains shared build scripts.
- `stories/` contains the storybook application.
- `templates/` contains a template directory for a package.

# Stories

The frontend stories are hosted with Ladle at https://celestial.sunsetglow.net.

## Stack

- Language: TypeScript
- Builds: Vite (Turborepo+SWC+esbuild+Rollup)
- Package Manager: pnpm
- State Management: Jotai
- UI Framework: React
- Headless Components: React Aria
- CSS Framework: vanilla-extract
- Router: Wouter
- Requests: Tanstack Query
- Linters/Formatters: ESLint+dprint+Semgrep
- Test Runner: Vitest+Testing Library
- Component Stories: Ladle
- Visual Test Runner: Ladle+Playwright
- E2E Test Runner: Playwright [TODO]
