-- name: VaultCreateSecret :one
INSERT INTO vaulted_secrets (tenant_id, ciphertext, nonce)
VALUES ($1, $2, $3)
RETURNING *;

-- name: VaultFetchSecret :one
SELECT *
FROM vaulted_secrets
WHERE id = $1;

-- name: VaultDeleteSecret :exec
DELETE
FROM vaulted_secrets
WHERE id = $1;
