# OIDC

> **OpenID Connect is a thin identity layer on OAuth 2. A system gets a signed token that says who the user or workload is, and it can verify that token without calling you on the phone.**

```text
identity provider
    │  signs an ID token (a JWT)
    ▼
your app, AWS, GCP, or GitHub Actions
    │  checks the signature, the issuer, the audience, the expiry
    ▼
trusts the subject and the groups inside
```

OAuth alone is about delegated access to an API. OIDC adds a standard way to say "this token is about an identity." In DevOps the exciting use is not the login button. It is a pipeline that proves it is your pipeline.

## GitHub Actions to AWS, the picture

```text
job starts
   │
   ▼
GitHub issues an OIDC token
   subject: repo:org/app:ref:refs/heads/main
   │
   ▼
AWS STS AssumeRoleWithWebIdentity
   trust policy allows only that subject
   │
   ▼
short-lived AWS credentials, no access key in the repo
```

The trust policy is the whole security. If it allows any repository in the org, a fork's pull request workflow can assume the production role the moment someone adds a workflow file. Restrict the subject to the repo and the branch that is allowed to deploy. Give pull requests a different, weaker role or none.

## What you check on a token

| Claim | Why |
| --- | --- |
| `iss` | it came from the identity provider you trust |
| signature | it was not edited |
| `aud` | it was minted for you, not for some other site |
| `exp` | it is still in date |
| `sub` or groups | it is the subject you meant to allow |

Skipping `aud` is a classic bug. A token stolen from a different application then works on yours.

## Kubernetes

The cluster can trust the same identity provider. Users authenticate with OIDC. RBAC binds their groups. You stop distributing Kubernetes client certificates that live for a year on laptops. The API server needs the issuer URL and the CA. Groups in the token become group subjects in bindings.
