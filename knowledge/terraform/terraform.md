# A Day with Terraform

> **The daily loop is init, plan, read the plan, apply, and commit the code that matches what was applied.**

This page is the workflow. Language details live in [`terraform-fundamentals.md`](terraform-fundamentals.md). State details live in [`state.md`](state.md).

```text
edit .tf files
      │
      ▼
terraform fmt          make the diff about meaning, not whitespace
      │
      ▼
terraform validate     syntax and internal consistency
      │
      ▼
terraform plan         a preview nobody should skip
      │
      ▼
human reads the plan   especially every destroy and replace
      │
      ▼
terraform apply        only after the plan matches intent
      │
      ▼
commit the .tf files   state stays in the backend, not in git
```

## What each command is allowed to do

| Command | Talks to the cloud? | Changes the cloud? |
| --- | --- | --- |
| `fmt` | no | no |
| `validate` | no | no |
| `init` | downloads providers; configures backend | no resources |
| `plan` | yes, read | no |
| `apply` | yes | yes |
| `destroy` | yes | yes, deletes |

`plan -out=tfplan` saves the exact plan. `apply tfplan` applies that file, so the apply cannot silently pick up a newer config than the one you reviewed.

## A healthy repository layout

```text
live/
  dev/
    main.tf
    terraform.tfvars      # not secret; secrets come from env or a secret store
  prod/
    main.tf
modules/
  vpc/
  app/
```

`live/` is what gets applied. `modules/` is the reusable shape. Environments differ by variables, not by forked copies of the module.

## The plan symbols

```text
+   create
-   destroy
~   update in place
-/+ replace (destroy, then create) — stop and read this
<=  reads a data source
```

`-/+` on a database, a bucket with data, or a network interface is the line that ends careers when it is skimmed. Forces that cause replacement are marked `forces replacement` in the plan. If you did not mean to change that attribute, revert the line.

## Credentials

Terraform should use the same identity model as the rest of the platform: a short-lived role, not a long-lived access key in a `terraform.tfvars` file that someone will commit. In CI, the plan job and the apply job should not share the same power. Plan can be broad and read-only. Apply should be the role that is allowed to change the account, and it should run only on the protected branch.

## When the loop feels stuck

- **Plan wants to change something you did not touch.** Someone changed the console, or a provider upgrade changed a default. Either adopt the real value into code or revert the console.
- **Apply fails halfway.** Terraform records what succeeded. Fix the error and apply again. Do not start over in a new directory.
- **Two applies at once.** The state lock should stop the second one. If it does not, you do not have locking. Fix [`backend.md`](backend.md) before the next change.
