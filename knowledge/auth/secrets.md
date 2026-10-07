# Secrets

> **A secret is any value that grants access or exposes data if it is seen: passwords, keys, tokens, connection strings, and private certificates.**

```text
wrong place                 right place
git, image, chat, ticket    a secret manager, injected at runtime
a tfvars file in the repo   CI secret or cloud secret store
the container environment   acceptable only if the environment is access-controlled
of a public debug page      and not printed in logs
```

The value and the storage are different problems. A strong password committed to git is compromised. A weak password in a good secret manager is still weak, but at least you can rotate it in one place.

## Injection

```text
secret manager
     │  at start, or on a mount
     ▼
process memory or a file mode 0600
     │
     ▼
the app uses it and does not log it
```

Kubernetes Secrets are base64, not encryption, unless the cluster encrypts them at rest and you restrict who can `get secrets`. They are a distribution mechanism. For stronger handling, an external secrets operator pulls from the cloud secret manager into the cluster, and the source of truth stays outside etcd.

Environment variables are easy and they leak into crash dumps and `docker inspect` for anyone who can inspect. Files mounted with the right permissions are slightly better. Neither matters if the app prints its config at startup.

## Separation

One secret per environment. The prod database password is not "the same as dev with prod in the name" stored beside it in one file. The people who can read prod secrets are fewer than the people who can read dev secrets. If those sets are equal, the environments are equal, no matter what the labels say.

## Scanning is the backstop

Pre-commit and CI secret scanning catch the mistake. They do not replace the design. A scanner that fails the build is a control. A scanner that emails a report nobody owns is a suggestion. See [secrets scanning](../devsecops/secrets-scanning.md).

When a secret leaks, assume it was used. Rotate it, look for use in the audit log, then remove the copy. Deleting the file is step three, not step one.
