# Frontend

The frontend is written with full client side React, with the sole rationale of
being cheaper to deploy. SSR is pretty cool, but it costs money.

# Doing Things

See the `Makefile` for a list of common dev tool commands.

# Directories

- `codegen/` contains the outputs of codegen systems.
- `foundation/` contains the developer platform.
- `product/` contains the product-specific code.
- `public/` contains static assets.

## Stack

- Language: TypeScript
- Builds: Vite (esbuild/Rollup)
- Package Manager: pnpm
- State Management: Jotai
- UI Framework: React
- Headless Components: React Aria
- CSS Framework: vanilla-extract
- Router: Wouter
- Requests: Tanstack Query
- Data Validation: Zod [TODO]
- Linters/Formatters: ESLint + Dprint + Semgrep
- Test Runner: Vitest
- Component Stories: Ladle
- Visual Test Runner: Ladle + Playwright
- E2E Test Runner: Playwright [TODO]
