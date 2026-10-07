# Credential Rotation

> **Rotation replaces a credential before, or immediately after, it might be known by the wrong party. The system has to keep working while the old one dies.**

```text
issue new credential
      │
      ▼
consumers start using it          both can work for a while
      │
      ▼
confirm the new one is in use
      │
      ▼
revoke the old one
      │
      ▼
watch for failures that still present the old one
```

Revoke first and you cause the outage. Wait forever to revoke and the leaked credential remains valid. The overlap window is the design.

## What "rotate" means per type

| Credential | The move |
| --- | --- |
| API key | create a second key, switch consumers, delete the first |
| Cloud access key | two active keys is the AWS pattern, then disable the old |
| Password | set the new password where it is checked, then update consumers |
| SSH key | add the new public key, remove the old from every authorized set |
| Certificate | issue the new cert, reload the process, let the old one expire |
| OIDC and STS | you often rotate nothing, because the token dies in minutes |

Prefer the last row. A credential that expires on its own is rotation you do not have to remember. Static keys are rotation you will postpone. Every design review can ask "what is the lifetime?"

## After a leak

The order is rotate, investigate, then clean the artifact. A force-push that removes the key from git leaves the key valid. Attackers read the commit before you noticed. Look in the audit log for use of that key id between the leak and the revocation. Then scrub the repo so the next person does not use the dead key and so scanners go quiet.

## Make rotation a drill

If you have never rotated the production database password, the first time will be during an incident. Practice on dev: two versions live, app reloads, old version rejected, alerts silent. Document who can rotate. A secret only one ex-employee can change is not a secret you control.

## Automation

The secret manager or Vault can rotate a database password and hand the new value to the app. The app must reload it without a human SSH. If the app only reads the password at startup and crashes when it changes, fix the app before you automate rotation. Automation that restarts the world every night is not a win.
