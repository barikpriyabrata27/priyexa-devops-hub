# HashiCorp Vault

> **Vault stores secrets, hands them out with a login, and can issue short-lived credentials so a static database password is no longer the design.**

Ansible Vault, in the Ansible notes, only encrypts a file. HashiCorp Vault is a service. Same word, different job. This page is the service.

```text
workload
   │  login: Kubernetes auth, AWS IAM, or OIDC
   ▼
Vault
   │  policy: this identity may read secret/data/payments/prod
   ▼
a secret, or a database username that expires in an hour
```

## What people use it for

- A key-value store for secrets you still have to hold
- Dynamic database credentials: Vault creates a database user for the hour and drops it
- Encryption as a service: the app sends plaintext, Vault returns ciphertext, and the app never sees the key
- SSH or PKI certificates with short lives

Dynamic credentials are the interesting part. A leaked password dies at the end of the lease. A leaked static password lives until the next human rotation, which might be never.

## Auth and policy

Workloads should log in as themselves. On Kubernetes, the pod's service account token is the login. On AWS, the instance role is the login. Policies then name the paths that identity can read. `secret/data/payments/prod/*` for the payments prod app. Not `secret/*` for everything in the cluster.

Humans log in through OIDC and get a narrower policy, or a different path. The application should not be able to read the human break-glass path.

## Operations, the part that bites

Vault seals itself. Unsealing needs a threshold of keys, or a cloud KMS auto-unseal so a restart does not wait for three people. The storage backend must be durable. Running one Vault container with a local disk is a demo. Production is highly available, backed up, and monitored for seal status. A sealed Vault looks like every application forgot its password at once.

Audit devices log who read which path. Turn them on before you need to answer that question. Do not log the secret values. The audit log is metadata.

## A small adoption path

1. One cluster, auto-unseal, a backup you have restored in a drill.
2. Kubernetes auth for one namespace.
3. One application reads one path.
4. Then dynamic credentials for the database that hurts the most when the password leaks.

Boiling the ocean — moving every secret in a week — usually means a root token in a CI variable and policies of `*`. That is a new outage with extra steps.
