# Terraform Overview

> **Terraform is a tool that turns a description of infrastructure into real cloud resources, and keeps that description and reality in sync.**

You do not click through a console and hope you can remember what you did. You write the desired end state, Terraform figures out the difference, and it makes the cloud match the file.

```text
You describe          Terraform compares        The cloud changes
desired state    →    desired vs actual    →    only what must change
(HCL files)           (the plan)                 (the apply)
```

## Why teams use it

A console is fine for one experiment. It falls apart when three people need the same VPC in three environments, and six months later nobody knows which security group rule was "temporary."

Terraform gives you:

- A reviewable change, the same way a pull request reviews code
- The same shape of infrastructure in dev, test, and prod
- A record of what exists, called **state**
- A way to destroy exactly what you created

## The pieces, in the order you meet them

```text
provider     "which cloud API am I talking to?"
resource     "create this one thing"
variable     "what changes between environments"
output       "what should the next system learn from this one"
module       "a reusable bundle of resources"
state        "what Terraform believes already exists"
backend      "where that memory is stored, safely, for the team"
workspace    "a separate memory for a separate environment"
```

Start with [`terraform-fundamentals.md`](terraform-fundamentals.md) for the language, then [`plan.md`](plan.md) and [`apply.md`](apply.md) for the workflow. Treat [`state.md`](state.md) and [`backend.md`](backend.md) as non-optional. Most Terraform outages are state stories, not syntax stories.

## A tiny complete example

```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "ap-south-1"
}

resource "aws_s3_bucket" "logs" {
  bucket = "priyexa-app-logs-dev"
}
```

`terraform init` downloads the AWS provider. `terraform plan` says it will create one bucket. `terraform apply` creates it. The next plan says "no changes" — that silence is the product working.

## The habit that keeps Terraform boring

Boring is the goal. Interesting Terraform usually means someone edited the console, imported nothing, and now plan wants to destroy a database. Lock the pipeline:

```text
pull request  →  terraform plan (read-only credentials)
merge         →  terraform apply (separate, narrower credentials)
```

Never apply from a laptop against production once more than one person shares the state.
