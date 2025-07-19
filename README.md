# Blossom

> [!NOTE]
> The repository is currently being updated.

Blossom contains code patterns that I've accumulated between various projects. It serves as a
template repository for my future projects (they _blossom_ out of this repository, get it? Ha ha!).
Blossom is is a superset of features; most projects benefit from a trimming of features post-fork.

The tooling and code structure reflect my personal preferences and taste in software. They are meant
to be sensible for small-medium scale projects; think Seed-Series B startups.

Please feel free to take inspiration and/or copy code. This repository contains code in Python and
TypeScript. Many of the patterns here are translatable to other languages, but they are not provided
in this repository.

The project is structured as a monorepo organized by `{language}/{project}`. Each `project`
directory represents a deployed service, with the exception of the `foundation` directories, which
contain shared abstractions that all other projects depend on. Each language and project contains a
`README.md` with more description and a `CLAUDE.md` with programming guidelines.

I have found these `foundation` abstractions useful in constructing programs that are robust today
and malleable tomorrow. All of them are coupled to integrate smoothly with each other, and they
facade third-party libraries where beneficial to similarly integrate them smoothly with the other
`foundation` abstractions.

## Project Patterns

- [Infrastructure/Dev Shell](./flake.nix)
- [Infrastructure/Private Network](./infra/vpn)
- [Infrastructure/Continuous Integration](./github/workflows)
- [Infrastructure/Continuous Deployment](./infra/deploys)
- [Python/Foundation Libraries](./python/foundation)
- [Python/Database Management](./python/database)
- [Python/Web Backend (Internal-Facing)](./python/panopticon)
- [Python/Web Backend (Customer-Facing)](./python/product)
- [Python/Data Pipeline](./python/pipeline)
- [TypeScript/Foundation Libraries](./typescript/foundation)
- [TypeScript/Web Frontend (Internal-Facing)](./typescript/panopticon)
- [TypeScript/Web Frontend (Customer-Facing)](./typescript/product)

## Technologies & Dependencies

- Infrastructure:
  - Continuous Integration: Github Actions + Namespace
  - Data Pipeline Orchestrator: Dagster
  - Database: Postgres
  - Dependency Management: Nix
  - Private Network: Tailscale
  - Service Orchestrator: Nomad
- Python:
  - Background Jobs: Procrastinate
  - Data Pipelines: Dagster
  - Data Validation: pydantic
  - Error Triage: Sentry
  - Linter/Formatter: ruff + Semgrep + Tach
  - Logs: Structlog
  - Metrics: datadog
  - Migrations: yoyo-migrations
  - ORM: sqlc + psycopg
  - Package Manager: uv
  - Test Runner: pytest
  - Traces: ddtrace
  - Type Checker: pyright
  - Web Framework: Quart + Hypercorn
- TypeScript:
  - Builds: Vite (SWC+esbuild)
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

## Port Space

As I have multiple projects spun off from this template and do not wish for ports to clash, I change
the ports after forking. To make this easy, the template comes with ports in the `408XX` range. All
reserved ports are noted here and can be grepped for and changed.

- 40801: Postgres
- 40811: Web Backend (Customer-Facing)
- 40812: Web Backend (Internal-Facing)
- 40813: Data Pipeline
- 40821: Web Frontend (Customer-Facing)
- 40822: Web Frontend (Internal-Facing)
- 40822: Ladle
- 40823: Visual Tests
