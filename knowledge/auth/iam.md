# IAM as a Pattern

> **IAM, as a pattern, is every allow and deny decided from identity plus policy, in one place you can audit. AWS IAM and GCP IAM are implementations. The habit is the same everywhere.**

```text
who          what they want          the policy            the log
principal →  action on a resource →  allow or deny     →   a record either way
```

If access lives in a shared password, a sudoers file nobody reviews, and an IAM policy, you have three IAM systems and zero confidence. Push human access through the directory. Push cloud access through the cloud IAM. Push cluster access through RBAC bound to the same directory groups.

## Central does not mean one giant admin role

Central means one decision point per system, with small roles. A single `Admin` policy attached to the engineering group is central and also reckless. The audit will be complete. It will completely show that everyone could do everything.

## Federation beats local users

Create the human once, in the identity provider. AWS, GCP, GitHub, and the cluster trust that provider. You stop making "Priya" by hand in four consoles and forgetting the fourth when she leaves. The protocols for that trust are [SSO](sso.md) and [OIDC](oidc.md).

## Service principals are IAM too

The VM's role, the function's service account, and the CI job's assumed role are principals. Review them with the same seriousness as human admin. They often have more power and no second factor, because nothing is sitting there to approve a prompt. Short lifetimes and narrow resources are the replacement for a prompt.

## Audit

Turn on the cloud trail, the Kubernetes audit log for sensitive APIs, and the identity provider's sign-in log. A policy you cannot see being used will grow. A deny you cannot see will be bypassed with a new path. IAM without logs is a story. IAM with logs is an operation.
