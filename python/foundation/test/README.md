# test

The `test` package contains the `t` mega pytest fixture. Rather than define a
bunch of independent fixtures, we aggregate all our fixtures into the `t`
fixture.

We created this single `t` fixture because:

1. The `t` interface is typed with inference, unlike standard pytest fixtures.
2. In almost all tests, only `t` needs to be put into the test function
   signature, making it far less verbose to define a new test. With standard
   pytest fixtures, every fixture needs to be added to the test function
   parameters.

For examples of how to use this fixture, look at existing test files.
