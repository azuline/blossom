-- name: organization_fetch :one
SELECT *
FROM organizations
WHERE id = $1;

-- name: organization_create :one
INSERT INTO organizations (name, inbound_source)
VALUES ($1, $2)
RETURNING *;

-- name: organization_user_add :one
INSERT INTO organizations_users (organization_id, user_id)
VALUES ($1, $2)
RETURNING *;

-- name: organization_fetch_all :many
SELECT t.*
FROM organizations t
JOIN organizations_users tu ON tu.organization_id = t.id
WHERE tu.user_id = $1;
