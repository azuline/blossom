-- name: vault_secret_create :one
INSERT INTO vaulted_secrets (organization_id, ciphertext)
VALUES ($1, $2)
RETURNING *;

-- name: vault_secret_fetch :one
SELECT *
FROM vaulted_secrets
WHERE id = $1;

-- name: vault_secret_delete :exec
DELETE
FROM vaulted_secrets
WHERE id = $1;