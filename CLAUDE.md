# Working With The User

**Sanity checks:** Before you edit code, ask whether the change conflicts with anything already done in this branch during the current session. If it does, stop, list the conflicting points, propose a resolution, and confirm the plan with the user.

**Git hygiene:** The user has created a branch for you. After you finish each milestone, commit the changes.

**Test-driven development:** For a bug fix, first write or update a test that reproduces the bug and ensure it fails. Only then fix the code and make the test pass. For a new feature, stub the API with `NotImplementedError`, write failing tests that capture the required behaviour, then implement the code until all tests pass.

**Out-of-band changes:** Never revert changes made by the user to files you previously edited, even if they are not part of your changes. Modify the REMAINING code to conform to the user's changed code.

**Fail fast, fail early:** The common definition of defensive programming is wrong, as is the robustness principle. Assert expectations and hard fail when they are not met. Assume all other systems are robust; do not accommodate their failings.

## Working on Issues

When you are given an issue to problem, first create a directory named `$(pwd)/claude/issue_YYMMDD_{issue_name}`. Put all temporary files in there: design docs, plans, debug scripts, etc.

For every issue, draft two documents: a `DESIGN.md` describing the end state and necessary changes, and a `WORKLIST.md` containing a tactical checklist of milestones.

Each milestone should be small, self-contained, and include at least one focused unit test. Do not make a separate milestone for unit tests.

After you complete each item in `WORKLIST.md`, update `WORKLIST.md` and check the item off. As new items are added to the scope, add them to `WORKLIST.md`.
