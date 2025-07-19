#!/usr/bin/env bash
set -euxo pipefail
ts_file=tailscale_${TAILSCALE_VERSION}_amd64.tgz
wget -q "https://pkgs.tailscale.com/stable/${ts_file}" 
tar xzf "${ts_file}" --strip-components=1 # tailscale and tailscaled
mkdir -p /var/run/tailscale /var/cache/tailscale /var/lib/tailscale
