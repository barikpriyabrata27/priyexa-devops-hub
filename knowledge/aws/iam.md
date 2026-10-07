# AWS IAM

> **IAM decides which identity may call which AWS API. It is not the login screen of your application. That is a different problem, covered in the auth notes.**

```text
principal                policy                      AWS API
(who)                    (what is allowed)           (the action)
user, role, service  →   Allow s3:GetObject      →   succeeds or AccessDenied
```

Identities:

- A **user** is a person or a long-lived integration. Prefer not to give humans long-lived access keys.
- A **group** collects users so you can attach the same policies.
- A **role** is an identity that is assumed for a while. EC2 instances, Lambda functions, and CI systems assume roles. Roles have no password.
- A **policy** is the JSON document of allows and denies.

## A policy, read aloud

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": ["s3:GetObject"],
    "Resource": "arn:aws:s3:::priyexa-app-logs/*"
  }]
}
```

"Allow getting objects in this bucket, and nowhere else." `Resource: "*"` with `s3:*` is the policy everyone writes on day one and regrets during the first audit.

## How a decision is made

```text
explicit Deny anywhere in the applicable policies?     → deny
else explicit Allow?                                    → allow
else                                                    → deny
```

Default is deny. An allow in one policy cannot beat a deny in another. Permission boundaries and service control policies can cap what a grant is allowed to give. The friendly version: deny wins, and silence is also deny.

## Humans

Humans sign in through IAM Identity Center (the successor to AWS SSO) and assume a role in an account. They do not share an admin user named `deploy`. Access keys on a human user belong in the past. If one leaks from a laptop, it keeps working until someone notices.

## Workloads

An EC2 instance profile is a role attached to the instance. The instance calls the metadata service and receives temporary credentials. A Lambda function is configured with a role. A GitHub Actions job assumes a role with OIDC, so the pipeline has no stored access key at all. See [OIDC](../auth/oidc.md).

The practical patterns — conditions, confused deputy, and breaking up admin — are in [aws-iam.md](aws-iam.md).
