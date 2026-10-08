# Networking for DevOps

This folder is the network path a request actually takes, from a name in DNS to a packet that is allowed, routed, and answered. It is not a vendor certification dump. Cloud consoles and Kubernetes sit on top of these rules.

```text
name  →  address  →  route  →  filter  →  handshake  →  application
DNS       IP         gateway   firewall   TCP/TLS      HTTP
```

A failure at each step looks different. Treat them as different faults.

```text
NXDOMAIN / SERVFAIL     the name never became an address
connection refused      the host answered, nothing is listening
timed out               something dropped the packet, or the path is wrong
TLS error               you reached a process that is not the certificate you expected
HTTP 502 / 504          you reached a proxy, and the thing behind it failed or was slow
```

The host commands live in [Linux networking](../linux/networking.md). The cloud drawings live in [AWS VPC](../aws/vpc.md) and [GCP networking](../gcp/networking.md). The cluster overlay lives in [Kubernetes networking](../kubernetes/kubernetes-networking.md).

## The pages

- [OSI and TCP/IP](osi-model.md) — which layer you are actually debugging
- [Addressing and CIDR](addressing.md) — who owns which range
- [TCP and UDP](tcp-udp.md) — handshakes, ports, and what a timeout is
- [DNS](dns.md) — resolvers, records, and caches that lie
- [HTTP and TLS](http-tls.md) — status codes, certificates, and proxies
- [Routing and NAT](routing-nat.md) — how a packet picks a path, and how NAT hides it
- [Firewalls](firewalls.md) — stateful filters, and why "private" is not a policy
- [Load balancing](load-balancing.md) — layer 4, layer 7, and health checks that lie
- [VPN, peering, and private paths](vpn-peering.md) — connecting networks without putting them on the internet
- [Advanced concepts](advanced.md) — MTU, BGP, anycast, QUIC, and captures
