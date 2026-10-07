# Containers on GCP

> **Google Cloud will run a container in several places. The choice is how much of the cluster you want to see.**

```text
a container image in Artifact Registry
        │
        ├── Cloud Run            HTTP or events, no cluster to babysit
        ├── GKE                  Kubernetes, you own the objects
        ├── Cloud Run jobs       a container that runs and exits
        └── Compute Engine       you install Docker yourself, rarely the point
```

Build the image once, scan it, store it in Artifact Registry in the same region as the runtime, and deploy by digest or by an immutable tag. `:latest` is not a release. It is a moving pointer. See [container scanning](../devsecops/container-scanning.md) and the [Docker notes](../docker/README.md).

## Artifact Registry

It replaces the older Container Registry. Repositories hold Docker images and language packages. IAM on the repository decides who can push. A pull from Cloud Run or GKE uses the runtime service account. Grant that account `roles/artifactregistry.reader` on the repo, not project Editor.

## Which runtime

| You need | Choose |
| --- | --- |
| an HTTP API, scale to zero, little platform work | [Cloud Run](cloud-run.md) |
| a batch container | Cloud Run jobs |
| many services, custom networking, Kubernetes APIs | [GKE](gke.md) |
| a function and a trigger | [Cloud Functions](cloud-functions.md) |

Teams get into trouble by running GKE for one service, or by forcing Cloud Run to behave like a VM (local disk, background threads, no `PORT`). Match the platform to the shape of the process.

## Supply chain, briefly

The pipeline builds, scans, signs if you are ready for that discipline, and pushes. Production pulls only from the prod project’s registry, not from a developer’s laptop tag. Binary Authorization can require an attestation before GKE runs an image. That is a policy gate, not a scan. The scan finds the CVE. The policy decides whether the CVE is allowed to reach a node.
