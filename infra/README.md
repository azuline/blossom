# Infrastructure

The projects in this directory are:

- [`vpn` (Private Network)](./vpn)
- [`deploys` (Continuous Deployment)](./deploys)

Refer to each project for its feature list.

## Developer Loop

Run `direnv allow` in the project's root directory to bootstrap the developer environment. The infrastructure setup includes:

```bash
$ direnv allow          # Bootstrap Nix development environment
$ docker compose up -d  # Start local infrastructure (Postgres)
```

## Major Dependencies

- Continuous Integration: [Github Actions](https://github.com/features/actions) + [Cachix](https://www.cachix.io/) + [Namespace](https://namespace.so/)
- Data Orchestrator: [Dagster+](https://dagster.io/)
- Database: [Postgres](https://www.postgresql.org/)
- Dependency Management: [Nix](https://nixos.org/)
- Dev Shell: [flake.nix](../flake.nix)
- Error Triage: [Sentry](https://sentry.io/)
- Infrastructure Observability: [Datadog](https://www.datadoghq.com/)
- Product Observability & Feature Flags: [PostHog](https://posthog.com/)
- Public Cloud: [GCP](https://cloud.google.com/)
- Service Orchestrator: [Nomad](https://www.nomadproject.io/) / [GKE](https://cloud.google.com/kubernetes-engine)
- Virtual Private Network: [Tailscale](https://tailscale.com/)

## Developer Environment Setup

1. **Install Nix:** [Instructions](https://docs.determinate.systems/)
2. **Install Direnv:** [Instructions](https://direnv.net/)
3. **Install Docker:** [Linux](https://docs.docker.com/engine/install/) / [MacOS](https://github.com/abiosoft/colima)

## Port Space

Infrastructure services use ports in the `408XX` range:

- 40801: Postgres