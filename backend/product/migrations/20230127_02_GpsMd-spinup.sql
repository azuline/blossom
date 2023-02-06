-- spinup
-- depends: 20230127_01_aQQKb-nanoid

CREATE FUNCTION updated_at() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE PLPGSQL;

-- Drawing somewhat from https://www.thenile.dev/blog/multi-tenant-rls.
-- Create functions to get current tenant and current user. These will be used
-- in upcoming policies.
CREATE FUNCTION current_tenant_id()
RETURNS bigint AS $$
DECLARE
    tenant_id bigint;
BEGIN
    SELECT NULLIF(current_setting('app.current_tenant_id', TRUE), '')::bigint INTO tenant_id;
    RETURN tenant_id;
END;
$$ LANGUAGE PLPGSQL SECURITY DEFINER;

CREATE FUNCTION current_user_id()
RETURNS bigint AS $$
DECLARE
    user_id bigint;
BEGIN
    SELECT NULLIF(current_setting('app.current_user_id', TRUE), '')::bigint INTO user_id;
    RETURN user_id;
END;
$$ LANGUAGE PLPGSQL SECURITY DEFINER;

-- End the boilerplate definitions. Start the real table definitions.
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

CREATE TYPE user_signup_step AS ENUM (
    'created',
    'complete'
);

CREATE TABLE users (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    external_id text NOT NULL UNIQUE DEFAULT generate_external_id('usr'),
    created_at timestamptz NOT NULL DEFAULT NOW(),
    updated_at timestamptz NOT NULL DEFAULT NOW(),

    name text NOT NULL,
    email text UNIQUE NOT NULL,
    -- This is going to be a hex value. It is null if a user's signup_step is
    -- `created`.
    password_hash text,
    -- When a user is invited, they are `created` with an invite attached to
    -- them. Only when a user finishes signing up do they switch to `complete`.
    signup_step user_signup_step NOT NULL DEFAULT 'created',
    -- Whether or not they can access the product. Generally, this is meant to
    -- be used to remove access from product.users that violate an internal policy or
    -- have nefarious intents.
    is_enabled boolean NOT NULL DEFAULT TRUE,
    last_visited_at timestamptz,
    CHECK ((signup_step = 'created') = (password_hash IS NULL))
);
CREATE TRIGGER updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE PROCEDURE updated_at();

CREATE TABLE users_tenants (
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
CREATE TRIGGER updated_at BEFORE UPDATE ON users_tenants
FOR EACH ROW EXECUTE PROCEDURE updated_at ();
-- A user can have been removed from a tenant and re-added later, but they
-- cannot be added without expiring the previous memberships.
CREATE UNIQUE INDEX users_tenants_membership ON users_tenants (tenant_id, user_id)
    WHERE removed_at IS NOT NULL;
-- The inverse index so that user->tenant lookups are performant.
CREATE INDEX users_tenants_user_id ON users_tenants (user_id);

-- Index the foreign keys to remove a bad access pattern footgun.
CREATE INDEX users_tenants_removed_by_user_idx ON users_tenants (removed_by_user);
CREATE INDEX users_tenants_tenant_id_idx ON users_tenants (tenant_id);

CREATE TABLE invites (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    external_id text NOT NULL UNIQUE DEFAULT generate_external_id('inv'),
    created_at timestamptz NOT NULL DEFAULT NOW(),
    updated_at timestamptz NOT NULL DEFAULT NOW(),

    user_id bigint NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    -- This is going to be a hex value.
    code_hash text NOT NULL,
    -- If this time is in the past, it means the invite has expired.
    -- Do a 14 day expiration window because this is a SaaS and I personally
    -- take _forever_ to sign up for a SaaS.
    expires_at timestamptz NOT NULL DEFAULT NOW() + interval '14 days',
    -- If this is not null, it means this invite was accepted.
    accepted_at timestamptz
);
CREATE TRIGGER updated_at BEFORE UPDATE ON invites
FOR EACH ROW EXECUTE PROCEDURE updated_at();
-- One user can only accept one invite maximum.
CREATE UNIQUE INDEX invites_one_accepted_per_user ON invites (user_id)
    WHERE accepted_at IS NOT NULL;
-- For ease of looking up invites associated with a user.
CREATE INDEX invites_user_id ON invites (user_id);

-- Now enable row level security for our tables!

ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
-- Let tenants modify themselves.
CREATE POLICY tenants_self_all ON tenants
    USING (id = current_tenant_id());

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- Let users do anything to themselves.
CREATE POLICY users_self_all ON users
    USING (id = current_user_id());
-- Let users read other users on their tenant.
CREATE POLICY users_shared_tenant_select ON users FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM users_tenants ut
        WHERE ut.tenant_id = current_tenant_id()
            AND ut.user_id = id
    ));

ALTER TABLE users_tenants ENABLE ROW LEVEL SECURITY;
CREATE POLICY users_tenants_self_all ON users_tenants
    USING (tenant_id = current_tenant_id());

ALTER TABLE invites ENABLE ROW LEVEL SECURITY;
CREATE POLICY invites_self_all ON invites
    USING (user_id = current_user_id());

-- Create the database users that we will be accessing the database with for
-- all client requests. 
--
-- Because users are global in a database cluster (and not only within a
-- database), we only create the users if they do not already exist in the
-- database. This allows us to run the migrations in our tests.
DO
$$
BEGIN
    IF EXISTS (
        SELECT FROM pg_catalog.pg_user
        WHERE usename = 'customer'
     ) THEN
        RAISE NOTICE 'User "customer" already exists. Skipping.';
    ELSE
        BEGIN   -- nested block
            CREATE USER customer;
        EXCEPTION
            WHEN duplicate_object THEN
                RAISE NOTICE 'User "customer" was just created by a concurrent transaction. Skipping.';
        END;
    END IF;
END
$$;

-- And grant the user privileges in this database.
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO customer;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO customer;
