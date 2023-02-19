-- tenants
-- depends: 20230127_03_GpsMd-users

CREATE TYPE tenants_inbound_source AS ENUM (
    'outreach',
    'organic',
    'word_of_mouth',
    'referral',
    'unknown'
);

CREATE TABLE tenants (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    external_id text NOT NULL UNIQUE DEFAULT generate_external_id('ten'),
    created_at timestamptz NOT NULL DEFAULT NOW(),
    updated_at timestamptz NOT NULL DEFAULT NOW(),

    name text NOT NULL,
    inbound_source tenants_inbound_source NOT NULL
);
CREATE TRIGGER updated_at BEFORE UPDATE ON tenants
FOR EACH ROW EXECUTE PROCEDURE updated_at();

ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
-- Let tenants modify themselves.
CREATE POLICY tenants_self_all ON tenants
    USING (id = current_tenant_id());

CREATE TABLE tenants_users (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    external_id text NOT NULL UNIQUE DEFAULT generate_external_id('utn'),
    created_at timestamptz NOT NULL DEFAULT NOW(),
    updated_at timestamptz NOT NULL DEFAULT NOW(),

    user_id bigint NOT NULL REFERENCES users (id),
    tenant_id bigint NOT NULL DEFAULT current_tenant_id() REFERENCES tenants (id) ON DELETE CASCADE,

    -- If this is not null, it means the user was removed from the tenant at
    -- this time.
    removed_at timestamptz,
    removed_by_user bigint REFERENCES users (id)
);
CREATE TRIGGER updated_at BEFORE UPDATE ON tenants_users
FOR EACH ROW EXECUTE PROCEDURE updated_at ();
-- A user can have been removed from a tenant and re-added later, but they
-- cannot be added without expiring the previous memberships.
CREATE UNIQUE INDEX tenants_users_membership ON tenants_users (tenant_id, user_id)
    WHERE removed_at IS NOT NULL;
-- The inverse index so that user->tenant lookups are performant.
CREATE INDEX tenants_users_user_id ON tenants_users (user_id);

-- Index the foreign keys to remove a bad access pattern footgun.
CREATE INDEX tenants_users_removed_by_user_idx ON tenants_users (removed_by_user);
CREATE INDEX tenants_users_tenant_id_idx ON tenants_users (tenant_id);

ALTER TABLE tenants_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenants_users_self_all ON tenants_users
    USING (tenant_id = current_tenant_id());

-- Let users read other users on their tenant.
CREATE POLICY users_shared_tenant_select ON users FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM tenants_users ut
        WHERE ut.tenant_id = current_tenant_id()
            AND ut.user_id = id
    ));
