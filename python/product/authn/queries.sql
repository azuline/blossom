-- name: AuthnFetchUserEmail :one
SELECT *
FROM users
WHERE email = $1;

-- name: AuthnCreateSession :one
INSERT INTO sessions (user_id, tenant_id)
VALUES ($1, $2)
RETURNING *;

-- name: AuthnExpireSession :exec
UPDATE sessions
SET expired_at = NOW() 
WHERE external_id = $1;

-- name: AuthnFetchLinkedTenant :one
SELECT t.*
FROM tenants t
JOIN tenants_users tu ON tu.tenant_id = t.id
WHERE tu.user_id = $1 AND t.external_id = $2;

-- name: AuthnFetchMostRecentlyAccessedTenant :one
SELECT t.*
FROM tenants t
JOIN tenants_users tu ON tu.tenant_id = t.id
LEFT JOIN sessions s ON s.tenant_id = t.id AND s.user_id = tu.user_id
WHERE tu.user_id = $1
ORDER BY s.last_seen_at DESC NULLS LAST, t.id ASC
LIMIT 1;

-- name: AuthnFetchSessionByUser :one
SELECT *
FROM sessions
WHERE user_id = $1
ORDER BY last_seen_at DESC
LIMIT 1;
