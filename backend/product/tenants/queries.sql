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
