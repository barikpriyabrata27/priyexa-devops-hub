# Compute Engine

> **Compute Engine is a virtual machine: an image, a machine type, a zone, a disk, and a service account.**

```bash
gcloud compute instances create web-1 \
  --zone=asia-south1-a \
  --machine-type=e2-small \
  --image-family=debian-12 \
  --image-project=debian-cloud \
  --subnet=app \
  --no-address \
  --service-account=app-sa@priyexa-dev.iam.gserviceaccount.com \
  --scopes=cloud-platform
```

`--no-address` means no public IP. You reach the VM through IAP or a load balancer, not through SSH on the open internet.

```text
IAP tunnel or OS Login
        │
        ▼
VM in a private subnet
        │
        ├── boot disk, encrypted
        └── attached service account, not a JSON key
```

## Machine types

`e2` is the inexpensive general choice. `n2` and `c3` are for when you have measured a need. Custom machine types let you pick vCPU and memory separately when the presets waste one of them. Spot VMs are cheap and revocable, the same bet as AWS Spot.

## Disks

The boot disk is persistent and zonal unless you chose a regional disk. Delete-with-instance is convenient in dev and rude in prod if the disk is the only copy of something. Snapshots are how you copy a disk across zones and regions. They are not a database backup strategy. Databases have their own tools that understand consistency.

## OS Login

OS Login ties SSH to IAM. You stop managing `authorized_keys` files that accumulate ex-employees. Grant `roles/compute.osLogin` and, if they must be root, the admin variant, on purpose and on a group.

## Startup scripts

A startup script can install a package. It should not be the long-term configuration system. An image baked in a pipeline, plus a configuration tool, beats a script that drifts every boot. Secrets come from Secret Manager using the VM's service account.

One VM is a pet. The moment the service matters, put the same spec in a [managed instance group](managed-instance-groups.md) or stop using VMs and run a container on [Cloud Run](cloud-run.md) or [GKE](gke.md).
