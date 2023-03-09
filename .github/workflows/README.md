# Github Actions

## Dependency Management

We use Nix to manage dependencies in CI.

## Continuous Deployment

The CD pipeline:

1. Builds a deployable artifact.
2. Uploads the deployable artifact as a Github Release.
3. Connects to the Tailscale VPN.
4. Kicks off a Nomad deployment for the new artifact.
