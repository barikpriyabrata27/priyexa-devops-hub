# Terraform Output

> **An output publishes a value from this configuration so a human, another module, or another root can use it.**

Resources keep many attributes. Outputs are the few you deliberately hand to the outside.

```hcl
output "vpc_id" {
  description = "ID of the application VPC."
  value       = aws_vpc.main.id
}

output "db_endpoint" {
  description = "Hostname of the primary database."
  value       = aws_db_instance.main.address
  sensitive   = true
}
```

```text
root module outputs     shown after apply, readable with terraform output
module outputs          become module.network.vpc_id for the caller
```

## Why bother

Without outputs, the next team copies IDs out of the console into another tfvars file. Those IDs drift. An output is a contract: "the VPC id lives here." A root module that creates a network should output the VPC id, subnet ids, and security group ids. A module that creates a database should output the endpoint and the port, not the password if you can avoid it.

## Reading them

```bash
terraform output
terraform output -raw vpc_id
terraform output -json
```

`-raw` is what a script wants. The normal output wraps values in quotes and is easy to paste wrong into the next command.

## Outputs are not a secret store

Marking an output `sensitive` redacts the CLI. The value is still in state. Anyone who can read state can read it. Prefer to pass a secret manager's name or ARN as the output, and let the application fetch the secret at runtime.

## Root outputs and `terraform_remote_state`

Another configuration can read this one's outputs:

```hcl
data "terraform_remote_state" "network" {
  backend = "s3"
  config = {
    bucket = "priyexa-tf-state"
    key    = "network/prod/terraform.tfstate"
    region = "ap-south-1"
  }
}

resource "aws_instance" "app" {
  subnet_id = data.terraform_remote_state.network.outputs.private_subnet_ids[0]
}
```

This couples the two states. It is useful and it is a dependency you must name. If the network workspace is destroyed, the app plan breaks. For large platforms, a deliberately small "network outputs" contract is healthier than letting every stack read every attribute of the network state.
