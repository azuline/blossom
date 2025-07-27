-- name: test_bulk_inserts :copyfrom
INSERT INTO organizations (name, inbound_source) VALUES ($1, $2);
