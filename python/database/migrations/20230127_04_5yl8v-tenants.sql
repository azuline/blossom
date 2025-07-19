-- tenants
-- depends: 20230127_03_GpsMd-users

CREATE TABLE tenants_inbound_source_enum (value TEXT PRIMARY KEY);
INSERT INTO tenants_inbound_source_enum (value) VALUES ('outreach'), ('organic'), ('word_of_mouth'), ('referral'), ('unknown');

CREATE TABLE tenants (
    id TEXT COLLATE "C" PRIMARY KEY DEFAULT generate_id('org') CHECK (id LIKE 'org_%'),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    storytime  JSONB,

    name TEXT NOT NULL,
    inbound_source TEXT NOT NULL REFERENCES tenants_inbound_source_enum(value)
);
CREATE TRIGGER updated_at BEFORE UPDATE ON tenants
FOR EACH ROW EXECUTE PROCEDURE updated_at();

ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenants_self_all ON tenants USING (id = current_tenant_id());

CREATE INDEX ON tenants(inbound_source);

CREATE TABLE tenants_users (
    id TEXT COLLATE "C" PRIMARY KEY DEFAULT generate_id('utn') CHECK (id LIKE 'utn_%'),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    storytime  JSONB,

    user_id TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    tenant_id TEXT NOT NULL DEFAULT current_tenant_id() REFERENCES tenants (id) ON DELETE CASCADE,

    -- If this is not null, it means the user was removed from the tenant at this time.
    removed_at TIMESTAMPTZ,
    removed_by_user TEXT REFERENCES users (id) ON DELETE SET NULL
);
CREATE TRIGGER updated_at BEFORE UPDATE ON tenants_users
FOR EACH ROW EXECUTE PROCEDURE updated_at ();

ALTER TABLE tenants_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenants_users_on_tenant_all ON tenants_users USING (tenant_id = current_tenant_id());
CREATE POLICY tenants_users_on_user_all ON tenants_users USING (user_id = current_user_id());

-- A user can have been removed from a tenant and re-added later, but they
-- cannot be added without expiring the previous memberships.
CREATE UNIQUE INDEX ON tenants_users (tenant_id, user_id) WHERE removed_at IS NOT NULL;
CREATE INDEX ON tenants_users (user_id);
CREATE INDEX ON tenants_users (removed_by_user);
CREATE INDEX ON tenants_users (tenant_id);

-- Let users read other users on their tenant.
CREATE POLICY users_shared_tenant_select ON users FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM tenants_users ut
        WHERE ut.tenant_id = current_tenant_id() AND ut.user_id = id
    ));
