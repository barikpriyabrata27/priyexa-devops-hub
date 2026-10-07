# GCP Fundamentals

> **Google Cloud is organized as organization, folders, projects, and resources. The project is the usual boundary for billing, APIs, and IAM.**

```text
Organization
  └── Folder (platform, product, sandbox)
        └── Project          enable APIs here, attach billing here
              └── Resources  instances, buckets, clusters, in a region and zone
```

A project is closer to an AWS account than to a "folder of VMs." Give production its own project. Enable only the APIs you use. A fresh project cannot create a VM until `compute.googleapis.com` is enabled. That friction is useful.

## Regions and zones

A region such as `asia-south1` contains zones `asia-south1-a`, `asia-south1-b`, and `asia-south1-c`. Zonal resources live in one zone and die with it. Regional resources, such as a regional disk or a regional managed instance group, are spread by Google. Pick the region for latency and for the data-residency promise you made, then use more than one zone.

## How you will actually work

```bash
gcloud config set project priyexa-dev
gcloud auth login
gcloud services list --enabled
```

The console, `gcloud`, and Terraform all call the same APIs. Application Default Credentials are how client libraries and Terraform find a login. On your laptop that is your user. On a VM or GKE node it should be the attached service account, not a downloaded JSON key. Keys leak. Attached identities do not sit in git.

## Shared responsibility, said once

Google runs the buildings, the network fabric, and the managed control planes. You choose IAM, network exposure, whether a bucket is public, and what your container does. Cloud Storage does not protect you from `allUsers` as a viewer. Cloud SQL does not protect you from a public IP plus a weak password.

The map of this folder:

| Question | Page |
| --- | --- |
| How do I click and script it? | [Console and CLI](gcp-console-cli.md) |
| Who may do what? | [IAM](iam.md) |
| Where does the network live? | [Networking](networking.md) |
| A virtual machine? | [Compute Engine](compute-engine.md) |
| Many identical VMs? | [Managed instance groups](managed-instance-groups.md) |
| Kubernetes? | [GKE](gke.md) |
| A container without a cluster? | [Cloud Run](cloud-run.md) |
| A function? | [Cloud Functions](cloud-functions.md) |
| Objects, SQL, names, load balancers? | the matching notes below |

AWS equivalents live in [AWS fundamentals](../aws/aws-fundamentals.md). The vocabulary differs. The ideas — account boundary, private network, least privilege, managed database — do not.
