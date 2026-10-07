# Terraform Resource

> **A resource block is Terraform's promise to create, update, and eventually destroy one infrastructure object.**

The address `aws_instance.web` is both the name in code and the key in state. Rename it carelessly and Terraform thinks the old instance should die and a new one should be born.

```hcl
resource "aws_instance" "web" {
  ami           = var.ami_id
  instance_type = "t3.micro"

  tags = {
    Name = "web"
    Env  = var.environment
  }
}
```

```text
address          type              name you chose
aws_instance.web aws_instance      web
```

## Terraform owns what it created

If Terraform created the instance, it will update it when arguments change and delete it on destroy. If someone created an instance in the console, Terraform does not know it exists until you import it. Unmanaged resources are invisible to plan.

## Arguments, attributes, and the graph

Arguments are what you set (`instance_type`). Attributes are what the cloud assigns (`id`, `public_ip`). Other resources depend on you by referencing attributes:

```hcl
resource "aws_eip" "web" {
  instance = aws_instance.web.id
}
```

That single reference is an edge in the graph. The instance is created first. The EIP waits. On destroy, the EIP goes first.

## Update in place or replace

Some argument changes are updates. Changing a tag usually is. Changing the AMI of an instance usually forces a new instance. The plan shows which one. Read it. There is no separate "please be careful" flag beyond the words `forces replacement`.

## `count` and `for_each`

```hcl
resource "aws_subnet" "private" {
  for_each = var.private_subnets

  vpc_id            = aws_vpc.main.id
  cidr_block        = each.value
  availability_zone = each.key
}
```

Addresses become `aws_subnet.private["ap-south-1a"]`. Those keys are stable. Deleting one AZ removes one subnet. With `count`, deleting item 0 shifts every later index, and Terraform replaces resources you did not mean to touch.

## Lifecycle escapes, used rarely

```hcl
lifecycle {
  prevent_destroy = true
  ignore_changes  = [tags["LastPatched"]]
}
```

`prevent_destroy` makes destroy and replace fail on purpose. Use it on databases and state buckets. `ignore_changes` tells Terraform to stop fighting something an outside process edits. It is a scalpel. Ignoring `ami` or `user_data` hides drift forever.

## Import

```bash
terraform import aws_instance.web i-0123456789abcdef0
```

Import writes state. It does not write configuration. After import, you still need a resource block that matches reality, or the next plan will try to "fix" the instance. Modern Terraform can also generate configuration with `import` blocks, which is the better path when you are adopting a large existing account.
