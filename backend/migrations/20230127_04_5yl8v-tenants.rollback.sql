DROP POLICY users_shared_tenant_select ON users;
DROP POLICY tenants_self_all ON tenants;
DROP POLICY tenants_users_on_tenant_all ON tenants_users;
DROP POLICY tenants_users_on_user_all ON tenants_users;
DROP TABLE tenants_users;
DROP TABLE tenants;
DROP TYPE tenants_inbound_source;
