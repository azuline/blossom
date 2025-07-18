CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE public.tenants_inbound_source AS ENUM (
	'outreach',
	'organic',
	'word_of_mouth',
	'referral',
	'unknown'
);

CREATE TYPE public.user_signup_step AS ENUM (
	'created',
	'complete'
);

CREATE OR REPLACE FUNCTION public.current_tenant_id()
 RETURNS bigint
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    tenant_id bigint;
BEGIN
    SELECT NULLIF(current_setting('app.current_tenant_id', TRUE), '')::bigint INTO tenant_id;
    RETURN tenant_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.current_user_id()
 RETURNS bigint
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    user_id bigint;
BEGIN
    SELECT NULLIF(current_setting('app.current_user_id', TRUE), '')::bigint INTO user_id;
    RETURN user_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.generate_external_id(prefix text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE
    -- With a size of 16 and this alphabet, we have 456 years @ 100k IDs
    -- generated per hour until we have a 1% probability of at least 1
    -- collision, per https://zelark.github.io/nano-id-cc/.
    size          int  := 16;
    alphabet      text := '0123456789abcdefghijklmnopqrstuvwxyz';
    idBuilder     text := '';
    i             int  := 0;
    bytes         bytea;
    alphabetIndex int;
    mask          int;
    step          int;
BEGIN
    mask := (2 << cast(floor(log(length(alphabet) - 1) / log(2)) as int)) - 1;
    step := cast(ceil(1.6 * mask * size / length(alphabet)) AS int);

    while true
        loop
            bytes := gen_random_bytes(size);
            while i < size
                loop
                    alphabetIndex := (get_byte(bytes, i) & mask) + 1;
                    if alphabetIndex <= length(alphabet) then
                        idBuilder := idBuilder || substr(alphabet, alphabetIndex, 1);
                        if length(idBuilder) = size then
                            return prefix || '_' || idBuilder;
                        end if;
                    end if;
                    i = i + 1;
                end loop;

            i := 0;
        end loop;
END
$function$
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

CREATE TABLE public.invites (
  id bigint PRIMARY KEY NOT NULL GENERATED ALWAYS AS IDENTITY,
  external_id text UNIQUE NOT NULL DEFAULT generate_external_id('inv'::text),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id bigint UNIQUE NOT NULL,
  code_hash text NOT NULL,
  expires_at timestamp with time zone NOT NULL DEFAULT (now() + '14 days'::interval),
  accepted_at timestamp with time zone
);

CREATE INDEX invites_user_id ON public.invites USING btree (user_id);

CREATE TRIGGER updated_at BEFORE UPDATE ON public.invites FOR EACH ROW EXECUTE FUNCTION updated_at();

CREATE TABLE public.users (
  id bigint PRIMARY KEY NOT NULL GENERATED ALWAYS AS IDENTITY,
  external_id text UNIQUE NOT NULL DEFAULT generate_external_id('usr'::text),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  password_hash text,
  signup_step user_signup_step NOT NULL DEFAULT 'created'::user_signup_step,
  is_enabled boolean NOT NULL DEFAULT true,
  last_visited_at timestamp with time zone
);

ALTER TABLE public.users
ADD CONSTRAINT users_check
CHECK (((signup_step = 'created'::user_signup_step) = (password_hash IS NULL)));

CREATE TRIGGER updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION updated_at();

ALTER TABLE public.invites
ADD CONSTRAINT invites_user_id_fkey
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

CREATE TABLE public.pgmigrate_migrations (
  id text PRIMARY KEY NOT NULL,
  checksum text NOT NULL,
  execution_time_in_millis bigint NOT NULL,
  applied_at timestamp with time zone NOT NULL
);

CREATE TABLE public.sessions (
  id bigint PRIMARY KEY NOT NULL GENERATED ALWAYS AS IDENTITY,
  external_id text UNIQUE NOT NULL DEFAULT generate_external_id('ses'::text),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id bigint NOT NULL,
  tenant_id bigint,
  last_seen_at timestamp with time zone NOT NULL DEFAULT now(),
  expired_at timestamp with time zone
);

CREATE INDEX sessions_tenant_id_idx ON public.sessions USING btree (tenant_id);

CREATE INDEX sessions_user_id_idx ON public.sessions USING btree (user_id);

CREATE TRIGGER updated_at BEFORE UPDATE ON public.sessions FOR EACH ROW EXECUTE FUNCTION updated_at();

CREATE TABLE public.tenants (
  id bigint PRIMARY KEY NOT NULL GENERATED ALWAYS AS IDENTITY,
  external_id text UNIQUE NOT NULL DEFAULT generate_external_id('ten'::text),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  name text NOT NULL,
  inbound_source tenants_inbound_source NOT NULL
);

CREATE TRIGGER updated_at BEFORE UPDATE ON public.tenants FOR EACH ROW EXECUTE FUNCTION updated_at();

ALTER TABLE public.sessions
ADD CONSTRAINT sessions_tenant_id_fkey
FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;

ALTER TABLE public.sessions
ADD CONSTRAINT sessions_user_id_fkey
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

CREATE TABLE public.tenants_users (
  id bigint PRIMARY KEY NOT NULL GENERATED ALWAYS AS IDENTITY,
  external_id text UNIQUE NOT NULL DEFAULT generate_external_id('utn'::text),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id bigint NOT NULL,
  tenant_id bigint NOT NULL DEFAULT current_tenant_id(),
  removed_at timestamp with time zone,
  removed_by_user bigint
);

CREATE UNIQUE INDEX tenants_users_membership ON public.tenants_users USING btree (tenant_id, user_id) WHERE (removed_at IS NOT NULL);

CREATE INDEX tenants_users_removed_by_user_idx ON public.tenants_users USING btree (removed_by_user);

CREATE INDEX tenants_users_tenant_id_idx ON public.tenants_users USING btree (tenant_id);

CREATE INDEX tenants_users_user_id ON public.tenants_users USING btree (user_id);

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

CREATE TABLE public.vaulted_secrets (
  id bigint PRIMARY KEY NOT NULL GENERATED ALWAYS AS IDENTITY,
  external_id text UNIQUE NOT NULL DEFAULT generate_external_id('vsc'::text),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  tenant_id bigint NOT NULL,
  ciphertext text NOT NULL,
  nonce text NOT NULL
);

CREATE INDEX vaulted_secrets_tenant_id_idx ON public.vaulted_secrets USING btree (tenant_id);

CREATE TRIGGER updated_at BEFORE UPDATE ON public.vaulted_secrets FOR EACH ROW EXECUTE FUNCTION updated_at();

ALTER TABLE public.vaulted_secrets
ADD CONSTRAINT vaulted_secrets_tenant_id_fkey
FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;
