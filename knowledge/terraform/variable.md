# Terraform Variable

> **A variable is an input so the same configuration can describe dev and prod without copy-paste.**

```hcl
variable "environment" {
  description = "Deployment environment name."
  type        = string

  validation {
    condition     = contains(["dev", "test", "prod"], var.environment)
    error_message = "environment must be dev, test, or prod."
  }
}

variable "instance_type" {
  type    = string
  default = "t3.micro"
}
```

No default means the variable is required. A plan without a value fails immediately, which is what you want for an environment name. A silent default of `"prod"` is how a test apply lands in production.

## Where values come from

Terraform loads values in this order, later sources winning:

```text
default in the variable block
        │
        ▼
terraform.tfvars and *.auto.tfvars
        │
        ▼
TF_VAR_environment environment variable
        │
        ▼
-var and -var-file on the command line
```

Commit a `dev.tfvars` that contains sizes and names. Do not commit passwords. Pass secrets as environment variables or read them from a secret manager with a data source. A `.tfvars` file full of database passwords will end up in git history.

## Types are documentation that fails the build

```hcl
variable "subnet_cidrs" {
  type = map(string)
}
```

A map keyed by AZ name survives adding and removing entries. A list works until someone reorders it and `count` recreates subnets.

For a module that should be hard to call wrong:

```hcl
variable "service" {
  type = object({
    name = string
    port = number
  })
}
```

## Locals are not variables

Variables cross the boundary into the module. Locals are nicknames inside it.

```hcl
locals {
  name_prefix = "${var.environment}-payments"
}
```

Callers cannot set a local. If callers need to set it, it is a variable.

## Sensitive values

```hcl
variable "db_password" {
  type      = string
  sensitive = true
}
```

`sensitive` hides the value in plan output. It does not encrypt state. The password still sits in state. That is why state belongs in an encrypted backend with tight access, not because the variable was marked sensitive. See [`state.md`](state.md).
