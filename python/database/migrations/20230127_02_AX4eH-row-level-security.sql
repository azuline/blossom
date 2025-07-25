-- row-level-security
-- depends: 20230127_01_aQQKb-setup

-- Drawing somewhat from https://www.thenile.dev/blog/multi-organization-rls.
-- Create functions to get current organization and current user. These will be used
-- in upcoming policies.
CREATE FUNCTION current_organization_id()
RETURNS text AS $$
DECLARE
    organization_id text;
BEGIN
    SELECT NULLIF(current_setting('app.current_organization_id', TRUE), '')::text INTO organization_id;
    RETURN organization_id;
END;
$$ LANGUAGE PLPGSQL SECURITY DEFINER;

CREATE FUNCTION current_user_id()
RETURNS text AS $$
DECLARE
    user_id text;
BEGIN
    SELECT NULLIF(current_setting('app.current_user_id', TRUE), '')::text INTO user_id;
    RETURN user_id;
END;
$$ LANGUAGE PLPGSQL SECURITY DEFINER;

-- Create the database user that we will be accessing the database with for all
-- client requests. 
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
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO customer;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO customer;
