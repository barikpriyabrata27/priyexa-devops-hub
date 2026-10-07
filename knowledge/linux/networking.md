# Networking

> **Separate name resolution from connectivity. A wrong name and a closed port are different faults and the commands are different.**

```bash
dig app.internal
ss -lntp
ip route
curl -sv --max-time 5 http://127.0.0.1:8080/health
```

`dig` asks DNS and shows which server answered. `NXDOMAIN` means the name is not there. `SERVFAIL` means the resolver could not finish the lookup. A correct address means you should stop calling it DNS. `ss -lntp` shows what is listening, and as whom. `curl` to localhost tells you whether the process answers. `curl` from another machine tells you whether the path allows it.

```text
connection refused     the host is reachable and nothing is listening
timed out              a filter or a route is dropping packets
DNS error              the name never became an address
```

A timeout is not a refusal. Opening a security group does not fix a process bound to `127.0.0.1`. A process bound to `127.0.0.1` answers on the machine and nowhere else, which is a constant surprise inside containers.

## Routes

`ip route` shows the default gateway. If every destination fails, the fault is local or the gateway. If one destination fails, the fault is that path. `ping` proves almost nothing about TCP. Test the port you care about.

In Kubernetes the pod's resolver is CoreDNS, written in `/etc/resolv.conf`. Names that work on your laptop and fail in the pod are split DNS or a private zone. Read [GCP networking](../gcp/networking.md) or [AWS VPC](../aws/vpc.md) when the packet has already left the machine. This page stops at the host.
