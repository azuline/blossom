{ nixpkgs, system }:

import nixpkgs {
  inherit system;
  overlays = [
    (self: super: {
      python = super.python310;
      fail-on-dirty-diff = import ./fail-on-dirty-diff.nix { pkgs = super; };
      sqlc-py = import ./sqlc-py.nix { pkgs = super; };
      sqlc-gen-python = import ./sqlc-gen-python.nix { pkgs = super; };
    })
  ];
}
