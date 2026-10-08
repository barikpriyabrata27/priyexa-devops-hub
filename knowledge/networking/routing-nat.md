# Routing and NAT

> **A route says where to send a packet next. NAT rewrites the address. They solve different problems and people mix the names up.**

Every host has a routing table. The most specific matching prefix wins, not the first line a human would read.

```text
10.20.0.0/24   dev eth0          directly connected
10.0.0.0/8     via 10.20.0.1     toward the rest of the private network
0.0.0.0/0      via 10.20.0.1     the default route, "everything else"
```

`0.0.0.0/0` is the default. If one destination fails and others work, the default route is probably fine and that one path is not. If every destination fails, look at the local route and the gateway. `ip route` shows this on Linux.

Routers along the path do the same lookup. The return path is a separate lookup on each hop. The path out and the path back do not have to match.

## Asymmetric routing

```text
client ──▶ firewall A ──▶ server
client ◀── firewall B ◀── server
```

Firewall A saw the SYN. Firewall B sees the SYN-ACK and has no connection to attach it to, so it drops it. The client times out. The server thinks it answered. Stateful devices must see both directions, or you must turn state off and accept the risk. This shows up with redundant firewalls, multi-homed servers, and "optimized" routes that send replies a different way.

## NAT

Network address translation rewrites IP addresses, and often ports, as a packet crosses a boundary.

```text
SNAT / masquerade    private host → internet looks like the NAT's public address
DNAT / port forward  internet:443 → a private host:8443
```

SNAT is how a private subnet reaches package registries without a public address on each instance. The return packets are matched to the connection. A new inbound connection is not. NAT is not an access policy. The firewall next to it is.

DNAT is how a public load balancer or a home router publishes one service. The backend still sees the NAT device unless the proxy protocol or an equivalent passes the original client.

Carrier-grade NAT and cloud NAT gateways run out of ports when many clients share one public address and open many connections. Symptoms look like random timeouts to one destination. The fix is more addresses, fewer connections, or a private path such as a VPC endpoint that avoids NAT entirely. See [AWS NAT](../aws/nat.md).

## Traceroute is a hint

`traceroute` sends packets with increasing TTL and collects the ICMP replies from each hop. It shows a path, not the path of your TCP connection, and many hops refuse to answer. A star in the output is an unanswered probe, not proof that the hop is down. Use it to find where replies stop. Confirm with a TCP connect to the real port.
