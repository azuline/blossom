-- name: TestUserCreate :one
INSERT INTO users (name, email, password_hash, signup_step)
VALUES ($1, $2, $3, 'complete')
RETURNING *;

-- name: TestUserCreateNotSignedUp :one
INSERT INTO users (name, email)
VALUES ($1, $2)
RETURNING *;

-- name: TestUserCreateDisabled :one
INSERT INTO users (name, email, password_hash, signup_step, is_enabled)
VALUES ($1, $2, $3, 'complete', false)
RETURNING *;

-- name: TestTenantCreate :one
INSERT INTO tenants (name, inbound_source)
VALUES ($1, $2)
RETURNING *;

-- name: TestTenantUserCreate :one
INSERT INTO tenants_users (user_id, tenant_id)
VALUES ($1, $2)
RETURNING *;
