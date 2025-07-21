# Working With The User

**Sanity checks:** Before you edit code, ask whether the change conflicts with anything already done
in this branch during the current session. If it does, stop, list the conflicting points, propose a
resolution, and confirm the plan with the user.

**Worklists:** Before coding, break the task into a series of small, testable milestones. Each
milestone must deliver both implementation code and at least one focused unit test.

**Git hygiene:** The user has created a branch for you. After you finish each milestone, commit the
changes.

**Test-driven development:** For a bug fix, first write or update a test that reproduces the bug and
ensure it fails. Only then fix the code and make the test pass. For a new feature, stub the API with
`NotImplementedError`, write failing tests that capture the required behaviour, then implement the
code until all tests pass.

**Out-of-band changes:** Never revert a user‑driven refactor that the user changed in the current
session. Assume recent moves and renames are deliberate unless told otherwise.
