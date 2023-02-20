{ pkgs, poetry2nix }:

{
  backend = import ./backend.nix { inherit pkgs poetry2nix; };
}
