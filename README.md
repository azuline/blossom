# Blossom

> [!NOTE]
> The repository is currently being updated.

Blossom contains code patterns that I've accumulated between various projects. It serves as a
template repository for my future projects (they _blossom_ out of this repository, get it? Ha ha!).
These patterns are meant to be sensible for small-medium scale enterprise projects (think
Seed/Series A startup codebases). Blossom is is a superset of features; most projects benefit from a
trimming of features post-fork.

The code in this repository reflects my taste and preferences. Please feel free to take inspiration
and/or copy code. These templates are implemented in Python and TypeScript, but many of the patterns
here are translatable to other languages (and I have some translations squirrelled away!).

The project is structured as a monorepo organized by `{language}/{project}`. Each `project`
directory represents a deployed service, with the exception of the `foundation` directories. The
`foundation` directories contain shared abstractions that all other projects depend on. Each
language and project contains a `README.md` with more description and a `CLAUDE.md` with programming
guidelines.

I have found these `foundation` abstractions useful in constructing programs that are robust today
and malleable tomorrow. All of them are coupled to integrate smoothly with each other, and they
facade third-party libraries where beneficial to similarly integrate them smoothly with the other
`foundation` abstractions. This coupling makes them ineligible to be independent libraries, yet
greatly increases their ergonomics in this one codebase (i.e. they are tailored to this repository
and therefore not general).

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

## Vendors

The third-party vendors that the repository integrates with are:

- Source Code Manager: Github
- Continuous Integration: Github Actions (+Cachix) (+Namespace)
- Public Cloud: GCP
- Virtual Private Network: Tailscale
- Data Orchestrator: Dagster+
- Infrastructure Observability: Datadog
- Error Triage: Sentry
- Product Observability & Feature Flags: PostHog
- Email Sending: Postmark
- Large Language Model: OpenAI

Most of the paid vendors are optional or have substitutes; in my personal projects I deploy to my
home tailnet and Nomad cluster without most of the observability tooling.

## Technologies & Dependencies

- Infrastructure:
  - Database: Postgres
  - Dependency Management: Nix
  - Service Orchestrator: Nomad / GKE
- Python:
  - Background Jobs: Procrastinate
  - Data Pipelines: Dagster
  - Data Validation: pydantic
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
