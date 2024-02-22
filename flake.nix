{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    devshell = {
      url = "github:numtide/devshell";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { flake-utils, nixpkgs, devshell, ... }:
    flake-utils.lib.eachDefaultSystem (system: 
      let
        pkgs = import nixpkgs {
          inherit system;

          overlays = [ devshell.overlays.default ];
        };
      in
      with pkgs; {
        devShells.default = pkgs.devshell.mkShell {
          packages = [ nodejs nodePackages.pnpm cairo pango libpng pkg-config librsvg];
        };
      }
    );
}
