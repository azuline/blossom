#!/usr/bin/env bash
set -euxo pipefail
/render/tailscaled --tun=userspace-networking --socks5-server=localhost:1055 &
pid=$!
until /render/tailscale up --authkey="${TAILSCALE_AUTHKEY}" --advertise-routes="$ADVERTISE_ROUTES"; do sleep 0.1; done
export ALL_PROXY=socks5://localhost:1055/
echo "Tailscale is up at IP $(/render/tailscale ip)"
wait ${pid}
