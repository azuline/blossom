-- spinup
-- depends: 20230127_02_AX4eH-row-level-security

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

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- Let users do anything to themselves.
CREATE POLICY users_self_all ON users
    USING (id = current_user_id());

-- The invites table holds invitations for users to signup.
--
-- This still functions well even with tenants. When a user is invited to a
-- tenant, the user is created in a `created` signup step, inserted into
-- `users_tenants`, and given an active row in invites. Upon invite completion,
-- the user transitions to a `completed` signup step and has already been added
-- to the tenant.
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

ALTER TABLE invites ENABLE ROW LEVEL SECURITY;
CREATE POLICY invites_self_all ON invites
    USING (user_id = current_user_id());
