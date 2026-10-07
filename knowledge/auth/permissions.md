# Permissions

> **A permission is one action on one kind of thing. Roles and policies are how you bundle permissions so you are not handing them out one grain at a time.**

```text
permission          s3:GetObject, compute.instances.start, pods/log get
resource            which bucket, which project, which namespace
principal           which user, group, or service account
```

The useful grant is all three. `GetObject` on one bucket for one role is a permission. `GetObject` on `*` for `*` is a fog.

## Allow and deny

Most systems default to deny. You add allows. Some add explicit denies that beat allows: AWS IAM, GCP deny policies, Kubernetes with a separate admission policy. Learn the rule of the system you are in before you stack three tools and expect the "most specific" one to win. There is no universal most-specific rule.

## Scopes and blast radius

A permission in dev should not be a permission in prod because the token is the same. Separate identities per environment. A CI token that can deploy to production and also rewrite the production pipeline definition is two incidents waiting in one secret. Split them.

## Check the effective permission

People debug by adding admin. The better loop is to ask the system what the principal can do:

- AWS: simulate the policy, read the deny in CloudTrail
- GCP: Policy Troubleshooter
- Kubernetes: `kubectl auth can-i`

The answer is an explanation you can fix. Admin-until-it-works is an explanation you have destroyed.

## Permissions leak through indirection

Being able to create a VM and attach a powerful service account is the powerful permission, even if you cannot call the API yourself. Being able to edit a pipeline that holds a deploy secret is the deploy permission. When you review access, follow the chain one hop. The direct grants are the easy part.
