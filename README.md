# Blossom

This repository contains a template for a full stack web application that I
pulled out from some of my other projects. This repository doesn't contain any
code specific to a single project; it mainly contains a developer platform and
some developer tooling.

This is still pretty early WIP; as my other projects mature, this repository
will cherry-pick code from them. Better documentation will come with time.

# Contents

There's a lot of stuff in this repository, but some of the more fun contents
are:

Backend:

- Database migrations with yoyo-migrations.
- Postgres Row Level Security for secure multi-tenancy.
- Database queries via the sqlc database ORM
- An ergonomic RPC framework with TypeScript binding codegen.
- A single massive pytest fixture for efficiently writing maintainable tests.

Frontend:

- A Design System built with React Aria and vanilla-extract. Tokens and
  components contained in this repository; design guidelines unwritten.
- An RPC framework with function, Tanstack Query, and Jotai bindings. Contracts
  are codegenned from the backend.
- Unit testing with Vitest and React Testing Library (TODO).
- Visual testing with Ladle and Playwright.

Infrastructure:

- Nix package management & developer environment.

# Getting Started

We use Nix to manage development environments. All packages we use are
declaratively defined in `nix/` alongside some other modifications to the
shell.

1. Follow the [Linux guide](https://nixos.wiki/wiki/Nix_Installation_Guide)
   or [MacOS nix-darwin](https://github.com/LnL7/nix-darwin) guide to install
   Nix.
2. [Enable Nix Flakes](https://nixos.wiki/wiki/Flakes#Enable_flakes).
3. [Install `direnv`](https://nixos.wiki/wiki/Development_environment_with_nix-shell#direnv).
   (Or run `nix develop` to start a devshell).

# Monorepo Organization

The monorepo is organized at the top-level by service type. For example,
backends go into `backend/`, frontends go into `frontend/`.

## Backend & Frontend

We've adopted a pattern inside `backend/` and `frontend/` that splits packages
into multiple second-level directories.

- `foundation/` contains application-agnostic libraries and tools that support
  and improve product development. This directory contains the developer
  platform.
- `product/` contains the product's user-facing application.
- `codegen/` contains the outputs of codegen tooling.

We believe that this models the [product and platform split](https://newsletter.pragmaticengineer.com/p/the-platform-and-program-split-at)
more explicitly and makes the platform's boundaries clearer and easier to
maintain. This is named foundation instead of platform because Python has a
standard library module named `platform` (crying).

Within each second-level directory live packages. All packages contain READMEs
that document their purpose, context, and usage. Though I'm a little lazy with
this so it's not so good right now.

So the directory structure is three-tiered: `service type -> app/foundation -> package`.

## Infrastructure

Infrastructure code is structured similarly. The top level is organized by
what type of infrastructure it is.

- `flake.nix` aggregates all of Nix outputs derivations into a single flake.
- `docker-compose.yaml` defines all services used in the local environment.
- `nix/` contains Nix derivations for our packages and toolchains.
- `.github/` contains the CI configurations.

There isn't much infrastructure yet.

# Developer Port Space

- 40851: Backend
- 40852: Postgres
- 40853: Frontend
- 40854: Ladle
