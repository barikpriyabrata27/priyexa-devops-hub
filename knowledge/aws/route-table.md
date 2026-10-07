# Route Table

> **A route table is a list of "where next?" rules for packets leaving a subnet. The most specific route wins.**

```text
Destination        Target
10.20.0.0/16       local              stay inside the VPC
0.0.0.0/0          igw-abc            public subnet: the internet
0.0.0.0/0          nat-abc            private subnet: outbound only
10.50.0.0/16       pcx-abc            a peered VPC
172.16.0.0/12      vgw-abc            the office, over VPN
```

Every subnet is associated with exactly one route table. A subnet with no explicit association uses the VPC's main route table. That default is a trap: someone adds an internet route to main "just to test," and every forgotten subnet becomes public.

## Longest prefix match

A packet to `10.20.1.15` matches `10.20.0.0/16` (local) and would also match `0.0.0.0/0`. The longer prefix wins, so it stays local. A packet to `8.8.8.8` matches only the default route. If the default route is missing, the packet is dropped. "The instance has a public IP but I cannot reach it" is often a missing route, not a missing security group.

## Local is automatic

The VPC CIDR route target `local` is in every route table and cannot be removed. Subnets in the same VPC can address each other at layer 3 without you adding routes. Isolation between tiers is therefore not "they are different subnets." It is security groups. Subnets separate failure domains and route policy. Security groups separate who may connect.

## Public versus private, again

```text
public route table
  10.20.0.0/16 → local
  0.0.0.0/0    → internet gateway

private route table
  10.20.0.0/16 → local
  0.0.0.0/0    → NAT gateway in a public subnet
```

The NAT gateway itself sits in a public subnet, because its own traffic must reach the internet gateway. Pointing a private route at an internet gateway does nothing useful for instances without public IPs, and it is the wrong tool even for ones that have them.

## Checks when traffic fails

1. Which route table is the subnet actually associated with?
2. Is there a route for that destination?
3. Does the target (NAT, gateway, peering) exist and, for NAT, live in a public subnet?
4. Only then open the security group.

Route tables are free. Confusion is not. Name them `public-a`, `private-a`, `data`, and associate them on purpose.
