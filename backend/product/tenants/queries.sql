-- name: TenantFetch :one
SELECT *
FROM tenants
WHERE id = $1;

-- name: TenantFetchExt :one
SELECT *
FROM tenants
WHERE external_id = $1;

-- name: TenantFetchAll :many
SELECT *
FROM tenants;

-- name: TenantCreate :one
INSERT INTO tenants (name, inbound_source)
VALUES ($1, $2)
RETURNING *;

-- name: TenantAddUser :one
INSERT INTO tenants_users (tenant_id, user_id)
VALUES ($1, $2)
RETURNING *;
