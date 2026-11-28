# Senior DevOps Mock Interview — Detailed Questions and Answers
Date: 28 November 2026
Topics: Kubernetes performance, GitHub Actions to IIS over VPN, blue-green deployment, health checks, Terraform drift, state and import.

## 1. A production Kubernetes service is slow. How do you troubleshoot it end to end?
**Answer:** Establish scope and baseline first. Measure latency from outside the cluster and from a debug pod inside it. Compare DNS lookup, connection, TLS, time to first byte and total time; an outside-only slowdown suggests ingress, load balancer, routing or network issues, but is not conclusive. Check `kubectl get pods -A -o wide`, `kubectl top pods -A`, `kubectl top nodes`, `kubectl describe pod <pod> -n <ns>`, and `kubectl logs <pod> -n <ns> --previous` if restarts occurred. Inspect CPU throttling, memory pressure, OOMKilled, restarts, readiness, node placement and events. Curl the Kubernetes Service DNS name from a temporary debug pod, and compare service vs direct pod endpoints where safe. Check Service selectors, EndpointSlices, CoreDNS, CNI, ingress and network policies. If these look healthy, inspect traces and downstream DB, cache or API latency, connection pools, locks and slow queries. Correlate findings with deployments and monitoring; mitigate and verify latency improvement.
**Interview tip:** Do not jump to raising CPU/memory before identifying the bottleneck.

## 2. GitHub Actions deployment to IIS through VPN works intermittently. How do you stabilize it?
**Answer:** Locate the exact failing stage using timestamped logs: VPN handshake, DNS, route, authentication, copy, IIS restart or health validation. Preflight checks verify VPN establishment, target DNS, port reachability, disk space, IIS app pool and deployment permissions. Use least-privilege credentials, protected secrets, concurrency controls, bounded retries for transient network operations and explicit timeouts. Do not blindly retry a partially deployed release. Upload immutable versioned artifacts, verify checksums, deploy to a separate release directory, and use health checks before traffic cutover. Preserve the prior known-good release and automate rollback. Record deployment IDs and audit trails.
**Example:** `Test-NetConnection <server> -Port 443` tests TCP reachability but not application health.

## 3. File copying fails halfway through deployment. How do you prevent a mixed-version IIS application?
**Answer:** Never overwrite live application files piecemeal. Copy the complete artifact to a new versioned directory or inactive IIS site; validate completeness and startup. Then switch the IIS physical path or reverse-proxy/load-balancer routing in a controlled cutover. Keep the old version untouched and ready. If verification fails, revert the routing or path to the previous version. For single-server IIS, true zero downtime is not guaranteed without carefully designed routing, overlapping workers and connection draining.

## 4. What is blue-green deployment, and how is it implemented with IIS?
**Answer:** Blue is the currently active release; Green is a separately deployed inactive release. Install and test Green without touching Blue, then switch new requests to Green via a reverse proxy or load balancer. Keep Blue warm for fast rollback. On IIS/EC2, two separate sites, application pools or release directories plus a routing component can approximate blue-green; IIS does not automatically provide Azure App Service deployment slots. Plan for session handling, in-flight requests and backward-compatible database migrations.

## 5. Green returns HTTP 500 errors five minutes after cutover. How do you detect and roll back?
**Answer:** Monitor real endpoint 5xx error rate, latency, request volume, logs and traces, not only a synthetic health URL. Example policy: alert if 5xx exceeds 5% for two minutes at sufficient traffic volume; actual thresholds should be based on baseline and service objectives. Confirm Blue is still healthy, then change routing back to Blue without reinstalling. Verify recovery and investigate Green. In AWS, CloudWatch metrics/alarms plus EventBridge and an automation target can support this; a working rollback requires explicit routing integration. A shared database outage will not be fixed by swapping Blue and Green.

## 6. Why can /health return 200 while real API calls return 500?
**Answer:** A shallow health endpoint may only check whether the process responds. A real endpoint may fail because of SQL connectivity, authentication, dependency timeouts or application exceptions. Monitor API error rates and dependencies, and design separate health semantics. For a .NET IIS app, `/health/live` can return 200 while the process is alive; `/health/ready` should return 503 if a critical dependency makes the app unable to serve essential requests. Readiness checks must be bounded and avoid causing load or cascading failures. IIS on EC2 does not provide Kubernetes probes natively.

