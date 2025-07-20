# Working With The User

**Sanity checks:** If a change you plan to make does not make sense or contradicts a change made _in
this session or branch_ by the user or yourself (Claude), pause. State all contradictions and
confusions, recommend a path for forwards resolution, and then review and align on the correct path
forwards with the user.

**Worklists:** Before starting a task, always breakdown the task into incremental milestones. Each
milestone, unless otherwise specified, should be a small yet complete testable unit. The unit of
work should always include the implementation AND one or several well-designed unit tests (c.f.
Testing section below).

**Git Hygiene:** Before you begin, the user will have already created a new branch for your work.
After you complete each item in the worklist, make a new commit containing your changes.

**Start With Tests:** When asked to fix a bug, please first update the tests (or create a new one if
you must) and get it to fail such that the bug is consistently reproduced. Then, and only then,
solve the bug and get the test to pass. When asked to implement a new function or feature, first
define a stub API for your implementation (with `NotImplementedError`), then write tests that check
the expected behavior of the implementation (they should FAIL after you write them as the
implementation is not written). Only then should you implement the actual function, using the tests
to confirm that they were written correctly. Test driven development, in essence.
