# Authentication

> **Authentication is the check that the caller is who they claim to be, before any decision about what they may touch.**

```text
something you know       a password, a recovery code
something you have       a hardware key, a phone, a certificate
something you are        a biometric, rarely the only factor
```

One factor is a single bet. Phishing eats passwords. Malware eats long-lived tokens stored on disk. A second factor, especially a hardware key or a platform prompt that cannot be silently forwarded, changes the economics of stealing a password.

## Humans and workloads are different logins

A person can use a browser, a password plus a second factor, and an SSO session. A pipeline cannot complete a prompt at 3 a.m. Workloads authenticate with a key the platform injects, a workload identity token, or a short-lived certificate. Giving a CI job a person's password "because the login already works" means the person's password is now in a variable.

## Sessions come after the proof

The proof happens once. A session cookie or a token stands in for it afterward. The session is a new secret. It needs a lifetime, a way to revoke it, and the `Secure` and `HttpOnly` flags if it is a cookie. A session that never expires is a password that refresh never rotates.

## What failure should look like

Say "invalid credentials." Do not say "unknown user" on one path and "wrong password" on another. That difference is a username oracle. Rate-limit the attempts. Log them. A burst of failures against one account is a signal, not an inconvenience to hide.

## Where DevOps actually meets this

- The cloud console goes through [SSO](sso.md).
- The cluster goes through OIDC, then Kubernetes RBAC.
- SSH goes through keys or a certificate authority, not a shared root password.
- The pipeline uses [OIDC](oidc.md) to assume a cloud role with no stored access key.

Authentication that you cannot revoke is not done. See [credential rotation](credential-rotation.md).
