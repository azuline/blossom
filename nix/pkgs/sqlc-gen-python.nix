{ pkgs }:

let
  module = pkgs.buildGoModule {
    pname = "sqlc-gen-python";
    version = "1.0.0";
    src = pkgs.fetchFromGitHub {
      owner = "azuline";
      repo = "sqlc-gen-python";
      rev = "6ff33dbf7603b5646bf288161fed47a1432cdb57";
      sha256 = "sha256-f/mgrWdpkZjAI5MpmuHdcT6R2XspLKqPvTdvpz3tY5c=";
    };
    vendorSha256 = "sha256-fXmdjclFzxhv5EhP1OYi9Ek0ZrSGt6ETsLrka+N4M1c=";
  };
in
pkgs.writeShellScriptBin "sqlc-gen-python" ''
  #!/usr/bin/env sh
  ${module}/bin/plugin
''
