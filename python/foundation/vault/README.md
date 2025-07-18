# vault

The `vault` package provides an encrypted secrets vaulting abstraction.
Functions are exposed for creating, reading, and deleting encrypted secrets.

Secrets are encrypted with ChaCha20+Poly1305 and authenticated with the tenant
ID.

At scale, this package should instead invoke a mature and well tested secrets
vault service, such as [Hashicorp Vault](https://www.hashicorp.com/products/vault).
