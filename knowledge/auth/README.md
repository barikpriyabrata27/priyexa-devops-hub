# Authentication and Authorization

Phase IX is identity: prove who is calling, then decide what they may do, with credentials that can expire.

The map is [authentication and authorization](authentication-and-authorization.md).

## People

- [Authentication](authentication.md)
- [Passwords](passwords.md)
- [Users](users.md)
- [Groups](groups.md)
- [SSO](sso.md)
- [OIDC](oidc.md)

## Access decisions

- [IAM as a pattern](iam.md)
- [Permissions](permissions.md)
- [Roles](roles.md)
- [RBAC](rbac.md)
- [Least privilege](least-privilege.md)

## Software and secrets

- [Service accounts](service-accounts.md)
- [Tokens](tokens.md)
- [API keys](api-keys.md)
- [SSH keys](ssh-keys.md)
- [Secrets](secrets.md)
- [HashiCorp Vault](vault.md)
- [Credential rotation](credential-rotation.md)

Cloud policy details live in [AWS IAM](../aws/iam.md) and [GCP IAM](../gcp/iam.md). File encryption for Ansible variables is [Ansible Vault](../ansible/vault.md), which is not the service described in [HashiCorp Vault](vault.md).
