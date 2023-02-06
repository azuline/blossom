# test

The `test` package contains the `t` mega pytest fixture. The `t` fixture
most of our internal fixtures, for the sake of being easy to define and use in
tests.

We designed the `t` fixture because:

1. The `t` interface is typed with inference, unlike standard pytest fixtures.
2. In almost all tests, only `t` needs to be put into the test function
   signature, making it far less verbose to define a new test. With standard
   pytest fixtures, every fixture needs to be added to the test function
   parameters.
