# Terraform Backend

> **A backend is where state lives and how it is locked. The default local backend is a file on one laptop, which is not a team.**

```hcl
terraform {
  backend "s3" {
    bucket         = "priyexa-tf-state"
    key            = "network/prod/terraform.tfstate"
    region         = "ap-south-1"
    dynamodb_table = "priyexa-tf-locks"
    encrypt        = true
  }
}
```

```text
developer or CI
      │
      ▼
terraform apply
      │
      ├── lock row in DynamoDB
      ├── read state from S3
      ├── change the cloud
      └── write new state to S3, then unlock
```

S3 keeps the object. DynamoDB (or S3's native lock, depending on your Terraform version and settings) stops a second apply. `encrypt = true` turns on server-side encryption. Versioning on the bucket lets you recover the state from before a bad apply. Block public access. No human should browse this bucket for fun.

## The backend block is special

You cannot use variables inside the `backend` block. The backend is configured before variables are loaded. Teams pass partial config with `-backend-config` or a backend config file so the same code can point at different keys per environment. Changing the backend means `terraform init -migrate-state`, which copies state from the old place to the new one. Do this once, carefully, and confirm the old copy is no longer the one applies use.

## Other backends

| Backend | Fits |
| --- | --- |
| `s3` | AWS accounts, the usual choice on this roadmap |
| `gcs` | Google Cloud, locking included |
| `azurerm` | Azure |
| `remote` | HCP Terraform, with runs and policy in the same place |
| `local` | a solo experiment you can delete |

GCS looks like:

```hcl
terraform {
  backend "gcs" {
    bucket = "priyexa-tf-state"
    prefix = "network/prod"
  }
}
```

## What does not belong in the backend bucket

Application logs, build artifacts, and "misc" files. The state bucket's IAM policy should allow the Terraform roles to get and put specific keys, and should allow almost nobody else. CI plan and CI apply can be different roles. A read-only plan role that can also `s3:DeleteObject` is not read-only.

## A backend you can trust

1. Dedicated bucket, versioning on, public access blocked, encryption on.
2. Locking on.
3. State key layout that separates environments: `network/dev`, `network/prod`, `app/prod`.
4. Access logged.
5. The bucket itself created outside the stack that depends on it, or carefully bootstrapped once. A stack that stores state in a bucket it also creates is a circular trap the day you try to destroy it.
