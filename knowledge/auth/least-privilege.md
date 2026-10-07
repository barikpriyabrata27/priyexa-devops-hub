# Least Privilege

> **Least privilege means the identity can do the work it has and nothing extra. It is a direction you move, not a certificate you frame.**

```text
today          the pipeline is admin, because that unblocked the first deploy
next           the pipeline can update one service and read one bucket
later          that permission exists only in prod for the prod pipeline
```

Nobody designs the perfect policy on day one. You start from the APIs the job actually calls, grant those, and read the denies. The failure mode is stopping at "we will tighten it later" while later never comes. Put a date on the wide role or delete it in the same quarter.

## Practical moves

- Separate dev and prod identities.
- Separate plan and apply, read and write, deploy and IAM-admin.
- Resource-scope the grant to one bucket, one namespace, one project.
- Prefer roles assumed for an hour over keys that last until someone remembers.
- Remove permissions nobody has used. Access Analyzer and cloud policy intelligence tools list the unused ones. An unused admin action is not "nice to have." It is blast radius.

## What people call least privilege and isn't

A custom role that is `*` with three services removed. A reader role that can also `create` "in case." A Kubernetes `edit` binding on `*` because the team has two namespaces. Those are conveniences. Name them as debt.

## The test

Imagine the credential is in a public gist tonight. What is the worst thing the finder can do before the hour is up? If the answer is "delete the account," the privilege is not least. If the answer is "read one log bucket until the token expires," you are close.

Pair this with [credential rotation](credential-rotation.md). A narrow key that lives forever will eventually meet a wide place to use it.
