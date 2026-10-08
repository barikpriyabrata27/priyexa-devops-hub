# VPN, peering, and private paths

> **Connect two networks with a route you can name. Do not put a production database on a public address because the VPN was annoying to set up.**

```text
site-to-site VPN     two networks, one encrypted tunnel, routes for each other's prefixes
client VPN           a person becomes a member of the network for the session
peering              two cloud networks exchange routes directly, usually not transitive
private endpoint     a service published as a private address in your network
bastion / SSM        a controlled way for a human to reach a host, not a way for networks to merge
```

A VPN encrypts traffic between two places that already have routing. It does not invent addressing. If both sides use `10.0.0.0/16`, the tunnel comes up and the routes conflict. Fix the plan in [addressing](addressing.md) before building the tunnel.

## Peering is not transitive

```text
A ──peer── B ──peer── C
```

A can talk to B, and B can talk to C. A cannot talk to C through those two peerings. Every pair that must communicate needs its own peering, or you put a transit network in the middle and accept the cost and the extra hop. This surprises teams who draw a mesh and assume a cloud will forward across it.

Peering also fails when CIDR ranges overlap. The cloud will refuse the route. NAT in front of one side is a last resort for a partner you do not control.

## Private endpoints

PrivateLink, Private Service Connect, and similar products put a network interface for a managed service inside your VPC. Traffic to the service does not cross the internet and does not require a peering to the provider's whole network. Security groups still apply to that interface. DNS must point the service name at the private address, or clients will keep using the public one and you will think the endpoint is broken.

## Human access is a different problem

A bastion is a small host that is allowed to SSH onward. It becomes a shared admin box unless logins are personal and recorded. Prefer a managed path that does not leave a long-lived key on the bastion: SSM Session Manager, IAP, or short-lived certificates. See [Linux SSH](../linux/ssh.md).

A client VPN for every developer, with routes to the entire production supernet, is a flat network with extra steps. Split-tunnel so internet traffic does not hairpin through the office, and publish only the prefixes a person needs. Full-tunnel is for a threat model that requires it, not the default because the checkbox was there.

## When the tunnel is "up" and nothing flows

Phase 1 and phase 2 of IPsec being green means the encryption negotiated. It does not mean a route exists, or that a firewall on either side allows the inner packets. Check the route tables on both sides, then a firewall rule for the inner addresses, then a TCP connect to the real port. The VPN status page is the wrong place to stop.
