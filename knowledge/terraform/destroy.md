# Terraform Destroy

> **Destroy deletes every resource in this state. It is apply with an empty desired world.**

```bash
terraform plan -destroy -out=tfplan
terraform apply tfplan
```

There is also `terraform destroy`, which is the same idea with a prompt. In automation, plan the destruction and apply the saved plan so a review exists.

```text
current state                desired state
┌────────────────┐           ┌──────────────┐
│ vpc, subnets,  │  destroy  │              │
│ database, app  │ ───────►  │   (empty)    │
└────────────────┘           └──────────────┘
```

## When destroy is the right tool

- A sandbox or a pull-request environment at the end of its life
- A stack you are intentionally retiring, after data has been copied
- A learning account you want returned to zero

## When it is the wrong tool

Removing one resource from configuration, then applying, destroys that resource only. You do not need to destroy the world to delete a bucket. `terraform destroy -target=...` exists and is sharp. Targeted destroy skips the normal graph and can leave dependents broken. Prefer deleting the block and letting a full plan show the consequences.

## Guardrails

```hcl
lifecycle {
  prevent_destroy = true
}
```

On a production database this turns a bad plan into an error. Pair it with CI that rejects plans containing unexpected destroys, and with a backend that few identities can write.

Destruction order follows dependencies in reverse. The instance goes before the subnet. The subnet goes before the VPC. If a resource was created outside Terraform and attached to a Terraform network, destroy can fail because the cloud refuses to delete a VPC that still has a stranger's ENI. That failure is useful. Find the stranger. Do not force past it.

## Data does not move itself

Destroy deletes the database. It does not take a snapshot unless the resource's configuration says so (`skip_final_snapshot = false` on RDS, for example). Before a production destroy:

1. Confirm the backup or export exists and can be restored.
2. Confirm DNS and consumers no longer point at the stack.
3. Run a destroy plan and read every line.
4. Apply it in a window when failure is survivable.

A destroyed sandbox is a success. A destroyed production database with no snapshot is a resume event.
