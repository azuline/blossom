# Frontend

# Doing Things

See the `Makefile` for a list of common dev tool commands.

# Directories

- `codegen/` contains the outputs of codegen systems.
- `configs/` contains tooling configurations shared between packages.
- `foundation/` contains the developer platform.
- `patches/` contains override patches for third-party dependencies.
- `product/` contains the product-specific code.
- `public/` contains static assets.
- `scripts/` contains shared build scripts.
- `templates/` contains a template directory for a package.
- `visualtest/` contains the visual testing harness and snapshots.

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
