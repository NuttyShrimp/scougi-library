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
          packages = [ nodejs nodePackages.pnpm nodePackages.prisma cairo pango libpng pkg-config librsvg];
          env = [
            # {
            #   name = "PRISMA_MIGRATION_ENGINE_BINARY";
            #   value = "${prisma-engines}/bin/migration-engine";
            # }
            {
              name = "PRISMA_QUERY_ENGINE_BINARY";
              value = "${prisma-engines}/bin/query_engine";
            }
            {
              name = "PRISMA_QUERY_ENGINE_LIBRARY";
              value = "${prisma-engines}/lib/libquery_engine.node";
            }
            # {
            #   name = "PRISMA_INTROSPECTION_ENGINE_BINARY";
            #   value = "${prisma-engines}/bin/introspection-engine";
            # }
            # {
            #   name = "PRISMA_FMT_BINARY";
            #   value = "${prisma-engines}/bin/prisma-fmt";
            # }
            {
              name = "PRISMA_SCHEMA_ENGINE_BINARY";
              value = "${pkgs.prisma-engines}/bin/schema-engine";
            }
          ];
        };
      }
    );
}
