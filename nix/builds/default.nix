{ pkgs }:

{
  backend = import ./backend.nix { inherit pkgs; };
}
