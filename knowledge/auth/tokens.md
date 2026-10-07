# Tokens

> **A token is a credential the caller presents instead of a password. Its only virtue is that it can be short-lived, scoped, and thrown away.**

```text
opaque token        a random string, meaningful only to the server that issued it
JWT                 claims you can read, signature you must verify
session cookie      a token the browser stores for you
```

A JWT is not secret in its contents. Anyone can base64-decode the middle. The signature is the security. Verify it with the identity provider's keys. Do not accept a token because the JSON inside says `"role": "admin"`. That field is a claim from the issuer, trustworthy only after the signature check, and only if your policy uses that issuer's claims.

## Lifetime

```text
minutes      access tokens, cloud credentials from STS
hours        an interactive session
days         a smell, unless it is a refresh token stored with care
forever      an API key you have renamed "token"
```

Access tokens are easy to leak through logs and browser history. A short expiry limits the leak. Refresh tokens last longer and should be stored where a script cannot casually print them. Rotation of refresh tokens detects theft: if the old refresh token is reused, revoke the family.

## Audience and scope

A token for the logging API must not be a token for the deploy API. Scope is the permission list inside the delegation. Audience is who the token was minted for. Check both. A "god token" in CI that talks to every internal service is an API key with modern makeup.

## Where tokens show up in this repo's world

- OIDC tokens for CI, described in [oidc.md](oidc.md)
- Kubernetes service account tokens mounted into pods
- Registry tokens for pulling images
- Personal access tokens on GitHub, which are just scoped passwords

Personal access tokens are the ones that end up in a dotfile. Prefer SSH keys or OIDC for automation. If a PAT must exist, scope it, expire it, and store it in a secret manager.
