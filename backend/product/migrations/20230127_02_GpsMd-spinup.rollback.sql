DROP POLICY invites_self_all ON invites;
DROP POLICY users_self_all ON users;
DROP POLICY users_shared_tenant_select ON users;
DROP POLICY tenants_self_all ON tenants;
DROP POLICY users_tenants_self_all ON users_tenants;
DROP TABLE invites;
DROP TABLE users_tenants;
DROP TABLE users;
DROP TABLE tenants;
DROP TYPE user_signup_step;
DROP TYPE tenants_inbound_source;
DROP FUNCTION current_user_id;
DROP FUNCTION current_tenant_id;
DROP FUNCTION updated_at;

-- Don't do these because it breaks tests--users are not per-database, but
-- instead per-host.
-- DROP OWNED BY customer;
-- DROP USER customer;
