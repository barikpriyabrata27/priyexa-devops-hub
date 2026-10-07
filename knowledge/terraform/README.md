# Terraform

Phase II is infrastructure as code: describe the cloud, preview the change, apply it, and remember what you own.

The workflow page is [`terraform.md`](terraform.md). Start there if you want the daily loop. Start at [`overview.md`](overview.md) if you want the map.

## Language

- [Overview](overview.md) — what problem Terraform solves
- [Fundamentals](terraform-fundamentals.md) — HCL, the graph, types
- [A day with Terraform](terraform.md) — fmt, validate, plan, apply
- [Provider](provider.md) — plugins, aliases, authentication
- [Resource](resource.md) — addresses, replacement, import
- [Variable](variable.md) — inputs per environment
- [Output](output.md) — the values you publish

## Workflow

- [Plan](plan.md) — the dry run you actually read
- [Apply](apply.md) — making the cloud match
- [Destroy](destroy.md) — deleting a whole stack on purpose

## Memory

- [State](state.md) — why the state file exists
- [State operations](terraform-state.md) — move, import, lock, recover
- [Backend](backend.md) — remote state and locking
- [Workspace](workspace.md) — separate state, and where that stops being enough

## Reuse

- [Writing a module](module.md)
- [Versioning and consuming modules](terraform-modules.md)

Related cloud notes: [AWS](../aws/README.md), [GCP](../gcp/README.md). The thing Terraform should not do — configure the inside of a server — is [Ansible](../ansible/README.md).
