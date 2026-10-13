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

---

# AWS Credentials, API Keys, and CodeCommit

## 1. API Key vs AWS Access Key

### API Key

An API key is a credential used by an application to identify itself when accessing an API. Its purpose and permissions depend on the API provider.

**Common use cases:**
- Accessing third-party APIs.
- Integrating applications with external services.
- Identifying API consumers and applying usage limits.

**Example:**
An application uses an API key to retrieve weather information from a weather service.

### AWS Access Key

An AWS Access Key is a credential used to authenticate programmatic requests to AWS services. It is commonly used by the AWS CLI, AWS SDKs, and automation scripts.

A long-term IAM access key consists of two parts:

- **Access Key ID:** Identifies the access key.
- **Secret Access Key:** Used to cryptographically sign AWS requests.

Example (illustrative only):

```text
AWS_ACCESS_KEY_ID=AKIAEXAMPLE
AWS_SECRET_ACCESS_KEY=<your-secret-access-key>
```

AWS also supports temporary credentials, which include a session token and are generally preferable for short-lived access.

**Common use cases:**
- Managing AWS resources through the AWS CLI.
- Running automation scripts.
- Integrating applications with AWS services.
- Executing infrastructure management tasks using authorized credentials.

### Key Differences

| Feature | API Key | AWS Access Key |
|---|---|---|
| Purpose | Access an API | Authenticate AWS API requests |
| Format | Depends on the API provider | Access Key ID and Secret Access Key for long-term IAM keys |
| Used by | Applications and API clients | AWS CLI, SDKs, and automation tools |
| Permissions | Defined by the API provider | Controlled by AWS IAM policies and other applicable policies |
| Example | Calling a weather API | Listing EC2 instances using AWS CLI |

**Important:** Authentication identifies the caller; authorization determines which actions the caller is permitted to perform.

Never expose secret keys in source code, Git repositories, logs, or public documentation.

---

## 2. AWS CodeCommit

AWS CodeCommit is a managed source control service that hosts private Git repositories in AWS.

It provides Git-based version control for storing source code, configuration files, scripts, and infrastructure-as-code projects.

### Common Use Cases

- Storing application source code.
- Managing Terraform configuration files.
- Version-controlling Ansible playbooks and Python scripts.
- Maintaining deployment scripts and CI/CD pipeline configuration.
- Collaborating through branches and pull requests.

### CodeCommit vs Git vs GitHub

| Feature | Git | AWS CodeCommit | GitHub |
|---|---|---|---|
| Type | Version control system | Managed Git repository service | Git hosting and collaboration platform |
| Runs locally | Yes | No, it hosts remote repositories | No, it hosts remote repositories |
| Stores repository history | Yes | Yes | Yes |
| Pull requests | Depends on the hosting platform | Supported | Supported |
| Infrastructure integration | Tool-dependent | AWS ecosystem | Broad integrations and Actions |

Git is the version control tool. CodeCommit and GitHub are services that host Git repositories.

### Typical DevOps Workflow

1. Write code on a developer's machine.
2. Commit changes using Git.
3. Push the code to an AWS CodeCommit repository.
4. Review and merge changes using branches and pull requests.
5. Trigger an authorized CI/CD pipeline.
6. Build, test, scan, and deploy the application or infrastructure.

CodeCommit stores and versions code; it does not replace the entire CI/CD pipeline.

---

## 3. How AWS Access Keys and CodeCommit Work Together

Consider a Terraform project that manages AWS infrastructure.

- **AWS CLI:** Provides the command-line interface for interacting with AWS.
- **AWS Access Key or another supported authentication method:** Authenticates AWS API requests.
- **Git:** Manages source code and version history.
- **AWS CodeCommit:** Hosts the remote Git repository.
- **Terraform:** Provisions and manages AWS infrastructure.
- **CI/CD tools:** Automate validation, testing, and deployment.

These components serve different purposes and work together in a DevOps workflow.

**Important:** AWS API credentials and CodeCommit Git authentication credentials are different. Depending on the configured access method, Git access may use HTTPS Git credentials, SSH keys, or another supported mechanism.

---

## 4. AWS CLI Setup on Windows

### Verify Installation

```powershell
aws --version
```

If AWS CLI is not installed, download the official Windows installer:

https://awscli.amazonaws.com/AWSCLIV2.msi

### Configure a Named Profile

```powershell
aws configure --profile freelance
```

Provide the following values when prompted:

- AWS Access Key ID
- AWS Secret Access Key
- Default AWS Region, such as `ap-south-1`
- Default output format, such as `json`

Use credentials authorized by the AWS account owner. If access keys are unavailable, use an approved alternative authentication method.

### Verify the AWS Identity

```powershell
aws sts get-caller-identity --profile freelance
```

This command returns the AWS account ID, caller ARN, and user or role identity information.

### List Configured Profiles

```powershell
aws configure list-profiles
```

### List S3 Buckets

```powershell
aws s3 ls --profile freelance
```

### List EC2 Instances

```powershell
aws ec2 describe-instances --region ap-south-1 --profile freelance
```

These commands require the corresponding IAM permissions.

---

## 5. Security Best Practices

1. Never commit AWS access keys or secret keys to Git.
2. Use IAM roles or AWS IAM Identity Center where appropriate instead of long-lived access keys.
3. Apply the principle of least privilege: grant only the permissions required for the task.
4. Keep credentials for personal and client accounts separate.
5. Use named AWS CLI profiles when working with multiple accounts.
6. Rotate or revoke exposed credentials immediately.
7. Avoid sharing credentials through email, chat, or source code.
8. Verify the AWS account and region before performing infrastructure changes.

## 6. Official Documentation

- AWS CLI installation: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
- AWS CLI configuration: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html
- AWS CLI authentication: https://docs.aws.amazon.com/cli/latest/userguide/cli-authentication-user.html
- AWS CodeCommit: https://docs.aws.amazon.com/codecommit/latest/userguide/welcome.html

---

**Key Takeaway:** An API key is a general-purpose API credential, an AWS Access Key is a specific AWS authentication credential, and AWS CodeCommit is a Git repository hosting service. Understanding their separate roles is essential when building secure AWS DevOps workflows.
