-- sessions
-- depends: 20230127_04_5yl8v-tenants

CREATE TABLE sessions (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    external_id text NOT NULL UNIQUE DEFAULT generate_external_id('ses'),
    created_at timestamptz NOT NULL DEFAULT NOW(),
    updated_at timestamptz NOT NULL DEFAULT NOW(),

    user_id bigint NOT NULL REFERENCES users(id),
    tenant_id bigint REFERENCES tenants(id),
    last_seen_at timestamptz NOT NULL DEFAULT NOW(),
    expired_at timestamptz
);
CREATE TRIGGER updated_at BEFORE UPDATE ON sessions
FOR EACH ROW EXECUTE PROCEDURE updated_at();

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY sessions_self_all ON sessions
    USING (user_id = current_user_id());

CREATE INDEX sessions_user_id_idx ON sessions (user_id);
CREATE INDEX sessions_tenant_id_idx ON sessions (tenant_id);
