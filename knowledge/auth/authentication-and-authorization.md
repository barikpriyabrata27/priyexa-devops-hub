# Authentication and Authorization

> **Authentication answers "who is this?" Authorization answers "what may they do?" Mixing them up is how a logged-in user becomes an admin.**

```text
request
   │
   ▼
authentication        prove identity
   │                  password, key, token, SSO
   ▼
identity              a user, a service account, a workload
   │
   ▼
authorization         is this action allowed for this identity?
   │                  roles, policies, scopes
   ▼
allow or deny
```

A valid password does not imply permission to delete the database. A valid permission does not exist for someone who has not proven who they are. The rest of this folder splits that line into pieces you can operate.

| Question | Note |
| --- | --- |
| How do we prove a person? | [authentication](authentication.md), [passwords](passwords.md), [SSO](sso.md), [OIDC](oidc.md) |
| How do we prove a machine? | [service accounts](service-accounts.md), [SSH keys](ssh-keys.md), [API keys](api-keys.md), [tokens](tokens.md) |
| Who are the actors? | [users](users.md), [groups](groups.md) |
| What may they do? | [authorization concepts](iam.md), [permissions](permissions.md), [roles](roles.md), [RBAC](rbac.md), [least privilege](least-privilege.md) |
| Where do secrets live? | [secrets](secrets.md), [Vault](vault.md), [rotation](credential-rotation.md) |

Cloud-specific policy engines sit next door: [AWS IAM](../aws/iam.md) and [GCP IAM](../gcp/iam.md). Kubernetes RBAC is in [kubernetes-security](../kubernetes/kubernetes-security.md).

## A sentence you can use in an interview

"I authenticate the caller with a short-lived credential from SSO or from the platform identity. I authorize with a role scoped to one environment. I rotate or expire anything that can be stolen, and I log the deny as carefully as the allow."
