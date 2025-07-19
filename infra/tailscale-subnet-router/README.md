# Tailscale Subnet Router

For deployments onto PaaS like Render, Railway, etc., we deploy a subnet router in order to make
their private services accessible to users. This directory contains a Dockerfile for deploying the
subnet router. Tailscale Split DNS routing can be set up to route to PaaS internal URLs.

For deployments onto more mature infrastructure offerings, Tailscale should be run in a pod sidecar
and the subnet router elided.

The following environment variables should be set for the subnet router:

- `TAILSCALE_VERSION`
- `TAILSCALE_AUTHKEY`
- `ADVERTISE_ROUTES` (CIDR range)
