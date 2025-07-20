# Infrastructure

The projects in this directory are:

- [`shell` (Nix Dev Shell)](../flake.nix)
- [`workflows` (Continuous Integration)](../.github/workflows)
- [`deploys` (Continuous Deployment)](./deploys)
- [`vpn` (Virtual Private Network)](./vpn)

## Deployment Setup

todo, unsure if i want to put nomad homelab in this template or a GCP setup

## Vendors

The vendors that this repository depends on for its infrastructure are:

- Continuous Integration: Github Actions (+Cachix) (+Namespace)
- Data Orchestrator: Dagster+
- Database: PostgreSQL
- Email Sending: Postmark
- Error Triage: Sentry
- Infrastructure Observability: Datadog
- Large Language Model: OpenAI
- Product Observability & Feature Flags: PostHog
- Public Cloud: Google Cloud Platform
- Source Code Management: Github
- Virtual Private Network: Tailscale

Most of the paid vendors are optional or have substitutes; in my personal projects I deploy to my
home tailnet and Nomad cluster without most of the observability tooling.
