# GKE

> **GKE is Kubernetes where Google runs the control plane. You still run the workloads, the IAM, the network policy, and the upgrade choices.**

If Kubernetes itself is the gap, read the [Kubernetes notes](../kubernetes/README.md) first. This page is only the Google-shaped edges.

```text
you apply manifests or a Helm chart
        │
        ▼
GKE control plane          Google-managed, regional or zonal
        │
        ▼
node pool                  Compute Engine VMs, or Autopilot where nodes fade
        │
        ▼
pods, with Workload Identity for Google APIs
```

## Modes

**Standard** shows you the node pools. You choose machine types, sizes, and when to upgrade nodes. **Autopilot** bills per pod resource request and Google picks the nodes. Autopilot is less to operate and less flexible. Standard is the right answer when you need DaemonSets that Autopilot restricts, special hardware, or a node image you control.

Regional clusters have a control plane replicated across zones. Zonal clusters are cheaper and a weaker production default.

## Identity

Nodes use a service account. Replace the default Editor account. Pods that must call Google APIs use Workload Identity: a Kubernetes service account is bound to a Google service account, and the pod never mounts a key. This is the same lesson as IRSA on EKS and instance profiles on EC2.

## Release channels

Rapid, regular, and stable are how fast Google upgrades the control plane. Pick one. Node upgrades should follow, with a surge so capacity exists during the drain. A cluster nobody has upgraded in a year becomes a forced upgrade at the worst time. Disruption budgets on your workloads make those upgrades boring.

## Network

VPC-native clusters use alias IP ranges for pods. Plan the ranges before the cluster exists. Exhausting pod IPs looks like "unschedulable" and is not fixed by a bigger node. Private clusters give nodes only internal IPs. You reach the API through authorized networks or a private endpoint. Public API plus a wide authorized network is the setting that shows up in incident reports.

## What GKE will not do for you

It will not choose sensible requests and limits, write a PodDisruptionBudget, or stop a container that runs as root. Those are the Kubernetes notes. GKE will cheerfully run an insecure pod on a very reliable control plane.
