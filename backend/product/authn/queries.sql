-- name: AuthnFetchUserEmail :one
SELECT * FROM users
WHERE email = $1;
