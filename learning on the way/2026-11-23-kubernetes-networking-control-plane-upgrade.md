# Kubernetes Networking and Control Plane Upgrades — Detailed Interview Q&A
Date: 23 November 2026
Scope: Detailed study notes based on today's spoken Kubernetes troubleshooting and self-managed control-plane upgrade discussion. Example IPs and versions are illustrative.

## 1. If CoreDNS goes down, can two Pods still communicate?
Yes, provided their network path remains healthy. CoreDNS translates Service and Pod DNS names to IP addresses; it is not the component that forwards packets. The CNI plugin establishes and manages Pod networking (interfaces, addressing, routes and/or overlay connectivity), while Linux networking, routing and the cluster's dataplane carry packets. If frontend Pod 10.0.1.10 knows backend Pod 10.0.2.20 and the backend listens on TCP 8080, it may connect using `curl http://10.0.2.20:8080` even if DNS is unavailable. NetworkPolicy, firewall rules, CNI health and application readiness can still block the connection. Pod IPs are ephemeral, so applications normally use a Service DNS name rather than hardcoded Pod IPs.

## 2. DNS resolves a backend Service name, but the frontend still times out. What next?
Successful name resolution proves only that the name mapped to an address, typically a Service ClusterIP; it does not prove backend reachability. A ClusterIP is a virtual stable address, not a physical machine that is 'up' or 'down' in the same sense as a server. Troubleshoot in order:
1. `kubectl get svc backend-service -n production -o wide` and `kubectl describe svc backend-service -n production`. Check type, selector, Service port, targetPort and protocol.
2. `kubectl get pods -n production --show-labels`. Confirm Pods exist, labels match the Service selector and Pods are Ready.
3. `kubectl get endpointslices -n production -l kubernetes.io/service-name=backend-service -o wide` and optionally `kubectl describe endpointslice -n production <name>`. Verify eligible endpoint IPs, ports and readiness conditions.
4. Test the Service name and ClusterIP from a frontend Pod, then test an actual backend Pod IP and port to isolate Service routing from direct Pod networking.
5. Check whether the application is listening on the expected interface and port; check NetworkPolicies, CNI dataplane and node-level firewall rules. Also consider kube-proxy or the replacement Service implementation (for example eBPF), and the application's own logs.
A Service with no eligible endpoints has no ready backend to forward requests to, even if DNS works. A timeout can also result from dropped packets or incorrect routing; a refused connection can indicate a reachable address with no listener.

## 3. How do we configure a ClusterIP Service?
Example service.yaml:
```yaml
apiVersion: v1
kind: Service
metadata:
  name: backend-service
  namespace: production
spec:
  type: ClusterIP
  selector:
    app: backend
  ports:
    - name: http
      port: 8080
      targetPort: 8080
      protocol: TCP
```
`apiVersion: v1` identifies the API version; `kind: Service` identifies the resource; metadata names it and places it in a namespace. `type: ClusterIP` exposes a virtual IP within the cluster's Service network. The API server normally allocates the IP from the configured Service CIDR; a specific available `clusterIP` may be requested but is usually omitted. `selector: app: backend` means the Service selects Pods in the same namespace whose labels include `app=backend`. `port` is the Service-facing port; `targetPort` is the destination port on each selected Pod. The Service does not create Pods. Apply with `kubectl apply -f service.yaml`, then inspect using `kubectl get svc -n production`.

## 4. How are endpoints created? Do we manually enter Pod IPs?
Usually not. The EndpointSlice controller watches Services with selectors and matching Pods, and maintains EndpointSlice objects with backend addresses, ports and readiness-related conditions. If three Ready Pods labeled `app=backend` have IPs 10.0.1.10, 10.0.2.20 and 10.0.3.30, the Service can route to eligible members. When a Pod is replaced or becomes unready, endpoint records are updated automatically. A selector mismatch or missing Ready Pods can leave no usable backends. For Services without selectors, endpoint management is different and may require manually managed EndpointSlices or another controller.

## 5. Are service.yaml and deployment.yaml different?
They are commonly separate files because they define different Kubernetes resource kinds, but can coexist in one multi-document YAML separated by `---`. A Deployment defines desired replica count, Pod template, images, container ports and Pod labels; a Service defines a stable access point and selects Pods by labels. Example deployment.yaml:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  namespace: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
        - name: backend
          image: example/backend:1.0
          ports:
            - containerPort: 8080
```
The Deployment selector matches its own Pod template labels. Separately, the Service selector matches those Pod labels. The Service doesn't select the Deployment object itself. A frontend in the same namespace can usually call `http://backend-service:8080`; cross-namespace callers can use `backend-service.production.svc.cluster.local` (subject to cluster DNS domain configuration).

