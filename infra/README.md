# Infrastructure

The projects in this directory are:

- [`shell` (Nix Dev Shell)](../shell)
- [`deploy` (Continuous Deployment)](./deploy)
- [`vpn` (Virtual Private Network)](./vpn)

## Deployment Setup

### Enterprise (TODO)

- Terraform + GCP
- Setup:
  - `$ just install`
  - `$ gcloud auth application-default login`
  - `$ cp gcp/terraform.tfvars{.example,}`
  - `$ cd gcp && terraform ...`
- Dev Loop:
  - `$ just lint`

### Hobbyist (TODO)

- Homelab: Nomad + NixOS

## Vendors

The vendors that this repository depends on for its infrastructure are:

- Continuous Integration: [Github Actions](https://github.com/features/actions) (+[Namespace](https://namespace.so/))
- Public Cloud: [Google Cloud Platform](https://cloud.google.com/)
- Source Code Management: [Github](https://github.com/)
- Virtual Private Network: [Tailscale](https://tailscale.com/)

TODO: namespace is commented out since GHA is free in the template, grep for `EXTENSION\(namespace\)`.
