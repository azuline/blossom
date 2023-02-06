{ pkgs }:

pkgs.writeShellScriptBin "sqlc-py" ''
  #!/usr/bin/env bash

  # This is a wrapper around sqlc that dynamically generates the sqlc config file
  # at runtime. We do this because the config file paths change depending on the
  # queries.sql files in the codebase and because sqlc incorrectly attempts to
  # parse rollback migrations from yoyo.

  # Delete the generated config file before exiting.
  trap "rm sqlc.yaml" EXIT

  # Put the starting config onto disk.
  # We still need to populate queries and schema
  cat <<EOF > sqlc.yaml
  version: '2'
  plugins:
  - name: py
    process:
      cmd: "sqlc-gen-python"
  sql:
  - schema: []
    queries: []
    engine: postgresql
    codegen:
    - plugin: py
      out: codegen/sqlc
      options:
        package: codegen.sqlc
        emit_async_querier: true
  EOF

  # Add queries from around the codebase to queries.
  ${pkgs.fd}/bin/fd --type f queries.sql . \
      | sort \
      | while read -r file; do
    ${pkgs.yq-go}/bin/yq -i ".sql[0].queries += \"''${file}\"" sqlc.yaml
  done

  # Add migration files to migrations, but omit rollback files.
  ${pkgs.fd}/bin/fd --type f ".sql" product/migrations \
      | sort \
      | ${pkgs.ripgrep}/bin/rg -v ".rollback.sql" | while read -r file; do
    ${pkgs.yq-go}/bin/yq -i ".sql[0].schema += \"''${file}\"" sqlc.yaml
  done

  # And finally run sqlc.
  ${pkgs.sqlc}/bin/sqlc "$@"
''