## 6. Can companies run Kubernetes without EKS, GKE or AKS?
Yes. Kubernetes is open-source and can be installed on company-owned physical servers, virtual machines or cloud VMs using tools such as kubeadm. This is self-managed Kubernetes. For example, three control-plane nodes and two worker nodes can form a high-availability architecture if configured with appropriate load balancing, networking and etcd topology. The organization manages installation, patches, upgrades, security, etcd, CNI, observability and disaster recovery. With EKS/GKE/AKS the cloud provider manages substantial control-plane responsibilities, though the customer's responsibilities vary by service and node mode. A local kind cluster is also non-managed Kubernetes, but is intended primarily for development and testing.

## 7. What is etcd and why take its backup before upgrading?
etcd is the live, distributed key-value database containing Kubernetes API state: Deployments, Services, desired replica counts, Pod and Node objects, ConfigMaps, Secrets and related cluster resources. It is NOT itself a snapshot. The API server persists and reads cluster state in etcd; scheduler and controllers normally use the API server instead of directly reading etcd. Analogy: Oracle stores database information in data files and uses control files/redo logs; etcd is a separate database storing Kubernetes cluster state, not just one Oracle-style file. An etcd snapshot is a point-in-time backup of the live database. For kubeadm clusters using local etcd, capture and protect a snapshot with the supported etcd tooling and document how to restore it. Also back up relevant Kubernetes configuration and certificates. A snapshot supports recovery from serious failures, but restoring it is a deliberate disaster-recovery procedure, not an automatic rollback of every upgrade.

## 8. What happens when etcd is unavailable?
Existing application containers and Pods may keep running and serving traffic because they already exist on their nodes. However, the API server may be unable to read or persist cluster state; API operations can fail or hang, and controllers/scheduler cannot reliably reconcile changes or reschedule workloads. The API server process itself does not necessarily exit. Existing traffic can continue if dataplane components remain healthy, but recovery and new scheduling are impaired. A loss of etcd is therefore a major control-plane outage even when some applications remain accessible.

## 9. What is etcd quorum in a three-member cluster?
etcd uses the Raft consensus protocol. A majority of members must be available for normal writes. With three voting members, quorum is two. Three healthy: normal. Two healthy: still quorum. Only one healthy: quorum lost. A three-member cluster tolerates one member failure; five members tolerate two. This is one reason to upgrade control-plane nodes sequentially and verify health after each. Not every three-control-plane-node cluster necessarily has three etcd members: etcd can be stacked on those nodes or hosted externally, so confirm actual topology first.

## 10. Are we upgrading RHEL or Kubernetes?
In the interview scenario we are upgrading Kubernetes, for example Kubernetes 1.33 to 1.34, on Linux nodes that remain on RHEL 9. Kubernetes control-plane component images/manifests and Kubernetes packages such as kubeadm and kubelet are upgraded; etcd may also change depending on the target release and topology. Upgrading RHEL itself is a separate OS lifecycle activity and is not automatically performed by `kubeadm upgrade`. Check supported Kubernetes/container runtime/OS combinations before beginning.

## 11. Is kubeadm a running service? What exactly does it upgrade?
No. `kubeadm` is a CLI for bootstrapping and maintaining kubeadm-based clusters. `kubeadm upgrade plan` assesses the supported upgrade path and checks; `kubeadm upgrade apply <target-version>` performs the initial control-plane upgrade on the first control-plane node, including updating kubeadm-managed static Pod manifests and relevant cluster configuration. The kubelet observes changed manifests and restarts affected components. Remaining control-plane nodes are upgraded individually with `kubeadm upgrade node`. Kubelet and optionally kubectl packages are upgraded separately using the OS package manager. Running the first-node command does not automatically update the binaries or static Pods on all other control-plane nodes.

## 12. Which components run on control-plane nodes?
Typically kube-apiserver, kube-controller-manager and kube-scheduler. In a stacked etcd topology, etcd also runs there. Kubelet runs as a host service on each node, including control-plane nodes. Container runtime (for example containerd) also runs on the node. In a kubeadm cluster, API server, scheduler, controller manager and local etcd are normally deployed as static Pods. The scheduler selects nodes for ordinary scheduled Pods; controllers reconcile desired state; the API server exposes the Kubernetes API; etcd persists state.

## 13. What is a static Pod and why can it run without the API server?
A static Pod is managed directly by the kubelet on a specific node, using a local manifest file rather than a Deployment and scheduler. In kubeadm clusters, the directory is usually `/etc/kubernetes/manifests/`, with files such as `kube-apiserver.yaml`, `kube-controller-manager.yaml`, `kube-scheduler.yaml` and (for stacked etcd) `etcd.yaml`. Kubelet watches this directory and creates/restarts containers from these manifests without needing a working API server. It may publish mirror Pod objects to the API server when the API is available, but those objects do not control the local static Pod. This solves the bootstrap dependency: the API server itself can start or restart without first contacting an API server.

