# AWS Fundamentals

> **AWS is a set of APIs for renting computers, networks, storage, and managed services. Everything else is a console button on top of an API.**

If you remember one picture, remember this:

```text
Organization
  └── Account          the blast-radius boundary and the bill
        └── Region     ap-south-1, eu-west-1, ...
              └── Availability Zone    a distinct data center
                    └── Subnet         your slice of a VPC
```

An account is not a folder. It is a security and billing wall. A badly scoped admin key in the dev account should be incapable of deleting production, because production is a different account. Regions are geographic. Availability Zones are isolated sites inside a region. You spread an application across zones so one building can fail and the service stays up.

## Shared responsibility

AWS operates the hardware, the hypervisor, and the managed service. You operate identity, network exposure, data encryption choices, and everything you install on an EC2 instance.

```text
AWS                          You
────────────────────         ─────────────────────────
buildings and power          IAM policies
host and network fabric      security group rules
managed service patching     what your app does
(for RDS, S3, Lambda)        data you store, and backups you asked for
```

"It's in AWS so it's backed up" is false. S3 is durable. An RDS instance is backed up only if backups are on. An EC2 disk is yours to snapshot.

## How you talk to it

The console, the CLI, and Terraform all call the same APIs. A resource you cannot see in `aws ec2 describe-instances` does not exist, no matter what a diagram claims.

```bash
aws sts get-caller-identity
```

That command answers "who am I right now?" Run it before any change. The number of incidents that start with the wrong account is not small.

## The services this folder covers

| Need | Service | Note |
| --- | --- | --- |
| a private network | [VPC](vpc.md) | subnets, routes, gateways |
| who can call the API | [IAM](iam.md) | users, roles, policies |
| a virtual machine | [EC2](ec2.md) | compute you manage |
| a relational database | [RDS](rds.md) | database AWS manages |
| object storage | [S3](aws-s3.md) | buckets and objects |
| functions and events | [Serverless](serverless.md) | Lambda and friends |

Deeper cuts of the same topics: [IAM in practice](aws-iam.md), [EC2 in production](aws-ec2.md).

## A useful default architecture

```text
public subnets          load balancer, NAT gateway
private app subnets     EC2 or containers, no public IPs
private data subnets    RDS, no route to the internet
```

Traffic from the internet hits the load balancer. The application talks to the database inside the VPC. The database has no public address. That shape shows up in almost every design discussion, and it is the shape the rest of these notes assume.
