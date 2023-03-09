# blossom

A platform for an excellent full stack web application developer experience.

_Still pretty early WIP!_

## What's this?

We can bucket most systems into [_Product_ systems and _Platform_ systems](https://newsletter.pragmaticengineer.com/p/the-platform-and-program-split-at).
Product systems solve an end user problem and serve the customer. Product
systems are built on top of platform systems, which solve foundational problems
for product systems to enable efficient and correct delivery.

While end user problems are specific to the product being built, many products
tend to share similar platform problems, especially prior to reaching scale.

My pet projects have similarly shaped platform problems. _blossom_ is this
factored out shared platform.

More generally, _blossom_ solves a set of common platform problems that
small-to-medium scale monolithic web applications have. It can serve as a
reference for an existing web application, or as a template for a greenfield
project.

_blossom_ contains opinionated design decisions and modern library choices. All
libraries are cohesively integrated together at the platform layer, so that
product development can easily use all platform libraries with zero-friction.

## What's in here?

_blossom_ contains a platform that spans from infrastructure to design. In this
section, we'll cover interesting features and design decisions that _blossom_
contains. Each feature is further documented in its own README. This section
links to those READMEs.

### Infrastructure

- Nix for package management & developer environments.
- Nomad for service orchestration.
- Github Actions CI pipeline.
- Github Actions CD pipeline with Nomad and Tailscale.

### Backend

- Multi-tenant account system.
- RPC framework with TypeScript type codegen.
- Nix dependency management.
- Nix builds.
- Ergonomic test fixture system for concise and maintainable tests.
- Highly performant parallelized tests that share a single database.
- Postgres Row Level Security for secure multi-tenancy.
- Secrets vault for secure encrypted secret storage.
- Database migrations with yoyo-migrations.
- Database table conventions and tests to enforce them.
- Database queries with the sqlc database ORM.
- Monolithic CLI for service operations and developer tooling.
- Quart webserver served with Hypercorn.
- Configuration via environment variables.
- Linting with black, Ruff, and Semgrep.

### Frontend

- Design System built with React Aria and vanilla-extract.
- RPC framework with imperative, Jotai, and Tanstack Query bindings.
- Jotai state management.
- Error handling with rich metadata and stacktraces.
- Icon system with tokenized colors and sizes, and lazy-loading.
- Form system for convenient form creation.
- Page layout primitives for consistency and flexibility.
- Loader components for consistent crafted loading states.
- Page routing with code splitting and prefetching.
- Ladle stories with a library for easy story development.
- Unit and integration tests with Vitest.
- Visual snapshot tests with Playwright and Ladle.
- RPC mocks with msw for Ladle stories and Vitest testing.
- SPA builds with the Vite toolchain (SWC+esbuild+Rollup).
- Linting with eslint+dprint+Semgrep.
- pnpm dependency management.

## Getting Started

We use Nix to manage developer environments. All tools we use are declaratively
defined in `nix/`. To bootstrap the developer environment and get started:

1. Follow the [Linux guide](https://nixos.wiki/wiki/Nix_Installation_Guide)
   or [MacOS nix-darwin](https://github.com/LnL7/nix-darwin) guide to install
   Nix.
2. [Enable Nix Flakes](https://nixos.wiki/wiki/Flakes#Enable_flakes).
3. [Install `direnv`](https://nixos.wiki/wiki/Development_environment_with_nix-shell#direnv).
   (Or run `nix develop` to start a dev shell).

## Monorepo Organization

The monorepo is organized at the top-level by service type. For example,
backends go into `backend/`, frontends go into `frontend/`.

## Backend & Frontend

We've adopted a pattern inside `backend/` and `frontend/` that splits packages
into multiple second-level directories.

- `foundation/` contains platform libraries and tools. This is named
  `foundation` instead of `platform` because `platform` is a Python standard
  library.
- `product/` contains the product's user-facing application.
- `codegen/` contains the outputs of codegen tooling.

Within each second-level directory live packages. Each package contains a
README that document its purpose, context, and usage.

So the directory structure is three-tiered: `service type -> app/foundation -> package`.

## Infrastructure

Infrastructure code is structured similarly. The top level is organized by
what type of infrastructure it is.

- `flake.nix` aggregates all of Nix outputs derivations into a single flake.
- `docker-compose.yaml` defines all services used in the local environment.
- `nix/` contains Nix derivations for our packages and toolchains.
- `nomad/` contains Nomad service definitions.
- `.github/workflows/` contains the CI/CD pipeline configurations.

## Developer Port Space

- 40851: Backend
- 40852: Postgres
- 40853: Frontend
- 40854: Ladle
- 40855: Visual Tests
