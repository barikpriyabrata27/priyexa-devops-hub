# Amazon VPC

> **A VPC is your private network inside one AWS region. Nothing else in that account can talk to your instances until you decide the routes and the firewall rules.**

```text
VPC  10.20.0.0/16
│
├── public subnet   10.20.0.0/24    AZ a     route → internet gateway
├── public subnet   10.20.1.0/24    AZ b
├── private subnet  10.20.10.0/24   AZ a     route → NAT gateway
├── private subnet  10.20.11.0/24   AZ b
└── data subnet     10.20.20.0/24   AZ a     no path to the internet
```

The VPC is regional. Subnets live in one Availability Zone. A subnet is "public" because its route table points `0.0.0.0/0` at an internet gateway and its instances have public IPs. The name in the console is a label. The route is the truth. See [subnet](subnet.md), [route table](route-table.md), [internet gateway](internet-gateway.md), and [NAT](nat.md).

## CIDR, said simply

`10.20.0.0/16` means the first 16 bits are the network and you have the rest for addresses, about 65 thousand. Subnets carve that up. Overlap is forbidden inside a VPC, and it is painful between VPCs you later want to peer. Pick a range from RFC 1918 (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`) and write down which account owns which slice before the second VPC exists.

## What a VPC does not include

Creating a VPC in Terraform or the CLI does not automatically give you a place to log in from home. You add an internet gateway, routes, and a security group. The default VPC that AWS sometimes creates for an account is convenient and a poor production design, because it is public-by-habit. Build your own.

## Connecting VPCs and the office

- **VPC peering** connects two VPCs. Routes are not transitive. A peered to B and B peered to C does not let A reach C.
- **Transit Gateway** is the hub when many VPCs and a corporate network must meet.
- **Site-to-site VPN** or **Direct Connect** connects the office or the data center.
- **VPC endpoints** let private subnets reach S3, DynamoDB, or other AWS APIs without a NAT gateway and without the public internet.

## Security is two layers

[Security groups](security-group.md) wrap an instance or an RDS node. They are stateful. Network ACLs wrap a subnet. They are stateless. Start with security groups. Add a NACL when you need a coarse deny at the subnet edge. Default NACLs allow all. Do not "lock down" a NACL on a Friday without remembering that return traffic needs an explicit allow.

## A design you can defend

Three tiers, at least two Availability Zones, database subnets with no default route, flow logs enabled to S3 or CloudWatch, and no overlapping CIDR with the rest of the company. Flow logs answer "did the packet arrive?" when a security group argument is going nowhere.
