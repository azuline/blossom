-- name: RpcFetchTenantAssociatedWithUser :one
SELECT * FROM tenants t
WHERE t.external_id = $1
    AND EXISTS (
        SELECT *
        FROM users_tenants ut
        WHERE ut.user_id = $2
            AND ut.tenant_id = t.id
    );
