# _blossom_

A platform for an excellent full stack web application developer experience.

_Still pretty early WIP!_

# What's this?

In web applications, we can bucket most systems into two categories:
[Product systems and Platform systems](https://newsletter.pragmaticengineer.com/p/the-platform-and-program-split-at).
_Product systems_ solve an end user problem and serve the customer. They are
built on top of _platform systems_, which solve foundational problems and
enable efficient and correct delivery.

While product systems are specific to the product being built, many products
tend to share similar platform problems, especially prior to reaching scale.
My pet projects have similarly shaped platform problems. _blossom_ is a shared
platform to solve platform problems across my pet projects.

More generally, _blossom_ solves a set of common platform problems that
small-to-medium scale monolithic web applications have.

_blossom_ contains opinionated design decisions and modern library choices. All
libraries are cohesively integrated together at the platform layer, so that
product development can easily use all platform libraries with zero-friction.

# What's in here?

_blossom_ contains a platform that solves problems ranging from infrastructure
to design.

In this section, we'll cover interesting features and design decisions that
_blossom_ contains. Each feature is further documented in its own README. This
section links to those READMEs.

## Infrastructure

_blossom's_ infrastructure currently solves for developer environments, builds,
CI/CD pipelines, and service orchestration.

We operate under the assumption that hardware is already provisioned and
managed with a functioning Nomad+Consul cluster. For reference, my
NixOS+Nomad+Consul configurations are located [here](https://github.com/azuline/nixos).

- [Nix](./nix) for package management & developer environments.
- [Nomad](./nomad) for service orchestration.
- [Github Actions CI](./github/workflows) pipeline.
- [Github Actions CD](./github/workflows) pipeline with Nomad and Tailscale.

## Backend

_blossom's_ backend is a monolithic Python (+mypy) application backed by
Postgres. Python was chosen because I am the most comfortable and efficient
with Python.

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

## Frontend

_blossom's_ frontend is a React SPA written in TypeScript. An SPA was chosen
purely for cheap cost of deployment (CDNs :money_with_wings:).

- Design System built with React Aria and vanilla-extract.
- Light and dark theme support.
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
- Linting with eslint+dprint+Semgrep.
- Builds with the Vite toolchain (SWC+esbuild+Rollup).
- pnpm dependency management.

## Design

Designs are built in Figma. The Figma files are still private; might publish
them later if I'm feeling cute idk~

- Figma Tokens file for the Design System.
- Figma component library for the Design System components.
- Figma libraries for the palette and themes.

# Getting Started

We use Nix to manage developer environments. All tools we use are declaratively
defined in `nix/`. To bootstrap the developer environment and get started:

1. Follow the [Linux guide](https://nixos.wiki/wiki/Nix_Installation_Guide)
   or [MacOS nix-darwin](https://github.com/LnL7/nix-darwin) guide to install
   Nix.
2. [Enable Nix Flakes](https://nixos.wiki/wiki/Flakes#Enable_flakes).
3. [Install `direnv`](https://nixos.wiki/wiki/Development_environment_with_nix-shell#direnv).
   (Or run `nix develop` to start a dev shell).

After installing Nix and activating the developer environment, all tools and
commands should work.

# Monorepo Organization

The monorepo is organized at the top-level by service type. Examples of service
types are frontend, backend, nix, and nomad. Each service type has its own
internal organization.

## Application Services

The application services (the backend and frontend services) are organized as
packages. Each package solves one class of problems or feature and contains a
README that document its purpose, context, and usage.

Packages are sorted into _package groups_. The package groups are:

- `foundation/` contains platform packages.
- `product/` contains the product packages.
- `codegen/` contains the packages that are produced from codegen tooling.

Inside each package group, packages are arranged in a flat structure. All
package directories are direct children of a package group directory.

_Note: The platform packages live in `foundation` instead of `platform` because
`platform` is a Python standard library package._

## Infrastructure

Infrastructure is structured similarly. The top level is organized by type of
infrastructure.

- `flake.nix` aggregates all of Nix outputs derivations into a single flake.
- `docker-compose.yaml` defines all services used in the local environment.
- `nix/` contains Nix derivations for our packages, toolchains, and builds.
- `nomad/` contains Nomad service definitions.
- `.github/workflows/` contains the CI/CD pipeline configurations.

# Developer Port Space

- 40851: Backend
- 40852: Postgres
- 40853: Frontend
- 40854: Ladle
- 40855: Visual Tests
