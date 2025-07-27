-- name: organization_fetch :one
SELECT *
FROM organizations
WHERE id = $1;

-- name: organization_fetch_all :many
SELECT t.*
FROM organizations t
JOIN organizations_users tu ON tu.organization_id = t.id
WHERE tu.user_id = $1;

-- name: organization_create :one
INSERT INTO organizations (name, inbound_source)
VALUES ($1, $2)
RETURNING *;

-- name: organization_user_add :one
INSERT INTO organizations_users (organization_id, user_id)
VALUES ($1, $2)
RETURNING *;

-- name: user_fetch :one
SELECT *
FROM users
WHERE id = $1;

-- name: user_create :one
INSERT INTO users (name, email, password_hash, signup_step)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: authn_user_fetch_by_email :one
SELECT *
FROM users
WHERE email = $1;

-- name: authn_session_create :one
INSERT INTO sessions (user_id, organization_id)
VALUES ($1, $2)
RETURNING *;

-- name: authn_session_expire :exec
UPDATE sessions
SET expired_at = NOW() 
WHERE id = $1;

-- name: authn_linked_organization_fetch :one
SELECT t.*
FROM organizations t
JOIN organizations_users tu ON tu.organization_id = t.id
WHERE tu.user_id = $1 AND t.id = $2;

-- name: authn_most_recently_accessed_organization_fetch :one
SELECT t.*
FROM organizations t
JOIN organizations_users tu ON tu.organization_id = t.id
LEFT JOIN sessions s ON s.organization_id = t.id AND s.user_id = tu.user_id
WHERE tu.user_id = $1
ORDER BY s.last_seen_at DESC NULLS LAST, t.id ASC
LIMIT 1;

-- name: authn_session_fetch_by_user :one
SELECT *
FROM sessions
WHERE user_id = $1
ORDER BY last_seen_at DESC
LIMIT 1;

-- name: vault_secret_create :one
INSERT INTO vaulted_secrets (organization_id, ciphertext)
VALUES ($1, $2)
RETURNING *;

-- name: vault_secret_fetch :one
SELECT *
FROM vaulted_secrets
WHERE id = $1;

-- name: vault_secret_delete :exec
DELETE
FROM vaulted_secrets
WHERE id = $1;

-- name: rpc_unexpired_session_fetch :one
SELECT *
FROM sessions
WHERE id = $1
AND expired_at IS NULL
AND last_seen_at > NOW() - '14 days'::INTERVAL;

-- name: pipeline_organization_id_fetch_all :many
SELECT id FROM organizations ORDER BY id;

--------------------------------------------------------------------------------
---------------------- TESTING QUERIES GO BELOW HERE. --------------------------
--------------------------------------------------------------------------------

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
