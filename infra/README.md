# Infrastructure

The projects in this directory are:

- [`shell` (Nix Dev Shell)](../flake.nix)
- [`deploys` (Continuous Deployment)](./deploys)
- [`vpn` (Virtual Private Network)](./vpn)

## Deployment Setup

todo, unsure if i want to put nomad homelab in this template or a GCP setup

## Vendors

The vendors that this repository depends on for its infrastructure are:

- Continuous Integration: [Github Actions](https://github.com/features/actions) (+[Namespace](https://namespace.so/))
- Data Orchestrator: [Dagster+](https://dagster.io/)
- Database: [PostgreSQL](https://www.postgresql.org/)
- Email Sending: [Postmark](https://postmarkapp.com/)
- Error Triage: [Sentry](https://sentry.io/)
- Infrastructure Observability: [Datadog](https://www.datadoghq.com/)
- Large Language Model: [OpenAI](https://openai.com/)
- Product Observability & Feature Flags: [PostHog](https://posthog.com/)
- Public Cloud: [Google Cloud Platform](https://cloud.google.com/)
- Source Code Management: [Github](https://github.com/)
- Virtual Private Network: [Tailscale](https://tailscale.com/)

Most of the paid vendors are optional or have substitutes; in my personal projects I deploy to my
home tailnet and Nomad cluster without most of the observability tooling.

TODO: namespace is commented out since GHA is free in the template, grep for `EXTENSION\(namespace\)`.
