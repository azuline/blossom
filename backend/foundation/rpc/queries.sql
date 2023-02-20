-- name: RpcFetchUnexpiredSession :one
SELECT *
FROM sessions
WHERE external_id = $1
AND expired_at IS NULL
AND last_seen_at > NOW() - '14 days'::INTERVAL;
