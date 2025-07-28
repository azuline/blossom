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