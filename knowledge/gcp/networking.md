# GCP Networking

> **A VPC network in Google Cloud is global. Subnets are regional. Routes and firewalls decide who can talk.**

This surprises people coming from AWS, where each VPC is stuck in one region.

```text
VPC (global)
  ├── subnet asia-south1      10.20.0.0/20
  ├── subnet asia-south2      10.24.0.0/20
  └── firewall rules (global to the VPC, targeted by tags or service accounts)
```

You do not create a new VPC per region. You add a subnet in the region where the workloads run. Subnets can be expanded later without recreation, which is a kindness AWS subnets do not offer.

## Firewall rules

Rules have direction, priority, and a target. A target can be a network tag or, better, a service account. "Apply this rule to every VM running as `app-sa`" survives instance replacement. Tags survive only if every new instance remembers the tag.

```text
priority 1000   allow tcp:443    from 0.0.0.0/0     target tag https
priority 1000   allow tcp:5432   from service account app-sa
                                 target service account db-sa
implied deny ingress at the bottom
implied allow egress at the bottom
```

The implied deny means a VM with no allow rule is not reachable. The implied allow egress means a VM can open outbound connections unless you write a deny. Private does not mean "no internet" until you delete the default route to the internet gateway or override it.

## Private Google access and Cloud NAT

Private Google Access lets a VM with only an internal IP reach Google APIs such as Cloud Storage. Cloud NAT lets private VMs reach the rest of the internet without inbound addresses. Put databases on no NAT and no public IP. Put application nodes behind NAT only if they must patch or call external APIs.

## Sharing a network

Shared VPC lets a host project own the network and service projects place VMs into it. The platform team controls routes and firewalls. Application teams consume subnets. It is the grown-up layout once more than one team shares an address plan. Until then, one VPC per environment project, non-overlapping CIDRs, and firewall rules you can read aloud are enough.

VPC Flow Logs are the packet diary when "the firewall should allow it" and the connection still times out.
