# RBAC

> **Role-based access control grants permissions to roles, and assigns roles to users or groups. You change a person's access by changing their role, not by editing a unique policy for them.**

```text
user  →  group  →  role  →  permissions
                         on a scope (project, account, namespace)
```

The scope is half the control. `edit` in the `payments` namespace is a job. `edit` in every namespace is a different, larger job. `cluster-admin` is "the API server trusts you completely."

## Kubernetes, because that is the RBAC people mean in this repo

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: payments
  name: deployer
rules:
  - apiGroups: ["apps"]
    resources: ["deployments"]
    verbs: ["get", "list", "watch", "update", "patch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  namespace: payments
  name: deployers
subjects:
  - kind: Group
    name: payments-team
    apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: deployer
  apiGroup: rbac.authorization.k8s.io
```

A `Role` is namespaced. A `ClusterRole` is cluster-wide, and you can still bind it inside one namespace with a `RoleBinding` if the rules are namespaced resources. Bind groups from OIDC, not individual users, when the directory is the source of truth.

## What RBAC does not see

RBAC authorizes the Kubernetes API. It does not, by itself, stop a container from calling the cloud metadata service, reading a node filesystem, or opening a network connection. Pod security, network policy, and the cloud role of the node are the other layers. A developer who can `create pods` can often become admin of the node if those layers are loose. Treat "create pods" as a sensitive verb.

## Review

`kubectl auth can-i --list` as a user tells you their view. A periodic look at `ClusterRoleBinding` subjects is how `system:anonymous` and leftover users get found. Delete bindings when the group disappears. A binding to a group that SSO no longer emits is harmless. A binding to a user who left and whose certificate still works is not.
