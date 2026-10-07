# Terraform Workspace

> **A workspace is a separate state file for the same configuration, selected by name.**

```bash
terraform workspace new dev
terraform workspace new prod
terraform workspace select prod
```

```text
one directory of .tf files
        │
        ├── workspace dev   → state key .../env:/dev/terraform.tfstate
        └── workspace prod  → state key .../env:/prod/terraform.tfstate
```

`terraform.workspace` in code returns the name, so a tag or a name prefix can follow it:

```hcl
locals {
  name = "${terraform.workspace}-payments"
}
```

## What workspaces are good at

Short-lived environments that share one configuration and must not share one state: a developer sandbox, a test stack, a demo. Creating a workspace is cheap. Destroying that workspace's resources does not touch the others, as long as you selected the right one before you typed destroy.

## What workspaces are bad at

Production isolation. The same backend credentials that can select `prod` can select `dev` and can destroy either. A workspace is a name, not an account boundary. Prod and non-prod should be separate cloud accounts or projects. Separate directories (`live/dev`, `live/prod`) with separate state keys make the blast radius obvious in code review. Workspaces hide that split inside a CLI flag.

A common failure: a laptop left on workspace `prod`, a habit of applying locally, and a variable file that said `dev` in the engineer's head. The prompt shows the workspace. Read it.

## CLI workspaces versus the product named Terraform Cloud workspaces

On the CLI, a workspace is the state namespace above. In HCP Terraform, a workspace is also the place runs, variables, and permissions live. Same word, larger object. When someone says "create a workspace," ask which one they mean.

## A safe pattern if you do use them

- Default workspace `default` is never production. Do not apply it by accident.
- Names match environments exactly.
- CI sets the workspace explicitly in the job, never "whatever was selected last."
- The production cloud account is a different set of credentials, so selecting the wrong name still cannot delete the other account.

Separate accounts plus separate state keys beat a clever workspace scheme every time an incident is on the table.
