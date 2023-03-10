# database

The `database` package exposes abstractions for creating a Postgres connection
pool and spawning connections from it.

Two functions are exposed for creating connections, one for `admin` connections
and another for `customer` connections. The `admin` connection has unrestricted
access to all rows. The `customer` connection enforces Row Level Security (RLS)
based on the passed in User and Tenant, which means that only rows with a
matching `user_id` or `tenant_id` can be accessed, and should be used for all
queries originating from a customer request.

See the database migrations for the schema that enables Row Level Security.
