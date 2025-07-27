-- name: test_bulk_inserts :copyfrom
INSERT INTO organizations (name, inbound_source) VALUES ($1, $2);

-- name: test_batch_upsert_organizations :batchexec
INSERT INTO organizations (id, name, inbound_source) VALUES ($1, $2, $3) 
ON CONFLICT (id) DO UPDATE SET inbound_source = EXCLUDED.inbound_source;

-- name: test_batch_create_users :batchone
INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id, name, email;

-- name: test_batch_update_user_visited :batchmany
UPDATE users SET last_visited_at = NOW() WHERE name = $1 RETURNING id, name, last_visited_at;
