# Advanced concepts

> **The outages that survive the basic checks are usually path MTU, a route that is only wrong in one direction, or a name that moved and a cache that did not.**

These are the topics that show up after DNS, ports, and security groups have already been ruled out.

## MTU and black holes

The maximum transmission unit is the largest packet a hop will carry. Ethernet is often 1500 bytes. Tunnels, VPNs, and overlays wrap extra headers, so the inner packet must be smaller. If a hop cannot carry the packet and also cannot send back "fragmentation needed," the sender never learns to shrink it. Small requests work. A large TLS handshake or a big POST hangs. That is a path-MTU black hole.

```text
works:    curl of a tiny health check
hangs:    a request or certificate exchange above the tunnel MTU
```

Clamping TCP MSS on the tunnel, or setting a lower MTU on the interface, is the usual fix. Guessing "the app is slow" is how this incident lasts a day.

## BGP

Border Gateway Protocol is how networks on the internet tell each other which prefixes they can reach. You rarely speak BGP yourself. Your cloud and your DNS provider do. What you need to know:

- A prefix announcement is a route advertisement. Withdraw it, and the world eventually stops sending traffic there.
- Propagation is not instant, and not uniform. One provider can still be sending users to the old site.
- A more specific prefix wins. Announcing `203.0.113.0/25` when you meant the `/24` can pull in traffic you did not expect.
- Hijacks and leaks happen. RPKI is how operators sign which AS may announce a prefix. It is not something an application sets in a config map, and it is why "we announced the range" still needs an owner.

Anycast announces the same address from several places. Routing delivers the client to a nearby site. It is how many DNS and CDN edges work. The client is not guaranteed to stay on one site for the whole session unless the application or the route is sticky. A health-driven withdrawal should stop announcing a dead site. If it does not, anycast keeps delivering users to the outage.

## QUIC and HTTP/3

QUIC runs over UDP and carries many streams so one lost packet does not stall the others. HTTP/3 uses it. Middleboxes that allow TCP/443 and drop UDP, or that assume they can read TLS, break it. Provide a fallback, and test UDP/443 as its own path. See [TCP and UDP](tcp-udp.md).

## Congestion and retries

TCP slows down when packets are lost. That is congestion control, and it is why a saturated link shows rising latency before it shows errors. Application retries on top of that, with no jitter, make the congestion worse. Use timeouts, a limited number of retries, and backoff. A circuit breaker stops calling a dependency that is already failing so the threads you have can serve the traffic you can still help.

## Packet capture

When logs disagree, look at the packets on the host that is supposed to be receiving them.

```bash
sudo tcpdump -ni any host 203.0.113.10 and port 443
```

You want to know whether the SYN arrived, whether a SYN-ACK left, and whether the conversation then died during TLS. A capture on the client and a capture on the server answer "who stopped talking." Do not capture full payloads on a production interface and leave them on disk. Headers are usually enough, and payloads may be secrets.

## Asymmetric paths and hairpins

Return traffic that takes a different firewall was covered in [routing](routing-nat.md). A hairpin is traffic that leaves a network and comes back in to reach a neighbor, often because a public DNS name was used for a private service. It costs money, it depends on the NAT device, and it breaks when that device does not support hairpin. Private DNS that answers with the private address avoids it.

## What "advanced" does not mean

You do not need to recite timer values from a textbook. You do need to say, in an incident, whether you are looking at a name, a route, a filter, a handshake, or a byte size that a tunnel cannot carry. The rest of this folder is that sequence. Cloud and Kubernetes add objects on top. They do not replace it.
