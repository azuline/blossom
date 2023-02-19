-- name: RpcFetchTenantAssociatedWithUser :one
SELECT * FROM tenants t
WHERE t.external_id = $1
    AND EXISTS (
        SELECT *
        FROM tenants_users tu
        WHERE tu.user_id = $2
            AND tu.tenant_id = t.id
    );
