-- spinup
-- depends: 20230127_02_AX4eH-row-level-security

CREATE TABLE user_signup_step_enum (value TEXT PRIMARY KEY);
INSERT INTO user_signup_step_enum (value) VALUES ('created'), ('complete');

CREATE TABLE users (
    id TEXT COLLATE "C" PRIMARY KEY DEFAULT generate_id('usr') CHECK (id LIKE 'usr\_%'),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    storytime  JSONB,

    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    -- This is a hex value. It is null if a user's signup_step is `created`.
    password_hash TEXT,
    -- When a user is invited, they are `created` with an invite attached to
    -- them. Only when a user finishes signing up do they switch to `complete`.
    signup_step TEXT NOT NULL REFERENCES user_signup_step_enum(value) DEFAULT 'created',
    -- Whether or not they can access the product. Generally, this is meant to
    -- be used to remove access from product.users that violate an internal policy or
    -- have nefarious intents.
    is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    last_visited_at TIMESTAMPTZ,
    CHECK ((signup_step = 'created') = (password_hash IS NULL))
);
CREATE TRIGGER updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE PROCEDURE updated_at();

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY users_self_all ON users USING (id = current_user_id());

CREATE INDEX ON users(signup_step);

-- The invites table holds invitations for users to signup.
--
-- When a user is invited to a organization, the user is created in a `created`
-- signup step, inserted into `organizations_users`, and given an active row in
-- invites. Upon invite completion, the user transitions to a `completed`
-- signup step and has already been added to the organization.
CREATE TABLE invites (
    id TEXT COLLATE "C" PRIMARY KEY DEFAULT generate_id('inv') CHECK (id LIKE 'inv\_%'),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    storytime  JSONB,

    user_id TEXT COLLATE "C" NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    -- This is going to be a hex value.
    code_hash TEXT NOT NULL,
    -- If this time is in the past, it means the invite has expired.
    -- Do a 14 day expiration window because this is a SaaS and I personally
    -- take _forever_ to sign up for a SaaS.
    expires_at TIMESTAMPTZ NOT NULL DEFAULT now() + interval '14 days',
    -- If this is not null, it means this invite was accepted.
    accepted_at TIMESTAMPTZ
);
CREATE TRIGGER updated_at BEFORE UPDATE ON invites
FOR EACH ROW EXECUTE PROCEDURE updated_at();

ALTER TABLE invites ENABLE ROW LEVEL SECURITY;
CREATE POLICY invites_self_all ON invites USING (user_id = current_user_id());

-- One user can only accept one invite maximum.
CREATE UNIQUE INDEX ON invites (user_id) WHERE accepted_at IS NOT NULL;
CREATE INDEX ON invites (user_id);
