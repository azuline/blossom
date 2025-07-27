-- name: rpc_unexpired_session_fetch :one
SELECT *
FROM sessions
WHERE id = $1
AND expired_at IS NULL
AND last_seen_at > NOW() - '14 days'::INTERVAL;