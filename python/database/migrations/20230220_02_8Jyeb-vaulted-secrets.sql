-- vaulted_secrets
-- depends: 20230220_01_ZJvx5-sessions

CREATE TABLE vaulted_secrets (
    id TEXT COLLATE "C" PRIMARY KEY DEFAULT generate_id('vsc') CHECK (id LIKE 'vsc_%'),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    storytime  JSONB,

    organization_id TEXT COLLATE "C" NOT NULL REFERENCES organizations(id),
    ciphertext TEXT NOT NULL
);
CREATE TRIGGER updated_at BEFORE UPDATE ON vaulted_secrets
FOR EACH ROW EXECUTE PROCEDURE updated_at();

ALTER TABLE vaulted_secrets ENABLE ROW LEVEL SECURITY;
CREATE POLICY vaulted_secrets_self_all ON vaulted_secrets USING (organization_id = current_organization_id());

CREATE INDEX ON vaulted_secrets (organization_id);
