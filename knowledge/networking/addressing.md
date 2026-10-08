# Addressing and CIDR

> **A CIDR is a promise about which addresses belong together. Overlap is cheap to type and expensive to peer.**

An IPv4 address is 32 bits, written as four numbers. `10.20.0.15` is one host. `10.20.0.0/24` is the 256 addresses that share the first 24 bits. The `/24` is the prefix length. Longer prefix means a smaller network.

```text
10.20.0.0/16     65,536 addresses     a regional VPC-sized block
10.20.0.0/24        256 addresses     one subnet
10.20.0.0/32          1 address       a single host, often a route or a NAT target
```

Two addresses are subtracted in practice: the network address and the broadcast address in a classic subnet. Cloud subnets also reserve a handful for the gateway and services. Do not plan a `/28` as if all 16 addresses are usable instances.

## Private ranges

[RFC 1918](https://www.rfc-editor.org/rfc/rfc1918) reserves these for networks that are not on the public internet:

```text
10.0.0.0/8
172.16.0.0/12      172.16.0.0 through 172.31.255.255, not all of 172.0.0.0/8
192.168.0.0/16
```

They are not secret. Every company uses them. They are not routable between strangers on the internet, which is why NAT exists, and why two VPCs that both chose `10.0.0.0/16` cannot be peered cleanly. Write down which account, region, and environment owns which slice before the second network is created. A spreadsheet beats a later renumber.

`169.254.0.0/16` is link-local. You will see it when DHCP failed. `127.0.0.0/8` is the local machine only. A process bound to `127.0.0.1` is healthy and unreachable from everywhere else.

## Public addresses

A public address is one the internet will route. Owning one does not publish your service. A route and a firewall still have to allow the port. Losing a public address that other people have cached, allow-listed, or hardcoded is an outage even when the application is fine. Elastic IP and static addresses exist so a replaceable instance can keep a stable address.

## IPv6

IPv6 addresses are 128 bits. The same ideas hold: prefix length, routing, firewalls. Cloud VPCs increasingly give you both. Dual-stack means the service must listen, be allowed, and be named in DNS for both families. An allow-list that covers only IPv4 is a hole the moment clients prefer IPv6. An IPv6 listener with no firewall rule is how a "private" service becomes public without anyone creating a public IPv4.

## Overlap is the production bug

```text
account A    10.20.0.0/16
account B    10.20.0.0/16
                 │
                 └── peering, VPN, or a merger
                     routing cannot tell them apart
```

NAT between them is a workaround, not a design. Pick non-overlapping ranges. Leave gaps so a VPC can grow without a migration. See [VPN and peering](vpn-peering.md) for what happens when you connect them anyway.
