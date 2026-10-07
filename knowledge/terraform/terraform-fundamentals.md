# Terraform Fundamentals

> **Terraform's language, HCL, describes infrastructure as blocks of configuration. It is not a script that runs line by line.**

Order in the file does not decide order in the cloud. Terraform builds a graph from references. If a security group mentions a VPC, the VPC is created first, even if you wrote the security group at the top of the file.

```text
your files                         graph Terraform builds
──────────                         ──────────────────────
vpc.tf  ── aws_vpc.main ─────────► aws_vpc.main
sg.tf   ── aws_security_group ───►   └── aws_security_group.web
                vpc_id = aws_vpc.main.id
```

## The four block types you will type every day

**`terraform`** — settings for Terraform itself: which providers, which versions, which backend.

**`provider`** — how to authenticate and which region or project to use.

**`resource`** — something Terraform should create and own. The address is `type.name`, for example `aws_instance.web`.

**`data`** — something that already exists, which you only want to read. A data source never creates or destroys.

```hcl
data "aws_ami" "al2023" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-2023*-x86_64"]
  }
}

resource "aws_instance" "web" {
  ami           = data.aws_ami.al2023.id
  instance_type = var.instance_type
}
```

## Values, not scripts

```text
var.instance_type     input, set per environment
local.common_tags     a name you computed for reuse inside this config
aws_instance.web.id   an attribute of a resource you manage
module.network.vpc_id an output from a module
```

Strings in quotes are literal. A reference without quotes is a dependency. That distinction is the whole language.

## Types you will actually use

| Type | Example | Typical use |
| --- | --- | --- |
| string | `"ap-south-1"` | names, regions |
| number | `2` | counts, ports |
| bool | `true` | feature flags |
| list | `["a", "b"]` | subnet ids, ordered |
| map | `{ env = "dev" }` | tags |
| object | a fixed set of attributes | a module input that must have `name` and `port` |

`count` and `for_each` create many copies of one resource block. Prefer `for_each` with a map keyed by a stable name. `count` indexes shift when you delete an item in the middle, and Terraform then wants to recreate everything after it.

## Version pins

Pin Terraform and providers. An unpinned `terraform init` on a new laptop can download a provider that renames an argument and turns a no-op plan into a recreate.

```hcl
terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.40"
    }
  }
}
```

`~>` allows the rightmost component to increase. `~> 5.40` accepts `5.40.1` and `5.41.0`, and rejects `6.0.0`.

## What this is not

Terraform does not SSH into a server and install nginx. That is Ansible, a startup script, or an image build. Terraform's job ends when the resource exists and its attributes match config. Mixing "install these packages" into Terraform provisioners is how apply becomes flaky. See [`../ansible/ansible-fundamentals.md`](../ansible/ansible-fundamentals.md).
