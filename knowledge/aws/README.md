# AWS

Phase III is the Amazon cloud this roadmap uses: a network you control, identity on every API call, and the compute and data services that sit inside.

Start with [fundamentals](aws-fundamentals.md) if the account / region / zone picture is fuzzy.

## Network

- [VPC](vpc.md)
- [Subnet](subnet.md)
- [Route table](route-table.md)
- [Internet gateway](internet-gateway.md)
- [NAT gateway](nat.md)
- [Security group](security-group.md)

## Identity

- [IAM](iam.md) — users, roles, and how a decision is made
- [IAM in practice](aws-iam.md) — boundaries, conditions, CI roles

## Compute and data

- [EC2](ec2.md) — the instance
- [EC2 in production](aws-ec2.md) — fleets, scaling, replacement
- [RDS](rds.md)
- [S3](aws-s3.md)
- [Serverless](serverless.md)

These resources are what the [Terraform](../terraform/README.md) notes create. Google Cloud's equivalents are in [GCP](../gcp/README.md).
