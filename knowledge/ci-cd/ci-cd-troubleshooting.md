# CI/CD Troubleshooting

> **A failed pipeline is a system telling you which step diverged. Read the first failure, reproduce it as narrowly as you can, and change one thing.**

```text
trigger
  │
  ├── checkout          wrong ref, missing secrets, submodule auth
  ├── build             compile error, out of memory, wrong JDK
  ├── test              a real bug, or a test that depends on time and order
  ├── scan              a new CVE, or a scanner that cannot reach its database
  ├── publish           registry login, immutable tag already exists
  └── deploy            credentials, health check, a manifest that does not match the cluster
```

The log is long. The first red step is the one you own. Later steps failed because they never ran, or because they ran in a dirty workspace the failed step left behind. Do not start at the bottom.

## A way to look

1. Which pipeline, which run, which commit? A rerun of an old commit is a different fact from a new push.
2. Did this step pass on the previous commit? The diff between them is the suspect list.
3. Is the failure on the runner or in the application? "Cannot connect to docker.sock" is the runner. "Assertion error in CartTest" is the code.
4. Can you rerun the same step with the same inputs? A flake that passes on rerun is still a bug. It is a bug in timing, shared state, or the network.

## Failures you will see until they annoy you less

**It passed locally.** The runner has a different OS, a clean workspace, no `~/.m2` full of jars you forgot you installed, and CPU limits. Reproduce in a container that matches the runner, or print the versions at the start of the job so the log contains the answer.

**Works on rerun.** Tests share a database, a port, or a clock. Look for `sleep`, for dates, for anything not cleaned in `after`. Quarantine the flake after you have a ticket. Do not quarantine it as the fix.

**Cannot pull or push.** The credential expired, the OIDC subject does not match the trust policy, or the tag is immutable and you tried to push `:latest` again with different bytes. Print the identity the job actually assumed. Do not print the token.

**Deploy succeeded, the app is down.** The pipeline's definition of success was "kubectl exited 0." The pods are `CrashLoopBackOff` or the readiness probe fails. Teach the pipeline to wait for healthy. [Deployment strategies](deployment-strategies.md) and [rollback](rollback.md) are the recovery, not a second blind apply.

**Out of disk or memory on the runner.** The workspace was not cleaned, a Docker build left images, or the test forks the world. Clean the workspace, cap the job, and stop baking caches that grow without a bound.

**A secret works in one branch and not another.** Environment protection or an environment-scoped secret is doing that on purpose. The branch is not allowed to use production. That is a control, not a bug, until you are on the branch that should deploy.

## Change one variable

Rerunning with a new commit, a new secret, and a new runner image is three experiments. You will not know which one fixed it, and you will not know which one to revert when it breaks again. Change the thing the log pointed at. Record the run URL in the ticket. Future you, and the next on-call, will treat that as the real documentation.
