# Terraform State

> **State is Terraform's memory of the real resource IDs it created, so the next plan can update those objects instead of creating new ones.**

The configuration says "a bucket named logs." The cloud has `priyexa-app-logs-dev` with an ID. State binds the address `aws_s3_bucket.logs` to that ID. Lose the binding and Terraform will try to create the bucket again, then fail because the name is taken — or worse, create a second copy of something that did not have a unique name.

```text
configuration          state file                 cloud
aws_s3_bucket.logs  →  id = "priyexa-app-logs" →  the actual bucket
```

## What is inside

A state file is JSON. It contains resource addresses, IDs, and attributes. Attributes include things you would rather not publish: database passwords, generated keys, raw user data. State is a secret store whether you wanted one or not.

That is why:

- State is never committed to git
- State is stored in a remote backend with encryption and access control
- Very few people can read it

`.terraform.lock.hcl` is safe to commit. `terraform.tfstate` is not. See [`backend.md`](backend.md).

## Refresh

At the start of plan, Terraform refreshes state from the live APIs. If someone resized an instance in the console, refresh sees it, and the plan offers to change it back. That offer is drift correction. Accept it when code is right. Change code when the console change was intentional.

## State is not a backup of your infrastructure

It does not contain your database rows. It contains the ID of the database. Restoring an old state file while the cloud has moved on makes Terraform confused about what it owns. Restoring infrastructure means backups of the data plus a state file that matches the objects you restored.

## One state, one owner

Two people applying against two local state files will each believe they own the VPC and will create duplicates. One remote state, with locking, is the fix. One state per environment is the layout. Dev and prod do not share a state file. A bad dev apply must be incapable of deleting prod, and separate states plus separate accounts are how you get that.

The operations that move, import, and repair state are in [`terraform-state.md`](terraform-state.md).
