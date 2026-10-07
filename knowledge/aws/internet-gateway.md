# Internet Gateway

> **An internet gateway lets instances with public IP addresses talk directly to the internet, in both directions.**

It is horizontally scaled and managed. You do not patch it. You attach one to the VPC — one is enough — and you point routes at it.

```text
internet
    │
    ▼
internet gateway          attached to the VPC
    │
    ▼
public subnet route  0.0.0.0/0 → igw
    │
    ▼
instance with a public IPv4 or IPv6 address
```

## Both halves are required

A route to the gateway without a public address goes nowhere useful. A public address without a route goes nowhere either. AWS rewrites traffic between the instance's private address and its public address at the gateway. You do not configure that NAT yourself for inbound instances. You do configure a separate NAT gateway when the instance must stay private and still open outbound connections. That is [NAT](nat.md).

## What people place behind it

- An Application Load Balancer or Network Load Balancer in public subnets
- A bastion, if you still use one — prefer SSM Session Manager and skip the open SSH port
- A NAT gateway

Not the database. Not the application nodes, if you can put them behind a load balancer. Every public address is a surface.

## Egress-only internet gateway

For IPv6, an egress-only internet gateway allows outbound traffic and blocks unsolicited inbound traffic. IPv6 on instances is publicly routable. There is no separate private IPv6 the way RFC 1918 works for IPv4. If you enable IPv6, decide the route on purpose.

## Cost and failure

The internet gateway itself has no hourly charge. Data transfer out of AWS still costs money. The gateway is not the thing that fails in an architecture review. The thing that fails is a security group of `0.0.0.0/0` on port 22, plus a key pair shared in a chat, plus a public IP you forgot was assigned.

Detach is rare. You cannot detach a gateway while routes still target it. Delete the routes first.
