#!/usr/bin/env bash
set -euxo pipefail
/app/tailscaled --tun=userspace-networking --socks5-server=localhost:1055 &
pid=$!
until /app/tailscale up --authkey="${TAILSCALE_AUTHKEY}" --advertise-routes="$ADVERTISE_ROUTES"; do sleep 0.1; done
export ALL_PROXY=socks5://localhost:1055/
echo "Tailscale is up at IP $(/app/tailscale ip)"
wait ${pid}
