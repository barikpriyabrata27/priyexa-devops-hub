# Roles

> **A role is a named bundle of permissions for a job. You assign the role. You do not copy its permissions onto each person.**

```text
role: deploy-dev
    ├── read the dev artifact bucket
    ├── update the dev service
    └── write logs
```

Priya is not "a person who has 40 permissions." Priya is in a group that has the role `deploy-dev`. Tomorrow's new permission is added to the role once.

## Job roles, not person roles

`priya-admin` is not a role. It is a backdoor with a friendly name. Name roles for the work: `billing-viewer`, `namespace-operator`, `break-glass-network`. If only one person has the job, the role still has the job's name, so the next person can receive it without a redesign.

## Built-in roles are a start

Cloud providers and Kubernetes ship roles that are either too wide (`Owner`, `cluster-admin`) or close enough (`cloudsql.client`, `edit` in one namespace). Start from a predefined role. Narrow it when the extra permissions are real. Custom roles cost maintenance every time the platform adds an action. Pay that cost for production identities, not for a weekend demo.

## Assume, don't inhabit

A human's daily session should not be the admin role. They assume it, for minutes, when the work needs it, and the assumption is logged. Tools call this role assumption, privilege escalation, or just-in-time access. The effect is the same: a stolen laptop session is not automatically `cluster-admin`.

## Roles compose badly when they overlap in secret

Two roles that both grant "edit IAM" will surprise you. Keep one path that can change access, and make it noisy. A deploy role that can also change its own role is not a deploy role. It is admin with extra steps.
