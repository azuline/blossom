-- name: test_user_create :one
INSERT INTO users (name, email, password_hash, signup_step, is_enabled)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: test_organization_create :one
INSERT INTO organizations (name, inbound_source)
VALUES ($1, $2)
RETURNING *;

-- name: test_organization_user_create :one
INSERT INTO organizations_users (user_id, organization_id)
VALUES ($1, $2)
RETURNING *;

-- name: test_session_create :one
INSERT INTO sessions (user_id, organization_id, expired_at, last_seen_at)
VALUES ($1, $2, $3, $4)
RETURNING *;
