# Terraform Provider

> **A provider is the plugin that knows how to talk to one API, such as AWS, Google Cloud, or Kubernetes.**

Terraform itself does not know what an S3 bucket is. The AWS provider does. Your configuration says `aws_s3_bucket`. The provider translates that into API calls.

```text
.tf files  →  Terraform Core  →  AWS provider  →  AWS API
                              →  Google provider →  GCP API
                              →  helm provider   →  Kubernetes API
```

## Declaring one

```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.40"
    }
  }
}

provider "aws" {
  region = "ap-south-1"
}
```

`source` is the registry address. `hashicorp/aws` means the HashiCorp namespace, provider name `aws`. `terraform init` downloads that plugin into `.terraform/` and records the exact version in `.terraform.lock.hcl`. Commit the lock file. It is what makes next week's init download the same plugin.

## Authentication belongs outside the file

```hcl
provider "aws" {
  region = var.region
}
```

Do not put `access_key` and `secret_key` in the provider block. The AWS provider reads the standard chain: environment variables, a shared config, or a role from the instance or CI identity. The Google provider similarly uses Application Default Credentials. The configuration stays free of secrets, and rotating a key does not require a code change.

## More than one provider configuration

Two regions means two configurations of the same provider. The second one needs an alias.

```hcl
provider "aws" {
  region = "ap-south-1"
}

provider "aws" {
  alias  = "us"
  region = "us-east-1"
}

resource "aws_s3_bucket" "replica" {
  provider = aws.us
  bucket   = "priyexa-replica"
}
```

Resources without `provider` use the default. Forgetting the alias is how a "replica" quietly lands in the primary region.

## What init is really doing

```text
terraform init
    │
    ├── read required_providers
    ├── download the plugin (or use the cache)
    ├── write .terraform.lock.hcl
    └── connect the backend
```

If init says the configuration has changed and you must reinitialize, a provider, module source, or backend changed. Run init again. Do not copy a `.terraform` folder from another machine.

## Provider upgrades

Read the upgrade guide before bumping the major version. Providers rename arguments, change defaults, and sometimes force resource replacement. The safe sequence is: bump the constraint, init, plan in a non-production workspace, and read every `forces replacement` before you touch production.
