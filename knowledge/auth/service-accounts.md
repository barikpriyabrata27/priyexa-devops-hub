# Service Accounts

> **A service account is an identity for software. It is not a person, it should not have a password a person types, and it should not be shared by every workload in the account.**

```text
Cloud Run service  ── runs as ──►  payments-api@prod
GKE pod            ── mapped to ─►  payments-worker@prod
CI job             ── assumes ───►  payments-deploy-prod
```

Three jobs, three identities. When the worker key leaks, you revoke the worker. The API and the pipeline keep running.

## How they authenticate

| Platform | Prefer | Avoid |
| --- | --- | --- |
| GCP | attached service account, Workload Identity | downloaded JSON keys |
| AWS | IAM role on the instance, task, or OIDC | long-lived access keys |
| Kubernetes | a Kubernetes service account, projected tokens | a certificate baked into the image |
| CI | OIDC into the cloud role | a static cloud key in repository secrets |

The pattern is: the platform hands the process a short-lived credential because of where it is running. Nothing secret sits in the source tree.

## Permissions

The service account's role is the permission of the code. If the code only reads one bucket, the role only reads that bucket. Developers who can deploy code as that service account effectively have that role. Review who can change the deployment and who can impersonate the account. Impersonation is the quiet admin path.

## Naming and lifecycle

Name it for the workload and the environment: `payments-api-prod`. Delete it when the workload is deleted. An account named `terraform` created in 2019, owner of the project, used by nobody you can find, is a standing incident. Inventory service accounts the way you inventory human privileged users.

## Humans should not log in as them

A service account key on a laptop "so I can debug what the pod sees" becomes a permanent personal admin key. Use impersonation that is logged and time-limited, or a debug role of your own. If you must use the service account, the use should show up in the audit log under your name.
