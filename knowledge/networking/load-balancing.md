# Load balancing

> **A load balancer spreads connections across healthy backends. If the health check is a lie, it spreads them across broken ones with confidence.**

```text
clients
   │
   ▼
load balancer          one address, many backends
   │
   ├── app replica
   ├── app replica
   └── app replica
```

Layer 4 balancing uses IP and port. It does not read the HTTP path. It is simple, fast, and can pass TLS through without decrypting it. Layer 7 balancing reads the request. It can route `/api` and `/static` to different pools, inject headers, and terminate TLS. It costs a decryption and it becomes a place that can fail independently of the app.

## Health checks

The check should ask the question you care about, on the port you serve, at an interval shorter than the time you are willing to send traffic to a dead process.

```text
TCP connect only        the process accepts connections; it may still error every request
HTTP /health 200        whatever the handler decides to check
deep check              database and cache; can mark the whole fleet down together
```

A deep check that fails when the database fails removes every replica at once, which is worse than serving errors from one bad pod. Check local process health in the load balancer. Alert on the dependency separately. A check that always returns 200 is how a drained or broken instance stays in service. See [HTTP and TLS](http-tls.md).

## Draining and stickiness

Connection draining, or deregistration delay, stops new work and lets in-flight requests finish before a deploy kills the process. Skipping it is how a rolling update becomes a burst of 502s.

Sticky sessions pin a client to one backend. They hide an application that stores session state in memory. They also pin load to one replica and make deploys wait for that pin to expire. Prefer shared session state, and use stickiness only as a bridge.

## Where it sits

```text
internet → public balancer → app subnet
east-west → internal balancer → services that must not be public
```

An internal balancer has a private address. It still needs routes and firewall rules between the caller and the backends. "Internal" does not mean "reachable from every VPC you own."

Cross-zone balancing sends traffic to healthy replicas in other zones. It survives a zone failure and it can cost cross-zone data. Disabling it keeps traffic local and can overload one zone while another sits idle. For Kubernetes Services and Ingress, the same ideas apply with different object names. See [Kubernetes networking](../kubernetes/kubernetes-networking.md).
