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

# Major Dependencies

- Builds: Vite + SWC + esbuild
- CSS-in-JS: vanilla-extract
- Component Stories: Ladle
- E2E Test Runner: Playwright
- Headless Components: React Aria
- Linter/Formatter: Biome + ESLint + Semgrep
- Module State Management: Jotai + valtio
- Package Manager: pnpm
- Router: Tanstack Router
- Server State Management: Tanstack Query
- Test Runner: Vitest
- UI Framework: React
- Visual Test Runner: Playwright + Ladle
