SENIOR DEVOPS INTERVIEW — DETAILED QUESTIONS, ANSWERS AND COMPONENT NOTES
14 November 2026 | RAD365 and general DevOps practice


Q1. Walk through a recent CI/CD pipeline you built.
Answer: A healthcare radiology application is maintained in a monorepo (one repository containing frontend and backend projects). CI on GitHub Actions checks out the code, installs dependencies, compiles/builds the .NET services and React frontend, executes unit tests and lint/static checks, then publishes versioned deployment artifacts. CD downloads the exact tested artifact and deploys to Windows IIS using PowerShell. For the proposed RAD365 design, a GitHub-hosted Windows runner would connect through SoftEther VPN to reach the private IIS server. This VPN-based deployment path remains a planned POC, not a verified completed deployment.
Notes: CI = Continuous Integration (automated build and verification). CD = Continuous Delivery/Deployment (release preparation or deployment). Monorepo = multiple projects in one repository. Artifact = packaged output of a build. IIS = Microsoft Internet Information Services web server. GitHub-hosted runner = temporary VM executing workflow jobs. OIDC = OpenID Connect, used to obtain short-lived AWS credentials; it does not establish VPN connectivity.


Q2. What was the toughest pipeline issue and how would you improve reliability?
Answer: The main challenge is private network access from an ephemeral GitHub-hosted Windows runner to the IIS EC2 instance. AWS OIDC authenticates the workflow to AWS APIs but cannot by itself reach private IIS endpoints. Options include SoftEther client VPN, a compatible Windows native VPN protocol, or AWS Systems Manager Run Command. For long-term deployment, SSM can reduce VPN dependency if EC2 is managed and network/IAM prerequisites are satisfied.
Notes: EC2 = Amazon Elastic Compute Cloud virtual server. VPN = encrypted virtual private network. SSM = AWS Systems Manager, including remote command execution via managed instances. SoftEther = VPN server/client software supporting multiple protocols.


Q3. A Kubernetes pod remains Pending. How do you troubleshoot?
Answer: Run kubectl get pods -n <namespace>, then kubectl describe pod <pod> -n <namespace> and read Events. Look for FailedScheduling messages: Insufficient cpu/memory, node selectors or affinity, taints/tolerations, PVC provisioning, or quotas. Inspect kubectl describe node <node> for Allocatable and Allocated resources; kubectl top nodes shows actual current usage only if Metrics Server is present. A Pending container often has no running container logs; kubectl logs --previous is mainly useful for previously terminated containers, not unscheduled pods.
Notes: Pod = smallest Kubernetes deployable unit. Scheduler = chooses a node for a pod. CPU request = CPU capacity reserved for scheduling; CPU limit = runtime upper bound. PVC = PersistentVolumeClaim for storage. Events = diagnostic cluster messages. Metrics Server = source for kubectl top metrics.


Q4. Why might CPU usage show 30% while a pod requesting 2 CPUs remains Pending?
Answer: The scheduler uses requested resources rather than historic or instantaneous utilization. On a node with 8 allocatable CPUs, existing pods might request 7 CPUs while consuming only 30% in real time. A new 2-CPU request cannot fit on that node. Check node allocated requests, pod requests, scheduling constraints, and available alternative nodes. Right-size requests or add capacity as appropriate.
Notes: Allocatable CPU excludes resources reserved for the system/Kubernetes; 8 physical cores does not always mean 8 allocatable CPUs.


Q5. Why might users receive intermittent HTTP 503 errors during Kubernetes deployment?
Answer: A pod can be Running but not Ready. Inspect readiness probe status, pod Events, Service selectors and EndpointSlices, ingress-controller logs, and Deployment rollout settings. If no ready endpoints exist, an ingress/proxy may return 503. Check maxUnavailable/maxSurge, termination grace periods, and whether new pods become ready before old pods stop. Determine which layer actually produced the 503.
Notes: Readiness probe = health check determining whether a pod should receive Service traffic. Liveness probe = restart decision for an unhealthy container. Startup probe = protects slow-starting containers from premature liveness checks. Service = stable network abstraction routing to selected pods. Ingress = Kubernetes HTTP(S) routing resource; an ingress controller implements it. EndpointSlice = scalable representation of Service backend endpoints. Rolling update = gradually replaces old pods with new ones.


Q6. If an app needs 40 seconds to start, how should probes be configured?
Answer: Use a startup probe when startup is variable or liveness might otherwise restart the app prematurely; keep readiness tied to actual ability to serve requests. initialDelaySeconds can defer checks but is a fixed delay. Ensure rollout availability settings preserve healthy replicas until replacements are ready.
Notes: initialDelaySeconds = delay before a probe begins. failureThreshold × periodSeconds determines startup probe tolerance.


Q7. Explain HTTP 200, 401, 402, 403, 501, 502, 503 and 504.
Answer: 200 OK = request succeeded. 401 Unauthorized = authentication missing/invalid (despite its name). 402 Payment Required = reserved and used by some payment services. 403 Forbidden = server refuses access; often authenticated but insufficient authorization, although authentication is not strictly required for every 403. 501 Not Implemented = server lacks required functionality for the request method. 502 Bad Gateway = gateway/proxy received an invalid upstream response or certain connection failures. 503 Service Unavailable = temporarily unable to handle request, e.g. no available targets or overload. 504 Gateway Timeout = gateway waited too long for upstream response.
Notes: Authentication = proving identity. Authorization = deciding permissions. ALB = AWS Application Load Balancer, a Layer 7 HTTP(S) load balancer. Upstream/backend = server receiving forwarded requests. AWS security groups filter network traffic and do not normally generate HTTP 403.


