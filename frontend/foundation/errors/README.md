# errors

The `errors` package defines a taxonomy of error classes that enable rich error
metadata and error stacktraces.

This package improves on the standard JavaScript runtime errors. The default
errors are untyped and lack a model for structured error handling.

This package exports a `BaseError` error class that all application errors
should subclass from. `BaseError` adds three new fields to the standard error
object:

- `expected`: This field signals whether the error occurred during normal user
  interaction. For example, backend form validation is expected to occasionally
  error. These errors should be caught and handled in app. If this error
  remains uncaught and is reported to the observability tooling, then we have a
  bug.
- `transient`: This field signals whether the error is due to a temporary
  problem on the client. For example, an error at the network level. These
  errors are not actionable. These fields are not reported even if uncaught.
  They should produce a message in the UI or trigger an error boundary.
- `cause`: The error that caused of this error. This chains the caused error
  with the new error and combines their stacktraces.