## 14. How do we upgrade a self-managed kubeadm control plane step by step?
Scenario: three control-plane nodes and two worker nodes, upgrading one supported Kubernetes minor version. Commands and exact package versions must be checked against the official kubeadm guide for the chosen source and target versions and OS. Use a maintenance/change window and tested rollback/recovery procedures.

Step 1 — Inventory and preflight: `kubectl get nodes -o wide`, `kubectl get pods -A`, `kubectl version`, check component versions, etcd health, cluster alerts, node capacity, PodDisruptionBudgets, API deprecations, CNI/CSI/ingress compatibility, container runtime compatibility and supported version-skew policy. Confirm the control-plane load balancer and etcd topology. Upgrades generally proceed one minor release at a time.

Step 2 — Back up: for self-managed etcd, take and verify an etcd snapshot and secure it. Back up kubeadm configuration, relevant PKI/certificates and manifests. Validate recovery documentation and maintenance communications.

Step 3 — First control-plane node: use the OS package manager to install the exact target `kubeadm` package, observing package holds/version locks as appropriate. Run `sudo kubeadm upgrade plan`; review target version and warnings. Run `sudo kubeadm upgrade apply v1.X.Y` with an actual supported patch release. Monitor component rollout and verify API server/etcd health. For highly available clusters, consider draining this node before kubelet maintenance according to workload placement and your organization's procedure; static control-plane Pods themselves are not evicted by an ordinary drain.

Step 4 — Kubelet on first control-plane node: drain when appropriate (`kubectl drain <node> --ignore-daemonsets`, adding flags only after assessing local data and PodDisruptionBudgets), install the compatible kubelet package and optionally kubectl, restart kubelet (`sudo systemctl daemon-reload && sudo systemctl restart kubelet`), check its status, then `kubectl uncordon <node>` if cordoned. Check node readiness and component health.

Step 5 — Remaining control-plane nodes: one node at a time, upgrade the `kubeadm` binary, run `sudo kubeadm upgrade node`, then upgrade/restart kubelet and optionally kubectl, using drain/uncordon and health checks as appropriate. Do not take down multiple etcd voting members simultaneously. Confirm quorum and API server access after each.

Step 6 — Worker nodes: sequentially drain a worker, upgrade kubeadm as needed and run `sudo kubeadm upgrade node`, upgrade kubelet and optionally kubectl, restart kubelet, validate Ready status and uncordon. Ensure enough healthy replicas and respect PodDisruptionBudgets. Do not upgrade kubelet to a version newer than the API server.

Step 7 — Post-upgrade validation: `kubectl get nodes`, `kubectl get pods -A`, `kubectl get --raw='/readyz?verbose'` where authorized, validate etcd health/quorum, CoreDNS, CNI, Service-to-Pod networking, ingress, storage, logs, monitoring and representative application transactions. Record version results and close the change only when stable.

Important nuances: control-plane upgrade sequencing differs for external etcd versus stacked etcd; exact kubeadm behavior and supported flags vary by Kubernetes version. Never assume `kubeadm` upgrades the OS, all nodes, or all node packages automatically. In managed EKS/GKE, follow the provider's control-plane and node-upgrade workflow rather than running kubeadm against provider-managed control planes.

## 15. Interview-ready answer
'First I identify whether the cluster is managed or self-managed. For a self-managed kubeadm cluster, I validate health, compatibility, API deprecations and version-skew rules, then back up etcd and cluster configuration. I upgrade the kubeadm binary on the first control-plane node, run kubeadm upgrade plan and kubeadm upgrade apply for the approved target version. I upgrade kubelet separately and verify the API server, etcd quorum and node health. I repeat on remaining control-plane nodes one at a time using kubeadm upgrade node, then drain and upgrade worker nodes sequentially. Finally, I validate DNS, networking, storage, workloads and monitoring. This is a Kubernetes version upgrade; the underlying RHEL OS is not upgraded unless separately planned.'

## 16. Quick commands reference
```bash
kubectl get nodes -o wide
kubectl get pods -A
kubectl version
kubectl describe svc backend-service -n production
kubectl get pods -n production --show-labels
kubectl get endpointslices -n production -l kubernetes.io/service-name=backend-service
sudo kubeadm upgrade plan
sudo kubeadm upgrade apply v1.X.Y   # first control-plane node; substitute actual version
sudo kubeadm upgrade node           # subsequent control-plane and worker nodes
sudo systemctl restart kubelet
kubectl get --raw='/readyz?verbose'
```
Study reminder: The relationship is Deployment -> labeled Pods -> Service selector -> EndpointSlices -> eligible Pod IPs. DNS resolves names; CNI and the network dataplane carry packets. kubeadm coordinates control-plane upgrades; kubelet manages local static Pods; etcd stores cluster state.
