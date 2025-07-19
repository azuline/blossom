-- vaulted_secrets
-- depends: 20230220_01_ZJvx5-sessions

CREATE TABLE vaulted_secrets (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    external_id text NOT NULL UNIQUE DEFAULT generate_external_id('vsc'),
    created_at timestamptz NOT NULL DEFAULT NOW(),
    updated_at timestamptz NOT NULL DEFAULT NOW(),

    tenant_id bigint NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    ciphertext text NOT NULL,
    nonce text NOT NULL
);
CREATE TRIGGER updated_at BEFORE UPDATE ON vaulted_secrets
FOR EACH ROW EXECUTE PROCEDURE updated_at();

ALTER TABLE vaulted_secrets ENABLE ROW LEVEL SECURITY;
CREATE POLICY vaulted_secrets_self_all ON vaulted_secrets
    USING (tenant_id = current_tenant_id());

CREATE INDEX vaulted_secrets_tenant_id_idx ON vaulted_secrets (tenant_id);
