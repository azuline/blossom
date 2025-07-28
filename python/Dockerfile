# https://pythonspeed.com/articles/base-image-python-docker-images/>
FROM ghcr.io/astral-sh/uv:python3.13-bookworm-slim

RUN apt-get -qq update -qq \
  && apt-get -qq install --upgrade --no-install-recommends gcc wget \
  && apt-get -qq clean

RUN mkdir /app
WORKDIR /app

ARG PORT
EXPOSE $PORT

ENV PATH="/app/.venv/bin:$PATH"
ENV UV_COMPILE_BYTECODE=true
ENV UV_NO_CACHE=true

COPY pyproject.toml uv.lock ./
RUN uv sync --no-dev --no-editable --no-install-project

COPY . .
# Wipe base uv image's default entrypoint.
ENTRYPOINT []
