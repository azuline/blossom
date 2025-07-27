-- name: user_fetch :one
SELECT *
FROM users
WHERE id = $1;

-- name: user_create :one
INSERT INTO users (name, email, password_hash, signup_step)
VALUES ($1, $2, $3, $4)
RETURNING *;
