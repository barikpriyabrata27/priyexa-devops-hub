# Cloud Run

> **Cloud Run runs a container when requests arrive, scales it, and can scale it to zero. You do not manage the nodes.**

```text
HTTPS request or event
        │
        ▼
Cloud Run service
        │
        ├── container listening on PORT
        ├── concurrency: how many requests per instance
        └── runtime service account
```

The container must listen on the port in the `PORT` environment variable, default 8080. If it listens on 80 because that is what the Dockerfile said, the revision never becomes healthy and the error is a timeout, not a helpful sentence.

## Revisions and traffic

Every deploy creates a revision. You can send 5% of traffic to the new revision and the rest to the last good one. That is a canary without a cluster. Rolling back is pointing traffic at the previous revision, which is still there until you delete it.

## Scaling

Minimum instances remove cold starts and cost money while idle. Maximum instances cap a runaway bill and cap capacity. Concurrency is how many requests one container handles at once. A CPU-heavy request wants low concurrency. An I/O-waiting request can share. Set the CPU to be allocated only during requests when you want to pay less, and always-on CPU when the process needs background work. Those two settings surprise people who port a VM app that assumes it is always running.

## Security

Require authentication unless the service is truly public. "Allow unauthenticated" is a checkbox that becomes a public API. The runtime service account should read only the secrets and buckets this service needs. Ingress can be restricted to internal traffic or to a load balancer, so the service is not a second front door around the WAF.

Cloud Run is the right size for an HTTP service that does not need the Kubernetes object model. When you need sidecars, DaemonSets, or a complex service mesh, you have outgrown it and [GKE](gke.md) earns its complexity. A single function-shaped handler might be simpler as [Cloud Functions](cloud-functions.md).