## 7. If the database is down, should a health endpoint return 200 or 503?
**Answer:** It depends on endpoint purpose. Liveness may remain 200 if the app process is alive. Readiness should return 503 when DB unavailability prevents essential operations. HTTP 503 means Service Unavailable, not specifically a DB error. Do not configure a liveness check to restart an otherwise healthy app solely because a shared DB is down.

## 8. Terraform plan shows unexpected changes. What do you do before applying?
**Answer:** Stop; do not apply. Inspect resource addresses and action symbols: + create, - destroy, ~ in-place update, and -/+ replacement. Compare code, input variables, provider versions, Terraform state and actual cloud resources. Check recent commits, change requests and AWS CloudTrail for authorized manual changes. `terraform plan -refresh-only` can show state-versus-remote differences without changing cloud infrastructure. Reconcile the desired configuration with approved reality, then generate and review a new plan. Use approvals for production changes. Not every unexpected plan is drift; configuration or provider changes can also explain it.

## 9. EC2 changed manually from t3.medium to t3.large. What does Terraform propose?
**Answer:** If the code still specifies t3.medium, a refreshed plan generally proposes changing the instance type back to t3.medium, subject to provider behavior and constraints. If the change to t3.large was approved, update the Terraform configuration to t3.large and re-plan. Be mindful that changing an EC2 instance type may require a stop/start and cause downtime.

## 10. Terraform plans to destroy a production EC2 instance. What is the first action?
**Answer:** Do not apply. Determine whether the plan is a deletion or replacement and why: deleted resource block, address change, count/for_each change, configuration or provider change. Verify the instance still exists and is serving traffic, inspect state and commits, and obtain authorization. A planned destroy means Terraform intends to remove it on apply; it does not mean the instance was already deleted.

## 11. Someone accidentally removed an EC2 resource block from Terraform. How do you avoid destruction?
**Answer:** Restore the correct resource configuration and original Terraform resource address from version control, then rerun `terraform plan`. Confirm no destroy or unintended replacement remains. If the resource was deliberately renamed or moved, use a `moved` block or `terraform state mv` where appropriate rather than allowing destroy/recreate. Only apply a reviewed, approved plan.

## 12. What is Terraform import?
**Definition:** Terraform import associates an existing real-world resource with a Terraform resource address in state, so Terraform can manage it without creating that resource.
**When to use it:** A resource was created manually, exists outside Terraform, and the team now wants it managed as code.
**Step-by-step EC2 example:**
1. Identify the existing instance ID, region, account, VPC and configuration in AWS.
2. Configure the AWS provider and a resource block such as:
```hcl
resource "aws_instance" "my_server" {
  ami           = "ami-REPLACE_WITH_REAL_AMI"
  instance_type = "t3.medium"
}
```
3. Run `terraform init`.
4. Run `terraform import aws_instance.my_server i-0123456789abcdef0` (example ID).
5. Inspect `terraform state show aws_instance.my_server` and run `terraform plan`.
6. Reconcile the HCL with actual instance properties and dependencies until no unintended changes are proposed. Review before applying.
**What import does not do:** The classic CLI import does not automatically produce a complete resource configuration, does not recreate the instance and does not guarantee a clean plan. Newer configuration-driven import blocks can be used with `terraform plan -generate-config-out=...` in supported Terraform versions to generate candidate configuration, which still requires review.
**Safety:** Back up state, use remote state locking, confirm the resource is not already tracked under another address, and never import a production resource into the wrong workspace/account.
**Interview answer:** "I define the target resource address, import the existing EC2 instance ID into Terraform state, reconcile code with reality, and verify a safe plan before applying."

## 13. Does terraform import create a new EC2 instance?
**Answer:** No. It registers an existing EC2 instance under a Terraform state address. Future plans compare configuration with that imported object.

## Quick revision checklist
- Kubernetes: outside vs inside latency → pod/node signals → service/network → dependencies.
- IIS deployment: preflight → immutable artifact → inactive release → health validation → cutover → monitoring → rollback.
- Health: liveness checks process; readiness checks ability to serve essential traffic.
- Terraform: never apply an unexplained destructive plan; reconcile code, state and reality.
- Import: existing resource + resource address + import + state inspection + safe plan.
