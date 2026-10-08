# TCP and UDP

> **TCP is a conversation with a handshake and retransmits. UDP is a datagram. Choosing the wrong one shows up as latency, or as a protocol that never connects.**

```text
client                         server
  │──── SYN ──────────────────▶│
  │◀─── SYN-ACK ───────────────│
  │──── ACK ──────────────────▶│
  │        connection open     │
  │──── data ─────────────────▶│
  │◀─── ACK ───────────────────│
```

That is the three-way handshake. `connection refused` means the SYN reached a host and nothing accepted that port, so you got a RST. `timed out` means the SYN was not answered. A firewall drop, a black hole route, and a host that is down all look like a timeout. They do not look like a refusal.

UDP has no handshake. DNS, NTP, and many streaming and game protocols use it. QUIC uses UDP and then builds its own reliability on top, which is why HTTP/3 can fail in networks that allow TCP/443 and drop UDP/443.

## Ports

A port is a number on a host, from 1 to 65535. The pair that identifies a connection is source address, source port, destination address, destination port, and protocol.

```text
well known     22 SSH, 53 DNS, 80 HTTP, 443 HTTPS, 5432 Postgres
ephemeral      the client's temporary source port, often a high number
```

Listening on `0.0.0.0:443` means every address on the host. Listening on `127.0.0.1:443` means only local clients. A security group that allows the world does not fix a bind address of localhost. `ss -lntp` on Linux shows who is listening.

## What the states tell you

`ESTABLISHED` is a working connection. A pile of `SYN_SENT` means clients cannot complete the handshake. `CLOSE_WAIT` piling up means your process accepted the close and never called close itself; that is an application bug, not a firewall. `TIME_WAIT` on the side that closed first is normal and keeps old packets from being accepted as part of a new connection. Tens of thousands of them can exhaust ports. Reuse and shorter connection lifetimes, not "disable TIME_WAIT," are the usual fix.

## Reliability is not free

TCP retransmits lost packets and delivers bytes in order. A single lost packet can stall the stream until it is recovered. That is head-of-line blocking, and it is one reason HTTP/2 on a bad network can feel worse than HTTP/1.1. UDP does not wait. The application either tolerates loss or implements its own repair, as QUIC does per stream.

## Timeouts you should set

The operating system connect timeout is long. A health check, a deploy probe, and an HTTP client in a pipeline need their own, measured in seconds. A call with no timeout holds a worker until a person notices. Retries without a budget turn a short blip into a thundering herd. See [HTTP and TLS](http-tls.md) for the status codes you get once the handshake has already succeeded.