Q8. An ALB target is healthy, but /api/orders gives 502. Why?
Answer: A simple /health check can return 200 even while another endpoint fails. Investigate ALB access logs (ALB-generated versus target-generated status), application and web-server logs, connection resets, malformed HTTP responses, TLS/protocol/port mismatch, and keep-alive behavior. A database failure may cause an application error, but does not automatically mean ALB will produce 502; identify the actual responding component.
Notes: Target group = ALB's backend destination set. Health check = probe used to assess target eligibility. TLS = Transport Layer Security for encrypted connections.


Q9. ALB idle timeout is 60 seconds, but the backend sends no data for 90 seconds. What happens?
Answer: Typically the ALB returns 504 Gateway Timeout because it waited beyond its idle timeout for a response. Verify the timeout, backend behavior and logs. Prefer fixing slow operations and using asynchronous work where appropriate instead of simply increasing every timeout.
Notes: Idle timeout = maximum period without data on a connection. 502 bad response; 503 unavailable service; 504 timed-out gateway.


Q10. What is CloudFront and why can users see stale data?
Answer: Amazon CloudFront is a content delivery network (CDN) that caches and distributes content from origins such as S3 or an HTTP API through edge locations. A cache hit means a stored response was served; it does not prove the content is the newest version. Check the origin object, cache policy TTL, Cache-Control headers, response Age and X-Cache headers, and whether deployment invalidation/versioning occurred.
Notes: CDN = geographically distributed delivery network. Origin = authoritative source of content. Edge location = CloudFront cache location. TTL = Time To Live, cache lifetime. Cache-Control = HTTP caching directive. X-Cache Hit = cache served response; Miss = cache fetch needed. Age = response age in seconds.


Q11. How do you verify and fix stale React files on S3/CloudFront?
Answer: Verify the new index.html and versioned JS/CSS assets exist in S3; run curl -I against the CloudFront URL; inspect X-Cache, Age and Cache-Control; check distribution Behaviors and Cache policy. Invalidate /index.html (and other affected HTML routes) after upload, or use versioned immutable asset filenames. A wildcard /* invalidates more content and should be reserved for situations requiring it. Invalidation is asynchronous; wait for completion when deployment verification requires immediate consistency.
Notes: S3 = Amazon Simple Storage Service object storage, capable of storing static frontend build files. Invalidation = marks cached paths stale so CloudFront refetches on subsequent requests; does not delete S3 objects. React = JavaScript UI library; its compiled static frontend can be hosted on S3, IIS or NGINX.


Q12. How can GitHub Actions automate CloudFront invalidation?
Answer: Build/test React, upload the exact build to S3, then invoke aws cloudfront create-invalidation --distribution-id <id> --paths '/index.html'. Use GitHub OIDC to assume an AWS IAM role with cloudfront:CreateInvalidation on the distribution. If upload works but invalidation returns AccessDenied, inspect the assumed role and permission policy first; also check SCPs and permission boundaries. The S3 bucket policy does not grant CloudFront invalidation permission.
Notes: IAM = AWS Identity and Access Management. SCP = AWS Organizations service control policy. GitHub Environment = deployment target with optional protection rules.


Q13. Can one IIS EC2 host Dev and Staging? How do you control access?
Answer: Yes. Configure separate IIS sites, physical folders, app pools, bindings, settings and preferably separate databases. Dev should be reachable only through private/VPN network paths. Staging may be published to authorized clients over HTTPS, preferably via an internet-facing ALB targeting only the staging port on a private EC2. IIS bindings alone are not security boundaries; enforce access through security groups, Windows Firewall, routing, and application authentication.
Notes: Application pool = IIS worker-process isolation boundary. Binding = host/IP/port/protocol mapping. DNS = maps a name to an address. Public subnet = subnet with appropriate route to an internet gateway; a public IP alone does not prove reachability.


Q14. How should staging promotion and approval work?
Answer: Deploy and validate Dev first; retain the exact versioned artifact. DevOps manually triggers workflow_dispatch selecting staging and artifact version. A staging GitHub Environment protection rule pauses the job until the development lead approves. Then the job connects to the target and deploys, verifies health and supports rollback. Availability of required reviewers depends on GitHub repository visibility/plan. Approval occurs before execution, not after installation.
Notes: workflow_dispatch = manual GitHub Actions trigger with inputs. Approval gate = human authorization before a protected job runs. Rollback = restore a known-good release.


Q15. What is the next RAD365 POC?
Answer: Only prove that a GitHub-hosted Windows runner can connect to the SoftEther-protected network and reach the private IIS endpoint. First confirm VPN protocol and prerequisites; then connect, run Test-NetConnection for IIS port and Invoke-WebRequest against a known endpoint, and record status. Do not claim deployment is completed by this connectivity POC.
Notes: Test-NetConnection = PowerShell TCP connectivity test. Invoke-WebRequest = HTTP request client. vpncmd = SoftEther command-line configuration utility. L2TP/IPsec = compatible VPN tunneling and security protocols supported by SoftEther and Windows when enabled/configured. SSTP = Windows-supported VPN protocol; verify the specific SoftEther server's enabled capabilities. SSM Run Command = alternative to VPN, requiring managed-instance setup.