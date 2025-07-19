CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE OR REPLACE FUNCTION public.b58_encode(num bigint)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE
  -- Sorted in "C" collation order; for this reason ID columns should be collated in C.
  alphabet   TEXT := '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  base_count BIGINT := char_length(alphabet);
  encoded    TEXT;
  divisor    BIGINT;
  mod        BIGINT;
BEGIN
  encoded := '';
  WHILE num >= base_count LOOP
    divisor := num / base_count;
    mod := num % base_count;
    encoded := concat(substring(alphabet FROM mod::INT + 1 FOR 1), encoded);
    num := divisor;
  END LOOP;
  RETURN concat(substring(alphabet FROM num::INT + 1 FOR 1), encoded);
END $function$
;

CREATE OR REPLACE FUNCTION public.current_tenant_id()
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    tenant_id text;
BEGIN
    SELECT NULLIF(current_setting('app.current_tenant_id', TRUE), '')::text INTO tenant_id;
    RETURN tenant_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.current_user_id()
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    user_id text;
BEGIN
    SELECT NULLIF(current_setting('app.current_user_id', TRUE), '')::text INTO user_id;
    RETURN user_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.generate_id(prefix text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE
  -- Milliseconds precision
  c_milli_prec BIGINT := 10^3;
  -- Random component bit length: 12 bits
  c_random_len BIGINT := 2^12;
  -- TSID epoch: seconds since 2000-01-01Z
  -- extract(epoch from '2000-01-01'::date)
  c_tsid_epoch BIGINT := 946684800;
  -- 42 bits
  c_timestamp_component BIGINT := floor((extract('epoch' from now()) - c_tsid_epoch) * c_milli_prec);
  -- 12 bits
  c_random_component BIGINT := floor(random() * c_random_len);
  -- 10 bits
  c_counter_component BIGINT := nextval('generate_id_seq') - 1;
  tsid BIGINT := ((c_timestamp_component << 22) | (c_random_component << 10) | c_counter_component);
BEGIN
  RETURN prefix || '_' || b58_encode(tsid);
END $function$
;

CREATE OR REPLACE FUNCTION public.updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$
;

CREATE TABLE public._yoyo_log (
  id character varying(36) PRIMARY KEY NOT NULL,
  migration_hash character varying(64),
  migration_id character varying(255),
  operation character varying(10),
  username character varying(255),
  hostname character varying(255),
  comment character varying(255),
  created_at_utc timestamp without time zone
);

CREATE TABLE public._yoyo_migration (
  migration_hash character varying(64) PRIMARY KEY NOT NULL,
  migration_id character varying(255),
  applied_at_utc timestamp without time zone
);

CREATE TABLE public._yoyo_version (
  version integer PRIMARY KEY NOT NULL,
  installed_at_utc timestamp without time zone
);

CREATE SEQUENCE public.generate_id_seq;

CREATE TABLE public.invites (
  id text PRIMARY KEY NOT NULL DEFAULT generate_id('inv'::text),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  storytime jsonb,
  user_id text UNIQUE NOT NULL,
  code_hash text NOT NULL,
  expires_at timestamp with time zone NOT NULL DEFAULT (now() + '14 days'::interval),
  accepted_at timestamp with time zone
);

CREATE INDEX invites_user_id_idx1 ON public.invites USING btree (user_id);

ALTER TABLE public.invites
ADD CONSTRAINT invites_id_check
CHECK ((id ~~ 'inv_%'::text));

CREATE TRIGGER updated_at BEFORE UPDATE ON public.invites FOR EACH ROW EXECUTE FUNCTION updated_at();

CREATE TABLE public.users (
  id text PRIMARY KEY NOT NULL DEFAULT generate_id('usr'::text),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  storytime jsonb,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  password_hash text,
  signup_step text NOT NULL DEFAULT 'created'::text,
  is_enabled boolean NOT NULL DEFAULT true,
  last_visited_at timestamp with time zone
);

CREATE INDEX users_signup_step_idx ON public.users USING btree (signup_step);

ALTER TABLE public.users
ADD CONSTRAINT users_check
CHECK (((signup_step = 'created'::text) = (password_hash IS NULL)));

ALTER TABLE public.users
ADD CONSTRAINT users_id_check
CHECK ((id ~~ 'usr_%'::text));

CREATE TRIGGER updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION updated_at();

ALTER TABLE public.invites
ADD CONSTRAINT invites_user_id_fkey
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

CREATE TABLE public.sessions (
  id text PRIMARY KEY NOT NULL DEFAULT generate_id('ses'::text),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  storytime jsonb,
  user_id text NOT NULL,
  tenant_id text,
  last_seen_at timestamp with time zone NOT NULL DEFAULT now(),
  expired_at timestamp with time zone
);

CREATE INDEX sessions_tenant_id_idx ON public.sessions USING btree (tenant_id);

CREATE INDEX sessions_user_id_idx ON public.sessions USING btree (user_id);

ALTER TABLE public.sessions
ADD CONSTRAINT sessions_id_check
CHECK ((id ~~ 'ses_%'::text));

CREATE TRIGGER updated_at BEFORE UPDATE ON public.sessions FOR EACH ROW EXECUTE FUNCTION updated_at();

CREATE TABLE public.tenants (
  id text PRIMARY KEY NOT NULL DEFAULT generate_id('org'::text),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  storytime jsonb,
  name text NOT NULL,
  inbound_source text NOT NULL
);

CREATE INDEX tenants_inbound_source_idx ON public.tenants USING btree (inbound_source);

ALTER TABLE public.tenants
ADD CONSTRAINT tenants_id_check
CHECK ((id ~~ 'org_%'::text));

CREATE TRIGGER updated_at BEFORE UPDATE ON public.tenants FOR EACH ROW EXECUTE FUNCTION updated_at();

ALTER TABLE public.sessions
ADD CONSTRAINT sessions_tenant_id_fkey
FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;

ALTER TABLE public.sessions
ADD CONSTRAINT sessions_user_id_fkey
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

CREATE TABLE public.tenants_inbound_source_enum (
  value text PRIMARY KEY NOT NULL
);

ALTER TABLE public.tenants
ADD CONSTRAINT tenants_inbound_source_fkey
FOREIGN KEY (inbound_source) REFERENCES tenants_inbound_source_enum(value);

CREATE TABLE public.tenants_users (
  id text PRIMARY KEY NOT NULL DEFAULT generate_id('utn'::text),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  storytime jsonb,
  user_id text NOT NULL,
  tenant_id text NOT NULL DEFAULT current_tenant_id(),
  removed_at timestamp with time zone,
  removed_by_user text
);

CREATE INDEX tenants_users_removed_by_user_idx ON public.tenants_users USING btree (removed_by_user);

CREATE INDEX tenants_users_tenant_id_idx ON public.tenants_users USING btree (tenant_id);

CREATE UNIQUE INDEX tenants_users_tenant_id_user_id_idx ON public.tenants_users USING btree (tenant_id, user_id) WHERE (removed_at IS NOT NULL);

CREATE INDEX tenants_users_user_id_idx ON public.tenants_users USING btree (user_id);

ALTER TABLE public.tenants_users
ADD CONSTRAINT tenants_users_id_check
CHECK ((id ~~ 'utn_%'::text));

CREATE TRIGGER updated_at BEFORE UPDATE ON public.tenants_users FOR EACH ROW EXECUTE FUNCTION updated_at();

ALTER TABLE public.tenants_users
ADD CONSTRAINT tenants_users_removed_by_user_fkey
FOREIGN KEY (removed_by_user) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE public.tenants_users
ADD CONSTRAINT tenants_users_tenant_id_fkey
FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;

ALTER TABLE public.tenants_users
ADD CONSTRAINT tenants_users_user_id_fkey
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

CREATE TABLE public.user_signup_step_enum (
  value text PRIMARY KEY NOT NULL
);

ALTER TABLE public.users
ADD CONSTRAINT users_signup_step_fkey
FOREIGN KEY (signup_step) REFERENCES user_signup_step_enum(value);

CREATE TABLE public.vaulted_secrets (
  id text PRIMARY KEY NOT NULL DEFAULT generate_id('vsc'::text),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  storytime jsonb,
  tenant_id text NOT NULL,
  ciphertext text NOT NULL
);

CREATE INDEX vaulted_secrets_tenant_id_idx ON public.vaulted_secrets USING btree (tenant_id);

ALTER TABLE public.vaulted_secrets
ADD CONSTRAINT vaulted_secrets_id_check
CHECK ((id ~~ 'vsc_%'::text));

CREATE TRIGGER updated_at BEFORE UPDATE ON public.vaulted_secrets FOR EACH ROW EXECUTE FUNCTION updated_at();

ALTER TABLE public.vaulted_secrets
ADD CONSTRAINT vaulted_secrets_tenant_id_fkey
FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;

CREATE TABLE public.yoyo_lock (
  locked integer PRIMARY KEY NOT NULL DEFAULT 1,
  ctime timestamp without time zone,
  pid integer NOT NULL
);
