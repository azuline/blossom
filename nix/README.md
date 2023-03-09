# nix

We use [Nix](https://nixos.org/) for package management, developer
environments, and builds.

# Directories

- [`builds`](./builds) contains Nix derivations for building our services.
- [`pkgs`](./pkgs) exports an overlaid `nixpkgs` with custom packages and overrides.
- [`toolchains`](./toolchains) bundle together sets of packages into distinct toolchains.
