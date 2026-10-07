# IAM in Practice

> **The job is not "turn on IAM." The job is to grant the smallest API surface that still lets the workload run, and to make stolen credentials expire.**

Read [iam.md](iam.md) for identities and the deny-beats-allow rule. This page is the part that shows up in design reviews.

## Three policies people mix up

| Policy | Attached to | What it does |
| --- | --- | --- |
| Identity policy | user or role | what this identity may do |
| Resource policy | an S3 bucket, a KMS key, a queue | who may touch this object, even from another account |
| Permission boundary | a user or role | the maximum an identity policy can grant |
| Service control policy | the whole account, from Organizations | the maximum anyone in the account can do |

An identity policy allow and a bucket policy allow are both required for cross-account S3 access. Either one missing looks like a random `AccessDenied`. SCPs are how the platform team says "nobody in this account may turn off CloudTrail," even an admin of that account.

## Conditions are the interesting part

```json
{
  "Effect": "Allow",
  "Action": "ec2:TerminateInstances",
  "Resource": "*",
  "Condition": {
    "StringEquals": { "aws:ResourceTag/Environment": "dev" }
  }
}
```

The role can terminate instances only when the instance is tagged `Environment=dev`. Tags become part of authorization. That only works if people cannot retag production instances. Restrict `ec2:CreateTags` on production with the same seriousness as terminate.

`aws:SourceVpce` and `aws:SourceIp` limit where a call may come from. A bucket policy that requires a specific VPC endpoint means a leaked key still cannot read the bucket from a cafe.

## Confused deputy

A role that any AWS service may assume is a role any customer can try to assume. Trust policies must say which account and which specific service resource.

```json
{
  "Effect": "Allow",
  "Principal": { "Service": "ecs-tasks.amazonaws.com" },
  "Action": "sts:AssumeRole",
  "Condition": {
    "StringEquals": { "aws:SourceAccount": "123456789012" },
    "ArnLike": { "aws:SourceArn": "arn:aws:ecs:ap-south-1:123456789012:task/*" }
  }
}
```

## Break glass without living in admin

Daily roles cannot delete the log bucket or close the account. A separate role can, it requires a second person or a strong identity check, and every use is an alarm. CloudTrail records the API calls. If CloudTrail is off, you are guessing.

## A CI role you can explain

GitHub Actions assumes a role through OIDC. The trust policy allows only your org and your repo, and only the `refs/heads/main` branch for apply. The plan role can read. The apply role can change the resources that stack owns. Neither role is `AdministratorAccess`.

When a workflow fails with `AccessDenied`, the useful next step is IAM Access Analyzer or the CloudTrail event for that denied call, not attaching `*:*` until the error goes away.
