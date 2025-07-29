-- organizations
-- depends: 20230127_03_GpsMd-users

CREATE TABLE organizations_inbound_source_enum (value TEXT PRIMARY KEY);
INSERT INTO organizations_inbound_source_enum (value) VALUES ('outreach'), ('organic'), ('word_of_mouth'), ('referral'), ('unknown');

CREATE TABLE organizations (
    id TEXT COLLATE "C" PRIMARY KEY DEFAULT generate_id('org') CHECK (id LIKE 'org\_%'),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    storytime  JSONB,

    name TEXT NOT NULL,
    inbound_source TEXT NOT NULL REFERENCES organizations_inbound_source_enum(value)
);
CREATE TRIGGER updated_at BEFORE UPDATE ON organizations
FOR EACH ROW EXECUTE PROCEDURE updated_at();

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
CREATE POLICY organizations_self_all ON organizations USING (id = current_organization_id());

CREATE INDEX ON organizations(inbound_source);

CREATE TABLE organizations_users (
    id TEXT COLLATE "C" PRIMARY KEY DEFAULT generate_id('utn') CHECK (id LIKE 'utn\_%'),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    storytime  JSONB,

    user_id TEXT COLLATE "C" NOT NULL REFERENCES users(id),
    organization_id TEXT COLLATE "C" NOT NULL DEFAULT current_organization_id() REFERENCES organizations(id),

    -- If this is not null, it means the user was removed from the organization at this time.
    removed_at TIMESTAMPTZ,
    removed_by_user TEXT REFERENCES users(id)
);
CREATE TRIGGER updated_at BEFORE UPDATE ON organizations_users
FOR EACH ROW EXECUTE PROCEDURE updated_at ();

ALTER TABLE organizations_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY organizations_users_on_organization_all ON organizations_users USING (organization_id = current_organization_id());
CREATE POLICY organizations_users_on_user_all ON organizations_users USING (user_id = current_user_id());

-- A user can have been removed from a organization and re-added later, but they
-- cannot be added without expiring the previous memberships.
CREATE UNIQUE INDEX ON organizations_users (organization_id, user_id) WHERE removed_at IS NOT NULL;
CREATE INDEX ON organizations_users (user_id);
CREATE INDEX ON organizations_users (removed_by_user);
CREATE INDEX ON organizations_users (organization_id);

-- Let users read other users on their organization.
CREATE POLICY users_shared_organization_select ON users FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM organizations_users ut
        WHERE ut.organization_id = current_organization_id() AND ut.user_id = id
    ));
