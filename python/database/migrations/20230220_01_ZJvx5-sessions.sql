-- sessions
-- depends: 20230127_04_5yl8v-tenants

CREATE TABLE sessions (
    id TEXT COLLATE "C" PRIMARY KEY DEFAULT generate_id('ses') CHECK (id LIKE 'ses_%'),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    storytime  JSONB,

    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tenant_id TEXT REFERENCES tenants(id) ON DELETE CASCADE,
    last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expired_at TIMESTAMPTZ
);
CREATE TRIGGER updated_at BEFORE UPDATE ON sessions
FOR EACH ROW EXECUTE PROCEDURE updated_at();

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY sessions_self_all ON sessions USING (user_id = current_user_id());

CREATE INDEX sessions_user_id_idx ON sessions (user_id);
CREATE INDEX sessions_tenant_id_idx ON sessions (tenant_id);
