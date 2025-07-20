FROM debian:latest
WORKDIR /app

RUN apt-get -qq update \
  && apt-get -qq install --upgrade -y --no-install-recommends apt-transport-https ca-certificates netcat-openbsd wget dnsutils >/dev/null \
  && apt-get -qq clean

ARG TAILSCALE_VERSION
ENV TAILSCALE_VERSION=$TAILSCALE_VERSION

COPY run-tailscale.sh .
COPY install-tailscale.sh /tmp
RUN /tmp/install-tailscale.sh && rm /tmp/install_tailscale.sh
CMD ./run-tailscale.sh
