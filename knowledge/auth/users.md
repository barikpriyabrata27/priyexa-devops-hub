# Users

> **A user is an identity for a person. One person, one user, no shared logins.**

```text
Priya  →  priya@company  →  groups  →  roles in each environment
```

A user named `devops` that four people know the password to cannot answer "who restarted production?" The audit log will say `devops`. That is not an audit log. It is a shrug.

## Lifecycle

```text
joiner     create the user from the HR source, add the groups for the job
mover      change groups, do not accumulate the old ones
leaver     disable the same day, revoke sessions and tokens, keep the record
```

Disable does not mean delete on day one. You may need the identity in logs for an investigation. It does mean every active credential stops. SSO makes this one switch. Local accounts on every server make this a scavenger hunt. That scavenger hunt is the argument for SSO and for SSH certificates.

## Humans are not service accounts

If a pipeline, a VM, or a bot needs to call an API, it gets a [service account](service-accounts.md). When Priya leaves, the pipeline should keep running. If the pipeline used Priya's access key, her offboarding is an outage or, worse, nobody offboards the key because the outage would be inconvenient.

## Privileged users

Administrators are users with a sharper role they must assume on purpose, for a while, with a reason. Standing admin on a daily login means a phished laptop is a phished production. Separate the everyday identity from the privileged role. Log the assumption. Alert on it when it happens outside the usual tools.

## Names

The username should survive a legal name change and should not be the only key you store. An immutable id from the directory, plus an email, survives renaming. Cloud IAM and Kubernetes RBAC should bind to that stable id or to a group, not to a display name someone will edit.
