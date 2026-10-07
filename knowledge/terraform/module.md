# Writing a Terraform Module

> **A module is a folder of Terraform files that you call as one unit, with variables in and outputs out.**

Any folder with `.tf` files is already a module. The root module is the folder you apply. A child module is a folder you call from it.

```text
live/prod/main.tf          root module, the thing you apply
        │
        └── module "vpc" { source = "../../modules/vpc" }
                    │
                    └── modules/vpc/*.tf     child module
```

## The smallest useful module

`modules/vpc/variables.tf`

```hcl
variable "name" {
  type = string
}

variable "cidr" {
  type = string
}
```

`modules/vpc/main.tf`

```hcl
resource "aws_vpc" "this" {
  cidr_block = var.cidr

  tags = {
    Name = var.name
  }
}
```

`modules/vpc/outputs.tf`

```hcl
output "vpc_id" {
  value = aws_vpc.this.id
}
```

The caller:

```hcl
module "vpc" {
  source = "../../modules/vpc"

  name = "payments"
  cidr = "10.20.0.0/16"
}
```

Inside the module, resources are `aws_vpc.this`. Outside, the only name that should matter is `module.vpc.vpc_id`. Callers that reach through `module.vpc.aws_vpc.this` are not using the contract, and a rename inside the module will break them.

## Design rules that keep modules kind

- One purpose. A VPC module that also creates the application database will be hated by the next team.
- No provider blocks inside a reusable module. The caller owns providers. The module can declare `required_providers` so init knows which plugins it needs.
- Variables have descriptions and types. Outputs have descriptions.
- Defaults belong to safe, cheap choices. Defaulting a module to production-sized nodes surprises everyone.
- Do not hardcode account IDs, regions, or environment names. Pass them in.

## Paths

`path.module` is the module's own folder. Use it to ship a template file next to the code. `path.root` is the root module. Reading root paths from a child module ties the module to one repository layout and makes it fail when someone publishes it.

See [`terraform-modules.md`](terraform-modules.md) for versions, registry modules, and how many layers is too many.
