# GCP IAM

> **Every call is allowed or denied by IAM policy. A principal, a role, and a resource are the whole sentence.**

```text
user:priya@example.com     roles/compute.admin     on project priyexa-dev
serviceAccount:app@...     roles/storage.objectViewer   on one bucket
```

Principals are users, groups, service accounts, or federated identities. Roles are bundles of permissions. Bindings attach a role to a principal on a resource. Policies are inherited down the tree: a binding on the folder applies to every project under it. Inheritance is why a "quick admin on the folder" becomes admin of production.

## Primitive roles versus predefined roles

`roles/owner`, `roles/editor`, and `roles/viewer` are the old broad brushes. Owner can delete the project and manage IAM. Editor can change almost every resource. They are convenient in a sandbox and indefensible in production. Predefined roles such as `roles/compute.instanceAdmin.v1` or `roles/cloudsql.client` name a job. Custom roles exist when a predefined role is still too wide, and they are yours to maintain when Google adds permissions.

## Service accounts are identities for software

```text
Cloud Run service
    └── runs as  app-sa@priyexa-prod.iam.gserviceaccount.com
                      └── may read one secret and one bucket
```

A service account is not a shared human login. Give each workload its own. The default Compute Engine service account with the Editor role is the default you should replace. It is powerful because that made demos easy.

On GKE, Workload Identity maps a Kubernetes service account to a Google service account. The pod never sees a JSON key. On Cloud Run, you select the runtime service account in the service spec. Same idea.

## The binding you meant

Grant on the smallest resource that works. `roles/storage.objectAdmin` on one bucket beats the same role on the project. `roles/iam.serviceAccountUser` on one service account is what lets someone attach it to a VM. Without that, a person who can create a VM still cannot make it run as the powerful account. That extra hop is intentional.

## Seeing why a call failed

Policy Troubleshooter and the IAM audit logs answer "which binding denied this?" faster than adding Owner until the error disappears. An allow cannot override a deny policy. If the organization has a deny for `storage.objects.delete` outside a break-glass group, no project owner can delete objects. That is the point of deny policies.
