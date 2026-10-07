# API Keys

> **An API key is a long-lived secret that grants whatever the key was created to grant. Treat it as a password that software presents.**

```text
good enough              a key scoped to one API, one environment, with an expiry
not good enough          a key that is the admin of the account, copied into three repos
```

Cloud providers have spent a decade trying to replace access keys with roles you assume. When a role works, use the role. Keys remain for vendors that only offer a key, and for a few automation edges. They are not the design you lead with.

## Handling

- Create the key in the vendor console or API. It is shown once.
- Store it in a secret manager or CI secret. Not in the repo, not in the image, not in Terraform state if you can avoid it.
- Inject it at runtime as an environment variable or a file with tight permissions.
- Do not pass it in a query string. Query strings end up in access logs and traces.
- Give each environment its own key so a dev leak is not a prod leak.

## Detection

A key in a git commit is public, even if you delete the commit. History still has it. Rotate the key first, then remove the file, then rewrite history if you must. Secret scanning in the pipeline exists for this. See [secrets scanning](../devsecops/secrets-scanning.md). The scan is a smoke alarm. Rotation is the fire response.

## Attribution

One key per consumer. A key named `backend` used by four services means you cannot revoke one consumer. A key named `billing-export-prod` can die without a puzzle. Log the key id, not the key.

## Expiry

If the vendor lets you set an end date, set one. A calendar reminder to rotate is weaker than an expiry that breaks a dev environment on purpose before it breaks production. The rotation habit is [credential rotation](credential-rotation.md).
