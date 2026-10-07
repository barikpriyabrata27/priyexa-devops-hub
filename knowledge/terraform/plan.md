# Terraform Plan

> **Plan is a dry run. It tells you what apply would change, and it changes nothing.**

If you only learn one discipline, learn this: nobody applies a plan they have not read, and production applies a saved plan, not a fresh guess.

```bash
terraform plan -out=tfplan
```

```text
code + state + live cloud
          │
          ▼
   terraform plan
          │
          ├── + create
          ├── ~ update in place
          ├── -/+ replace
          └── - destroy
```

The exit code is part of the tool. `0` means no changes. `2` means there are changes. `1` means an error. CI uses `2` to decide whether to post a diff on the pull request.

## How to read a plan

Start at the bottom:

```text
Plan: 2 to add, 1 to change, 0 to destroy.
```

Then search for `destroy` and `forces replacement`. Those are the lines that delete data or replace a live resource. A tag change is routine. A replacement of `aws_db_instance.main` is an incident unless you planned a migration.

Open the resource and see which argument changed. Terraform prints the old value and the new value. If the old value is not what your code used to say, the cloud drifted. Someone made a console change, or another process edited the resource.

## Saved plans close the race

```text
pull request:  terraform plan -out=tfplan
review:        humans read that exact diff
merge:         terraform apply tfplan
```

A second plan at apply time can see a different world than the one you approved. A saved plan is the approved world. It expires if state is changed by another apply, which is the lock doing its job.

## Plan is read-only only if the credentials are

Terraform will not update resources during plan, but data sources run, and some providers refresh in ways that surprise people. Give the plan job IAM permissions that cannot create, delete, or modify. Then a buggy provider or a mistaken command cannot turn "show me the diff" into "replace the database."

## When the plan lies by omission

- **A resource is not in state.** Terraform will not mention the console-built instance it does not own.
- **`ignore_changes` hides an attribute.** Plan looks clean while the instance runs different user data.
- **A failed provider refresh.** Plan stops with an error. That is safer than a partial story. Fix access before you apply.

Use plan output as the body of the infrastructure pull request. The code change and the planned effect belong in the same review.
