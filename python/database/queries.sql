-- name: TenantFetch :one
SELECT *
FROM tenants
WHERE id = $1;

-- name: TenantFetchAll :many
SELECT t.*
FROM tenants t
JOIN tenants_users tu ON tu.tenant_id = t.id
WHERE tu.user_id = $1;

-- name: TenantCreate :one
INSERT INTO tenants (name, inbound_source)
VALUES ($1, $2)
RETURNING *;

-- name: TenantAddUser :one
INSERT INTO tenants_users (tenant_id, user_id)
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
INSERT INTO sessions (user_id, tenant_id)
VALUES ($1, $2)
RETURNING *;

-- name: AuthnSessionExpire :exec
UPDATE sessions
SET expired_at = NOW() 
WHERE external_id = $1;

-- name: AuthnLinkedTenantFetch :one
SELECT t.*
FROM tenants t
JOIN tenants_users tu ON tu.tenant_id = t.id
WHERE tu.user_id = $1 AND t.external_id = $2;

-- name: AuthnMostRecentlyAccessedTenantFetch :one
SELECT t.*
FROM tenants t
JOIN tenants_users tu ON tu.tenant_id = t.id
LEFT JOIN sessions s ON s.tenant_id = t.id AND s.user_id = tu.user_id
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
INSERT INTO vaulted_secrets (tenant_id, ciphertext, nonce)
VALUES ($1, $2, $3)
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
WHERE external_id = $1
AND expired_at IS NULL
AND last_seen_at > NOW() - '14 days'::INTERVAL;

--------------------------------------------------------------------------------
---------------------- TESTING QUERIES GO BELOW HERE. --------------------------
--------------------------------------------------------------------------------

-- name: TestUserCreate :one
INSERT INTO users (name, email, password_hash, signup_step, is_enabled)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: TestTenantCreate :one
INSERT INTO tenants (name, inbound_source)
VALUES ($1, $2)
RETURNING *;

-- name: TestTenantUserCreate :one
INSERT INTO tenants_users (user_id, tenant_id)
VALUES ($1, $2)
RETURNING *;

-- name: TestSessionCreate :one
INSERT INTO sessions (user_id, tenant_id, expired_at, last_seen_at)
VALUES ($1, $2, $3, $4)
RETURNING *;
