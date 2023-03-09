# Frontend

# Doing Things

See the `Makefile` for a list of common dev tool commands.

# Directories

- `codegen/` contains the outputs of codegen systems.
- `foundation/` contains the developer platform.
- `patches/` contains override patches for third-party dependencies.
- `product/` contains the product-specific code.
- `public/` contains static assets.
- `visualtest/` contains the visual testing harness and snapshots.

# Stories

The frontend stories are hosted with Ladle at https://celestial.sunsetglow.net.

## Stack

- Language: TypeScript
- Builds: Vite (SWC+esbuild+Rollup)
- Package Manager: pnpm
- State Management: Jotai
- UI Framework: React
- Headless Components: React Aria
- CSS Framework: vanilla-extract
- Router: Wouter
- Requests: Tanstack Query
- Linters/Formatters: ESLint+dprint+Semgrep
- Test Runner: Vitest
- Component Stories: Ladle
- Visual Test Runner: Ladle+Playwright
- E2E Test Runner: Playwright [TODO]
