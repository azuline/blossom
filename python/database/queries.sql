-- name: OrganizationFetch :one
SELECT *
FROM organizations
WHERE id = $1;

-- name: OrganizationFetchAll :many
SELECT t.*
FROM organizations t
JOIN organizations_users tu ON tu.organization_id = t.id
WHERE tu.user_id = $1;

-- name: OrganizationCreate :one
INSERT INTO organizations (name, inbound_source)
VALUES ($1, $2)
RETURNING *;

-- name: OrganizationUserAdd :one
INSERT INTO organizations_users (organization_id, user_id)
VALUES ($1, $2)
RETURNING *;

-- name: UserFetch :one
SELECT *
FROM users
WHERE id = $1;

-- name: UserCreate :one
INSERT INTO users (name, email, password_hash, signup_step)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: AuthnUserFetchByEmail :one
SELECT *
FROM users
WHERE email = $1;

-- name: AuthnSessionCreate :one
INSERT INTO sessions (user_id, organization_id)
VALUES ($1, $2)
RETURNING *;

-- name: AuthnSessionExpire :exec
UPDATE sessions
SET expired_at = NOW() 
WHERE id = $1;

-- name: AuthnLinkedOrganizationFetch :one
SELECT t.*
FROM organizations t
JOIN organizations_users tu ON tu.organization_id = t.id
WHERE tu.user_id = $1 AND t.id = $2;

-- name: AuthnMostRecentlyAccessedOrganizationFetch :one
SELECT t.*
FROM organizations t
JOIN organizations_users tu ON tu.organization_id = t.id
LEFT JOIN sessions s ON s.organization_id = t.id AND s.user_id = tu.user_id
WHERE tu.user_id = $1
ORDER BY s.last_seen_at DESC NULLS LAST, t.id ASC
LIMIT 1;

-- name: AuthnSessionFetchByUser :one
SELECT *
FROM sessions
WHERE user_id = $1
ORDER BY last_seen_at DESC
LIMIT 1;

-- name: VaultSecretCreate :one
INSERT INTO vaulted_secrets (organization_id, ciphertext)
VALUES ($1, $2)
RETURNING *;

-- name: VaultSecretFetch :one
SELECT *
FROM vaulted_secrets
WHERE id = $1;

-- name: VaultSecretDelete :exec
DELETE
FROM vaulted_secrets
WHERE id = $1;

-- name: RpcUnexpiredSessionFetch :one
SELECT *
FROM sessions
WHERE id = $1
AND expired_at IS NULL
AND last_seen_at > NOW() - '14 days'::INTERVAL;

-- name: PipelineOrganizationIDFetchAll :many
SELECT id FROM organizations ORDER BY id;

--------------------------------------------------------------------------------
---------------------- TESTING QUERIES GO BELOW HERE. --------------------------
--------------------------------------------------------------------------------

-- name: TestUserCreate :one
INSERT INTO users (name, email, password_hash, signup_step, is_enabled)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: TestOrganizationCreate :one
INSERT INTO organizations (name, inbound_source)
VALUES ($1, $2)
RETURNING *;

-- name: TestOrganizationUserCreate :one
INSERT INTO organizations_users (user_id, organization_id)
VALUES ($1, $2)
RETURNING *;

-- name: TestSessionCreate :one
INSERT INTO sessions (user_id, organization_id, expired_at, last_seen_at)
VALUES ($1, $2, $3, $4)
RETURNING *;
