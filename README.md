# blossom

The code of web applications can be divided between _product_ and _platform_. Product code solves
end user problems; platform code enables correct and efficient delivery. Product code differs
greatly between applications, but platform code can often be reused. This repository contains my
generalizable platform code for web applications; boilerplate in essence.

Each of the libraries consisting the platform tightly integrate with each other to eliminate
friction during product delivery.

This repository contains a superset of features; most applications will find some of them
unnecessary. It is intended that features be cherry-picked and copy-pasted from this repository into
specific projects.

# Contents

The common code in this repository covers infrastructure, backend, frontend, and design.

## Infrastructure

- [Nix](./nix) for developer environments.
- [Nomad](./nomad) for service orchestration.
- [Github Actions](./github/.workflows) for CI pipeline.
- [Github Actions](./github/.workflows) for CD pipeline with Nomad and Tailscale.

## Backend

The backend is a Python monolith with Postgres database.

- Language: Python & mypy
- Builds: Nix
- Package Manager: Nix
- Database: Postgres
- ORM: sqlc (w/ psycopg engine)
- Web Framework: Quart & Hypercorn
- Migrations: pgmigrate
- Background Jobs: Procrastinate (TODO)
- Logging/Tracing: OpenTelemetry (TODO)
- Data Validation: pydantic
- Linters: ruff & Semgrep
- Formatter: ruff
- Test Runner: pytest

Features:

- [Lazy test fixtures](./foundation/test) for concise test setup.
- Parallelized tests with shared database.
- Multi-tenant account system.
- [Row Level Security](./backend/foundation/database) for secure multi-tenancy.
- [RPC framework](./backend/foundation/rpc) with TypeScript type codegen.
- [Vault abstraction](./backend/foundation/vault) for basic encrypted storage.
- [Database conventions](./backend/foundation/migrate) and tests to enforce them.
- [Developer CLI](./backend/cli) for service operations and developer tooling.
- [Environment variable](./backend/foundation/config) configuration.

## Frontend

The frontend is a Typescript React SPA (CDNs :money_with_wings:).

- Language: TypeScript
- Builds: Turborepo & Vite (SWC)
- Package Manager: pnpm
- UI Framework: React
- Headless Components: React Aria
- CSS-in-JS: vanilla-extract
- Module State Management: Jotai
- Server State Management: Tanstack Query
- Router: Wouter
- Linters: ESLint & Semgrep
- Formatter: dprint
- Component Stories: Ladle
- Test Runner: Vitest
- Visual Test Runner: Playwright & Ladle
- E2E Test Runner: Playwright (TODO)
  
Features:

- [Light and dark themes](./frontend/foundation/theme).
- [RPC framework](./frontend/foundation/rpc) with imperative, Jotai, and Tanstack Query bindings.
- [Custom errors](./frontend/foundation/errors) with rich metadata and stacktraces.
- [Icons](./frontend/foundation/icons) with tokenized colors and sizes, and lazy-loading.
- [Forms](./frontend/foundation/forms) for convenience.
- [Page layout primitives](./frontend/foundation/layout) optimizing consistency and flexibility.
- [Loader components](./frontend/foundation/loaders) for easy loading states.
- [Page routing](./frontend/foundation/routing) with code splitting and prefetching.
- [RPC mocks](./frontend/foundation/testing) with msw for Ladle stories and Vitest testing.

## Design

The design system currently has some random colors and fonts. Each application should change them.

- [Figma Tokens file](./frontend/foundation/theme).
- Figma component library.
- Figma color palette & theme libraries.

# Environment Setup

We use Nix to manage developer environments. All tools we use are declaratively defined in `nix/`.
To bootstrap the developer environment and get started:

1. Follow the [Linux](https://nixos.wiki/wiki/Nix_Installation_Guide) or
   [MacOS](https://github.com/LnL7/nix-darwin) guide to install Nix.
2. [Enable Nix Flakes](https://nixos.wiki/wiki/Flakes#Enable_flakes).
3. [Install `direnv`](https://nixos.wiki/wiki/Development_environment_with_nix-shell#direnv) and run
   `direnv allow` in the root of the monorepo.

After installing Nix and activating the developer environment, all tools and commands should work.

# Monorepo Organization

The monorepo is organized at the top-level by service type. Examples of service types are frontend,
backend, nix, and nomad. Each service type has its own internal organization.

## Application Services

The application services (the backend and frontend services) are organized as packages. Each package
solves one class of problems or feature and contains a README that document its purpose, context,
and usage.

Packages are sorted into _package groups_. While every application service will have its own set of
package groups, mainstays are:

- `foundation/` contains platform packages.
- `product/` contains the product packages.
- `codegen/` contains the packages that are produced from codegen tooling.

Inside each package group, packages are arranged in a flat structure. All package directories are
direct children of a package group directory.

_Note: The platform packages live in `foundation` instead of `platform` because
`platform` is a Python standard library package._

## Infrastructure

Infrastructure is structured similarly. The top level is organized by type of infrastructure.

- `flake.nix` aggregates all of Nix outputs derivations into a single flake.
- `docker-compose.yaml` defines all services used in the local environment.
- `nix/` contains Nix derivations for our packages, toolchains, and builds.
- `nomad/` contains Nomad service definitions.
- `.github/workflows/` contains the CI/CD pipeline configurations.

# Developer Port Space

We try to avoid having multiple local services occupy the same port. The current allocations of
services -> ports are:

- 40851: Backend
- 40852: Postgres
- 40853: Frontend
- 40854: Ladle
- 40855: Visual Tests

# License

```
Copyright 2023 blissful <blissful@sunsetglow.net>

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
