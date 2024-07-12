# testing

The `testing` package contains shared fixtures for frontend testing.

## Mocking Network Requests

We use `msw` to mock network requests.

Inside `rpc.ts`, a type enforces that every defined RPC has a "default mock."
The default mock is used in Ladle so that we can correctly render stories that
depend on server data.
