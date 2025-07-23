# Infrastructure

The projects in this directory are:

- [`shell` (Nix Dev Shell)](../flake.nix)
- [`deploy` (Continuous Deployment)](./deploys)
- [`vpn` (Virtual Private Network)](./vpn)

## Deployment Setup

todo, unsure if i want to put nomad homelab in this template or a GCP setup

## Vendors

The vendors that this repository depends on for its infrastructure are:

- Continuous Integration: [Github Actions](https://github.com/features/actions) (+[Namespace](https://namespace.so/))
- Public Cloud: [Google Cloud Platform](https://cloud.google.com/)
- Source Code Management: [Github](https://github.com/)
- Virtual Private Network: [Tailscale](https://tailscale.com/)

TODO: namespace is commented out since GHA is free in the template, grep for `EXTENSION\(namespace\)`.
