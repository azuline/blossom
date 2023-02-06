-- name: UserFetch :one
SELECT *
FROM users
WHERE id = $1;

-- name: UserFetchExt :one
SELECT *
FROM users
WHERE external_id = $1;

-- name: UserCreate :exec
INSERT INTO users (name, email, password_hash, signup_step)
VALUES ($1, $2, $3, $4);
