# Cloud Load Balancing

> **A load balancer publishes one address and sends traffic to healthy backends. On Google Cloud the global external load balancer is anycast: users enter at the edge closest to them.**

```text
user
  │
  ▼
forwarding rule     the address and port
  │
  ▼
target proxy        terminates TLS if this is HTTPS
  │
  ▼
URL map             host and path decide the backend
  │
  ▼
backend service     health checks, capacity, CDN
  │
  ├── managed instance group in asia-south1
  └── Cloud Run or NEG in another region
```

## Which balancer

| Traffic | Typical choice |
| --- | --- |
| public HTTPS | global external Application Load Balancer |
| public TCP that is not HTTP | external passthrough Network Load Balancer |
| only inside the VPC | internal load balancer |

The application load balancer understands hosts and paths, so `/api` and `/` can be different backends. It can terminate TLS with a Google-managed certificate. The network load balancer does not look inside the bytes. Use it when the protocol is not HTTP.

## Health checks are the product

Backends that fail the check receive no new traffic. A check that hits `/` on a server that returns 200 even when the database is gone will keep sending users into the hole. Check a path that means "this instance can do the job." Make the check's firewall rule explicit. Google's health checkers come from published ranges. Forgetting that rule looks like every backend is unhealthy while SSH still works.

## TLS

Managed certificates remove the weekend renewal. They need the DNS name to point at the load balancer before they will provision. A certificate on the VM plus a second certificate on the load balancer is fine when you mean to encrypt twice. It is accidental complexity when you did not.

## A failure story you should be able to tell

One zone's instances fail the check. The balancer shifts traffic to the other zone. Users see a slower page, not an outage. If both zones share one database and the database is the thing that failed, the balancer cannot help. Load balancing is not redundancy of your data.
