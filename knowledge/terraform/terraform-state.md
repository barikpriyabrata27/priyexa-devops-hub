# Working with Terraform State

> **State commands change Terraform's memory. They do not, by themselves, change the cloud. Used casually, they make memory and cloud disagree.**

Read [`state.md`](state.md) first if "state" is still a fuzzy word.

## The commands worth knowing

| Command | Effect |
| --- | --- |
| `terraform state list` | print every address in state |
| `terraform state show ADDRESS` | print one resource's stored attributes |
| `terraform state mv OLD NEW` | rename an address, or move it into a module |
| `terraform state rm ADDRESS` | forget a resource without destroying it |
| `terraform import ADDRESS ID` | start remembering a resource that already exists |

`state rm` is how you stop managing a resource and leave it running. The next apply will not touch it. `state mv` is how a refactor avoids destroy-and-create. You moved `aws_instance.web` to `module.app.aws_instance.web` in code, so you move the state address the same way. Plan should then say no changes.

## Prefer `moved` blocks

Terraform 1.1 and later can record a rename in code:

```hcl
moved {
  from = aws_instance.web
  to   = module.app.aws_instance.web
}
```

The next apply updates state. The refactor is reviewed in a pull request instead of living only in someone's shell history. Leave the block in place until every environment has applied it, then delete it.

## Locking

A lock stops two applies from writing state together. If an apply is killed hard, the lock can remain. Read the lock id, confirm nobody is actually running, then unlock:

```bash
terraform force-unlock LOCK_ID
```

Unlocking while an apply is alive will corrupt state. Corrupt state is recoverable only if the backend versions the object. Turn on versioning on the state bucket before you need the previous copy.

## Pull, push, and the local temptation

`terraform state pull` prints remote state. Do not redirect that JSON into a file you keep, edit by hand, and push back unless you are recovering an incident and you have a copy of the original. Hand-edited state is a common source of "every resource wants to be recreated."

## Drift between code and state

```text
code renamed the resource     plan wants to destroy and create
you only renamed the address  state mv or a moved block fixes it

code matches, cloud differs   plan wants to update
console edit                  apply returns the cloud to code

cloud object was deleted      plan wants to create it again
someone removed it by hand    apply heals it, if the data can be recreated
```

If the object held data and someone deleted it, apply creates an empty replacement. It does not conjure yesterday's rows. Backups do that.

## Interview way to say it

"State maps resource addresses to real IDs. I keep it remote, encrypted, locked, and versioned. Refactors go through `moved` blocks so a rename is not a destroy. I treat the state file as secret."
