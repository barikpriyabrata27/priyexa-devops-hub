# Passwords

> **A password is a secret the user can type. It is a bad credential for anything that can use a key or SSO instead, and a tolerable one for humans when it is long, unique, and backed by a second factor.**

## Storage

Never store the password. Store a slow hash from a password hashing function: Argon2id, bcrypt, or scrypt. A fast hash such as SHA-256 is built to be quick, which means an attacker who steals the database can guess billions of passwords. Salt every hash so identical passwords do not look identical.

```text
user types password
        │
        ▼
verify against stored Argon2 hash
        │
        ├── match     start a session
        └── no match  same error every time, plus a delay and a counter
```

## Policy that helps, and policy that does not

Forcing rotation every 30 days makes people append `1`, then `2`. Prefer length, a breach check, and a second factor. Do force rotation when you know the password leaked. A shared team password in a wiki is not a policy. It is a group login you cannot attribute.

## Where passwords still appear in a platform

- The break-glass account, sealed, alarmed when used
- A database user, when the engine cannot use IAM auth, stored in a secret manager
- The initial SSO directory bind, also in a secret manager

They do not belong in git, in a container image, in a Terraform state you treat casually, or in a Slack pin. Ansible Vault and cloud secret managers exist so the playbook can receive the value at runtime. See [secrets](secrets.md).

## Transmission

Passwords cross the network only over TLS. A login form on HTTP is a password broadcast. So is basic auth on a URL that ends up in an access log. Prefer a header or a body you do not log, and mark the field sensitive in the pipeline.
