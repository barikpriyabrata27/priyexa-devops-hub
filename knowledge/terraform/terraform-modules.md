# Using and Versioning Terraform Modules

> **Consuming a module is choosing a source and a version, then treating its variables and outputs as an API you do not get to casually break.**

Writing the folder is [`module.md`](module.md). This page is about sharing it without creating a private fork on every team.

## Sources

```hcl
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.8.1"

  name = "payments"
  cidr = "10.20.0.0/16"
}
```

| Source | When |
| --- | --- |
| `./modules/vpc` or `../../modules/vpc` | the module changes with this repo |
| a git URL with a ref | sharing across repos, pinned to a tag |
| the Terraform Registry | a well-known module, pinned with `version` |

Pin versions. An unpinned registry module changes under you the day someone runs init and upgrades. Commit `.terraform.lock.hcl` so the provider plugins inside those modules stay pinned too.

A git source:

```hcl
module "vpc" {
  source = "git::https://github.com/example/terraform-modules.git//vpc?ref=v1.4.0"
}
```

`//vpc` is the subdirectory. `ref=v1.4.0` is the pin. Moving ref is a deliberate upgrade, reviewed as a plan.

## Semantic versions for your own modules

Tag `v1.4.0`. Increment:

- **patch** when you fix a bug and nothing in the variables changes
- **minor** when you add an optional variable or output
- **major** when you rename a variable, remove an output, or force a resource replacement

Callers on `version = "~> 1.4"` get fixes and small additions. They do not get your breaking rename until they opt in.

## How many modules

```text
too few     one 2,000-line root, copy-pasted per environment
right       network, data, app — each callable, each with a small output set
too many    a module that wraps one resource and adds nothing
```

A module earns its existence when two callers would otherwise drift apart, or when it hides a sharp edge (a subnet layout, a least-privilege policy). A module that only renames `aws_s3_bucket` wastes a layer of addresses in state.

## Upgrading

1. Bump the version in a branch.
2. Plan every live environment.
3. Read replacements.
4. Apply non-prod.
5. Apply prod.

If the upstream module's `moved` blocks are written well, a major upgrade is a plan with updates. If they are not, you write the `moved` blocks yourself or you accept a recreation. Recreation of a network is a migration project, not an afternoon.
