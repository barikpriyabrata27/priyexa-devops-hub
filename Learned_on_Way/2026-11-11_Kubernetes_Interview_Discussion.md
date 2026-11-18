# Kubernetes Interview Discussion — 11 November 2026

**Session:** Senior DevOps / Platform Architect interview practice  
**Focus:** Kubernetes troubleshooting, rolling deployments, rollback, services, and namespaces.

## 1. CrashLoopBackOff troubleshooting
Scenario: Four Deployment replicas; two Pods running, two in `CrashLoopBackOff`.

- `CrashLoopBackOff` describes repeated container failures in Pods, not ReplicaSets.
- `kubectl get pods -o wide` shows extra columns, including Pod IP and assigned node. The `-o` is a **lowercase o** for output.
- `kubectl describe pod <pod-name>` inspects events and container termination reasons.
- `kubectl logs <pod-name> --previous` retrieves logs from the previous crashed container instance. There is no `--recent` flag; use `--tail` or `--since` for recent logs.
- Check application errors, probes, environment/configuration, Secrets, resource limits, and whether failures cluster on one node.

## 2. OOMKilled and memory
- `OOMKilled` means a container was killed due to out-of-memory conditions. Exit code 137 means SIGKILL; 137 alone does not prove an OOM.
- Example: Application needs about 800 MiB but container limit is 512 MiB.
- Update the container `resources` in **deployment.yaml**, not **svc.yaml**:

```yaml
resources:
  requests:
    memory: "512Mi"
  limits:
    memory: "1Gi"
```

- Requests should be sized using observed workload needs and cluster capacity. Investigate leaks or unexpected memory growth rather than blindly increasing limits.
- Apply changes with `kubectl apply -f deployment.yaml`; check rollout strategy and readiness.

## 3. Rolling updates
- Deployment manages ReplicaSets, which manage Pods.
- `maxSurge`: maximum extra Pods allowed above desired replicas during rollout.
- `maxUnavailable`: maximum desired replicas allowed to be unavailable during rollout.
- With 4 replicas, `maxSurge: 1`, `maxUnavailable: 0`: up to 5 Pods, while maintaining 4 available Pods if the starting workload is healthy.
- With 4 replicas and `maxSurge: 2`: up to 6 Pods.
- With 4 replicas and `maxUnavailable: 1`: minimum 3 available Pods.
- With 6 replicas, `maxSurge: 2`, `maxUnavailable: 2`: maximum 8 Pods, minimum 4 available.
- With 6 healthy replicas, `maxSurge: 2`, `maxUnavailable: 0`, if two new Pods fail readiness, Kubernetes retains the six healthy old Pods; it cannot remove an available old Pod until replacement capacity is available.
- Readiness checks and sufficient cluster capacity are essential.

## 4. Rollback and verification
- Roll back to the previous Deployment revision:
  `kubectl rollout undo deployment/python-app`
- See revision history:
  `kubectl rollout history deployment/python-app`
- Check completion:
  `kubectl rollout status deployment/python-app`
- Verify Pods and node placement:
  `kubectl get pods -o wide`
- Check readiness and application responses, not only Pod Running status.
- A Deployment rollback does not automatically reverse database migrations or external changes.

## 5. Services, ports, and HTTP health checks
- `kubectl get svc` lists Services in the current namespace, including Service type, Cluster IP and ports.
- `kubectl describe svc python-app-service` provides selectors, target ports and endpoints.
- A Service can expose multiple ports; it is not necessarily one Service per port.
- Example **only if** the Service exists and exposes port 5000:

```bash
kubectl port-forward svc/python-app-service 8080:5000
```

- In another terminal, test a real application endpoint:

```bash
curl -i http://localhost:8080/health
```

- HTTP 200 is a positive signal for that endpoint; use the app's actual path if `/health` is absent. Port forwarding is a local diagnostic path, not proof of external ingress availability.

## 6. Namespaces
- Namespace is a logical grouping of Kubernetes resources; it is **not** a Pod, Deployment, or ReplicaSet.
- Common built-in namespaces include `default`, `kube-system`, `kube-public`, `kube-node-lease`.
- List namespaces: `kubectl get namespaces`
- Create: `kubectl create namespace dev`
- List Services in production: `kubectl get svc -n prod`
- List Pods in development: `kubectl get pods -n dev`
- Check effective namespace from kubectl context: `kubectl config view --minify -o jsonpath='{..namespace}'` (empty typically means `default`).
- Specify namespace in Deployment metadata:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: python-app
  namespace: dev
spec:
  replicas: 4
  selector:
    matchLabels:
      app: python-app
  template:
    metadata:
      labels:
        app: python-app
    spec:
      containers:
        - name: python-app
          image: example/python-app:v1
```

- Or omit `metadata.namespace` and supply `-n prod` on `kubectl apply -f deployment.yaml -n prod`.
- The namespace must already exist. Without a namespace in the manifest or command, kubectl uses the current context's namespace (usually `default`).
- ReplicaSets and Pods created by the Deployment are in the same namespace.
- Namespaces alone do not guarantee network or security isolation.

## Interview questions and answers reviewed
1. **Two of four Pods crash: first steps?** `get pods -o wide`, `describe pod`, `logs --previous`, inspect events and resource use.
2. **What does OOMKilled mean?** Container killed under out-of-memory conditions; inspect memory limits and usage.
3. **Where to change memory limits?** In container resources in `deployment.yaml`, not Service YAML.
4. **What is a rolling update?** Gradual replacement of old Pods with new Pods, controlled by surge/unavailable limits and readiness.
5. **Four replicas, surge 2: maximum Pods?** Six.
6. **Four replicas, unavailable 1: minimum available?** Three.
7. **Six replicas, unavailable 2: minimum available?** Four.
8. **Six replicas, surge 2, unavailable 0, new Pods not ready: remove old Pods?** No; wait to preserve six available.
9. **Rollback command?** `kubectl rollout undo deployment/python-app`.
10. **Does undo delete the Deployment?** No; it restores the previous revision.
11. **How to validate after rollback?** Rollout status, Pod readiness, Service details, and an HTTP endpoint test.
12. **List Services in prod?** `kubectl get svc -n prod`.
13. **Where to specify namespace?** `metadata.namespace` in YAML or `-n` in command.

## Practical follow-up
- Try `kubectl get pods -o wide`, `kubectl get svc -A`, and `kubectl get namespaces` on the local kind cluster.
- Practice a safe Deployment rollout and rollback in a non-production namespace.
- Inspect actual memory requests/limits, readiness probes, and Service target ports.
