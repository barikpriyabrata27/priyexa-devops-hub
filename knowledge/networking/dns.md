# DNS

> **DNS answers "what address is this name?" It does not prove the port is open, and a cached wrong answer outlives the outage that caused it.**

```text
application
    │  app.example.com
    ▼
recursive resolver          the one in resolv.conf, or 8.8.8.8, or the VPC resolver
    │
    ▼
authoritative server        the zone that owns example.com
    │
    ▼
answer:  A  203.0.113.10    cached for TTL seconds
```

The recursive resolver does the walking of the hierarchy for the client. The authoritative server is the one that is allowed to answer for that zone. Asking a random resolver and asking the authoritative server can disagree while a cache is stale. When a change "has not propagated," you are usually looking at a cache, not at the protocol failing to spread.

## Records you will actually edit

```text
A        name → IPv4
AAAA     name → IPv6
CNAME    name → another name, not an address
NS       which servers are authoritative for a zone
TXT      verification, SPF, and whatever a vendor told you to paste
MX       where mail goes
SRV      host and port for a service, used more inside some platforms than on the public web
```

A CNAME cannot sit at the zone apex next to other records in classic DNS. Alias and ANAME records at some DNS providers are how `example.com` points at a load balancer without that limitation. A CNAME chain adds lookups. Pointing a CNAME at a CNAME at a CNAME is how a simple rename becomes a latency bug.

## Failures

```text
NXDOMAIN     the name is not in the zone
SERVFAIL     the resolver could not get a usable answer
NOERROR      the name exists; the record type you asked for might not
timeout      you never reached a resolver
```

`NXDOMAIN` is cached too. A negative cache is why creating a record does not fix every client instantly. Lower the TTL before a migration, not during it. A TTL of 300 seconds is a common choice for a name you expect to move. A TTL of a day is fine for a name that never moves, and painful for one that does.

## Split views

The same name can resolve to a private address inside the VPC and a public address on the internet. Laptops on the corporate DNS and pods using CoreDNS are not the same resolver. "It works on my machine" is often this. Inside Kubernetes, `/etc/resolv.conf` points at the cluster DNS, and `ndots` makes short names try several suffixes before the absolute name. A name that is slow only in-cluster is a search-list problem as often as it is an upstream problem.

Check the resolver you are actually using.

```bash
dig app.example.com
dig app.example.com @1.1.1.1
dig +trace app.example.com
```

The first uses the system resolver. The second bypasses it. `+trace` walks from the root and shows who is authoritative. If those three disagree, believe the one the failing client uses, then fix that cache or that zone.

DNSSEC validates that the answer was not forged. A broken signature looks like a `SERVFAIL` to clients, which is a hard outage, not a warning. Roll keys the way the operator documents, and do not enable it on a zone you cannot monitor.
