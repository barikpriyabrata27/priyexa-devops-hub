> **Interview tip:** Do not memorize these word-for-word. Use them as
> the structure for your answer and add your actual project names,
> scale, metrics and incidents where you have them.

## 1. Tell me about your experience as a DevOps Engineer.

**Answer:** I have 14+ years of corporate IT experience, with my recent
focus on DevOps and platform engineering. My work spans CI/CD, Git,
Jenkins/GitHub Actions, Ansible/AWX, Terraform, AWS, Docker/Kubernetes,
security scanning and automation. I focus on making delivery repeatable
and secure rather than doing manual operations. In projects, I typically
work from source control through build, testing, security checks,
artifact creation, deployment and monitoring. A good example is
automating repetitive operational tasks with Ansible/Python and
integrating them into CI/CD so the process is faster, auditable and less
error-prone.

## 2. What is your experience with Observability?

**Answer:** My approach to observability is to combine metrics, logs and
traces so that detection and diagnosis are connected. Metrics tell me
that something is wrong, logs provide event-level detail, and traces
show where a request spent time across services. I would use
Prometheus/Grafana for metrics and dashboards, centralized logging such
as Fluent Bit → Elasticsearch/OpenSearch → Kibana/Grafana for logs, and
OpenTelemetry with a tracing backend such as Tempo or Jaeger for
distributed traces. I also define useful alerts, retention, correlation
IDs and runbooks so the monitoring is actionable.

## 3. What infrastructure and cloud services have you worked with, and how did you set up monitoring/observability?

**Answer:** I have worked mainly on AWS, with some GCP: VPC networking, IAM, EC2, EKS, ECR, S3, RDS, and load balancers, plus Terraform for the infrastructure and Kubernetes for the workloads. Monitoring is three signals. Metrics come from Prometheus scraping node-exporter, kube-state-metrics, and the application /metrics endpoint, with Grafana dashboards and Alertmanager. Logs go from the node, via a Fluent Bit DaemonSet, to OpenSearch, and we search them in Kibana or Grafana. Traces come from OpenTelemetry into Tempo, also shown in Grafana, with the trace id printed in the logs so a slow request can be followed from the dashboard into the log line. Alerts fire on symptoms users feel, such as error rate and latency, not on every CPU wiggle. CloudWatch still covers what AWS itself emits, such as ALB 5xx, RDS CPU, and NAT bytes.

## 4. Do you have experience working with a logging team?

**Answer:** Yes. The logging team owns the platform: the OpenSearch cluster, retention, index patterns, and access. My side is making sure every service actually arrives there in a shape they can use. We agree the fields up front: timestamp, level, service, environment, trace id, and the message. Applications write JSON to stdout. Fluent Bit on each node adds the Kubernetes namespace and pod name and ships the record. I do not ask the logging team to parse a one-off text format for one service. When a new service ships, I check that a known log line is searchable within a minute, that prod and dev are separate indexes, and that the service account can read its own logs and not the whole company.

## 5. Have you set up logging for Kubernetes clusters, applications, or infrastructure? What exactly did you implement?

**Answer:** On Kubernetes I collect from stdout and stderr, not from files inside the container. A Fluent Bit DaemonSet mounts the node log directory, reads the container runtime's log files, enriches them with namespace, pod, container, and node, and forwards to OpenSearch. Application pods do not get a logging sidecar unless they write somewhere other than stdout. I set a retention policy per environment, drop health-check noise, and keep the DaemonSet's CPU and memory requests honest so the collector cannot evict the workloads it is watching. The check is simple: kubectl logs shows the line, and the same line is searchable in Kibana with the pod name. Node system logs and audit logs go to the same place on a different index, because an application developer should not need cluster-admin to read them.

## 6. What is EFK? What does F stand for? What is the difference between EFK and ELK?

**Answer:** EFK stands for Elasticsearch, Fluent Bit and Kibana. ELK
stands for Elasticsearch, Logstash and Kibana. The main difference is
the log collector/processing component: Fluent Bit is lightweight and
commonly runs as a Kubernetes DaemonSet, while Logstash is a heavier
processing pipeline with a large plugin ecosystem. A typical Kubernetes
flow is container logs → Fluent Bit → Elasticsearch/OpenSearch → Kibana,
with parsing, enrichment and filtering performed before indexing where
needed.

## 7. What does F stand for in EFK? What does L stand for in ELK?

**Answer:** F in EFK is Fluent Bit. L in ELK is Logstash. Both stacks use Elasticsearch to store logs and Kibana to search them. Only the middle component changes. Fluent Bit collects and forwards. Logstash collects and can do heavy transformation. If an interviewer only wants the letters, those two expansions are the whole answer.

## 8. What is the difference between Fluent Bit and Logstash?

**Answer:** Fluent Bit is a lightweight log collector and forwarder
designed for low resource usage, so it is well suited to running on
every Kubernetes node. Logstash is a more feature-rich data-processing
pipeline with many input/filter/output plugins and is useful when
complex transformations are required. In practice, I would often use
Fluent Bit for collection and forwarding and use Logstash only where its
richer processing capabilities justify the additional resource and
operational cost. I would compare them using throughput, CPU/memory,
latency, backpressure behavior, parsing capability and operational
complexity.

## 9. How would you verify that Fluent Bit is faster than Logstash?

**Answer:** I would not take the reputation as proof. I would run both on the same node, feed the same log file at a rising rate, and measure three numbers: events per second accepted, CPU and memory of the collector, and how far behind the collector falls when the output is slow. Same parser, same output, same machine. Fluent Bit should hold a higher rate at lower CPU before it starts buffering. If Logstash wins on a pipeline full of complex grok filters, I say that, because 'faster' depends on the work. The chart of throughput versus CPU is the answer, not the product page.

## 10. If Fluent Bit is deployed as a DaemonSet, what other deployment options are available?

**Answer:** A DaemonSet is the common Kubernetes pattern when I need one
collector per node. Other options include a sidecar container when logs
are application-specific, a Deployment for a centralized collector or
gateway, and an external collector/agent outside the cluster. I choose
based on the required isolation, log volume, parsing needs and network
path. For general container/node logs, a DaemonSet is usually efficient
because it collects locally and avoids adding a sidecar to every
application pod.

## 11. How do you collect metrics?

**Answer:** For infrastructure and Kubernetes, I would normally use
Prometheus-compatible exporters and scrape endpoints. Node Exporter
provides host metrics, kube-state-metrics exposes Kubernetes object
state, and applications can expose their own `/metrics` endpoint.
Prometheus discovers targets, scrapes them at configured intervals and
stores the time series. Grafana can query Prometheus for dashboards,
while Alertmanager handles alert routing. For cloud-native environments,
I would also consider managed metrics where operational simplicity is
more important.

## 12. What is Prometheus?

**Answer:** Prometheus is a time-series monitoring and alerting system.
It normally pulls metrics from HTTP endpoints, stores them as labeled
time series and provides PromQL for querying. Exporters expose metrics
for systems that do not natively expose Prometheus metrics. Grafana is a
visualization layer that queries Prometheus and turns the data into
dashboards and alerts. In Kubernetes, service discovery can
automatically find pods, services or other targets. I would use
Prometheus for collection and querying, Grafana for visualization, and
Alertmanager for routing alerts.

## 13. What metrics can Prometheus collect?

**Answer:** Prometheus can collect application, infrastructure and
Kubernetes metrics as time series. Examples include request rate, error
rate, latency, CPU, memory, disk, network, pod restarts, container
resource usage and Kubernetes object state. It commonly handles four
metric types: counter, gauge, histogram and summary. For example, a
counter can track HTTP requests, a gauge can represent current memory,
and a histogram can show request-latency distribution. The important
design point is to avoid high-cardinality labels that can make the
Prometheus server expensive.

## 14. What types of metrics have you seen Prometheus collect? Have you configured Prometheus in Kubernetes? What is the scraping interval?

**Answer:** In Kubernetes I have scraped node CPU and memory, pod restarts, container working set, kube-state-metrics such as desired versus ready replicas, and application RED metrics: request rate, error ratio, and a latency histogram. The scrape interval I set is 30 seconds in the ServiceMonitor or the prometheus.yml scrape_config. Fifteen seconds is what I use for a small set of critical targets. One minute is too slow for a short incident. I keep labels to namespace, service, and status code. A label of user id or request id would explode the series count.

## 15. Where do you configure indexes in ELK/EFK?

**Answer:** The index is decided before the document is stored, not in the Kibana visualization. Fluent Bit or Logstash sets the index name, usually with a prefix and a date: logs-payments-prod-2026.10.07. Index templates in Elasticsearch or OpenSearch define the mappings, the shard count, and the lifecycle: hot, then warm, then delete. I do not let every log line invent fields. A template pins keyword versus text, and a high-cardinality field such as a raw user id stays out of the index or gets hashed. Kibana index patterns are only the search window over those indexes. If the pattern is missing, the data may still be there and you are looking at the wrong name. ILM or ISM rolls the date indexes so a single index does not grow without bound.

## 16. What is tracing?

**Answer:** For distributed tracing, I would instrument the services
with OpenTelemetry and propagate trace context across service-to-service
calls. An OpenTelemetry Collector can receive, process and export
telemetry to a tracing backend such as Tempo or Jaeger. Grafana can then
visualize the trace and correlate it with Prometheus metrics and logs.
For ten microservices, I would ensure consistent trace propagation,
service names, sampling and correlation IDs. I would validate the setup
with a real request and follow the trace from ingress through each
downstream service.

## 17. Have you configured tracing for an application? If you have Prometheus and Grafana, how would you set up tracing and visualize it?

**Answer:** Yes. Prometheus and Grafana stay the metrics path. Tracing is a second data source in the same Grafana. I instrument the application with OpenTelemetry, propagate the traceparent header on outbound calls, and send spans to an OpenTelemetry Collector. The collector exports to Tempo or Jaeger. Grafana gets a Tempo datasource and a derived field on the logs so a trace id in a log line opens the trace. I prove it with one request that crosses two services and shows two spans. I do not try to store spans in Prometheus.

## 18. You have 10 microservices running in Kubernetes. How would you implement distributed tracing and visualize it in Grafana?

**Answer:** Each of the ten services gets the same OpenTelemetry SDK and the same service name. Every incoming request extracts the trace context, and every outgoing call injects it, including the database client if the driver supports it. A collector runs as a DaemonSet, so pods export to the node and not across the network to a single bottleneck. The collector forwards to Tempo. Grafana's service map should show ten nodes when I send a request through the front door. Sampling stays high in dev and lower in prod. The test is one trace with a span per service, not ten separate traces that do not connect.

## 19. What is the difference between Tracing and APM?

**Answer:** Distributed tracing follows an individual request across
services and records spans for each operation. APM is broader: it can
include transaction traces, application metrics, errors, profiling and
runtime information. So tracing is a capability within an
APM/observability solution. If I need to answer 'where did this request
become slow?', tracing is especially useful; if I need a broader view of
application performance and runtime behavior, APM provides more context.

## 20. Which cloud platforms have you worked with? What AWS services have you used mostly in EKS?

**Answer:** For a DevOps platform on AWS, the services I would commonly
work with include IAM, VPC, EC2, EKS, ECR, S3, CloudWatch, Route 53,
ALB/NLB, Auto Scaling and Systems Manager. For Kubernetes specifically,
EKS is the control plane, ECR stores images, VPC provides networking,
IAM controls permissions and CloudWatch/Prometheus/Grafana can provide
observability. The exact services should be chosen based on the
application architecture rather than simply using every AWS service.

## 21. How do you identify private and public subnets?

**Answer:** I determine whether a subnet is public or private from its
routing, not from its name. A public subnet normally has a route such as
`0.0.0.0/0 → Internet Gateway`, and resources need a public IPv4 address
or equivalent connectivity to be directly reachable from the Internet. A
private subnet does not route directly to the Internet Gateway. It may
use a NAT Gateway for outbound Internet access. In an interview I would
check the subnet's associated route table, the Internet/NAT gateway and
the resource's address before calling it public or private.

## 22. What is the difference between public and private subnets?

**Answer:** A public subnet has a route to an internet gateway, so instances with a public address can be reached from the internet. A private subnet has no such route. Outbound traffic, if it exists, goes through a NAT gateway. That is the whole difference. The names in the console are labels. Two subnets can look identical in the VPC diagram and be different because of the route table associated with each one.

## 23. What is the difference between Self-Managed Node Groups and Managed Node Groups in EKS?

**Answer:** A managed node group is an EC2 Auto Scaling group that EKS looks after. You pick the instance type, the AMI family, the subnets, and the scaling limits. EKS drains and replaces nodes when you upgrade the Kubernetes version. A self-managed group is an Auto Scaling group you own completely: the AMI, the bootstrap script, the kubelet flags, and the upgrade. You use it when you need a custom AMI, a special bootstrap, or hardware the managed group does not offer. You pay for that with your own upgrade and drain procedure. Both still need an IAM role for the node, security groups, and tags so the AWS cloud controller can find them. For a normal cluster I start with managed node groups. I only go self-managed for a constraint I can name.

## 24. If you create an EC2 instance and lose the PEM/key file, how would you regain access?

**Answer:** I would first check whether an alternate access path exists,
such as SSM Session Manager or EC2 Instance Connect. If not, I can stop
the instance, detach its root EBS volume, attach it to a helper
instance, mount it, add the correct public key to the user's
`authorized_keys`, then reattach the volume and start the original
instance. I would preserve permissions and ownership and take a snapshot
before modifying the disk. The exact recovery procedure depends on the
OS and how SSH is configured.

## 25. Does every AMI support SSM? What about an AMI from the AWS Marketplace?

**Answer:** No. SSM is not guaranteed merely because an instance uses an
AMI. The instance needs a compatible SSM Agent, an IAM instance profile
with the required permissions and network connectivity to the Systems
Manager endpoints. AWS-provided AMIs commonly include the agent, but
Marketplace AMIs vary. I would verify the image documentation and check
agent status, IAM and network connectivity. If the instance is in a
private subnet, I would provide NAT or the appropriate VPC endpoints for
Systems Manager services.

## 26. Your system processes large-scale data pipelines and suddenly latency increases significantly. How would you debug this issue?

**Answer:** I split the pipeline into stages and see which stage's age grew. Crawl, process, and store usually have a queue between them. If the queue depth is flat and CPU is high, the workers are slow. If the queue depth is climbing, consumers are not keeping up or they are blocked on the next stage. I look at the slow dependency first: database latency, object storage errors, or a downstream API. Then I check whether a deploy, a schema change, or a data skew lined up with the start of the incident. One hot partition, one huge URL, or one poison message can stall a whole partition. I sample a few slow items and trace one of them end to end instead of staring at a cluster-wide CPU chart. The fix is either more consumers, a bad query, or isolating the hot key. I add a lag alert so the next time the queue age is the page, not a customer.

## 27. Design a reliable and scalable system to process millions of URLs daily --- Crawl → Process → Store. Focus on infrastructure and DevOps decisions.

**Answer:** I would decouple crawl, processing and storage using a
queue. A scalable architecture could have distributed crawler workers
pulling URL jobs, a durable queue such as SQS/Kafka, processing workers
that scale independently, and durable storage for raw and processed
results. I would enforce per-domain rate limits, retries with backoff,
idempotency and dead-letter handling. Infrastructure would use
autoscaling, container orchestration, private networking and
observability. I would measure throughput, queue depth, success/error
rate and cost per million URLs, then scale based on those metrics.

## 28. Can you share an example of a time when you proactively identified a problem or opportunity and took the initiative to address it without being asked? What was the outcome?

**Answer:** I would answer this with a real STAR example. In one
situation, I noticed a repetitive operational activity that depended
heavily on manual steps. I analyzed the process, identified the
error-prone points, created automation using scripting/Ansible, tested
it safely and integrated the result into the team's workflow. The
important part is that I did not stop at automation: I added validation,
logging and failure handling. The result was less manual effort, more
consistent execution and a process that could be reused by the team. In
an interview I would add the actual time/error reduction from my
project.

## 29. A production application is down. How would you investigate and troubleshoot the issue?

**Answer:** I first establish impact and scope: which users, services,
regions and dependencies are affected. I check recent
deployments/changes, load balancer health, application metrics, logs,
traces, infrastructure health and dependency status. I communicate
during the incident and prioritize service restoration---rollback,
failover, scaling or disabling a bad feature---before deep root-cause
analysis. Once stable, I validate the recovery, document the timeline
and perform an RCA with corrective and preventive actions.

## 30. A CI/CD pipeline suddenly starts failing. How would you identify the root cause and resolve it?

**Answer:** I open the run that failed and read the first red step, not the last line of the log. Then I compare it with the previous green run on main: same Jenkinsfile, same plugin, same agent image, or did one of those move? A compile error is the commit. A missing credential is the secret store or an expired cloud role. A docker push failure is registry auth or an immutable tag. An agent offline is capacity, not the application. I rerun the failed stage once if I suspect a flake, and I treat a pass on rerun as a bug in the test or the runner, not as a fix. I change one thing at a time. The useful record is the run URL, the commit SHA, and the first error, written on the ticket.

## 31. An EC2 instance becomes unreachable. What steps would you follow to troubleshoot it?

**Answer:** I troubleshoot from the outside in. First confirm the
instance state and health checks. Then check the route table,
Internet/NAT path, Security Groups, NACLs and whether the instance has
the expected public/private IP. For SSH, verify the service, OS
firewall, route and key/user. I would also check system and instance
status checks, CPU/memory/disk pressure and recent changes. If network
access is unavailable, I would use SSM Session Manager if configured, or
offline EBS recovery. I would avoid rebooting or replacing the instance
before collecting evidence unless customer impact requires immediate
mitigation.

## 32. How would you troubleshoot a server where CPU utilization suddenly reaches 100%?

**Answer:** First I confirm whether CPU is genuinely saturated and
whether the issue affects one process, one host or many instances. I use
`top`/`htop`, `ps`, `pidstat` or equivalent to identify the consuming
process, then inspect logs and recent deployments. I also check load
average, I/O wait, memory pressure and thread/process counts because
high CPU can be a symptom rather than the root cause. If customers are
impacted, I scale or mitigate first, then investigate the cause and add
an appropriate alert/capacity control.

## 33. A deployment is successful, but users are experiencing errors. How would you investigate the issue?

**Answer:** The deploy being successful only means the rollout command exited 0. I check whether the new pods are Ready, not merely Running. kubectl describe shows probe failures, image pull errors, and events. kubectl logs shows the process. If the pods are Ready, the bug is in front of them: the Service selector does not match the pod labels, the ingress points at the wrong service, the target group health check fails, or a network policy or security group blocks the path. I send one request with a known id and follow it: load balancer access log, ingress log, application log. A spike in 5xx with the old pods healthy means the new version is the problem and I roll the deployment back. A spike with no new pods receiving traffic means the path, not the code.

## 34. How would you design a highly available and fault-tolerant application on AWS?

**Answer:** I design out single points of failure. On AWS that typically
means multiple Availability Zones, load balancing, autoscaling and
managed/replicated data services where appropriate. I define RTO/RPO,
use health checks and automated recovery, protect data with backups and
test restoration. At the application level I design stateless services
where possible and make dependencies resilient with timeouts, retries
and circuit-breaking where appropriate. Finally, I validate the design
through failure testing rather than assuming redundancy automatically
equals availability.

## 35. How would you monitor a production application and set up meaningful alerts?

**Answer:** I alert on user symptoms and on things that are about to become user symptoms. For an HTTP service that is error ratio, latency, and saturation: 5xx rate, p95 latency, and pod restarts or queue age. I do not page on CPU at 70 percent. Each alert has a runbook line: what it means, which dashboard, what to check first. Warning goes to chat. Paging goes to someone who can act. I group alerts by service and I set a short repeat interval so a flap does not send a hundred messages. When thousands of alerts fire at once, I look for the one shared dependency: the database, DNS, the node group, or a bad deploy that touched everything. The individual CPU alerts are the noise around that cause. After the incident I delete or retune the alerts that nobody acted on.

## 36. What happens when you enter a website URL in your browser and press Enter? Explain the complete flow.

**Answer:** The browser first parses the URL and checks relevant
local/browser caches. DNS resolution then maps the hostname to an IP,
usually through the configured recursive resolver. The client
establishes a network connection---typically TCP plus TLS for
HTTPS---and validates the server certificate. It sends the HTTP request
with headers/cookies, and the request travels through any CDN, WAF or
load balancer to the origin. The server returns the response; the
browser processes redirects, HTML, CSS, JavaScript and other resources,
performs additional requests and renders the page.

## 37. How would you troubleshoot a Kubernetes pod stuck in CrashLoopBackOff?

**Answer:** For `CrashLoopBackOff`, I check `kubectl logs --previous`
first, then `kubectl describe pod` for events. I inspect the container
command/args, environment variables, ConfigMaps/Secrets, mounted
volumes, dependencies and probes. If the container is being OOM-killed,
I check memory limits and actual usage. If the application exits
normally, I verify the expected long-running process. I fix the
underlying issue rather than simply increasing restart delays.

## 38. How would you secure a CI/CD pipeline and prevent secrets from being exposed?

**Answer:** The pipeline is a production credential with a YAML file. I keep secrets in the CI secret store or a cloud secret manager, never in the Jenkinsfile or the repo. Pull requests from forks do not receive those secrets. Production deploy uses an environment with required reviewers, and the job assumes a cloud role with OIDC so there is no long-lived access key. The default token can read the repo and nothing else. Third-party actions and shared libraries are pinned to a commit. The build runs SAST, dependency scanning, and a container scan, and a critical finding fails the job. The artifact is promoted by digest, not rebuilt from a branch later. Signing the image and only allowing signed digests in the cluster closes the gap where someone pushes a tag the pipeline did not build.

## 39. What is the difference between `terraform import` and `terraform taint`?

**Answer:** `terraform import` brings an existing infrastructure
resource under Terraform management by associating it with a resource
address in state; it does not automatically generate perfect
configuration. `terraform taint` was the older mechanism for marking a
resource for replacement. In current Terraform, I prefer
`terraform apply -replace=resource.address`, because it makes the
replacement intent explicit for that operation. Neither command is a
rollback mechanism.

## 40. How do you manage secrets in Terraform without hardcoding them?

**Answer:** I avoid hardcoding secrets in `.tf` files, variables files
or Git. I prefer retrieving secrets from a secret manager such as AWS
Secrets Manager or SSM Parameter Store and using short-lived IAM
roles/OIDC for CI. However, an important interview point is that
sensitive values can still end up in Terraform state if a resource
requires the value. Therefore I secure the backend with encryption,
access control and locking, minimize secret exposure and mark sensitive
outputs appropriately. I never treat `sensitive = true` as
encryption---it mainly prevents casual display.

## 41. What's the difference between `count` and `for_each`? Give a real-world use case.

**Answer:** `count` creates resources addressed by numeric indexes such
as `resource.example[0]`. `for_each` creates resources addressed by
stable keys such as `resource.example["prod"]`. For a collection where
individual items have meaningful identities, I prefer `for_each` because
removing one key does not shift the indexes of the remaining resources.
For example, I might create one IAM policy attachment per environment
using `for_each = toset(var.environments)`. Switching from `count` to
`for_each` changes resource addresses, so Terraform can interpret the
change as destroy/create unless I use moved blocks or state moves.

## 42. How do you handle drift detection in Terraform?

**Answer:** Drift means the real infrastructure differs from what
Terraform state/configuration represents. I detect it by running a
refresh-aware `terraform plan` and reviewing unexpected differences. I
first determine who changed the resource and whether the manual change
was intentional. If Terraform should remain authoritative, I update the
configuration and apply a reviewed plan; if the external system is
authoritative, I import or model the desired state. For production, I
prefer controlled reconciliation, testing and staged rollout rather than
an immediate blanket apply.

## 43. What is a Terraform remote backend, and why is it important?

**Answer:** A Terraform backend defines where Terraform stores state and
how that state is accessed. A remote backend is important because teams
and CI/CD should not rely on a developer's local `terraform.tfstate`. A
suitable backend provides centralized access, encryption, versioning
and, depending on the backend, state locking. For AWS I might use an
S3-based backend with appropriate encryption/versioning and a supported
locking mechanism. Access should be restricted because state can contain
sensitive infrastructure information.

## 44. How do you manage multiple environments (dev, staging, prod) in Terraform?

**Answer:** I prefer reusable modules plus separate root configurations
or clearly separated state for Dev, UAT and Prod. Environment-specific
values belong in variables or environment-specific configuration, while
the module contains reusable infrastructure logic. Each environment
should have independent state and permissions so a Dev change cannot
accidentally modify Prod. CI should run `fmt`, `validate`, security
checks and `plan`, with approval and restricted credentials for
production apply.

## 45. What is the difference between `local-exec` and `remote-exec` provisioners?

**Answer:** `local-exec` runs a command on the machine where Terraform
is executing, while `remote-exec` runs commands on the target resource
through a configured connection. I generally avoid provisioners when a
native Terraform resource, cloud-init, Ansible or another
configuration-management mechanism is more reliable. Provisioners can
make infrastructure less declarative and harder to reproduce. If I must
use one, I document the dependency and make the command idempotent and
failure-safe.

## 46. How do you safely roll back infrastructure changes after a failed deployment?

**Answer:** I roll back the thing that changed, and I know which thing that was before I start. An application rollback is the previous container digest: kubectl rollout undo, or shifting the Service or ingress back to the old ReplicaSet in a blue-green setup. I confirm the old pods go Ready and the error rate drops. An infrastructure rollback is not the same command. If Terraform apply failed halfway, I fix the cause and apply again, because Terraform is not a transaction and a blind destroy is worse. If a plan already replaced a database, rollback is a restore from the snapshot I took before the change, not another apply that recreates an empty instance. The pipeline should have the previous digest and the previous Terraform plan saved. I do not debug a bad release against live traffic when the last version is known good.

## 47. Explain `terraform refresh` vs `terraform plan`.

**Answer:** A refresh updates Terraform's view of real infrastructure so
state reflects provider-side changes; in modern Terraform, refresh is
generally part of normal planning rather than a workflow I run
separately. `terraform plan` compares configuration with the refreshed
state/provider information and calculates proposed changes. The
important distinction is that refresh is about reconciling state with
reality, while plan is about determining what Terraform intends to
change.

## 48. How do you write reusable Terraform modules?

**Answer:** A module is a folder with variables in, resources inside, and outputs out. Callers in live/dev and live/prod pass different values and do not copy the resources. I pin the module version. The module does one job, a VPC or a service, and it does not contain a provider block or a hardcoded account id. Variables have types and descriptions. Defaults are the cheap, safe choice. Outputs are the contract, the VPC id and the security group id, not every attribute. Two environments differ by tfvars and by which account the credentials point at, not by a forked module. If a module wraps a single resource and adds nothing, I inline it. If a change to the module would force replacement, that shows up in the plan for dev before it ever runs in prod.

## 49. What is the importance of DevOps in the Software Development Life Cycle (SDLC)?

**Answer:** DevOps brings development, operations, security and
automation practices together so software can be delivered quickly and
reliably. The goal is not simply faster deployments; it is a feedback
loop from code to production and back to engineering. CI provides fast
automated validation, CD makes releases repeatable, IaC makes
infrastructure reproducible, observability provides feedback, and
automation reduces manual error. A good DevOps implementation improves
deployment frequency, lead time, change-failure rate and recovery time
while maintaining security and reliability.

## 50. How is CI achieved?

**Answer:** Continuous Integration means developers integrate changes
frequently into a shared repository and every change is automatically
validated. A practical CI flow is commit/PR → checkout → dependency
install → lint/unit tests → build → SAST/SCA → artifact creation →
publish. The pipeline should fail fast on quality/security gates and
produce an immutable artifact that later stages can promote. CI is not
just 'running Jenkins'; the important part is fast feedback,
repeatability and keeping the main branch in a releasable state.

## 51. How do you ensure security and compliance in CI/CD?

**Answer:** I build security into the pipeline rather than adding a
final security step. I use SAST such as CodeQL/SonarQube where
appropriate, SCA/dependency scanning, container/image scanning such as
Trivy, secret scanning, IaC scanning and policy gates. Credentials use a
secret store or OIDC/short-lived roles, and production deployment
requires least privilege and approval controls. I also retain audit logs
and reports so security decisions are traceable.

## 52. How does containerization work in deployments?

**Answer:** Containerization packages an application and its
dependencies into an image so the workload runs consistently across
environments. During deployment, the image is pulled from a registry and
a runtime starts the container with configured environment variables,
ports, volumes and resource limits. In Kubernetes, a Deployment manages
replicas of pods containing those containers. The key DevOps benefit is
reproducibility: the same immutable image can move from test to staging
to production rather than being rebuilt differently in each environment.

## 53. Explain Blue-Green Deployment.

**Answer:** Blue-green means two complete environments. Blue is serving traffic. Green is the new version, deployed and health-checked while it receives none of the user traffic. You switch the load balancer or the Service to green in one move. If green fails, you switch back to blue, which was never turned off. The cost is that you run both for the length of the release, and any database migration has to work with both versions or be split into an expand step and a later contract step. It is the right choice when you want an instant, boring rollback and you can afford the extra capacity. It is the wrong choice when the database cannot be shared and you have no plan for the data.

## 54. What is self-healing in Kubernetes?

**Answer:** Self-healing comes from Kubernetes controllers continuously
reconciling actual state with desired state. If a container fails,
kubelet can restart it according to the pod's restart policy. If a pod
managed by a Deployment/ReplicaSet disappears, the controller creates a
replacement. If a node fails, eligible replicas can be scheduled on
healthy nodes. This is not magic recovery: capacity, persistent storage,
affinity, PodDisruptionBudgets and application dependencies can limit
recovery, so high availability still requires good architecture.

## 55. How would you troubleshoot an unreachable pod?

**Answer:** I first determine whether the pod is unreachable from
another pod, from the node, or from outside the cluster. Then I check
pod status, readiness, IP, Service and EndpointSlice, DNS,
NetworkPolicy, CNI/networking and the destination port. I use
`kubectl exec`, `curl`, `nslookup`/`dig` and service-level tests to
isolate DNS versus network versus application issues. For external
traffic I also inspect Ingress/load-balancer health and security
controls.

## 56. What are the use cases of Ansible?

**Answer:** I use Ansible for repeatable configuration and operational
automation: installing/configuring software, managing users and files,
applying security baselines, orchestrating multi-step changes and
integrating APIs or infrastructure workflows. Inventories define
targets, playbooks describe tasks and roles organize reusable logic. I
design tasks to be idempotent, use variables rather than hardcoded
values, protect secrets with Ansible Vault or an external secret store
and use `check_mode`/testing where appropriate.

## 57. Explain Infrastructure as Code (IaC).

**Answer:** Infrastructure as Code means defining infrastructure in
version-controlled, repeatable configuration rather than creating it
manually. Terraform is a common example: configuration describes desired
infrastructure, state tracks managed resources and `plan/apply` provides
a controlled change workflow. IaC gives us reviewable changes,
repeatability, auditability and easier environment creation. It also
introduces responsibilities such as state security, module design,
version management and drift control.

## 58. What happens when you run `terraform init`?

**Answer:** `terraform init` initializes a working directory. It
configures the backend, downloads required providers, installs modules
and creates the dependency/plugin metadata Terraform needs. It does not
create or modify infrastructure. I run it after cloning a project, after
backend/provider/module changes when needed, and in CI on a clean
workspace. I also commit the dependency lock file so provider versions
remain reproducible.

## 59. What are the different Linux distributions?

**Answer:** The ones I actually operate are Amazon Linux, Ubuntu, Debian, and RHEL or a rebuild such as Rocky or Alma. Amazon Linux is the default on AWS and matches the AWS tooling. Ubuntu and Debian are common on images and in containers. RHEL and its rebuilds show up where a vendor supports only that family. Alpine shows up in container bases because it is small, and it is a frequent source of 'works on Ubuntu, fails in the image' because of musl versus glibc. I do not collect distributions for fun. I pick one family per platform, bake it into an image, and patch by replacing the image. The package manager follows the family: dnf or yum, apt, apk.

## 60. How do you check the performance of a Linux server?

**Answer:** I look at CPU, memory, disk, I/O and network rather than
relying on one metric. I use `top`/`htop` and `ps` for processes,
`free`/`vmstat` for memory, `iostat` for disk I/O, `df`/`du` for
storage, `ss` for network sockets and system/application logs for
context. I compare the current values with a baseline and correlate them
with recent changes and workload. The goal is to identify the
bottleneck, mitigate impact safely and then fix the root cause rather
than simply adding capacity.

## 61. What commands do you use to troubleshoot network issues in Linux?

**Answer:** I troubleshoot in layers: `ip addr` and `ip route` for
interface/address/routing, `ping` or `tracepath` for reachability,
`dig`/`resolvectl` for DNS, `ss` for listeners and connections, and
`curl` for application-level connectivity. Then I check host firewalls,
cloud Security Groups/NACLs, proxies and service logs. This separates
DNS, routing, TCP, TLS and application problems. I prefer a test from
the same host/network namespace as the failing application.

## 62. What kind of Bash scripts have you used in your projects?

**Answer:** Small operational scripts, not application logic. A disk check that reads df, compares the use percent with a threshold, and exits non-zero so cron or the monitoring agent can alert. A log sweep that uses grep, awk, and sort to count error codes in an access log when the indexer is down. A deploy helper that pulls a digest, restarts a unit, and curls the health URL. I use set -euo pipefail, I quote variables, and I do not parse ls. Anything that needs to run on more than one machine, or needs a review, becomes an Ansible task instead of a script copied by hand. The script lives in git. Secrets come from the environment, not from the file.

## 63. What AWS services have you worked with?

**Answer:** The AWS services I use in this kind of platform are IAM, VPC, EC2, EKS, ECR, S3, RDS, ALB or NLB, Route 53, CloudWatch, and Systems Manager. IAM is on every call. The VPC and its subnets hold the cluster and the database. ECR holds images. S3 holds artifacts and logs. RDS is the relational database. The load balancer is the public door. CloudWatch holds the AWS-side metrics. I name these because they are the ones I would have to explain in a design, not because they are the full catalog.

## 64. Have you used both CloudFormation and Terraform?

**Answer:** CloudFormation is AWS-native and uses CloudFormation
templates to provision AWS resources. Terraform is multi-cloud and uses
HCL with a provider model. Terraform's module ecosystem and workflow are
attractive when the organization manages multiple platforms or wants a
common IaC approach; CloudFormation has strong native AWS integration.
For an AWS-only organization I would still choose based on team skills,
existing estate, governance and module maturity rather than assuming one
is universally better.

## 65. What is the difference between CloudFormation and Terraform?

**Answer:** CloudFormation is AWS only. A stack is the unit, and AWS stores the state. A failed update can roll the stack back as a unit, with limits. Terraform talks to many providers, including AWS, GCP, and Kubernetes, and I store the state. The language is HCL rather than a CloudFormation template. For one AWS account and a team that wants AWS to hold the state, CloudFormation fits. For this set of notes, which also covers GCP and Kubernetes, Terraform is the one language. The difference that matters in an incident is who holds the state and how a failed update behaves.

## 66. If you are working specifically with AWS, which would you choose: CloudFormation or Terraform?

**Answer:** For this roadmap, and for any account that is not AWS-only forever, I choose Terraform. The AWS examples, the GCP examples, and the Kubernetes work can share one language and one state model. CloudFormation is a strong AWS-native choice when the organization is all-in on AWS, wants a stack to roll back as a unit, and does not want a separate state file to protect. I would not run both for the same resources. Two tools means two sources of truth. If a team already has a large CloudFormation estate I would not rewrite it for sport. New platforms in this repo are Terraform, with the plan in the pull request and the state in a locked backend.

## 67. Write a simple Dockerfile for a Node.js application.

**Answer:** For a Node.js application I would start from a supported
slim base image, copy `package*.json` first, run a deterministic install
such as `npm ci`, then copy the application source. I would use a
non-root runtime user, define the correct `CMD`, add a `.dockerignore`
and avoid putting secrets in the image. For production I would usually
use a multi-stage build if a compilation/build step is required.

## 68. How would you write the same Dockerfile using a multi-stage build?

**Answer:** In a multi-stage Dockerfile, the first stage contains the
build tools and compiles or prepares the application. The final stage
starts from a smaller runtime image and copies only the files needed to
run the application. This reduces image size, attack surface and the
number of packages shipped to production. It also separates build-time
dependencies from runtime dependencies, which makes vulnerability
scanning and maintenance easier.

## 69. Can you create a Jenkins pipeline for building and deploying a Docker image?

**Answer:** A Jenkins pipeline for an image is a Jenkinsfile in the repo. It checks out the commit, runs the tests, builds the image, scans it, and pushes the digest to ECR. Credentials come from the Jenkins credential store, not from the file. A minimal shape is: agent with Docker, stage Test running the unit tests, stage Build running docker build, stage Scan failing on a critical finding, stage Push assuming an AWS role and pushing the tagged image, stage Deploy updating the Kubernetes deployment to that digest and waiting for rollout status. The deploy stage is restricted to the main branch. The pull-request build stops after the scan. I pin the agent image so 'works on the controller' is not the design.

## 70. If an application is deployed to EKS and a pod fails, how would you investigate it?

**Answer:** On EKS a failed pod is still a Kubernetes pod. I start with kubectl get pods -n the namespace and look at the status: ImagePullBackOff, CrashLoopBackOff, Pending, or OOMKilled. describe shows the events. logs --previous shows the crash if the new container has already replaced it. Image pull failures are ECR permissions or the node role. Pending is CPU, memory, or a subnet out of IPs. OOMKilled is the limit, not the node disappearing. If the pod never lands on a node, I check the node group and whether the nodes are Ready. If it lands and dies, I read the application log before I read the AWS console. The cluster and the cloud meet at IAM, the security group on the nodes, and the VPC CNI. I go there only when the Kubernetes events point at them.

## 71. You have made changes in Terraform, but the plan is showing unexpected resources to be created or destroyed. How would you investigate?

**Answer:** Unexpected creates and destroys mean the plan is not the diff I thought I wrote. I read every line marked destroy or forces replacement first. Then I ask what changed outside the code: a console edit, a provider upgrade, a variable file from the wrong environment, or a resource address rename that looks like a delete plus a create. terraform state list and a moved block fix a rename. A console edit is either adopted into code or reverted, on purpose. I also check that the backend key and the workspace are the environment I meant. Applying this plan because 'most of it looks fine' is how a tag change deletes a database. I do not apply until the unexpected lines are explained.

## 72. Two Engineers are working with the same Terraform state at the same time. How would you prevent state conflicts?

**Answer:** One remote state, with a lock. Two laptops and two local state files will create two copies of the same network. The state lives in S3 with a DynamoDB lock, or in a Terraform Cloud workspace. The pipeline is the only writer for production. A second apply waits or fails on the lock instead of writing over the first. Engineers can plan. They do not apply from a laptop against the shared state. If an apply dies and leaves the lock, I confirm nothing is running and only then force-unlock. Versioning on the state bucket means a bad write can be rolled back to the previous object. Separate state keys per environment mean a dev apply cannot lock or destroy prod.

## 73. Terraform apply failed halfway through the deployment. What would you check before running `terraform apply` again?

**Answer:** Terraform can create some resources before a later operation
fails, so I treat a failed apply as a partially completed change, not an
automatic rollback. I inspect the error, state and actual cloud
resources, check for locks and dependencies, and run a fresh
`terraform plan`. If resources exist but are missing from state, I
reconcile them carefully rather than recreating them blindly. After the
cause is fixed, I apply the reviewed plan and validate the resulting
infrastructure.

## 74. You need to create the same infrastructure for multiple environments, such as Dev, UAT, and Prod. How would you structure your Terraform code?

**Answer:** I use one module and three root directories, live/dev, live/uat, and live/prod, each with its own state key and its own account or project. The directories are thin: they call the module and pass values. Dev can have smaller instances and one NAT. Prod has multiple zones and deletion protection. I do not use a single workspace switch on one laptop as the only separation, because the credentials would still be able to destroy both. A tfvars file per environment is fine. A copy of every resource pasted three times is how they drift apart.

## 75. Your application is running successfully in an EKS Pod, but users are unable to access it. How would you troubleshoot the issue?

**Answer:** The pod is Running, so I check Ready and the endpoints. kubectl describe shows probe failures and events. If the pod is Ready, I curl the pod IP from inside the cluster, then the Service, then the ingress. The first hop that fails is the fault: the process is not listening, the Service selector misses the labels, the ingress backend is wrong, or a network policy or the node security group drops the packet. From outside, I also check the load balancer target health. EKS does not add a new failure mode here. It adds the security group and the VPC CNI to that list.

## 76. A pod is running on one of the EKS nodes, but suddenly the node goes down. What happens to the application?

**Answer:** Kubernetes detects that the node has stopped responding and
eventually marks it NotReady. Pods managed by controllers such as
Deployments are recreated on healthy nodes if replicas and scheduling
constraints permit. Standalone pods are not automatically recreated.
Stateful workloads also depend on storage and identity semantics.
Recovery can be affected by PodDisruptionBudgets, affinity, resource
capacity and persistent volume attachment. For high availability I
spread replicas across nodes/AZs and monitor node health.

## 77. Your application running in EKS cannot connect to an RDS database. What AWS/Kubernetes components would you check?

**Answer:** I would test the connection from the pod and work through
the network path. First verify the RDS endpoint/DNS and port, then
VPC/subnet routing, Security Groups on both sides, NACLs if relevant and
NetworkPolicies. I would check that the application is using the correct
hostname, port, database credentials and TLS settings. I would also
check RDS status, connection limits and CloudWatch metrics. For EKS, I
would confirm the pod's subnet/security identity and any NAT/VPC
endpoint requirements for related services.

## 78. CPU usage suddenly increases across multiple Pods in production. How would you investigate the issue?

**Answer:** Many pods high at once is the cluster or the traffic, not one leak. I look at the node CPU and at whether the pods are throttled against a low limit. I check if a deploy rolled out to all of them together. I check the request rate. If the rate is flat and CPU is high, the new code is hotter. If the rate rose, I scale or I find the retry loop. kubectl top pods and the container CPU metric, split by pod, show whether it is even or one pod is the outlier wearing a shared chart.

## 79. A Docker container starts and then immediately exits. How would you find the root cause?

**Answer:** I start with `docker ps -a` and inspect the exit code and
`docker logs`. Then I check `docker inspect` for the command,
entrypoint, environment, mounts and restart policy. A common cause is
that the main process exits immediately because the CMD/ENTRYPOINT is
wrong or the application fails during startup. I reproduce it
interactively if needed by overriding the entrypoint. I would also check
permissions, required files and dependency connectivity before changing
the restart policy.

## 80. Your Docker image is around 2 GB, and the deployment team wants to reduce it significantly. What would you do?

**Answer:** I would inspect the image layers first, then remove
unnecessary build tools and files. I would use a smaller trusted base
image, multi-stage builds, a `.dockerignore`, dependency pruning and
better layer ordering. I would avoid copying source, caches, test data
or package-manager artifacts that are not needed at runtime. After the
change I would compare image size, startup time and vulnerability
findings. The goal is not simply the smallest image; it must remain
supported, secure and operationally useful.

## 81. The application works on your local machine but fails after running inside a container. How would you troubleshoot it?

**Answer:** The container is a clean room and the laptop is not. I compare three things. The process is listening on the port the image actually exposes, and Kubernetes or the runtime is sending traffic to that port, not to the port I use in development. The config comes from the environment or a mounted file, not from a dotfile that exists only on my machine. The base image has the libraries I linked against. Alpine and a glibc binary is a classic failure. I run the same image locally with docker run and the same environment the cluster sets. If it fails there, I have reproduced it. If it only fails in the cluster, the difference is service account, DNS, network policy, or a secret that is absent. I print the effective config at startup with secrets redacted.

## 82. A developer accidentally pushed incorrect code to a shared branch. How would you handle the situation?

**Answer:** I stop people from building on the bad commit, then I fix history in the way that matches whether anyone else has pulled it. If the branch is shared and others have it, I do not force-push over their work. I revert the bad commit, which adds a new commit that undoes it, and I push that. If I just pushed to a feature branch and nobody else has fetched it, a reset and a force-push with lease is acceptable and I say so in the team channel. If the bad push included a secret, rotation comes before the git cleanup. The commit is already copied. Deleting it does not un-leak the key. Afterwards I look at why review did not catch it: a missing pull request, or a branch with no protection.

## 83. You have conflicts between your feature branch and the main branch. What steps would you follow?

**Answer:** I update my branch with the latest main before I open or update the pull request. git fetch, then git rebase origin/main if the branch is mine and not shared, or git merge origin/main if others are committing to the same branch. Conflicts are shown in the files. I open each one, keep both intents, and delete the conflict markers. I run the tests. I do not pick 'ours' or 'theirs' for a whole file unless I have read it. After a rebase I force-push with lease to my feature branch only. After a merge I do an ordinary push. The pull request diff should show my change against current main, not a surprise mix of someone else's half-resolved file.

## 84. Your team has multiple developers working on the same repository. What Git branching strategy would you follow?

**Answer:** For most modern teams I prefer trunk-based development or
short-lived feature branches: developers branch from main, make a
focused change, open a PR, pass automated checks and merge quickly.
Feature flags can separate deployment from release. Git Flow can make
sense for organizations with long-lived release branches and formal
release cycles, but it adds complexity. The important controls are
protected main, mandatory review, automated CI and a clear
release/tagging strategy.

## 85. A Jenkins pipeline that was working yesterday suddenly starts failing today. How would you troubleshoot it?

**Answer:** Yesterday's job is the control. I open today's red run and yesterday's green run and compare the Jenkinsfile commit, the plugin versions, the agent image, and the commit being built. If only the application commit changed, I read the first compiler or test error. If nothing in the repo changed, something around Jenkins changed: a credential, a plugin upgrade, a full disk on the agent, or GitHub rate limiting. I rerun once. A pass on rerun means the stage is flaky and I file that, I do not call the pipeline healthy.

## 86. Your Jenkins pipeline successfully builds the Docker image but fails while pushing it to ECR. What would you check?

**Answer:** The image already exists, so I do not rebuild it. The failure is the push to ECR. I read the first error from docker push. The usual causes are authentication and the repository. The agent needs an IAM role that can call ecr:GetAuthorizationToken and push to that repository, then docker login against the registry URL for the right region. A token from the wrong account, or a repository that was never created, fails here even though the build was green. The name must be account.dkr.ecr.region.amazonaws.com/repository:tag. I also check that the agent can reach the ECR endpoint, which a private subnet without a route or a VPC endpoint will block. I do not store a long-lived AWS key in the job if the instance role can do this.

## 87. The CI pipeline is successful, but the deployment to Kubernetes fails. How would you identify where the problem is?

**Answer:** CI and deploy are different failures. I find the first deploy step that went red. An image build can succeed and the deploy can still fail because the cluster rejected the manifest, the image pull failed, the rollout timed out on a readiness probe, or the pipeline's kubeconfig points at the wrong cluster. I compare the manifest the pipeline applied with what is running. kubectl rollout status and describe on the deployment tell me whether new pods were created and why they are not Ready. If the pipeline said success and the app is still old, the task finished before the rollout completed. The fix is to wait for the rollout and to fail the job when it does not finish. I do not rebuild the image until I know the running digest is the one CI just pushed.

## 88. How would you design a pipeline from Git → Jenkins → Docker → ECR → EKS?

**Answer:** A typical flow is Git push/PR → Jenkins webhook trigger →
checkout → build → unit/integration tests → SAST/SCA → package or Docker
build → image scan → push immutable artifact to a registry → deploy to
the target environment → smoke/health checks → monitoring and promotion.
I separate CI from deployment where appropriate, use credentials from
Jenkins/external secret management, archive or publish artifacts, and
make deployments repeatable. For production, I add approvals,
environment-specific controls, rollback strategy and auditability.

## 89. How do you design an end-to-end CI/CD pipeline?

**Answer:** An end-to-end pipeline starts at the pull request and ends with a healthy production revision. Pull request: build, test, scan, no deploy. Main: build the image, push the digest, deploy to dev, run a smoke check. Production: an approval, then the same digest deployed, then a wait on health, then either success or an automatic return to the previous digest. Notifications and the digest are part of the pipeline. A pipeline that stops at 'tests passed' is CI. The end-to-end one includes the running service.

## 90. How do you store and manage credentials in Jenkins?

**Answer:** I store credentials in Jenkins Credentials rather than in
the Jenkinsfile or source repository. The pipeline references the
credential by ID and Jenkins injects it only for the required step. I
use the least-privileged account possible, restrict credential scope,
mask secrets in logs and rotate them. For AWS, I prefer short-lived role
credentials/OIDC over long-lived access keys where the Jenkins
architecture supports it. I also ensure shell commands do not
accidentally echo secrets.

## 91. How do you troubleshoot a failed Jenkins pipeline?

**Answer:** A failed Jenkins pipeline gets the console of the failed stage and the agent it ran on. I check the recent changes to the Jenkinsfile and to the shared library, because a library change breaks every job that uses it. I check the agent disk and the Docker daemon if the step is a container build. I do not restart Jenkins as a diagnostic. I rerun the stage after I can say why it failed. If I cannot, the rerun is the experiment, and I watch the same line.

## 92. What is the difference between Freestyle and Pipeline jobs?

**Answer:** A Freestyle job is configured primarily through Jenkins UI
and is suitable for simple jobs, but its configuration is less naturally
version-controlled. A Pipeline is defined as code, usually in a
Jenkinsfile, so it can be reviewed, versioned and reused. Pipeline also
supports stages, parallel execution, approvals, retries and more complex
delivery logic. For modern CI/CD, I prefer Pipeline as Code because the
build/deployment process becomes part of the repository and can evolve
through normal code review.

## 93. How do you implement approval before production deployment?

**Answer:** I would make production deployment a protected stage after
automated validation. For example, Jenkins can pause at an `input` step
or use an external change-management approval. The approval should show
the artifact/version, environment, change summary and relevant
test/security results. Only authorized users should approve, and the
production credentials should be available only to that deployment
stage. I would also make the artifact immutable so approval is for
exactly what was tested.

## 94. How do you integrate SonarQube and Trivy into Jenkins?

**Answer:** I would place SonarQube analysis after checkout/build
preparation and run Trivy against the resulting container image before
it is promoted. SonarQube can enforce code-quality/security quality
gates, while Trivy can scan OS packages, application dependencies and
container/IaC configurations depending on how it is configured. The
pipeline should fail on agreed severity thresholds, publish reports and
avoid deploying an image that fails the required gate. Thresholds should
be defined with the security team rather than hard-coded arbitrarily.

## 95. What is the difference between `git merge` and `git rebase`?

**Answer:** Merge combines two histories and, when needed, creates a
merge commit; it preserves the original branch topology. Rebase moves a
branch's commits onto a new base by replaying them, which creates new
commit IDs and produces a cleaner linear history. I use rebase for my
private feature branch when I want to update it with main and keep
history clean. I avoid rebasing shared branches because it rewrites
history. For team integration, I follow the repository's agreed merge
strategy.

## 96. How do you resolve merge conflicts?

**Answer:** I first fetch the latest target branch and make sure I
understand which changes should win. I then merge or rebase according to
the team's workflow, inspect each conflicted file, resolve the conflict
intentionally, and run tests---not just `git add`. After validation I
complete the merge/rebase and push the result. If the branch is shared,
I avoid force-pushing rewritten history unless the team explicitly
permits it. I prefer resolving conflicts locally and letting the PR show
the final diff.

## 97. How do you protect sensitive information from being pushed to GitHub?

**Answer:** I prevent secrets from reaching Git through secret managers,
protected CI variables, pre-commit hooks and GitHub secret scanning.
Repository branch protection and least-privilege access reduce the risk
further. If a secret is committed, I immediately revoke or rotate it
because deleting the file does not invalidate the leaked credential.
Then I remove the secret from history where necessary and verify that CI
logs, artifacts and caches do not contain it.

## 98. How do you implement branching strategies in a project?

**Answer:** I select the branching model based on release frequency and
team size. For a continuously delivered product, I prefer short-lived
feature branches with protected main and strong CI, or trunk-based
development with feature flags. For organizations with scheduled
releases and multiple supported versions, Git Flow can be appropriate.
Regardless of the model, I enforce PR review, automated tests, security
checks, branch protection and a clear release/tagging process.

## 99. What is the difference between an image and a container?

**Answer:** A Docker image is an immutable package containing the
application, runtime, libraries and filesystem layers needed to create a
container. A container is a running or stopped instance of that image
with its own process namespace, filesystem layer, networking and
resource controls. The same image can create multiple containers, which
is why immutable images help make deployments consistent. In Kubernetes,
the image is pulled from a registry and the container runtime creates
the actual container process from it.

## 100. How do you troubleshoot a container that keeps restarting?

**Answer:** A restarting container has a reason if I ask before the logs rotate away. docker inspect or kubectl describe shows the exit code and the restart count. Exit 137 is usually an OOM kill. Exit 1 is the process. kubectl logs --previous or docker logs shows what it printed as it died. A crash loop with no logs often means the entrypoint is wrong, a missing binary, or a config file it expects at a path that was not mounted. A probe that fails immediately will also restart the pod if the liveness probe is tighter than startup. I read the probe timing before I call the application broken. I keep the previous logs long enough to read them, and I fix the cause. Raising the restart limit hides it.

## 101. How do you optimize a Dockerfile?

**Answer:** I optimize a Dockerfile by choosing an appropriate minimal
base image, using multi-stage builds, copying dependency manifests
before application code for cache reuse, excluding unnecessary files
with `.dockerignore`, and running as a non-root user. I also pin or
constrain dependencies appropriately, remove package-manager caches,
avoid unnecessary layers and keep build secrets out of the image. I
validate the result with image size, build time, startup behavior and
vulnerability scanning.

## 102. How do you push Docker images to Amazon ECR?

**Answer:** First I authenticate Docker to the correct ECR registry
using the AWS identity assigned to the build agent. Then I build the
image, tag it with the full ECR repository URI and push it. If it fails,
I check the AWS account and region, repository existence, IAM
permissions such as ECR upload actions, Docker authentication,
network/proxy access and the exact image tag. In CI I prefer short-lived
IAM role credentials and immutable tags such as a Git commit SHA rather
than relying only on `latest`.

## 103. How do you troubleshoot `CrashLoopBackOff` and `ImagePullBackOff`?

**Answer:** For `ImagePullBackOff`, I first run `kubectl describe pod`
and inspect the Events section because it normally gives the immediate
reason. I verify the image repository and tag, registry connectivity,
imagePullSecrets, node IAM permissions where relevant, DNS and registry
rate limits. If the image exists but authentication fails, I fix the
secret/identity. If the tag is wrong, I correct the deployment. I then
watch the pod events and confirm the container starts successfully.

## 104. What happens when a Kubernetes worker node goes down?

**Answer:** The pods on that node become NotReady. Kubernetes waits out the eviction grace period and then, if a controller wants those pods, schedules them on other nodes. A Deployment with replicas and spare capacity comes back. A pod with a volume attached to the dead node can stick until the volume detaches. A DaemonSet pod does not move. It appears on the remaining nodes already, and on a replacement node when one joins. The application stays up if it had more than one replica and the lost node was not the only place it could run. If every replica was on that node, users see an outage until the reschedule finishes.

## 105. What is the difference between Deployment, StatefulSet and DaemonSet?

**Answer:** A Deployment is primarily for stateless replicated
applications and supports rolling updates. A StatefulSet is for
workloads that need stable identity, stable network naming and/or
persistent storage with ordered behavior. A DaemonSet ensures a pod runs
on each matching node, which is common for log collectors, monitoring
agents and node-level security agents. I choose the controller based on
workload behavior rather than treating them as interchangeable.

## 106. What are readiness and liveness probes?

**Answer:** A readiness probe answers 'can this pod receive traffic?' If
readiness fails, Kubernetes removes the pod from the Service's ready
endpoints but does not necessarily restart it. A liveness probe answers
'is this process unhealthy enough to restart?' A failed liveness probe
can cause kubelet to restart the container. For slow-starting
applications I use a startup probe so liveness does not kill the
application while it is still initializing.

## 107. How do you perform a zero-downtime deployment?

**Answer:** I use rolling or progressive deployment with multiple
replicas, readiness/startup probes, graceful termination and appropriate
`maxUnavailable`/`maxSurge` settings. The new version must become Ready
before old capacity is removed. I also use connection draining and
backward-compatible database changes. For higher-risk releases I prefer
canary or blue-green deployment with automated health checks and
rollback. Zero downtime is a system property, so I validate the
application, load balancer and database behavior---not just the
Kubernetes Deployment status.

## 108. How do you troubleshoot a pod that is stuck in the `Pending` state?

**Answer:** For a pod stuck in `Pending`, I run `kubectl describe pod`
and inspect scheduler events. Common causes are insufficient CPU/memory,
taints without matching tolerations, node selectors/affinity,
unavailable PVCs, quotas or topology constraints. I then compare the
pod's resource requests with available node capacity and inspect the
relevant scheduling rules. Restarting the pod usually does not solve a
scheduling constraint; I fix the actual constraint or add appropriate
capacity.

## 109. Explain VPC, subnet, route table and security groups.

**Answer:** A VPC is the isolated logical network boundary in AWS. A
subnet is a CIDR range inside one Availability Zone. A route table
determines where traffic from a subnet is sent, for example to an
Internet Gateway or NAT Gateway. Security Groups are stateful firewalls
attached to resources/ENIs. A typical design places public load
balancers in public subnets, application nodes in private subnets and
databases in isolated/private subnets, with routing and Security Groups
controlling the allowed paths.

## 110. What is the difference between ALB, NLB and CloudFront?

**Answer:** An ALB works at HTTP. It can route by host and path, terminate TLS, and send traffic to instances, IPs, or a Kubernetes ingress target. An NLB works at TCP or UDP. It is the one you pick when the protocol is not HTTP, or when you need a static address and very low connection overhead. CloudFront is a CDN in front of an origin. It caches, terminates TLS at the edge, and can sit in front of an ALB or an S3 bucket. It is not a substitute for the load balancer inside the region. A typical public web app is CloudFront, then an ALB, then the pods or instances. A database or a custom TCP service uses an NLB and does not go through CloudFront.

## 111. How do you secure an AWS environment?

**Answer:** I would secure AWS in layers: strong IAM with least
privilege and federation, MFA, short-lived credentials and role-based
access; network segmentation with VPCs, private subnets, Security Groups
and NACLs; encryption with KMS; centralized logging and monitoring;
GuardDuty/Security Hub where appropriate; secure CI/CD with OIDC; and
continuous vulnerability/configuration scanning. I would also enable
CloudTrail, protect root credentials, establish backups and test
incident-response procedures. Security should be enforced through policy
and automation, not only documentation.

## 112. How do you troubleshoot an unreachable EC2 instance?

**Answer:** I check the instance state and the status checks in the EC2 console, then the security group and the route to the address I am using. System status check failed means stop and start the instance so it moves hardware. Instance status check failed means the OS, and the serial console or a detached root volume is the way in. SSM Session Manager is the first access path I try, before I rebuild anything. Rebuilding deletes the disk I might need.

## 113. How do you monitor applications using CloudWatch?

**Answer:** I use CloudWatch metrics and alarms for resource and service
health, CloudWatch Logs for centralized log collection, dashboards for
operational visibility and alarms for actionable conditions. For
application monitoring I track request count, latency, errors and
saturation in addition to infrastructure metrics. I create alarms around
meaningful thresholds or SLO-related behavior rather than every small
fluctuation. For deeper observability, I correlate CloudWatch data with
application logs, traces and deployment events.

## 114. How do you design a highly available application on AWS?

**Answer:** On AWS, highly available means at least two Availability Zones and no single instance in the path. The load balancer spans two public subnets. The application runs in an Auto Scaling group or in EKS across two private subnets. RDS is Multi-AZ. Health checks remove a bad target. I test by stopping one instance, not by reading the architecture diagram. A second AZ that has no capacity does not count.

## 115. What would you do if CPU utilization suddenly reaches 95--100%?

**Answer:** At 95 to 100 percent I identify the process with top before I do anything else. If it is the application and the host is otherwise fine, I capture a profile or a thread dump and decide between scaling and a hot path. If it is a system process or steal time is high, the instance size or the noisy neighbor is the issue. I do not reboot first. A reboot without the process name is an incident with no evidence.

## 116. How would you troubleshoot HTTP 503 errors?

**Answer:** HTTP 503 means the service is currently unable to handle the
request; the exact cause depends on which component generated it. I
identify the responding layer first---load balancer, Ingress, reverse
proxy or application. Then I check backend/target health, Service
endpoints, readiness probes, connection limits, upstream timeouts and
application logs. In Kubernetes I verify that the Service has Ready
endpoints. I correlate the 503 spike with deployments, scaling events
and resource saturation, mitigate customer impact and then fix the
underlying availability problem.

## 117. Application latency increased from 200 ms to 5 seconds --- how would you investigate?

**Answer:** I first quantify the change by endpoint, percentile, region
and time window and compare it with request volume and error rate. Then
I trace representative requests and correlate latency with CPU/memory,
database queries, connection pools, external APIs, network calls and
recent deployments. I use the evidence to identify whether the
bottleneck is application, database, network or dependency related. If
impact is high, I mitigate with rollback, scaling or traffic controls
first, then address the root cause and add a targeted preventive
control.

## 118. Disk usage reached 95% --- what steps would you take?

**Answer:** I first run `df -h` to identify the full filesystem, then
`du` to locate large directories/files. I check application logs,
temporary files, deleted-but-open files, container images/logs and inode
usage with `df -i`. I remove or rotate only data that is safe to delete
and avoid deleting active application data blindly. Then I fix the cause
with log rotation, retention/lifecycle policies or capacity changes and
add an alert before the filesystem reaches a critical threshold.

## 119. How do you monitor application availability and latency?

**Answer:** I monitor availability with successful-request rate, health
checks and synthetic probes, and latency with percentiles such as p50,
p95 and p99 rather than only averages. I break the data down by
endpoint, region and dependency where useful. Alerts should be based on
user impact or SLO/error-budget burn so they are actionable. I correlate
the alert with logs, traces, deployment events and infrastructure
metrics to move quickly from detection to diagnosis.

## 120. What are SLI, SLO and SLA?

**Answer:** An SLI is the measured indicator of user-visible service
behavior, such as successful request percentage or latency. An SLO is
the target level for that indicator over a defined period, for example
99.9% successful requests. An SLA is a customer-facing contractual
commitment that may include consequences if the commitment is missed. I
use SLOs and error budgets to decide how much reliability risk is
acceptable and to make alerts focus on meaningful user impact.

## 121. How do you handle a P1 production incident?

**Answer:** For a P1, my priority is restore service safely while
maintaining clear communication. I establish an incident lead, confirm
impact, open the incident channel/bridge and assign owners for
investigation, mitigation and communications. I check dashboards, recent
changes, logs, traces and dependency health, and I use the safest
reversible mitigation first---rollback, failover, scaling or traffic
control. After recovery I verify customer impact has ended, preserve
evidence and complete an RCA with preventive actions and monitoring
improvements.

## 122. How does Kubernetes decide which node to schedule a pod on?

**Answer:** The Kubernetes scheduler watches for unscheduled pods. It
filters nodes that cannot satisfy hard constraints such as resource
requests, taints/tolerations, node selectors, affinity and volume
constraints, then scores the remaining feasible nodes and selects one.
The scheduler writes the pod's node assignment to the API server. The
kubelet on that node then works with the container runtime to start the
pod. If scheduling fails, `kubectl describe pod` and scheduler events
usually show which constraint prevented placement.

## 123. What happens internally when you run `kubectl apply`?

**Answer:** `kubectl apply` sends the desired Kubernetes object to the
API server. Authentication, authorization, admission and schema
validation occur before the object is persisted. Controllers then
reconcile the desired state; for a new pod, the scheduler selects a
suitable node and the kubelet asks the container runtime to start it.
For updates, controllers perform the appropriate rollout. I would
explain that `kubectl` does not itself start containers---it
communicates the desired state to the API server.

## 124. How does Kubernetes service discovery work?

**Answer:** A Kubernetes Service provides a stable virtual endpoint for
a set of pods. CoreDNS resolves the Service name to the Service IP,
while the cluster networking implementation routes traffic toward the
Service's healthy EndpointSlices. Clients therefore use a stable DNS
name such as `my-service.my-namespace.svc.cluster.local` instead of
tracking changing pod IPs. When troubleshooting, I check DNS resolution,
Service selectors, EndpointSlices and the actual target port.

## 125. What is the difference between readiness and liveness probes internally?

**Answer:** Internally both probes are kubelet calling a handler on a schedule: an HTTP get, a TCP socket, or an exec. The difference is what kubelet does with the result. A failed liveness probe kills the container and the restart policy brings it back. A failed readiness probe removes the pod from the endpoints of every Service that selects it, and adds it back when the probe passes. The pod object stays. Traffic stops. Startup probes delay the others so a slow boot is not killed. The probe spec looks similar. The controller that reacts is what makes them different.

## 126. How does Horizontal Pod Autoscaler (HPA) make scaling decisions?

**Answer:** The Horizontal Pod Autoscaler periodically reads CPU/memory
or custom/external metrics and compares the current value with the
configured target. It calculates a desired replica count and updates the
workload between its minimum and maximum limits. For resource
utilization, requests are important because utilization is calculated
relative to requested resources. HPA also has stabilization and scaling
behavior to prevent rapid oscillation. I troubleshoot HPA by checking
metrics availability, target values, current/desired replicas and the
workload's resource requests.

## 127. How does Kubernetes handle pod failures and self-healing?

**Answer:** A pod failure is handled by the controller that owns the pod. The ReplicaSet notices the count is low and creates a replacement. The kubelet restarts a container whose process exited if the restart policy says so. A failing liveness probe is one way the kubelet decides to restart it. The Service stops sending traffic to a pod that fails readiness. I do not need a custom loop for the basic case. I need the Deployment and a probe. A pod with no controller, created by hand, stays dead.

## 128. What happens during a rolling deployment in Kubernetes?

**Answer:** With a Deployment rolling update, Kubernetes creates or
updates ReplicaSets and gradually replaces old pods with new ones
according to rollout strategy settings such as `maxSurge` and
`maxUnavailable`. Readiness probes determine when new pods are eligible
to receive traffic. Kubernetes continues until the desired number of new
replicas are Ready. I monitor rollout status, events, application error
rate and latency, and I use `kubectl rollout undo` or a controlled
redeployment if the new version is unhealthy.

## 129. What happens internally when you run `docker run`?

**Answer:** `docker run` tells the Docker engine to create and start a
container from an image. Docker pulls the image if it is not available
locally, creates the container filesystem and metadata, configures
namespaces, cgroups, networking, mounts, environment variables and
ports, and starts the configured ENTRYPOINT/CMD. The container's
lifecycle is tied to its main process: when that process exits, the
container normally stops unless a restart policy causes it to be
restarted.

## 130. How does Docker layer caching work?

**Answer:** Docker images are built from layers, and Docker can reuse an
unchanged layer from a previous build. The cache is invalidated when the
relevant instruction or its inputs change. Therefore I usually copy
dependency manifests before application source, install dependencies in
a stable layer, then copy source. This allows source-only changes to
reuse the dependency layer. In CI I can also use a registry or BuildKit
cache to persist layers between runners.

## 131. How does the Terraform dependency graph (DAG) work internally?

**Answer:** Terraform builds a directed acyclic graph from references
between resources and explicit `depends_on` relationships. For example,
if an instance references a subnet ID, Terraform knows the subnet must
exist first. Independent resources can be created in parallel, which
improves performance. `depends_on` should be used only when Terraform
cannot infer a real dependency; excessive explicit dependencies reduce
parallelism and can create unnecessary coupling.

## 132. How does Terraform handle state locking and consistency?

**Answer:** State locking prevents two state-changing Terraform
operations from modifying the same state concurrently. The exact locking
implementation depends on the backend. If a lock appears stale, I first
verify that no Terraform operation is actually running. Only then would
I use the backend-supported force-unlock mechanism. If a lock is lost
during an apply, I do not immediately run another apply; I inspect the
state and real resources, because the previous operation may have
completed some changes.

## 133. What happens internally in a CI/CD pipeline from commit → deploy?

**Answer:** A commit to a branch triggers the pipeline through a webhook. The runner checks out that commit. CI builds the code, runs unit tests, and runs security scans. A failure stops the line. On success the pipeline builds an artifact, an image or a package, tagged with the commit SHA, and pushes it to the registry. That digest is the only thing later stages deploy. CD takes the digest, applies it to the target environment, and waits until the new version is healthy. Production is gated by the branch and by an approval. The same commit is not rebuilt in prod. It is promoted. Logs, the image digest, and the deployment name are the audit trail.

## 134. How does a pipeline handle parallel jobs and dependencies?

**Answer:** Jobs without a needs or dependsOn relationship run in parallel. Jobs that consume an artifact declare a dependency and wait. I use that on purpose: unit tests, lint, and a security scan run together, then the image build runs after they pass, then the push, then the deploy. Parallelism saves time until it overloads the runners or the registry. I cap the agent count and I do not let two jobs push the same tag. Artifacts are passed by digest or by a stored file, not by assuming a workspace survived from another agent. A matrix build, one job per service, is how a monorepo stays parallel without one giant shell script.

## 135. How does an AWS Load Balancer route traffic?

**Answer:** A load balancer receives traffic on a configured listener,
evaluates routing rules and selects a healthy registered target. ALB can
route HTTP/HTTPS based on host, path, headers and other Layer-7
conditions. NLB operates primarily at Layer 4 for TCP/UDP/TLS and is
designed for high performance and connection-level routing. Health
checks remove unhealthy targets from the eligible pool. When
troubleshooting, I check listener rules, target registration, target
health, ports, security controls and application responses.

## 136. What happens internally when you hit a CloudFront URL?

**Answer:** The client resolves the CloudFront hostname and connects to
an edge location. CloudFront evaluates the cache key and checks whether
a valid object is cached. On a cache hit it can return the object
directly; on a miss it sends a request to the configured origin. The
origin response is processed according to CloudFront policies,
optionally cached, and returned to the client. TLS, WAF, origin access
controls, headers and cache policies can all affect the request path.

## 137. How does DNS resolution work step by step?

**Answer:** The client first checks local caches and the hosts file,
then sends a query to its configured recursive resolver. If the resolver
does not have a cached answer, it follows the DNS hierarchy: root server
→ TLD server → authoritative server, then caches the response according
to TTL. For troubleshooting I check the client resolver configuration,
`dig`/`nslookup`, authoritative records, TTL, DNSSEC where applicable
and network connectivity. I distinguish DNS failure from an application
or routing failure by testing the resolved IP directly.

## 138. How does Git merge and rebase differ internally?

**Answer:** Merge creates a merge commit that joins the two histories and leaves both branch commits as they were. Rebase copies my commits onto the tip of the other branch, so the history reads as if I started from today's main. Internally rebase cherry-picks each commit, which is why conflicts can appear once per commit and why the commit hashes change. Merge conflicts once, in the merge commit. I rebase a private feature branch to keep the pull request current. I do not rebase a shared branch, because I would be rewriting commits other people have.

## 139. How do logs, metrics, and traces work together in observability?

**Answer:** Metrics tell me that something is wrong, logs tell me what the process said, and traces tell me which hop was slow. A useful setup ties them with one trace id. The application logs that id. The trace shows the span for each service. The dashboard links from a latency panel to the logs for that time window and to the trace. Prometheus and Grafana hold the metrics. Fluent Bit and OpenSearch hold the logs. OpenTelemetry and Tempo hold the traces. An alert on error rate is the start. The trace is how I see that the payment service waited on the database. The log is the database error. None of the three replaces the others.

## 140. What happens when your system goes down --- how do you approach it?

**Answer:** I confirm the impact first: who is affected and since when. Then I look for the change that lined up with the start, a deploy, a scaling event, or a dependency. I stabilize before I explain. Rollback the deploy if the timing matches and the previous version is healthy. If there was no deploy, I follow the failing request from the edge to the dependency that is timing out. I say what I know and what I am checking, in that order, to the channel. After the service is back I write the cause, not only the timeline.

## 141. What are the most common production mistakes in DevOps setups?

**Answer:** The mistakes I keep seeing are operational, not exotic. Secrets in git. A pipeline that is admin of the account. Production deploys from a laptop. Terraform state on one engineer's disk. Latest as an image tag. No requests or limits, so one pod evicts the node. A liveness probe that restarts a slow app. A health check that returns 200 when the dependencies are down. Alerts on everything, so real pages are ignored. One shared admin user. Backups that have never been restored. A security group open to the world because a debug session never ended. Each of these is a default that felt fine on day one. The fix is a pipeline, a review, and a habit of deleting the temporary exception.

## 142. How does Terraform handle state locking, and what happens if the lock is lost mid-apply?

**Answer:** Terraform writes a lock before it changes state and releases it after. A second operation sees the lock and stops. If the lock is lost mid-apply because the process was killed, the lock may remain and the next apply refuses to start, which is safe. Or, if the lock was released and the apply died halfway, state matches only the resources that finished. I do not delete the lock file by hand in the bucket. I force-unlock after I know the process is dead, then I plan, and I expect a partial update. I apply to finish. Two applies without a lock will corrupt state, which is the outcome the lock exists to prevent.

## 143. Explain a real scenario where `terraform plan` shows no change, but `terraform apply` still modifies resources.

**Answer:** In normal use, `terraform apply` executes a plan based on
the configuration and refreshed state. If someone observes a no-change
plan followed by unexpected provider-side modification, I would
investigate the exact commands, whether a saved plan was used, provider
behavior, eventual consistency and external controllers. I would also
compare state and cloud resource history. The safe practice is to save
and review the plan, use the same workspace/backend and provider
versions, and investigate any discrepancy rather than assuming Terraform
arbitrarily changed resources.

## 144. How do you safely manage Terraform state across multiple teams and environments?

**Answer:** State is the map from resource addresses to real ids, and it contains secrets. It lives in a remote backend, encrypted, versioned, and locked. One key per stack per environment: network/prod, app/prod. The bucket is not public and it is not the application log bucket. CI on the main branch is the writer. Everyone else can plan with read-only credentials. Teams that share an account still do not share a state file. A module boundary is a state boundary when the lifecycles differ. I do not import the state into git. If two teams need a value, they read an output, not each other's raw state. A lost lock gets force-unlocked only after I am sure no apply is running.

## 145. What problems arise when multiple modules reference the same resource, and how do you design around it?

**Answer:** I avoid having multiple modules independently own the same
infrastructure resource. One module should normally create and own the
resource, expose the required attributes as outputs, and let other
modules consume those outputs. If two modules both declare the same
resource, Terraform may see conflicting ownership or create duplicates.
For cross-module dependencies, pass values through module inputs/outputs
or a well-defined shared data source rather than duplicating resource
definitions.

## 146. What is the difference between `count` and `for_each`, and why can switching between them destroy resources?

**Answer:** count addresses resources by position. for_each addresses them by key. If I have three subnets on count and I remove the first, the indexes of the other two shift and Terraform plans to destroy and recreate them. With for_each keyed by availability zone, removing one key removes one subnet. Switching a resource from count to for_each changes every address, which Terraform sees as destroy all and create all, unless I write moved blocks. That is the production hazard. I use for_each when the set can grow and shrink in the middle.

## 147. How do you handle secrets in Terraform without exposing them in state files?

**Answer:** Marking a variable sensitive only hides it in the plan output. The value still lands in the state file. I avoid putting the secret in Terraform at all when the application can read it from a secret manager at runtime. If Terraform must create the password, I write it to the secret manager and I keep the state backend encrypted, access-logged, and restricted to the apply role. I do not commit a tfvars file with the password, and I do not pass it on the command line where it enters shell history. State is the exposure I design for, not an accident I discover later.

## 148. Explain drift detection. How do you detect and fix infrastructure drift without downtime?

**Answer:** Drift is the cloud no longer matching the code. Terraform sees it on the next plan, because refresh reads the real resource and the diff is the drift. Someone changed a security group in the console, or an autoscaler replaced a tag. The plan wants to put it back. If the code is right, I apply and the console change goes away. If the console change was the right fix, I put it in code and the plan goes empty. I do not ignore_changes to silence the plan. That hides the next real edit too. For a live resource, an in-place update is fine. A drift that forces replacement of a database is a stop and a conversation, not an apply during the incident. A scheduled plan in CI is how drift is found before the next human applies something unrelated.

## 149. What happens internally when you delete a resource manually from the cloud but not from Terraform?

**Answer:** Terraform still has the resource in state. The cloud does not have the object. The next plan says it will create the resource again, because desired state includes it and actual state does not. That recreation is empty. A database comes back without yesterday's data. The data comes from a backup, and then I either import the restored instance or let Terraform create a new one and restore into it. If someone deleted it on purpose and it should stay gone, I remove it from the configuration, plan, and apply, which updates state to forget it. Deleting in the console and leaving the code is how the resource reappears on the next apply and surprises everyone.

## 150. How do you design Terraform modules to be reusable without becoming tightly coupled?

**Answer:** A module is reusable when a caller can use it without reading the resource blocks. The inputs are variables with types. The outputs are the few ids the caller needs. The module does not reach into the caller's names, and the caller does not reach into the module's resource addresses. There is no provider inside it and no environment name hardcoded. If two callers need different behavior, that is a variable, not a copy of the module. Tight coupling is a module that only works for one VPC because the subnet ids are written in the resources.

## 151. Explain `depends_on` vs implicit dependency --- when does Terraform get it wrong?

**Answer:** Terraform automatically creates implicit dependencies when
one resource references an attribute of another resource. I use
`depends_on` only when a real dependency exists that Terraform cannot
infer---for example, when a resource needs another resource to exist
because of an external side effect but there is no direct attribute
reference. Overusing `depends_on` can serialize resources unnecessarily
and make plans less efficient. I prefer explicit data flow through
variables and outputs whenever possible.

## 152. How do Terraform workspaces actually work, and why can they be dangerous in large organizations?

**Answer:** Terraform workspaces allow one configuration to use multiple
independent state instances. They can be useful for simple environments
that are structurally identical. For large organizations, I prefer
separate root configurations/state boundaries when environments have
different permissions, networking, lifecycle or blast radius. A single
workspace selection error can target the wrong environment, so
production access should not depend only on a workspace name.

## 153. How do you refactor a Terraform codebase without destroying production resources?

**Answer:** The key is to preserve Terraform resource addresses while
changing the code structure. If a resource moves from one module/address
to another, I use a `moved` block or an appropriate state move so
Terraform understands that it is the same real resource. I test the
refactor in a lower environment, back up/version the state, run
`terraform plan` and require the plan to show no unintended
destroy/create operations before touching production.

## 154. What are partial applies, and how do you recover safely from a failed apply?

**Answer:** A partial apply means some resources changed and then an error stopped the run. State already records the ones that succeeded. There is no automatic undo. Before I apply again I read the error, I confirm the lock is not still held, and I plan. The plan should continue from the remaining resources, not recreate the ones that finished. I fix the cause, a quota, a missing dependency, a bad name, and I apply. If a resource was left half-created in the cloud and not in state, I import it or delete the orphan before I apply, so I do not end up with two.

## 155. How do provider version mismatches break production, and how do you prevent it?

**Answer:** Provider version changes can alter schemas, defaults,
validation and resource behavior, which can produce unexpected plans or
break previously valid configurations. I prevent this with version
constraints and the dependency lock file, test provider upgrades in
lower environments, review the plan carefully and upgrade in controlled
stages. I also read provider upgrade notes and avoid upgrading providers
automatically in production without a tested version.

## 156. Describe a real incident caused by Terraform state corruption. How did you fix it?

**Answer:** I would first stop concurrent Terraform operations and
preserve evidence. Then I would inspect backend version history or state
backups, validate the real infrastructure and compare it with the state.
If a known-good state version exists, I would restore it carefully;
otherwise I would reconcile resources using imports or state operations.
I would never hand-edit state as the first option. After recovery, I
would strengthen remote-state access, locking, backups/versioning and CI
controls.

## 157. How do you design an end-to-end CI/CD pipeline?

**Answer:** An end-to-end pipeline starts at the pull request and ends with a healthy production revision. Pull request: build, test, scan, no deploy. Main: build the image, push the digest, deploy to dev, run a smoke check. Production: an approval, then the same digest deployed, then a wait on health, then either success or an automatic return to the previous digest. Notifications and the digest are part of the pipeline. A pipeline that stops at 'tests passed' is CI. The end-to-end one includes the running service.

## 158. How do you store and manage credentials in Jenkins?

**Answer:** I store credentials in Jenkins Credentials rather than in
the Jenkinsfile or source repository. The pipeline references the
credential by ID and Jenkins injects it only for the required step. I
use the least-privileged account possible, restrict credential scope,
mask secrets in logs and rotate them. For AWS, I prefer short-lived role
credentials/OIDC over long-lived access keys where the Jenkins
architecture supports it. I also ensure shell commands do not
accidentally echo secrets.

## 159. How do you troubleshoot a failed Jenkins pipeline?

**Answer:** A failed Jenkins pipeline gets the console of the failed stage and the agent it ran on. I check the recent changes to the Jenkinsfile and to the shared library, because a library change breaks every job that uses it. I check the agent disk and the Docker daemon if the step is a container build. I do not restart Jenkins as a diagnostic. I rerun the stage after I can say why it failed. If I cannot, the rerun is the experiment, and I watch the same line.

## 160. What is the difference between Freestyle and Pipeline jobs?

**Answer:** A Freestyle job is configured primarily through Jenkins UI
and is suitable for simple jobs, but its configuration is less naturally
version-controlled. A Pipeline is defined as code, usually in a
Jenkinsfile, so it can be reviewed, versioned and reused. Pipeline also
supports stages, parallel execution, approvals, retries and more complex
delivery logic. For modern CI/CD, I prefer Pipeline as Code because the
build/deployment process becomes part of the repository and can evolve
through normal code review.

## 161. How do you implement approval before production deployment?

**Answer:** I would make production deployment a protected stage after
automated validation. For example, Jenkins can pause at an `input` step
or use an external change-management approval. The approval should show
the artifact/version, environment, change summary and relevant
test/security results. Only authorized users should approve, and the
production credentials should be available only to that deployment
stage. I would also make the artifact immutable so approval is for
exactly what was tested.

## 162. How do you integrate SonarQube and Trivy into Jenkins?

**Answer:** I would place SonarQube analysis after checkout/build
preparation and run Trivy against the resulting container image before
it is promoted. SonarQube can enforce code-quality/security quality
gates, while Trivy can scan OS packages, application dependencies and
container/IaC configurations depending on how it is configured. The
pipeline should fail on agreed severity thresholds, publish reports and
avoid deploying an image that fails the required gate. Thresholds should
be defined with the security team rather than hard-coded arbitrarily.

## 163. What is the difference between `git merge` and `git rebase`?

**Answer:** Merge combines two histories and, when needed, creates a
merge commit; it preserves the original branch topology. Rebase moves a
branch's commits onto a new base by replaying them, which creates new
commit IDs and produces a cleaner linear history. I use rebase for my
private feature branch when I want to update it with main and keep
history clean. I avoid rebasing shared branches because it rewrites
history. For team integration, I follow the repository's agreed merge
strategy.

## 164. How do you resolve merge conflicts?

**Answer:** I first fetch the latest target branch and make sure I
understand which changes should win. I then merge or rebase according to
the team's workflow, inspect each conflicted file, resolve the conflict
intentionally, and run tests---not just `git add`. After validation I
complete the merge/rebase and push the result. If the branch is shared,
I avoid force-pushing rewritten history unless the team explicitly
permits it. I prefer resolving conflicts locally and letting the PR show
the final diff.

## 165. How do you protect sensitive information from being pushed to GitHub?

**Answer:** I prevent secrets from reaching Git through secret managers,
protected CI variables, pre-commit hooks and GitHub secret scanning.
Repository branch protection and least-privilege access reduce the risk
further. If a secret is committed, I immediately revoke or rotate it
because deleting the file does not invalidate the leaked credential.
Then I remove the secret from history where necessary and verify that CI
logs, artifacts and caches do not contain it.

## 166. How do you implement branching strategies in a project?

**Answer:** I select the branching model based on release frequency and
team size. For a continuously delivered product, I prefer short-lived
feature branches with protected main and strong CI, or trunk-based
development with feature flags. For organizations with scheduled
releases and multiple supported versions, Git Flow can be appropriate.
Regardless of the model, I enforce PR review, automated tests, security
checks, branch protection and a clear release/tagging process.

## 167. What is the difference between an image and a container?

**Answer:** A Docker image is an immutable package containing the
application, runtime, libraries and filesystem layers needed to create a
container. A container is a running or stopped instance of that image
with its own process namespace, filesystem layer, networking and
resource controls. The same image can create multiple containers, which
is why immutable images help make deployments consistent. In Kubernetes,
the image is pulled from a registry and the container runtime creates
the actual container process from it.

## 168. How do you troubleshoot a container that keeps restarting?

**Answer:** A restarting container has a reason if I ask before the logs rotate away. docker inspect or kubectl describe shows the exit code and the restart count. Exit 137 is usually an OOM kill. Exit 1 is the process. kubectl logs --previous or docker logs shows what it printed as it died. A crash loop with no logs often means the entrypoint is wrong, a missing binary, or a config file it expects at a path that was not mounted. A probe that fails immediately will also restart the pod if the liveness probe is tighter than startup. I read the probe timing before I call the application broken. I keep the previous logs long enough to read them, and I fix the cause. Raising the restart limit hides it.

## 169. How do you optimize a Dockerfile?

**Answer:** I optimize a Dockerfile by choosing an appropriate minimal
base image, using multi-stage builds, copying dependency manifests
before application code for cache reuse, excluding unnecessary files
with `.dockerignore`, and running as a non-root user. I also pin or
constrain dependencies appropriately, remove package-manager caches,
avoid unnecessary layers and keep build secrets out of the image. I
validate the result with image size, build time, startup behavior and
vulnerability scanning.

## 170. How do you push Docker images to Amazon ECR?

**Answer:** First I authenticate Docker to the correct ECR registry
using the AWS identity assigned to the build agent. Then I build the
image, tag it with the full ECR repository URI and push it. If it fails,
I check the AWS account and region, repository existence, IAM
permissions such as ECR upload actions, Docker authentication,
network/proxy access and the exact image tag. In CI I prefer short-lived
IAM role credentials and immutable tags such as a Git commit SHA rather
than relying only on `latest`.

## 171. How do you troubleshoot `CrashLoopBackOff` and `ImagePullBackOff`?

**Answer:** For `ImagePullBackOff`, I first run `kubectl describe pod`
and inspect the Events section because it normally gives the immediate
reason. I verify the image repository and tag, registry connectivity,
imagePullSecrets, node IAM permissions where relevant, DNS and registry
rate limits. If the image exists but authentication fails, I fix the
secret/identity. If the tag is wrong, I correct the deployment. I then
watch the pod events and confirm the container starts successfully.

## 172. What happens when a Kubernetes worker node goes down?

**Answer:** The pods on that node become NotReady. Kubernetes waits out the eviction grace period and then, if a controller wants those pods, schedules them on other nodes. A Deployment with replicas and spare capacity comes back. A pod with a volume attached to the dead node can stick until the volume detaches. A DaemonSet pod does not move. It appears on the remaining nodes already, and on a replacement node when one joins. The application stays up if it had more than one replica and the lost node was not the only place it could run. If every replica was on that node, users see an outage until the reschedule finishes.

## 173. What is the difference between Deployment, StatefulSet and DaemonSet?

**Answer:** A Deployment is primarily for stateless replicated
applications and supports rolling updates. A StatefulSet is for
workloads that need stable identity, stable network naming and/or
persistent storage with ordered behavior. A DaemonSet ensures a pod runs
on each matching node, which is common for log collectors, monitoring
agents and node-level security agents. I choose the controller based on
workload behavior rather than treating them as interchangeable.

## 174. What are readiness and liveness probes?

**Answer:** A readiness probe answers 'can this pod receive traffic?' If
readiness fails, Kubernetes removes the pod from the Service's ready
endpoints but does not necessarily restart it. A liveness probe answers
'is this process unhealthy enough to restart?' A failed liveness probe
can cause kubelet to restart the container. For slow-starting
applications I use a startup probe so liveness does not kill the
application while it is still initializing.

## 175. How do you perform a zero-downtime deployment?

**Answer:** I use rolling or progressive deployment with multiple
replicas, readiness/startup probes, graceful termination and appropriate
`maxUnavailable`/`maxSurge` settings. The new version must become Ready
before old capacity is removed. I also use connection draining and
backward-compatible database changes. For higher-risk releases I prefer
canary or blue-green deployment with automated health checks and
rollback. Zero downtime is a system property, so I validate the
application, load balancer and database behavior---not just the
Kubernetes Deployment status.

## 176. How do you troubleshoot a pod that is stuck in the `Pending` state?

**Answer:** For a pod stuck in `Pending`, I run `kubectl describe pod`
and inspect scheduler events. Common causes are insufficient CPU/memory,
taints without matching tolerations, node selectors/affinity,
unavailable PVCs, quotas or topology constraints. I then compare the
pod's resource requests with available node capacity and inspect the
relevant scheduling rules. Restarting the pod usually does not solve a
scheduling constraint; I fix the actual constraint or add appropriate
capacity.

## 177. Explain VPC, subnet, route table and security groups.

**Answer:** A VPC is the isolated logical network boundary in AWS. A
subnet is a CIDR range inside one Availability Zone. A route table
determines where traffic from a subnet is sent, for example to an
Internet Gateway or NAT Gateway. Security Groups are stateful firewalls
attached to resources/ENIs. A typical design places public load
balancers in public subnets, application nodes in private subnets and
databases in isolated/private subnets, with routing and Security Groups
controlling the allowed paths.

## 178. What is the difference between ALB, NLB and CloudFront?

**Answer:** An ALB works at HTTP. It can route by host and path, terminate TLS, and send traffic to instances, IPs, or a Kubernetes ingress target. An NLB works at TCP or UDP. It is the one you pick when the protocol is not HTTP, or when you need a static address and very low connection overhead. CloudFront is a CDN in front of an origin. It caches, terminates TLS at the edge, and can sit in front of an ALB or an S3 bucket. It is not a substitute for the load balancer inside the region. A typical public web app is CloudFront, then an ALB, then the pods or instances. A database or a custom TCP service uses an NLB and does not go through CloudFront.

## 179. How do you secure an AWS environment?

**Answer:** I would secure AWS in layers: strong IAM with least
privilege and federation, MFA, short-lived credentials and role-based
access; network segmentation with VPCs, private subnets, Security Groups
and NACLs; encryption with KMS; centralized logging and monitoring;
GuardDuty/Security Hub where appropriate; secure CI/CD with OIDC; and
continuous vulnerability/configuration scanning. I would also enable
CloudTrail, protect root credentials, establish backups and test
incident-response procedures. Security should be enforced through policy
and automation, not only documentation.

## 180. How do you troubleshoot an unreachable EC2 instance?

**Answer:** I check the instance state and the status checks in the EC2 console, then the security group and the route to the address I am using. System status check failed means stop and start the instance so it moves hardware. Instance status check failed means the OS, and the serial console or a detached root volume is the way in. SSM Session Manager is the first access path I try, before I rebuild anything. Rebuilding deletes the disk I might need.

## 181. How do you monitor applications using CloudWatch?

**Answer:** I use CloudWatch metrics and alarms for resource and service
health, CloudWatch Logs for centralized log collection, dashboards for
operational visibility and alarms for actionable conditions. For
application monitoring I track request count, latency, errors and
saturation in addition to infrastructure metrics. I create alarms around
meaningful thresholds or SLO-related behavior rather than every small
fluctuation. For deeper observability, I correlate CloudWatch data with
application logs, traces and deployment events.

## 182. How do you design a highly available application on AWS?

**Answer:** On AWS, highly available means at least two Availability Zones and no single instance in the path. The load balancer spans two public subnets. The application runs in an Auto Scaling group or in EKS across two private subnets. RDS is Multi-AZ. Health checks remove a bad target. I test by stopping one instance, not by reading the architecture diagram. A second AZ that has no capacity does not count.

## 183. Your pod keeps getting stuck in `CrashLoopBackOff`, but logs show no errors. How would you approach debugging and resolution?

**Answer:** No logs and a crash loop means the process is dying before it writes, or it is being killed from outside. I look at the exit code and the last state in describe. 137 with OOMKilled is memory, and the application never got to log. A start error of 'executable not found' is one line that kubectl logs --previous will show if I ask for the previous container. I also check the liveness probe. A probe that fails at second one will restart a process that was still starting and had not logged. I loosen the probe or fix the binary, and I confirm the restart count stops climbing.

## 184. You have a StatefulSet deployed with persistent volumes, and one of the pods is not recreating properly after deletion. What could be the reasons, and how do you fix it without data loss?

**Answer:** A StatefulSet pod that will not come back is usually its volume, not the replica count. The pod name is stable, and it will only start when the PersistentVolumeClaim with that ordinal is bound. I describe the pod and the PVC. A PVC stuck Pending is a storage class, a zone, or a quota. A PVC bound in another zone than the only available node will not schedule. I do not delete the PVC to 'make it recreate' if the data matters. The volume is the data. I scale or delete the pod and let the StatefulSet recreate the same identity against the same claim. If the volume itself is stuck attached to a dead node, I detach it in the cloud once the node is confirmed gone, then the pod can mount it. A backup exists before I try anything that replaces the disk.

## 185. Your Cluster Autoscaler is not scaling up even though pods are in `Pending` state. What would you investigate?

**Answer:** The autoscaler scales when pods are Pending because they do not fit, and when it is allowed to. I check the autoscaler logs for the reason it skipped: a limit on the node group, a missing IAM permission, a pod that requests a GPU or a zone the group does not have, or a taint the new nodes would also have. I look at the Pending pod's events. If it says insufficient cpu, the autoscaler should add a node. If it says untolerated taint or node affinity, a new node of the same type will not help, and the autoscaler is right to do nothing. Quotas on the cloud account produce the same silence.

## 186. A NetworkPolicy is blocking traffic between services in different namespaces. How would you design and debug the policy to allow only specific communication paths?

**Answer:** NetworkPolicy is allow-list once a policy selects the pod. A policy in the source namespace does not automatically open the destination. I check both ends. Does any policy select the destination pods, and does an ingress rule allow the source pod's namespace and labels? Does the source have an egress rule that still allows this port? I use the labels the policy uses, not the ones I wish the pods had. kubectl get netpol and the pod labels side by side usually show the miss. I allow one path: namespace A, pod label app=api, to namespace B, pod label app=db, port 5432. I do not open the whole namespace to get unblocked and leave it. A deny shows up as a timeout, not as a Kubernetes event. A temporary packet capture or the CNI's policy log confirms the drop.

## 187. One of your microservices has to connect to an external database via a VPN inside the cluster. How would you architect this in Kubernetes with HA and security in mind?

**Answer:** The database stays outside the cluster. The cluster reaches it over a private path. On EKS that is a VPN or Direct Connect into the VPC, routes on the private subnets where the nodes run, and a security group that allows the node group to the database port. The application pods use a Service of type ExternalName or a ClusterIP plus an endpoint only if I must give them a stable internal name. Credentials come from a secret or from IAM auth, mounted into the one service that needs them. For HA the VPN has two tunnels, the nodes span two zones, and the database is multi-AZ on the other side. I do not run the VPN client as a sidecar in every pod. One gateway, redundant, is easier to secure than ten containers holding the VPN key.

## 188. You're running a multi-tenant platform on a single EKS cluster. How do you isolate workloads and ensure security, quotas, and observability for each tenant?

**Answer:** Tenants share a cluster and share nothing else I can avoid. Each tenant gets a namespace. ResourceQuota and LimitRange stop one tenant from taking the nodes. RBAC binds that tenant's group to that namespace only. NetworkPolicy denies ingress from other namespaces by default. A separate service account and a separate cloud role mean tenant A's pods cannot read tenant B's bucket. Logs and metrics are labeled with the namespace so a dashboard can be handed to the tenant without handing them the cluster. Namespaces are not a security boundary against a privileged pod. Pod security admission stays restricted, and nodes are not reachable from the tenant's containers. If a tenant needs a harder wall than that, they get their own cluster, not a promise that labels will save them.

## 189. You notice the kubelet is constantly restarting on a particular node. What steps would you take to isolate the issue and ensure node stability?

**Answer:** A kubelet that restarts takes its pods with it, so I treat the node as sick and cordon it before I experiment. journalctl -u kubelet on the node, or the node console if SSH is gone, shows the panic or the bad flag. Common causes are a full disk, a bad configuration from a bootstrap change, a CNI binary that does not match the version, or clock skew. I describe the node and look at conditions. If the node is flapping Ready, I drain it and replace it from the node group rather than nursing it. A replacement is cheaper than a unique snowflake. I keep one node out of the rotation until I know why, in case the AMI or the user data will kill the next node the same way.

## 190. A critical pod in production gets evicted due to node pressure. How would you prevent this from happening again, and how do QoS classes play a role?

**Answer:** Eviction for node pressure means the node ran out of memory, disk, or inodes, and kubelet chose this pod because of its QoS class. BestEffort pods, with no requests or limits, go first. Burstable pods go next. Guaranteed pods, where requests equal limits, go last. I set requests and limits so the important service is Guaranteed or at least Burstable with a real request. I also fix the pressure. A disk full of container logs needs rotation and a larger volume or a log agent that does not leave files behind. Memory pressure needs a limit on the hungry pod so it is killed alone instead of evicting the node. A PodDisruptionBudget does not stop pressure evictions. It only controls voluntary drains. After the fix I watch for eviction events, not just for restarts.

## 191. You need to deploy a service that requires TCP and UDP on the same port. How would you configure this in Kubernetes using Services and Ingress?

**Answer:** One Service port is one protocol. Kubernetes will not mix TCP and UDP on the same Service port number as a single definition. I create two Services, or two ports on one Service, one named tcp and one named udp, both targeting the same pods on that port. Ingress does not carry UDP. Ingress is HTTP. The UDP path needs a load balancer Service of type LoadBalancer, which on AWS is an NLB with a UDP listener. The TCP path can be the same NLB or an ingress if it is actually HTTP. I test both with a client, not with a browser. Security groups must allow both protocols. A security group that allows TCP 53 and not UDP 53 is a very confusing DNS outage.

## 192. An application upgrade caused downtime even though you had rolling updates configured. What advanced strategies would you apply to ensure zero-downtime deployments next time?

**Answer:** Rolling updates still stop traffic if every pod goes unready together, if the new version fails its probe slowly, or if maxUnavailable is high enough to drain the service. I set maxUnavailable to 0 or 1 and maxSurge so a new pod is Ready before an old one leaves. I add a readiness probe that means the app can serve, and a PodDisruptionBudget so a node drain does not pile on. For a change that cannot be rolling, I use blue-green. If the downtime was a migration that locked the database, no rollout setting fixes it. The migration has to be compatible with the old version.

## 193. Your service mesh sidecar (e.g., Istio Envoy) is consuming more resources than the app itself. How do you analyze and optimize this setup?

**Answer:** The sidecar is a proxy in the path of every request, so its CPU tracks request rate and its memory tracks connections and config size. I look at the proxy's own metrics before I raise the limit and forget it. A large number of endpoints, a huge mesh config, or access logs at debug will dwarf a small app. I turn the access log down, narrow the sidecar to the namespaces that need the mesh, and set requests from the measured usage so the proxy schedules honestly. If the app does not need mTLS and retries, it does not need the sidecar. Excluding that namespace is a valid optimization. I compare the proxy CPU with the app CPU on one dashboard so the next growth spurt is obvious.

## 194. You need to create a Kubernetes operator to automate complex application lifecycle events. How do you design the CRD and controller loop logic?

**Answer:** An operator is a controller that watches a custom resource and reconciles the world until it matches the spec. The CRD is the API: a small spec the user writes, and a status the controller writes. I do not put every implementation detail in the spec. The controller loop reads the object, compares it with the Deployment, Service, and secrets it owns, and creates or updates those. It writes status conditions: Progressing, Ready, Degraded. It uses an owner reference so deleting the custom resource deletes the children. It must be safe to run twice. The same reconcile on an unchanged object should change nothing. I start with one resource and kubebuilder or an equivalent, and I add a finalizer only when deletion has to wait for a real cleanup such as a cloud bucket.

## 195. Multiple nodes are showing high disk I/O usage due to container logs. What Kubernetes features or practices can you apply to avoid this scenario?

**Answer:** Container logs on the node disk are the files under the container runtime directory. A chatty pod will fill the node, and then kubelet evicts pods for disk pressure. I collect logs from stdout and let the log agent ship and remove the pressure, and I set the kubelet's container log rotation: a max size and a max number of files. I also stop the application from writing a second copy to an emptyDir that has no size limit. An emptyDir with a sizeLimit, or no emptyDir at all, keeps a runaway debug log inside the pod's budget. A DaemonSet for the log agent must have a request so it is not the first eviction victim. The alert is node disk pressure and eviction events, not a surprise page from a full disk at 2 a.m.

## 196. Your Kubernetes cluster's etcd performance is degrading. What are the root causes and how do you ensure etcd high availability and tuning?

**Answer:** etcd is the cluster's memory. Every object is stored there, and the API server is the only thing that should talk to it. It is slow when the disk is slow, when the dataset is large, or when the members cannot elect a leader. I watch leader changes, fsync duration, and database size. etcd wants a fast dedicated disk. I do not put it on a busy shared volume. For HA I run three or five members across zones, an odd number, and I keep them close enough that latency does not cause elections. Backup is a snapshot on a schedule, stored off the cluster, and a restore I have actually practiced. Compaction and defrag are how the database does not grow forever. A degraded etcd is a cluster that will soon refuse writes. I treat it as a production datastore, not as a pod I can reschedule casually.

## 197. Tell me about yourself.

**Answer:** I am a DevOps engineer. I have spent the recent years of a long infrastructure career on the path from commit to production: Git, Jenkins and GitHub Actions, Terraform, AWS, Docker, and Kubernetes. I care that a change is reviewed, that the pipeline can deploy it again tomorrow, and that we can see it and undo it. A typical piece of work for me is taking a manual step, an instance build or a deploy, and turning it into code with a health check and a rollback. I work with development teams rather than throwing a platform over the wall. If something fails, I want the runbook and the dashboard to be enough for the next person, not a private memory of the last incident.

## 198. Explain your project.

**Answer:** The project I describe is a service running on EKS. The infrastructure is Terraform: the VPC, the cluster, the node groups, ECR, and RDS in private subnets. The application is a container built in Jenkins, scanned, pushed by digest, and deployed with a rolling update. Config is a ConfigMap. The database password is in a secret store, not in the image. Dashboards show error rate, latency, and pod restarts. Logs land in OpenSearch with a trace id. Production is a protected branch and a separate AWS account from dev. I talk about one change I made in that system, what broke before it, and how we knew the change worked. That is more convincing than a list of product names.

## 199. If you want to deploy a three-tier application, what YAML files would you need to create?

**Answer:** A three-tier app is not one YAML file. The frontend Deployment and Service, the backend Deployment and Service, and a way to reach the frontend from outside, which is an Ingress or a LoadBalancer Service. The database, if it runs in the cluster, is a StatefulSet, a PersistentVolumeClaim, and a Service. On AWS I usually keep the database in RDS and the manifest only holds the address in a Secret or a ConfigMap. Each tier gets a namespace or at least labels, resource requests and limits, and a readiness probe. ConfigMaps for non-secret settings, Secrets for credentials. A Namespace and a ResourceQuota if this is a shared cluster. I do not put the database password in the Deployment YAML in git.

## 200. Explain the YAML files you would need to host an application.

**Answer:** The files are a Deployment for each process that should stay running, a Service so other tiers can find it, and an Ingress or a LoadBalancer Service for the one tier users reach. Configuration is a ConfigMap. Credentials are a Secret. If I need a disk, a PersistentVolumeClaim. I would walk an interviewer through one Deployment and point at the image, the probes, the resources, and the labels the Service selects. The YAML is the desired state. It is not a script.

## 201. If I want to deploy an application, what YAML files do I need to create?

**Answer:** For a single application, the minimum is a Deployment and a Service. If users come from outside the cluster, add an Ingress. If the app needs configuration, add a ConfigMap and mount it. If it needs a password, add a Secret from a secret manager, not pasted into the file. Probes and resource requests belong in the Deployment. I do not start by writing ten files. I start with the two that make the process run and reachable, and I add a file when there is a fact that does not belong in the others.

## 202. If you have a frontend, backend, and database, would you use one Dockerfile or separate Dockerfiles for each? Explain why.

**Answer:** Separate Dockerfiles. The frontend, the backend, and the database do not share a dependency tree or a release cycle. One image that contains all three forces every frontend change to rebuild the database layer and tempts people to run all three processes in one container. The frontend image is a built static bundle or a small Node process. The backend image is the API. The database in production is RDS, not a container I built. For a local demo, the official Postgres image in Compose is enough. I do not write a Dockerfile for Postgres just to say I have three. Each image has its own base, its own user, and its own scan.

## 203. Where would you store the Docker images?

**Answer:** In a container registry. Docker Hub is the public registry. A private registry such as Amazon ECR is the same kind of store in your own account. The image does not live on a laptop. The pipeline authenticates, pushes the image, and the cluster pulls that same image by digest. The tag latest is not a release, because someone can move it. People do not push from their laptops to the production registry.

## 204. If you have 10 EC2 instances and need to install packages on all of them, how would you configure the instances without manually configuring each one?

**Answer:** I do not SSH to ten instances. Ansible, with an inventory of the ten hosts, runs one playbook that installs the packages and starts the service. The second run changes nothing if they are already correct. If the instances are an Auto Scaling group, baking the packages into the AMI is better than configuring each boot with a long user-data script. User data is for the few facts that differ at launch. For a one-off on machines that already exist, the playbook is the tool. The inventory comes from tags, not from a list I typed last quarter.

## 205. What is the Jenkins home directory?

**Answer:** Jenkins home is the directory where the controller keeps its configuration, job definitions, plugins, and build records. The default path on a Linux package install is /var/lib/jenkins. JENKINS_HOME overrides it. That directory is the thing I back up. A new controller with an empty home is a new Jenkins, even if I install the same packages. Secrets live in credentials.xml and in the secrets directory inside that home, so the backup is sensitive. In a container, that path is a volume. If the volume is missing, every job disappears on the next restart.

## 206. How do you pull code from GitHub through Jenkins?

**Answer:** Jenkins pulls GitHub with the Git client and a credential, not with someone's laptop key left on the agent. I install the Git plugin and the GitHub plugin, or I use a multibranch pipeline that discovers Jenkinsfiles. Authentication is a GitHub App or a deploy key stored in the Jenkins credential store, bound to the job. A personal access token of a human is a last resort and it should be fine-grained and expiring. The webhook from GitHub to Jenkins triggers the build on push. The GitHub server's payload URL and a secret token prove the event is real. Branch protection stays on GitHub. Jenkins should not be able to push to main unless the job is the one that tags a release.

## 207. What plugins would you install to integrate Jenkins with GitHub?

**Answer:** To integrate Jenkins with GitHub I install Git, so the agent can clone, and GitHub Branch Source or the GitHub plugin, so Jenkins can discover branches and receive webhooks. I add the Pipeline plugin if it is not already there, because the Jenkinsfile should be the job. Credentials plugin is what stores the GitHub App key or the token. I do not install a pile of GitHub helper plugins I cannot name. Those four are the ones that make a webhook start a pipeline from a Jenkinsfile.

## 208. Where do you configure Docker credentials in Jenkins?

**Answer:** Docker credentials for a registry sit in the Jenkins credential store, as a username and token for the registry, and the job binds them in the push stage. For ECR I prefer not to store a key at all. The agent assumes a role and uses the AWS CLI to get a short-lived ECR password. If I must store it, it is a credential of type username/password, scoped to the folder of that job, and the pipeline uses docker login inside a withCredentials block so the password is masked. It does not live in the Dockerfile or in a config file in the repo.

## 209. How do you authenticate GitHub with Jenkins?

**Answer:** The safer authentication is a GitHub App installed on the organization, with the private key in the Jenkins credential store. Jenkins uses it to clone and to report status. A deploy key is enough for one repository and should be read-only unless the job must push a tag. A personal access token is tied to a person, which breaks when they leave, so I do not use one for the system. The webhook has its own shared secret so a stranger cannot trigger builds. I test by opening a pull request and seeing the check appear on the commit.

## 210. Write a Jenkins pipeline.

**Answer:** A Jenkins pipeline I would write in the repo is declarative. Agent, then stages: checkout, test, build the image, scan, push by digest, and deploy only when the branch is main. Credentials are bound in the deploy stage, not exported at the top. post marks the build unstable or failed and cleans the workspace. The Jenkinsfile is short because the repeated steps live in a shared library. I can walk through that file in an interview without inventing a plugin for every line.

## 211. Explain the difference between Ingress and Service.

**Answer:** A Service gives the pods a stable virtual address inside the cluster. Its selector finds pods by label. ClusterIP is internal. NodePort and LoadBalancer publish it further. A Service does not do HTTP hostnames and paths. An Ingress does. Ingress is a rule set, host and path to a Service, and an ingress controller is the actual proxy that implements the rules. I need both for a typical web app: the Ingress routes the URL to the Service, and the Service load-balances across the pods. Deleting the Service and pointing the Ingress at pod IPs directly will break the moment a pod is replaced.

## 212. How would you troubleshoot `ImagePullBackOff`?

**Answer:** ImagePullBackOff means the node tried to pull and failed, then backed off. The events on the pod say why: manifest unknown, unauthorized, or a timeout. Manifest unknown is the wrong name or tag. Unauthorized is the node role or the image pull secret, and on EKS that is the node IAM role against ECR. I confirm the image exists in the registry I think I am using, in that region. I do not change the deployment until the manual pull from a node, or a describe event, matches a cause.

## 213. What are the possible causes of `ImagePullBackOff`?

**Answer:** The image name is wrong, the tag does not exist, the registry denied the node, or the node cannot reach the registry. A private registry without an imagePullSecret does this immediately. ECR without permission on the node role does too. A rate limit from a public registry looks like a timeout or a denial after it worked all week. The event text distinguishes these. The pod never starts, so there are no application logs. CrashLoopBackOff means the pull succeeded and the process then died. I do not mix those causes.

## 214. How would you troubleshoot `CrashLoopBackOff`?

**Answer:** I get the pod, read the restart count, and describe it for the last state and the events. Then kubectl logs --previous. The reason is usually in one of those three. OOMKilled, a missing config file, an exception on startup, or a probe. I fix that cause and watch the restart count. Deleting the pod only helps if the cause was a one-off on a bad node. If the template is wrong, the new pod crashes too.

## 215. What are the possible causes of `CrashLoopBackOff`?

**Answer:** The usual causes are the process exiting on startup, an out-of-memory kill, a failing liveness probe, and a bad command or missing file in the image. Less often the container is killed because the node is under pressure. The status and the exit code separate these. Exit 1 is the application. Exit 137 is a kill. A probe event is in describe, not in the application log. ImagePullBackOff is a different status and is not a crash loop.

## 216. If a database is accidentally deleted from Docker, how would you make sure backups are available in the future?

**Answer:** A container filesystem disappears with the container. A database whose data lived only there is gone, and no amount of docker start brings it back. The future fix is a volume for the data directory, and a backup that leaves the machine. For Postgres or MySQL that is a scheduled dump or a volume snapshot copied to S3, restored once in a drill so I know the dump is valid. In production I do not run the company database in Docker on one VM. I use RDS, with automated backups and a restore I have tested. The container, if I still use one for a local database, mounts a named volume and the backup job reads from the database protocol, not from copying files out of a running data directory.

## 217. What is Terraform?

**Answer:** Terraform solves the problem of building the same infrastructure twice and remembering what you built. I describe the desired resources in code. Terraform compares that with state and with the live cloud, shows me a plan, and changes only the difference. The next person can review the plan. Dev and prod stay aligned because they use the same modules with different variables. Without it, the cloud is whatever someone clicked, and the only copy of that knowledge is the console. Terraform does not replace Ansible or a pipeline. It creates the network, the cluster, and the database. It does not install nginx inside a server and it does not ship the application release.

## 218. What is a `.tf` file?

**Answer:** A .tf file is a Terraform configuration file written in HCL. It holds blocks: terraform settings, providers, resources, variables, outputs, and modules. Terraform loads every .tf file in the directory as one configuration. The filenames are for humans. main.tf, variables.tf, and outputs.tf are a convention, not a rule. The order of files does not decide the order of creation. References between resources do. A .tfvars file is different. It supplies values. A .tf file declares what should exist.

## 219. How do you install Terraform providers/plugins?

**Answer:** Providers are plugins, and terraform init installs them. The required_providers block names the source and the version, for example hashicorp/aws. init downloads that plugin and writes the exact version into .terraform.lock.hcl, which I commit. I do not copy a provider binary around by hand. If the lock file and the constraint disagree, init tells me, and I upgrade on purpose. A module has its own required providers. The root module's init installs those too. Changing the version and running init is the upgrade. I read the plan after an upgrade before I apply it.

## 220. What is the difference between desired state and actual state?

**Answer:** Desired state is what the code says should exist. Actual state is what the cloud has right now. Terraform's state file is its memory of the objects it created so it can connect the two. A plan is the difference. If desired says three subnets and actual has three, the plan is empty. If someone deletes one, the plan creates it. If I remove it from the code, the plan destroys the extra. The job is to make actual match desired, not to run a script of steps. When those two drift, I decide which one is correct before I apply. Applying always votes for the code.

## 221. How would you troubleshoot an EC2 instance that suddenly becomes unreachable?

**Answer:** An unreachable EC2 instance is a path problem until the console says the OS is dead. I check the instance state first. Stopped is not unreachable, it is stopped. Then the status checks. A failed system status check is AWS's hardware or network, and a stop and start moves the instance. A failed instance status check is the OS. Then the path: security group, network ACL, route table, and whether I am using the public or private address. SSM Session Manager avoids SSH entirely if the agent and the role are in place. If SSH is the only door and the key is not the problem, the serial console shows a kernel panic or a full disk. I do not rebuild the instance before I know which of those it is, because rebuilding throws away the evidence.

## 222. Public vs Private Subnet --- when and why would you use each?

**Answer:** The difference is the route, not the name. A public subnet has a route to an internet gateway, and the instances that should be reachable have a public address. A private subnet does not. It may have a route to a NAT gateway so instances can open outbound connections without accepting inbound ones. I put load balancers and NAT gateways in public subnets. I put application nodes and databases in private subnets. The database subnet often has no default route at all. I confirm with the associated route table. A subnet labeled private that routes 0.0.0.0/0 to an internet gateway is public, whatever the tag says.

## 223. How does a Security Group actually control traffic?

**Answer:** A security group is a stateful firewall on the network interface. I write allow rules. There is no deny rule. Traffic that matches an allow is allowed, and the return traffic is allowed automatically. A network ACL is on the subnet, it is stateless, and it can deny. I have to allow both directions, including the ephemeral ports. In practice the security group does the real work: the load balancer accepts 443, the app accepts traffic only from the load balancer's group, the database accepts the port only from the app's group. The NACL stays at the default allow unless I have a reason to add a coarse deny. Referencing another security group beats a CIDR that goes stale when instances are replaced.

## 224. What happens when an application suddenly gets 20% higher traffic?

**Answer:** A small, steady increase is an Auto Scaling decision, not a heroics decision. The load balancer spreads traffic across the healthy instances or pods. An Auto Scaling group, or the cluster autoscaler plus a Horizontal Pod Autoscaler, adds capacity when the chosen metric stays high. I scale on something close to user load, request count or CPU of the service, and I scale in slowly so I do not flap. A 20 percent rise that is one expensive query is not a scaling problem. I check latency and the database before I double the fleet. The ceiling matters. A maximum size stops a bug from scaling the bill without limit. When the rise is sudden and huge, I also look for a bad deploy and for a retry storm.

## 225. How would you troubleshoot an S3 `AccessDenied` issue?

**Answer:** AccessDenied on S3 is IAM saying no, and the useful next step is which of the two policies said no. The caller needs an identity policy that allows the action on that bucket's ARN. The bucket policy must not deny it, and if the call is cross-account the bucket policy must allow the caller too. Block Public Access and an explicit deny for non-TLS are common surprises. So is a KMS key: the object is encrypted with a key the role cannot decrypt, and the error still looks like S3. I read the CloudTrail event for the denied call. It names the principal and the API. I do not attach s3:* to the role to see if the error goes away. I add the one action on the one bucket.

## 226. CPU suddenly reaches 100% --- how do you investigate?

**Answer:** I find out which process, then why. top or pidstat shows the process. A single application thread at the top is the app. Steal time or a runaway system process is the host. I check whether this started at a deploy, a cron job, or a traffic spike. For the app I take a thread dump or a profile if I can, and I look at the request rate. High CPU with low traffic is a loop. High CPU with high traffic is load, and the question is whether to scale or to fix a hot path. On Kubernetes I look at throttling as well. A low CPU limit makes a container look busy when it is only capped. I do not reboot as the first step. I capture the process list first, or the evidence is gone.

## 227. How do you identify a memory or disk-space issue?

**Answer:** Memory and disk fill up in different ways and I check them separately. free and the OOM messages in dmesg or the kernel log show memory. A process whose RSS grows until the kernel kills it is a leak or a cache with no bound. I note the command line of the killed process before I restart it. Disk is df for the filesystem and du for who filled it. Deleted files still held open by a process show up in lsof. Container logs and a core dump are the usual occupants. A full disk on a Kubernetes node causes evictions. The fix is rotation, a larger volume, or a quota, plus an alert at 80 percent so 100 percent is not the first time I hear about it. Network symptoms, timeouts and drops, get ss and a path check rather than another CPU chart.

## 228. A service is running but the application is not responding --- what will you check?

**Answer:** The process is up and the user still gets nothing. I check the listen address and the port. An app bound to 127.0.0.1 inside a container or a VM will not accept traffic from outside. Then the firewall and the security group, then DNS, then the health check that may be failing while my manual curl to the wrong port succeeds. I curl from the machine itself, then from a neighbor, then from the load balancer path. The logs at the moment of a failed request matter more than a status page that says running. On Kubernetes, Running does not mean Ready. A failing readiness probe removes the pod from the Service, and the process is happily running with no traffic.

## 229. How would you troubleshoot DNS/connectivity from Linux?

**Answer:** I separate name resolution from connectivity. dig or nslookup tells me what the resolver returned and which server answered. A wrong answer is DNS. A right answer and a hanging connection is routing, a security group, or a host that is not listening. I check /etc/resolv.conf so I know which resolver the machine uses. In Kubernetes the pod's resolver is CoreDNS, and a failure there looks like every service name breaking while raw IPs still work. ss or nc tests the port. traceroute or a simple mtr shows where packets die, with the caveat that some networks hide hops. Intermittent loss gets a longer mtr and a look at packet counts on the interface, not a one-off ping that happened to succeed.

## 230. The application works internally but not from the internet --- how will you troubleshoot it?

**Answer:** Internal works, external does not, so the process is fine and the front door is not. I walk the path from the outside in. DNS for the public name must point at the load balancer, not at a stale address. The load balancer listener must be on 443 and its security group must allow the world on that port. The target group or the ingress must be healthy. A target that is unhealthy will not receive traffic even though I can curl the pod from inside the cluster. The subnet of the load balancer needs a route to the internet gateway. The application itself stays private. If TLS fails, the certificate on the listener does not match the name. I test with curl from outside, then the load balancer access log, then the pod log. The first place the request disappears is the fault.

## 231. What is the difference between a Security Group and a NACL?

**Answer:** A security group attaches to a network interface, allows traffic, and is stateful, so the reply packets are allowed without a second rule. A network ACL attaches to a subnet, can allow and deny, and is stateless, so I must allow the return ports too. I use security groups for the real policy between tiers. I leave NACLs open unless I need a subnet-wide deny. Mixing them up is how a database 'randomly' fails after a NACL allows only the service port and blocks the ephemeral reply.

## 232. How does traffic flow from an internet user to an application running on EC2?

**Answer:** The browser resolves the name to the load balancer address. The packet hits the internet gateway of the VPC, then the load balancer in a public subnet. The load balancer's security group allows 443. It chooses a healthy target and opens a connection to the instance's private address on the application port. The instance's security group must allow that port from the load balancer, not from the whole internet. The instance sits in a private subnet and has no public IP. The return path is the connection the load balancer already opened. A NAT gateway is not in this inbound path. It is only for the instance's own outbound calls.

## 233. A container starts and immediately exits --- how do you debug it?

**Answer:** The container's main process exited, so the container stopped. Docker does not keep a container 'running' with nothing in it. I look at the exit code with docker inspect, and at what it printed with docker logs. Exit 0 means the command finished, which is normal for a batch job and a bug for a web server whose command was a shell that ended. Exit 1 is the application. Exit 137 is a kill, often out of memory. A restart policy will start it again and I will see a restart count. The Dockerfile's ENTRYPOINT or CMD is what ran. If that binary is missing, the log says so in one line and the container never becomes a long-running process.

## 234. What is the difference between a Docker image and a container?

**Answer:** An image is the built artifact. It is layers of filesystem plus the command to run. It does not have a process, an IP, or writable runtime state. A container is a running, or exited, instance of an image. I can start many containers from one image. They share the image layers and each has its own writable layer. Deleting a container does not delete the image. Deleting an image does not stop a container that already started from it, until that container is removed. I deploy an image digest. I debug a container. Mixing the words up causes people to 'restart the image' or to look for logs on an artifact that never ran.

## 235. A pod is stuck in `CrashLoopBackOff` --- what will you check first?

**Answer:** First I look at the last termination state: reason and exit code. That one field splits OOM, error, and completed. Second I read the previous logs. Third I look at events for a probe killing it. I do that before I change the image or the replica count. The first check takes a minute and stops me from restarting a crash that will happen again.

## 236. How do Kubernetes Service and Deployment work together?

**Answer:** A Deployment declares how many pods I want and how to update them. It owns a ReplicaSet. The ReplicaSet keeps that many pod copies running. When a pod dies, the ReplicaSet creates another. The Service does not create pods. It selects the pods the ReplicaSet created, by labels, and load-balances traffic to the ones that are Ready. The Deployment changes the template and creates a new ReplicaSet for a rollout. The Service keeps the same cluster IP the whole time, so callers do not change. If the Service selector and the pod labels diverge, the pods run and the Service has no endpoints. That is the first thing I check when the Deployment looks healthy and nobody can connect.

## 237. Explain a CI/CD pipeline from code commit to deployment.

**Answer:** From commit to deployment: the push triggers the pipeline, the runner checks out that SHA, tests and scans run, the image is built and pushed with the SHA as the tag, and the deploy updates the workload to that digest. The running pods are the end of the path. I can stop at any failed step and name which artifact did not exist yet. The deployment does not build. It consumes the digest the earlier step published.

## 238. What problem does Terraform solve?

**Answer:** The problem is that clicked infrastructure cannot be reviewed, repeated, or safely changed. Terraform lets me say what should exist, see the difference before it happens, and apply that difference again in another environment. It remembers the ids in state so the next change is an update and not a second copy. I use it so a network change is a pull request with a plan attached. The problem it does not solve is configuring the software inside the machine or shipping the application.

## 239. What happens if Terraform state is lost or becomes inconsistent?

**Answer:** If the state file is lost and the cloud resources remain, Terraform has amnesia. The next plan wants to create everything again, and the creates fail because the names already exist, or they succeed and I now have duplicates. I restore the state from the versioned backend. That is why versioning is on. If I have no backup, I rebuild state with terraform import, one resource at a time, until the plan is empty. I do not apply a plan that creates a second production VPC. If state is inconsistent rather than missing, a refresh and a careful plan show the disagreement. I fix the mapping with state mv or a moved block. I do not hand-edit the JSON unless I am recovering an incident and I have a copy of the original.

## 240. How would you safely deploy a new application version and roll back if required?

**Answer:** I deploy the new version beside the old one or as a rolling update that leaves the previous ReplicaSet in place. I watch the error rate and the readiness of the new pods. If they fail, I send traffic back to the previous digest. That digest is recorded from the last good deploy. I do not rebuild an older commit and hope it matches. For the database, the new version must still understand the current schema, so a bad application rollback does not require a database rollback. If it does, I am not ready to call the deploy safe.

## 241. How do you design a CI/CD pipeline for microservices running in Kubernetes?

**Answer:** Each service has its own pipeline, or its own workflow in a monorepo, so one team's bad test does not block every deploy. The workflow builds, tests, scans, and pushes an image tagged with the commit. A pull request runs CI only. The main branch deploys to dev automatically and to production through an environment with a required reviewer. GitHub Actions assumes a cloud role with OIDC. The deploy applies a manifest or a Helm release that pins the image digest, then waits for the rollout. Environments differ by variables and by which cluster credentials the job can use, not by a forked workflow nobody updates. A failure in production rolls back to the previous digest. The previous digest is an output of the last successful job, not a guess.

## 242. How do you implement zero-downtime deployments in Jenkins or GitHub Actions?

**Answer:** The pipeline does not SSH and restart the process. It updates the Deployment image and waits. In Jenkins or GitHub Actions the deploy step sets the digest, runs kubectl rollout status or the Helm upgrade with wait, and fails the job on timeout. The Kubernetes rollout is what makes it zero-downtime, if the probes and surge are set. The pipeline's job is to refuse to go green until the new pods are Ready, and to roll back the digest if they are not. A job that applies the manifest and exits is how a bad rollout becomes downtime with a green build.

## 243. How do you secure pipelines against supply chain attacks?

**Answer:** A supply-chain attack comes through a dependency, a build plugin, or an image I did not build. I pin dependencies and actions to a digest. I ignore floating tags. The build runs in an isolated runner with a short-lived role. Only that pipeline can push to the production registry. The cluster admits images by digest and, if I am ready, only images signed by that pipeline. A compromised developer laptop cannot push a tag the cluster will run. SBOMs and dependency review catch the known bad package. They do not catch a malicious build step, which is why the runner's credentials are narrow.

## 244. How do you manage parallel builds and artifacts in Jenkins/GitLab?

**Answer:** Parallel jobs are the ones that do not need each other's output: test and lint, or one job per service in a matrix. The publish job needs the build artifacts, so it depends on them and it is the only job that pushes a given tag. I store the artifact once, in the registry or the artifact store, and later jobs pull by id. I cap parallelism so forty image builds do not exhaust the registry or the runners. A failed parallel branch fails the pipeline. I do not let a green deploy job start because one of three test jobs was skipped.

## 245. Explain Blue-Green vs. Canary deployments --- when would you choose one over the other?

**Answer:** Blue-green keeps the old version running and switches traffic in one step. Rollback is switching back. I pay for two full copies during the release. Canary sends a small slice of traffic, five or ten percent, to the new version and watches the error rate. If the slice looks like the old version, I increase it. If it does not, I send that slice back and almost all users never saw the bug. I choose canary when I need to catch a problem that tests did not, and when the application can run two versions at once against the same data. I choose blue-green when I want a fast, total switch and I have the spare capacity. Both fail if a database migration is irreversible. The migration has to be compatible with both versions before either strategy is safe.

## 246. How do you optimize a Dockerfile for performance and security?

**Answer:** Performance of the build is cache order and a small context. Security of the image is a different pass on the same Dockerfile. I run as a non-root user, I pin the base image by digest, I do not copy secrets in with COPY or ARG that remain in a layer, and I use a multi-stage build so the compiler is not in the final image. I combine apt-get update and install and cleanup in one RUN so credentials or package archives are not stuck in a layer. Hadolint or a scanner catches the rest. A fast build of a root container that contains the toolchain is not the goal.

## 247. How do you handle secrets inside containers?

**Answer:** The image does not contain the secret. The pipeline injects it at deploy time from a secret manager. On Kubernetes the pod mounts a Secret, or an external-secrets controller copies it from AWS or Vault into a Secret the pod mounts as a file. The file mode is restricted. The application reads the file. Environment variables are acceptable for a low-sensitivity token and a bad place for a database password, because they show up in process listings and crash dumps. The service account can read only its own secret. A debug page that prints the environment is a leak. Logs redact the value. Rotation means a new secret and a rolling restart, or an application that re-reads the file. I do not bake a .env into the image 'just for the demo' and then use that image in prod.

## 248. Explain image layering in Docker --- how can it cause cache busting?

**Answer:** An image is a stack of layers. Each Dockerfile instruction creates a layer, and Docker reuses a layer when the instruction and everything before it are unchanged. That is the cache. Cache busting is the cache missing. I change one line near the top, such as the base image or a COPY of the whole source before dependency installation, and every later layer rebuilds. I want that when the source changed. I do not want it when only the application code changed and the dependencies did not. So I copy the dependency file, run npm ci or the equivalent, and only then copy the rest of the source. The dependency layer stays cached. A build arg that changes every time, or a clock in a RUN command, busts the cache on purpose and makes every build slow.

## 249. What strategies do you use for debugging container networking issues?

**Answer:** Container networking fails in a few repeatable places. The process listens on 0.0.0.0 and on the port I published. Docker's published port is a mapping, host to container, and a mismatch looks like a dead service. Inside a user-defined bridge network, containers find each other by name. The default bridge does not give me that DNS. In Kubernetes, the Service name resolves through CoreDNS to the Service IP, and kube-proxy or the CNI sends it to a pod IP. I exec into a debug container and use getent hosts and a curl to the Service. If DNS fails, I look at CoreDNS. If DNS works and the connection times out, I look at NetworkPolicy and security groups. I do not start by restarting the cluster.

## 250. How do you run multi-container applications in production without Docker Compose?

**Answer:** Compose is a dev tool. In production the same containers run under a supervisor that can restart them and place them on more than one machine. That is Kubernetes: a Deployment per service, a Service for the name, and a probe so a dead process leaves the pool. A single VM can run them under systemd if Kubernetes is not justified, one unit per container, with a restart policy. I do not run docker compose up on a production host and call it a platform. Compose has no rolling update, no cluster, and no secret handling I would trust with a real credential. The Compose file is useful as documentation of which processes exist. The production definition is the manifest.

## 251. How does Kubernetes handle self-healing at pod and node level?

**Answer:** At the pod level, the kubelet restarts containers and the ReplicaSet replaces pods that are gone. At the node level, if the node stops reporting, the pods are marked NotReady and, after the pod eviction timeout, they are scheduled elsewhere, provided a controller wants them and another node has room. A DaemonSet pod comes back when a new node joins. A volume that is stuck on the dead node can delay a StatefulSet pod. Self-healing is this reconciliation. It is not magic if the only node is gone or the quota is full. Then the pods stay Pending and I have to add capacity.

## 252. What is the difference between ReplicaSet, Deployment, StatefulSet, and DaemonSet?

**Answer:** A Pod is one or more containers that share a network namespace and a fate. A ReplicaSet keeps a count of identical pods running and replaces them when they die. A Deployment owns ReplicaSets and adds rolling update and rollback, which is what I use for a stateless service. A StatefulSet is for pods that need a stable name and a stable disk, such as a database I am forced to run myself. It creates pod-0, then pod-1, and each can have its own volume. A DaemonSet runs one pod on every matching node, which is how log agents and CNI plugins get onto all nodes. I do not use a StatefulSet for a stateless API, and I do not use a Deployment for something that must keep a specific disk.

## 253. How do you troubleshoot `CrashLoopBackOff` or `ImagePullBackOff` errors?

**Answer:** I read the status before I pick a tool. ImagePullBackOff is the registry path: name, tag, and credentials. CrashLoopBackOff is the process path: exit code, previous logs, probes, and memory. They look alike only because both end in BackOff. The events tell me which one I have. I fix the pull by making the node able to fetch that digest. I fix the crash by changing the image, the config, or the limit. One checklist with two branches is the answer.

## 254. How do you implement PodDisruptionBudgets and why are they critical?

**Answer:** A PodDisruptionBudget says how many pods of a service must stay up during a voluntary disruption, a node drain or a cluster upgrade. minAvailable 2 on a service with three replicas means a drain waits rather than taking the second-to-last pod. It does not protect against a node crash or an OOM kill. Those are involuntary. I set it on anything that has more than one replica and serves traffic. Without it, a node upgrade can drain every replica of a small service at once because nothing told the drain to wait. The budget has to be possible. minAvailable equal to the replica count means the drain never proceeds and the upgrade stalls. I leave room for one pod to be gone.

## 255. What is the role of etcd in Kubernetes, and how do you back it up?

**Answer:** etcd stores every Kubernetes object. The API server is its client. If etcd is down, the control plane cannot read or write objects. The running pods keep running, and I cannot change them. For availability I run an odd number of members across zones and I watch fsync latency. Backup is a snapshot, etcdctl snapshot save, on a schedule, stored outside the cluster. I have restored it onto a test control plane. A snapshot I have never restored is not a backup I will trust during an outage.

## 256. How do you secure a Kubernetes cluster using RBAC, Pod Security controls, and NetworkPolicy?

**Answer:** Three different doors. RBAC decides who can call the Kubernetes API. I bind a group to a Role in one namespace, not cluster-admin to every developer. Pod security admission, or a restricted policy, stops pods from running as root, mounting the host path, or using the host network. A NetworkPolicy default-deny, with explicit allows, stops every pod from talking to every other pod just because they share a cluster. I also turn off the default service account token automount where the pod does not call the API. The cloud role of the node is separate and just as important. A privileged pod on a node with a powerful instance role is the real admin, whatever RBAC says.

## 257. How do you handle drift detection in Terraform?

**Answer:** Drift means the real infrastructure differs from what
Terraform state/configuration represents. I detect it by running a
refresh-aware `terraform plan` and reviewing unexpected differences. I
first determine who changed the resource and whether the manual change
was intentional. If Terraform should remain authoritative, I update the
configuration and apply a reviewed plan; if the external system is
authoritative, I import or model the desired state. For production, I
prefer controlled reconciliation, testing and staged rollout rather than
an immediate blanket apply.

## 258. What is the impact of `terraform refresh` vs. `terraform plan`?

**Answer:** refresh updates state from the live cloud and writes that state. It does not show a line-by-line plan of what you will change, and modern Terraform does the refresh at the start of plan anyway. plan refreshes and then prints the diff between the code and that refreshed state, and it changes nothing if you do not apply. Running refresh by itself is how people update state as a side effect and then forget. I use plan. I treat a standalone refresh as a sharp tool when state is wrong and I want to sync it without applying a change.

## 259. How do you structure large Terraform projects using workspaces and modules?

**Answer:** Workspaces are separate state files for one configuration, selected by a name. They are useful for short-lived identical stacks. They are dangerous when prod is only a workspace name and the same credentials can select it. For a large project I use separate directories and separate accounts, and I use workspaces only inside non-production. Modules hold the repeated structure. The root module for prod is small and pinned. I do not put every environment in one workspace list and rely on everyone to run terraform workspace select.

## 260. How do you manage state locking and avoid conflicts in remote backends?

**Answer:** The backend lock is the conflict control. S3 with a lock table, or GCS, or Terraform Cloud, means the second apply cannot write state until the first finishes. I turn the lock on and I test it by running two plans that would apply. The second must wait or fail. I do not disable locking to unblock a pipeline. If the lock is stuck, I confirm no apply is running, then force-unlock the specific lock id. Avoiding conflicts is also social: one writer pipeline per state, not ten laptops.

## 261. How do you test Terraform code before deploying to production?

**Answer:** I never apply untested Terraform to production. On the pull request, CI runs fmt, validate, and plan, and posts the plan. fmt only checks formatting. validate checks that the configuration is internally consistent. The plan is the real test, because it shows the change against a real state. I apply to dev first and look at the result. For modules, I run the plan in a sandbox account. A policy tool such as Conftest or Checkov can reject a security group open to the world before the plan is approved. I do not have a unit test for every resource, and I do not pretend terraform validate applied anything. The saved plan from the approved pull request is what production apply runs.

## 262. How do you design an auto-scaling strategy in AWS for high-traffic applications?

**Answer:** For high traffic on AWS I scale the stateless tier and I protect the database. An Application Load Balancer in front of an Auto Scaling group, or HPA plus the cluster autoscaler on EKS, adds instances when request count or CPU stays high. The scaling policy has a target and a cooldown so it does not flap. The maximum stops a bug from creating a hundred machines. RDS gets a bigger class or a read replica only after I know the app is not missing a cache. I load-test the scaling once, because a policy that looks right and a group that cannot launch in the subnet are different.

## 263. How do you secure an S3 bucket used for static website hosting?

**Answer:** A static website bucket is not a public bucket if I can avoid it. CloudFront serves the site. The bucket policy allows only the CloudFront distribution, using the origin access control, and Block Public Access stays on. The bucket does not have a public ACL. TLS is on the distribution. The default certificate or a managed certificate matches the name. Directory listing is off. A separate bucket holds logs. If someone must upload, they get a scoped role, not the world-readable bucket. I test by requesting the website name and by requesting the bucket URL directly. The second one should fail.

## 264. How do you monitor Kubernetes clusters with Prometheus and Grafana?

**Answer:** I run Prometheus inside the cluster or use a managed compatible backend. Service discovery finds pods with a scrape annotation. kube-state-metrics and node-exporter cover the cluster and the nodes. Each application exposes /metrics. Grafana is the only UI I ask people to use, with one dashboard per service: rate, errors, latency, and saturation. A recording rule holds the expensive queries. Alertmanager routes by team. The scrape interval is 30 seconds for most services and shorter only where I have measured that I need it. I watch Prometheus's own memory, because too many label values will take the monitor down before the application does.

## 265. How do you implement centralized logging across distributed microservices?

**Answer:** Every service logs to stdout as JSON, with a service name, a level, and a trace id. A collector on each node ships those logs to one place, OpenSearch or a managed equivalent, with a retention that matches how far back we actually investigate. Metrics go to Prometheus, or to the cloud metrics service, and dashboards live in Grafana. Alerts come from the metrics, not from someone tailing a file. Traces go through OpenTelemetry to the same Grafana so a graph, a log line, and a trace meet on the id. Dev and prod are separate indexes and separate dashboards. I do not stand up a second logging stack per team. I give each team a view of their own service in the central one.

## 266. How do you design zero-downtime deployments for stateful apps on Kubernetes?

**Answer:** Stateful applications cannot lose the disk and cannot all restart at once. I use a StatefulSet so the identity and the volume stay with the ordinal. I roll one pod at a time, the default, and I wait until that pod is Ready before the next. The database itself should already be a managed service if I can do that. If it must run in the cluster, the volume is a PersistentVolumeClaim, the pod uses the same claim after the roll, and I take a snapshot before the upgrade. A Deployment that recreates pods with an emptyDir is not zero-downtime for state. It is data loss.

## 267. Terraform state is huge (200MB) and plan takes 12 minutes. How do you fix it?

**Answer:** A 200 MB state file is a design warning. I would identify
what is consuming state and whether too many unrelated resources are
managed in one root module. I would split state along sensible ownership
or lifecycle boundaries, reduce unnecessary data sources/resources and
avoid using one state for an entire organization. I would also use a
remote backend with locking and versioning. I would not simply increase
CI timeouts; the goal is to reduce the dependency graph and state size
while preserving safe ownership boundaries.

## 268. Pods are Running but users see 503 errors. Where do you debug?

**Answer:** 503 means the proxy has no healthy backend. I start at the ingress or the load balancer, not in the application code. I look at the backend or target group: how many pods are registered and how many pass the health check. A readiness probe failing on every new pod produces 503 during a rollout that the deployment controller may still call progressing. Endpoints empty is the same symptom. I fix the probe or the pods, and the 503 goes away. I only read application logs after a backend is actually being sent the request.

## 269. How do you manage secrets across 50+ services without exposing Vault access?

**Answer:** Applications never log into Vault as a human and they never receive the root token. Each service has an identity, a Kubernetes service account mapped to a Vault role, and a policy that can read one path: secret/data/payments/prod. The pod authenticates with its service account token. Vault returns the secret, or a database username that expires. The application cannot list the other 49 services. Humans use OIDC and a different policy. CI uses its own role. I audit who read which path. I do not mount a token that can read secret/* into every namespace because it was easier to template. If Vault is sealed or down, the apps that need a new secret fail, so Vault is highly available and I have practiced unsealing.

## 270. How do you design GitOps for multiple teams with independent releases?

**Answer:** I would give each team clear ownership of its application
configuration and use Git as the source of truth. A GitOps controller
such as Argo CD or Flux continuously reconciles the desired state to the
cluster. Teams can have separate repositories or well-defined directory
boundaries, with protected branches and PR-based promotion. Environment
overlays or Helm/Kustomize can keep common configuration reusable while
allowing independent releases. RBAC, repository permissions, audit logs
and policy checks prevent one team's change from affecting another
team's workloads.

## 271. An image passed security scans but was later exploited. What did you miss?

**Answer:** A security scan is a point-in-time control, not proof that
an image is permanently safe. I would investigate whether the
vulnerability was newly disclosed, whether runtime behavior was outside
the scan scope, whether a dependency was compromised after the scan, or
whether credentials/configuration were the real attack path. I would add
continuous image/dependency monitoring, runtime controls,
provenance/signing, least privilege and rapid patch/rollback processes.
The lesson is to use defense in depth rather than treating a successful
scan as a security guarantee.

## 272. How do you implement SLO-based alerting without alert fatigue?

**Answer:** I would alert on user-impacting SLO or error-budget burn
rather than every low-level metric threshold. For example, a
short-window burn alert can catch a severe outage quickly while a
longer-window alert catches sustained degradation. I group related
symptoms, route alerts to the correct owner and make each page
actionable with a runbook. Non-actionable information belongs in
dashboards or lower-priority notifications. I regularly review alert
volume and tune thresholds based on false positives and missed
incidents.

## 273. CI builds 40 Docker images and takes 18 minutes. How do you optimize it?

**Answer:** I would profile the 18 minutes before optimizing. If the
images are independent, build them in parallel with matrix/parallel jobs
and use BuildKit/remote cache. Reuse common base and dependency layers,
avoid rebuilding unchanged components and publish immutable images. I
would also check whether every image really needs a full build and
whether multi-stage builds can reduce work. The goal is to reduce both
wall-clock time and CI resource consumption, so I would measure build
time per image, cache hit rate and runner utilization before and after
the change.

## 274. How do you upgrade a Kubernetes cluster with zero downtime?

**Answer:** I would first review the supported upgrade path, API
deprecations, add-ons and workload compatibility. For managed Kubernetes
such as EKS, I would upgrade the control plane first according to the
supported sequence, then update node groups using a rolling replacement
strategy. I would maintain capacity so workloads can be rescheduled, use
PodDisruptionBudgets appropriately and monitor application health during
each step. I would upgrade add-ons such as CNI, CoreDNS and kube-proxy
as required. The key is staged rollout, readiness checks and a tested
rollback/recovery plan.

## 275. Reduce cloud cost by 40% without impacting performance. Where do you start?

**Answer:** I start with cost visibility by account, environment,
service and owner. Then I identify idle resources, low-utilization
EC2/EKS capacity, oversized databases, unattached storage, excessive
data transfer and inefficient logging. I apply right-sizing,
autoscaling, scheduling non-production resources, storage lifecycle
policies, Savings Plans/Reserved Instances where usage is predictable
and architectural changes where justified. I validate every change
against latency, throughput and SLOs. A 40% reduction should come from
measured waste and better utilization, not simply cutting capacity until
performance degrades.

## 276. What message/event do you get before there is something wrong with a Kubernetes pod, for example `CrashLoopBackOff` or `ImagePullBackOff`?

**Answer:** Kubernetes writes an event before the status settles into CrashLoopBackOff or ImagePullBackOff. For a pull failure I see Failed to pull image and a reason, then the status becomes ImagePullBackOff as it retries. For a crash I see the container start, then a Back-off restarting failed container event, and the status becomes CrashLoopBackOff after repeated exits. kubectl describe shows those events. kubectl get only shows the resulting status. The event is the earlier, more useful message.

## 277. What is the difference between `CrashLoopBackOff` and `ImagePullBackOff`?

**Answer:** ImagePullBackOff means the container image never started because the pull failed. CrashLoopBackOff means the container did start, exited, and has been restarted until Kubernetes slowed down the retries. One is a registry or name problem. The other is a running process that cannot stay up, or a probe killing it. Logs exist for the crash, after I ask for the previous container. Logs do not exist for the pull failure, because there was no process. The fix for one does nothing for the other.

## 278. If a pod is in `Pending` state, what will you check?

**Answer:** I describe the pod and read the events, which are the scheduler's reason. Pending means it is not on a node yet. The reasons I expect are not enough CPU or memory, a node selector or affinity that matches nothing, a taint, a PVC that is not bound, or too many pods on the node. I compare the requests with what the nodes have free. I do not delete the pod. It will Pending again for the same reason. I fix the constraint or add capacity.

## 279. If a pod is `Running` but the application is not accessible, how will you troubleshoot it?

**Answer:** Running is the container process. Accessible means a Service has endpoints and a path from the caller. I get the endpoints for the Service and compare labels. I check the container port against the Service target port. I check NetworkPolicy. I curl from a debug pod in the same namespace. If the pod IP answers and the Service does not, the Service is the bug. If neither answers, the process is bound to localhost or the wrong port.

## 280. What happens when a Kubernetes pod gets `OOMKilled`?

**Answer:** The kernel, or kubelet, killed the container because it used more memory than its limit. The pod status shows OOMKilled and the exit code is 137. This is not a mysterious crash. The limit is the contract. I look at the memory graph. A slow climb is a leak. A spike at startup is a JVM heap that is larger than the limit, which is a configuration error. I either raise the limit to the measured need or fix the application. I set the request to the normal usage so the scheduler leaves room, and the limit a bit above the spike I am willing to pay for. A pod with no limit can instead be evicted, or it can take the node with it. OOMKilled on one container is the better failure.

## 281. How do you check pod logs and events?

**Answer:** kubectl logs shows what the process wrote to stdout and stderr. kubectl logs --previous shows the crashed instance after a restart. kubectl describe shows the Kubernetes view: events, probes, image, resources, and why the pod was scheduled or killed. I need both. Logs tell me the exception. Describe tells me ImagePullBackOff or a failed mount, which never appears in the application log because the application never started. docker logs is the same idea outside Kubernetes. I do not describe a pod and assume I have read the application. I do not read logs and miss that the probe killed it.

## 282. What is the difference between `kubectl logs` and `kubectl describe`?

**Answer:** kubectl logs is the process output, stdout and stderr, including the previous container if I pass --previous. kubectl describe is the Kubernetes object: events, probes, image, resources, node, and why the scheduler or kubelet acted. Logs answer what the application printed. Describe answers what the platform did to it. A pull error and a probe kill are in describe. An exception is in the logs. I use both, and I say which fact came from which command.

## 283. How do you troubleshoot a pod that keeps restarting?

**Answer:** A pod that keeps restarting is CrashLoopBackOff or a liveness probe, and I treat it as a pod, not as a vague Docker problem. I describe the pod for Last State, I read logs --previous, and I check whether the probe is the thing killing a process that would otherwise stay up. OOMKilled is the memory limit. A bad config is the application. I watch the restart count after the fix. If only one replica restarts and the others are fine, I look at the node it landed on before I blame the image.

## 284. What are liveness, readiness, and startup probes?

**Answer:** A startup probe gives a slow process time to boot before the other probes count. A liveness probe answers 'should this process be killed and restarted?' A readiness probe answers 'should this pod receive traffic?' Failing liveness restarts the container. Failing readiness removes the pod from the Service endpoints and leaves the process running. I use readiness for a dependency the process can recover from, such as a database connection. I use liveness for a deadlock. If I point liveness at a check that fails whenever the database is slow, I restart every pod during a database blip and make it worse. A failing readiness with a passing liveness looks like a running pod that users cannot reach. That is the probe doing its job, and I fix the check or the dependency.

## 285. What happens if a readiness probe fails?

**Answer:** A failing readiness probe takes the pod out of the Service endpoints. The process keeps running. Users stop reaching that pod, and if every pod fails readiness the Service has nowhere to send traffic and the caller sees a timeout or a 503. Kubernetes does not restart the container for readiness. That is the liveness probe. I confirm with the endpoints object and the Ready condition. The fix is the check or the dependency the check is measuring, then the pod becomes Ready and traffic returns without a restart.

## 286. How do you troubleshoot a Kubernetes Service that is not routing traffic to pods?

**Answer:** A Service with no endpoints sends traffic nowhere. I run kubectl get endpoints or the endpoint slice and compare it with the pod labels. The selector is an exact label match. A typo, or an extra label I thought was optional, means the pods run and the Service is empty. The target port has to be the port the container listens on, not the Service port I wished it used. NetworkPolicy and security groups can still block traffic after the endpoints are right. I curl the Service IP from another pod. If that fails and the pod IP works, the Service or the policy is the problem. If the pod IP fails too, the process is not listening.

## 287. How do you check whether the Service selector matches the pod labels?

**Answer:** I print the Service selector and the pod labels side by side. kubectl get svc -o yaml and kubectl get pods --show-labels. Every key in the selector must be present on the pod with the same value. Extra labels on the pod are fine. A missing or different label means the endpoints stay empty. I also check the namespaces. A Service does not select pods in another namespace. The moment the labels match, endpoints appear. I do not need to restart the pods for a selector change.

## 288. What is the difference between `ClusterIP`, `NodePort`, and `LoadBalancer`?

**Answer:** ClusterIP is an address only inside the cluster. It is the default and it is what most services should be. NodePort opens a port on every node and is useful for a lab, not as a production design. LoadBalancer asks the cloud for a load balancer and an external address. On AWS that is an NLB or an ALB depending on the annotations. I expose one entry point with a LoadBalancer or an Ingress, and I keep everything behind it on ClusterIP. Three LoadBalancers for three internal services is three public doors I did not need and three bills.

## 289. What happens if a pod is deleted? Who creates it again?

**Answer:** Nobody recreates a pod by hand in a healthy setup. The ReplicaSet owns the count. If a pod is deleted and the ReplicaSet still wants three, it creates a new one. The Deployment owns the ReplicaSet and decides when a new ReplicaSet should replace the old one for a rollout. The pod itself is the running process. I do not edit a live pod and expect the edit to last. The next recreation comes from the template on the Deployment. kubectl delete pod is a restart, not a rollback and not a configuration change.

## 290. What is the difference between a Deployment, ReplicaSet, and Pod?

**Answer:** A Pod is the running unit. A ReplicaSet keeps a number of those pods alive from a template. A Deployment owns ReplicaSets so I can roll the template forward and back. I create Deployments. The Deployment creates the ReplicaSet. The ReplicaSet creates the pods. I do not create ReplicaSets myself unless I am explaining this chain. Deleting a Deployment deletes the ReplicaSet and the pods. Deleting one pod only makes the ReplicaSet replace it.

## 291. How do you perform a rollback of a Kubernetes Deployment?

**Answer:** A Deployment remembers its revisions. kubectl rollout undo deployment/name returns to the previous revision, which is the previous pod template and therefore the previous image. I can undo to a specific revision if the previous one was also bad. kubectl rollout status waits until the new pods are Ready or until the timeout. kubectl rollout history shows me what I would be going back to. A rollout that never finishes is a readiness probe or an image pull, and undo is the right call while I find out. Undo does not undo a database migration. If the new version wrote a schema the old version cannot read, I need the migration plan, not only the rollout command.

## 292. How do you check the Deployment rollout status?

**Answer:** kubectl rollout status deployment/name waits and prints whether the new ReplicaSet is available. It returns when the rollout finishes or the timeout hits. kubectl rollout history lists revisions so I know which one is current. The events on the Deployment and the status conditions, Progressing and Available, say if it is stuck on a quota, a pull error, or a probe. I use status during the deploy. I use history when I am about to undo. A status that never completes is a failed rollout, not a slow success.

## 293. What is a ConfigMap and how is it different from a Secret?

**Answer:** A ConfigMap holds configuration that is not secret: a URL, a feature flag, a config file. A Secret holds credentials. Kubernetes only base64-encodes Secret data unless encryption at rest is on. The split is about how carefully we treat the value, not about a different way of mounting it. Both are mounted as files or as environment variables. Changing either does not restart the pod by itself. Environment variables are read at process start, so I roll the Deployment to pick them up. A mounted file can be re-read by an application that watches it, and even then the kubelet updates the file on its own timer. I do not exec in and export a new variable. The next restart would lose it.

## 294. How do you update environment variables in a running Kubernetes application?

**Answer:** I change the ConfigMap or the Secret, or the environment block on the Deployment. Pods do not see a new environment variable until they are recreated, because the process read it at start. I roll the Deployment, which creates new pods. A mounted file can update without a new pod, on the kubelet's sync period, and only if the application re-reads the file. I do not kubectl exec and export. That dies with the process. The durable place is the manifest.

## 295. What is the difference between `CMD` and `ENTRYPOINT`?

**Answer:** ENTRYPOINT is the program. CMD is the default argument to that program. docker run can replace CMD easily by adding arguments. Replacing ENTRYPOINT requires an explicit flag. If ENTRYPOINT is the binary and CMD is the default flags, the container behaves like a command. If CMD is the whole command and ENTRYPOINT is empty, arguments from docker run replace the command entirely. In shell form, as a string, Docker runs it with a shell and signals may not reach the process. In exec form, as a JSON array, the process is pid 1 and receives the signal. I use exec form. RUN is different again. RUN executes during the image build and its result is a layer. It does not run when the container starts.

## 296. What is a multi-stage Docker build and why would you use it?

**Answer:** A multi-stage build uses one stage to compile and a later stage to run. The runtime image copies only the artifact across, with COPY --from. The compiler, the package manager cache, and the source stay in the earlier stage and do not ship. I use it so the production image is small and does not contain the toolchain. The reason is both size and security: fewer packages, less to scan, no compiler in production.

## 297. How do you reduce the size of a Docker image?

**Answer:** I start from the largest layers. docker history shows which instruction added the weight. I use a smaller base, a multi-stage build, and a .dockerignore so the context is not the whole repository. I install dependencies in one layer and clean the package lists in the same RUN, because a later RUN does not shrink the previous layer. I remove build tools from the final stage. Two gigabytes is usually a base image plus a copied repository plus a compiler. The final image should contain the runtime and the artifact.

## 298. What happens when a Docker container exits?

**Answer:** When the main process exits, the container stops. Its writable layer stays until the container is removed, and docker logs can still show the output. The exit code is in the container's state. A restart policy may start a new container with a new writable layer. Volumes mounted on it remain. Anything written outside a volume and not in a layer is gone when the container is removed. Exit 0 is a finished command. A non-zero exit is a failure. A web server that exits has finished, which is the bug, because it was supposed to stay in the foreground.

## 299. How do you troubleshoot a container that is running but the application is not responding?

**Answer:** The container is running, so the process did not exit. I check the port inside the container with ss or the application's own log. I check that docker port or the published mapping matches. I curl the container IP on the container network, then the published host port. A process listening on 127.0.0.1 answers neither. A process listening on 8080 while I published 80 answers only inside the container. The logs at the moment of the failed request show whether the request arrived.

## 300. What is the difference between a Docker volume and bind mount?

**Answer:** A volume is a named piece of storage Docker manages, in its volume directory, independent of the container's life. I mount it into the container at a path. A bind mount is a host directory mapped into the container. The host path is the source of truth, which is useful in development and risky in production because the container can write anywhere I mounted. Volumes are the better default for data I want Docker to manage and back up. Neither is a backup by itself. Both disappear in the sense that a container without that mount does not see the data. An empty container filesystem is not a volume and it dies with the container.

## 301. How do you check container logs?

**Answer:** docker logs prints what the container wrote to stdout and stderr. I add --tail and --since when the output is long, and I follow with -f only while I am watching a live repro. A stopped container still has logs until it is removed. If the application wrote to a file instead of stdout, docker logs is empty and I look in the volume or I change the application. The timestamp flag helps me line the line up with a load balancer log.

## 302. What is the difference between a Docker image and container?

**Answer:** The image is the packed filesystem and the start command, built by a Dockerfile and stored in a registry. The container is what I get when I run that image: a process, a writable layer, and a network identity. I ship images. I operate containers. Many containers can come from one image. Removing the container does not remove the image from the registry.

## 303. What plugins do you use in Jenkins?

**Answer:** The plugins I actually want are the ones that match the pipeline, not a marketplace tour. Git and GitHub, or GitHub Branch Source, so the Jenkinsfile is discovered. Pipeline, so the job is code. Credentials binding, so secrets stay in the store. Docker or a cloud agent plugin, so the build has a runtime. Amazon ECR or the AWS credentials plugin only if OIDC is not available. SonarQube and a scan plugin when those gates are in the pipeline. I pin plugin versions, I install them as code, and I remove plugins nobody can name. A controller with eighty plugins from old experiments is a future upgrade failure.

## 304. Your Jenkins pipeline is failing. How will you troubleshoot it?

**Answer:** I open the stage that went red and read the first error, not the stack that follows from it. Console output is the source. I check whether the agent is the expected one and whether the workspace is clean. A failure in checkout is credentials or the branch. A failure in the shell step is the command. A failure after the build, in the deploy stage, is the cluster or the registry, and I do not rebuild while I still have the image. I keep the build number in the ticket.

## 305. What happens if a Jenkins agent goes offline during a build?

**Answer:** The build on that agent dies. The controller marks the agent offline and the stage fails or hangs until the timeout. Work that already finished on other agents stays finished. I look at why the agent left: the VM was scaled in, the process crashed, the disk filled, or the network to the controller broke. Ephemeral agents are supposed to disappear after the job, not during it. I rerun the failed stage once the agent pool is healthy. I do not share a workspace between agents and expect a half-written directory to be safe. The fix for a recurring drop is an agent that drains before shutdown, and a pipeline that can retry a stage without rebuilding the world.

## 306. How do you securely store credentials in Jenkins?

**Answer:** Jenkins stores credentials encrypted in its home, and jobs bind them by id. I use the credentials binding so the secret is an environment variable for one step and is masked in the log. Folder-scoped credentials mean the dev folder cannot read production. I do not put the secret in a job parameter, because parameters are visible. I do not echo it to debug a script. Access to the credential store is an admin-level permission and I treat it that way. A leaked Jenkins home backup is a leaked secret store.

## 307. What is the difference between a Declarative and Scripted Pipeline?

**Answer:** A declarative pipeline is the structured Jenkinsfile: pipeline, agent, stages, steps, and a post block. Jenkins checks the shape. A scripted pipeline is a Groovy program. It can do anything the controller can do, which is its power and its risk. I use declarative for the build, test, scan, push, and deploy flow because the next person can read it. I drop into a script block for the one step that declarative cannot express. I do not write a scripted novel when a declarative pipeline would do. Shared libraries hold the repeated bits so every Jenkinsfile does not copy them.

## 308. How do you implement manual approval before production deployment?

**Answer:** Before the production stage I put an input step with a named approver or a group. The build pauses, shows the digest and the change, and continues only when someone submits. A timeout fails the build if nobody approves, so a paused job does not hold an agent all weekend. The approver is not the person who pushed, when I can arrange that. In GitHub Actions the same idea is an environment protection rule. The point of the manual step is a human looking at what is about to change, not a button everyone clicks without reading.

## 309. How do you handle rollback if a production deployment fails?

**Answer:** The production job has the previous artifact id stored. On a failed health check the job runs the deploy again with that id, or it runs kubectl rollout undo and waits for rollout status. The pipeline goes red either way, so a rollback is not a green build that hid the failure. I notify the channel with the digest I returned to. A manual rollback uses the same job with a parameter, not an SSH session, so the next run still knows what production is.

## 310. How do you pass environment-specific variables in a pipeline?

**Answer:** Environment-specific values are parameters of the deploy, not a second Jenkinsfile. In Jenkins I use a folder or a job per environment, or a parameter, and credentials that are scoped to that folder. The prod job cannot see the dev secret, and the dev job cannot see the prod secret. In the Jenkinsfile I read env.ENVIRONMENT and select the cluster and the namespace. I do not store the production password as a default in the Jenkinsfile. The same idea in GitHub Actions is an environment with its own secrets and protection rules. The variable names stay the same. The values change with the environment.

## 311. What will you do if the pipeline is successful but the application is not deployed correctly?

**Answer:** The pipeline's last step was not actually a deploy, or the deploy did not wait for health. I look at what the job changed: which manifest, which image digest, which cluster. Then I look at the cluster. If the deployment still has the old digest, the job updated the wrong place or did not have permission and swallowed the error. If the new digest is there and the pods are not Ready, the rollout was not part of the job's success condition. I add kubectl rollout status, or the Helm equivalent, and I fail the build when it times out. A green pipeline and a red production means the pipeline checked the wrong thing.

## 312. How do you integrate SonarQube with Jenkins?

**Answer:** The scanner runs as a step in the pipeline, not as a job someone remembers to click. I install the SonarQube scanner plugin, store the server URL and the token as a credential, and add a stage that runs the scanner after the build and before the image is promoted. The quality gate is the point. If the gate fails, the stage fails. A report that nobody fails the build on is a PDF. The project key matches the repo. I do not use one shared token that can administer SonarQube. A token that can only analyze that project is enough.

## 313. What is an artifact repository, and why do we need JFrog/Nexus?

**Answer:** An artifact repository stores the built outputs: jars, npm packages, Helm charts, and container images. Nexus and Artifactory are the usual ones. JFrog Artifactory is the product. The build pushes once. Every later environment pulls that same artifact. I do not rebuild from source in production and hope the dependencies resolve the same way. The repository also holds the retention and the access control. Developers pull. Only the pipeline pushes to the release repo. A proxy repository caches public dependencies so the build does not depend on the public internet staying up, and so a vanished upstream version does not break next Tuesday.

## 314. A production server is showing high CPU utilization. What will you check?

**Answer:** On a production server I check who is using the CPU, for how long, and whether it matches a cron, a deploy, or a traffic shift. top, the load average, and the run queue tell me if the box is actually out of CPU or one thread is pinned. I compare with the same hour yesterday. I look at disk wait too, because a stuck process can look like high CPU in a bad summary. The action is either kill a runaway job I can name, scale, or roll back the deploy that started it.

## 315. A server's disk is 100% full. How will you troubleshoot?

**Answer:** df shows which filesystem is full. du, or ncdu if it is installed, shows which directory. I also check deleted files still held open, with lsof, because du will not see them and the space returns only when the process exits. Container logs and a core file are the usual fill. I truncate or rotate the log, I do not delete a file a running process has open and expect the space back. Then I put a rotation policy and an alert at 80 percent in place. A full disk on a database volume is restored from the backup if the database has already crashed and corrupted.

## 316. An application suddenly becomes slow in production. What will you check first?

**Answer:** Slow, with normal machines, is usually waiting. I check the error rate and the latency split before I restart anything. A recent deploy is the first suspect, and the fastest test is to compare the latency chart with the deploy marker. Then the dependency the request waits on: the database, a downstream service, or a lock. Connection pool exhaustion looks like a slow app and a bored CPU. Disk latency and a full volume do the same. I take one slow request's trace or one slow query, not a sample of everything. If the cause is load, I scale. If the cause is a bad plan in the database or a lock, scaling the app makes it worse.

## 317. How do you troubleshoot a `502`/`503` error?

**Answer:** 502 and 503 mean a proxy did not get a good answer from upstream. 502 is a bad response or a closed connection. 503 is no healthy upstream. I start at the proxy that generated the code, the load balancer or the ingress, and read which target it chose. Then I check whether any pod or instance is Ready and registered. A deployment that is not finished, a failing readiness probe, or a target group with no healthy targets produces 503 while the process might still be starting. 502 during that window often means the process crashed after accepting, or the port is wrong. I match the timestamp with the pod logs. I do not treat the proxy error as the root cause. It is the symptom of the hop behind it.

## 318. How do you troubleshoot a DNS resolution issue?

**Answer:** I ask what name failed and what answer I expected. dig against the configured resolver shows the answer and the server. If the resolver is wrong, I fix resolv.conf or the DHCP option, not the application. If the resolver returns the right address and the connection fails, it is not DNS and I stop treating it as DNS. In Kubernetes I check the pod's /etc/resolv.conf and whether CoreDNS pods are running. A name that works on my laptop and not in the pod is split DNS or a private zone the laptop does not use.

## 319. An application cannot connect to the database. What will you check?

**Answer:** I check the path from the application to the database in order. The address and port in the config are the ones for this environment. DNS resolves to the address I expect. A security group or a network policy allows the app's identity to the database port, and the database is not public just so the rule is easy. The username and password are the current ones, not a rotated secret the app has not reloaded. The database is accepting connections and has not hit its connection limit. I test from the app's network, a debug pod in the same namespace, not from my laptop. A timeout is network. An authentication error is the secret. A refused connection is the port or the listener.

## 320. Tell me about yourself.

**Answer:** I have 14+ years of IT experience and currently focus on
DevOps/platform engineering. My day-to-day work includes CI/CD,
automation, infrastructure as code, containerization, Kubernetes/AWS,
security checks and troubleshooting. I work with tools such as Git,
Jenkins/GitHub Actions, Terraform, Ansible/AWX, Docker and Kubernetes,
and I use Python/Bash where automation is more effective than manual
work. My strength is connecting development, infrastructure and
operations: I look at the complete delivery path, automate repetitive
work, troubleshoot failures systematically and improve reliability and
security.

## 321. Explain your day-to-day activities in your current project.

**Answer:** My day typically starts with reviewing planned changes,
pipeline status, incidents and priorities. I then work on CI/CD or
automation tasks, such as updating pipelines, Terraform modules, Ansible
automation or deployment configurations. For a deployment I follow the
flow from Git change through validation, security checks, artifact
creation and deployment, then verify the application with health checks,
logs and metrics. I also troubleshoot failed builds or deployments and
work with developers or cloud/platform teams when the issue crosses
boundaries. I finish by documenting important changes and identifying
opportunities to automate repetitive work.

## 322. Explain your CI/CD pipeline.

**Answer:** In my project the pipeline is the path I would draw for one service. A developer opens a pull request. GitHub or Jenkins runs tests and a scan. Merge to main builds the image and deploys it to the dev cluster. Production is a protected environment: a person approves, the same digest rolls out, and the job waits for the new pods. I mention one real gate and one real rollback I can describe. I do not list every tool. I walk the artifact from commit to pod.

## 323. What is the difference between a private subnet and a public subnet?

**Answer:** Private versus public is whether the subnet's route table sends 0.0.0.0/0 to an internet gateway. Public does. Private does not. Private may send that route to a NAT gateway instead, which allows outbound connections only. Instances in a public subnet still need a public IP to be reached. Instances in a private subnet should not have one. I use the route table as the test, not the subnet's name.

## 324. Where are public and private subnets used?

**Answer:** Public subnets hold what must be reachable from the internet: the load balancer, the NAT gateway, and a bastion only if I still have one. Private subnets hold the application instances and the Kubernetes nodes. A third, data subnet, also private and often with no NAT route, holds RDS. I do not put the database in the public subnet to make a client tool on a laptop easier.

## 325. What is Prometheus and Grafana? Why are they used?

**Answer:** Prometheus collects and stores numeric time series by pulling /metrics endpoints. Grafana queries Prometheus and draws the dashboards and the alert views. I use them together because a database of metrics without a picture is hard to operate, and a dashboard without a store has nothing to show. Prometheus is not the log store and Grafana is not the collector.

## 326. Explain Auto Scaling and its policies.

**Answer:** Auto Scaling keeps a group at a desired size and changes that size from a policy. A target-tracking policy aims at a metric, such as average CPU. A step policy adds more instances as the metric gets worse. Scheduled scaling moves the minimum before a known peak. The group launches from a template, in the subnets I give it, and it terminates the instance a scale-in protection flag does not cover. Health checks replace bad instances. I set min, max, and the metric. Without a max, a hot loop is an unbounded bill.

## 327. What is Infrastructure?

**Answer:** Infrastructure is the part of the system that is not the application code and that the application needs in order to run: networks, compute, load balancers, databases, DNS, and the cluster. In this work it is also the pipeline and the identity that deploys it. I treat it as a product with a desired state, not as a pile of machines someone built once. If it cannot be recreated from code and a backup, it is a pet. The application's job is the feature. Infrastructure's job is to make that feature run in more than one place, survive a failure, and be changeable next week.

## 328. How do you use Terraform to deploy infrastructure in your project?

**Answer:** Terraform is how the project creates the cloud, not how it ships the app. The repository has modules for the network and the cluster, and a live directory per environment. A pull request runs plan. Merging to the environment branch runs apply with a locked remote state. Variables carry the differences: size, CIDR, and whether a database is multi-AZ. The application pipeline then deploys the image into what Terraform built. I do not also click in the console. The next plan would fight the click. Secrets the stack needs come from the CI role, not from a tfvars file in git.

## 329. Explain CloudWatch, Route 53, and Load Balancer.

**Answer:** CloudWatch provides AWS monitoring through metrics, logs,
alarms, dashboards and related operational features. Route 53 is AWS DNS
and can also provide health checks and routing policies such as
weighted, latency-based and failover routing. A load balancer
distributes traffic across healthy targets; ALB works at the HTTP/HTTPS
layer and NLB at the transport layer. In a typical application, Route 53
resolves the domain, the load balancer receives the request, and
CloudWatch monitors the health and performance of the components.

## 330. What tools are you using in your project?

**Answer:** The set I would name, because it matches the work, is GitHub or Jenkins for CI, Terraform for the cloud, Docker for the image, Kubernetes on EKS for runtime, Helm or manifests for the deploy, ECR for images, RDS for the database, and Prometheus with Grafana plus a log stack for visibility. Ansible appears when machines need configuration that does not belong in the image. I do not recite every tool I have touched. I say which one does which job in this project, and I can go one level down on any of them the interviewer picks.

## 331. What is the difference between a Security Group and NACL?

**Answer:** A Security Group is a stateful firewall associated with an
ENI/resource and supports allow rules. If inbound traffic is allowed,
the corresponding response traffic is automatically allowed. A Network
ACL is associated with a subnet, is stateless and supports both allow
and deny rules; return traffic therefore needs an explicit rule. I
normally use Security Groups for workload-level access control and NACLs
for broader subnet-level guardrails. NACL rule order matters, while
Security Group rules are evaluated as a set.

## 332. Explain the Terraform state file and why it is important.

**Answer:** The state file maps a resource address in code, such as aws_db_instance.main, to the real id in the cloud. Without it Terraform cannot update that database. It would try to create a new one. State also stores attributes, including secrets, so it belongs in an encrypted remote backend with a lock, not in git. It is not a backup of the data inside the database. It is only the identity of the infrastructure. Two people writing two state files will create two copies of the world. One state per environment, locked, is the rule.

## 333. What is a Terraform backend? Why do we use it?

**Answer:** A backend is where state is stored and how it is locked. The default is a local file, which is one person. A remote backend, S3 or GCS, lets the team share one state and stops two applies at once. I enable encryption and versioning. The backend block is configured before variables exist, so the bucket name is not a variable inside the block. Changing backends is a migration I do once, with terraform init -migrate-state, and then I stop using the old copy.

## 334. Explain the basic Jenkins CI/CD workflow.

**Answer:** The basic Jenkins workflow is a Jenkinsfile on the branch. A webhook starts a build. The controller schedules an agent. The agent checks out that commit and runs the stages in order. Artifacts and test results are archived on the build. The deploy stage uses a credential from the Jenkins store and talks to the cluster. The build status goes back to the commit. Freestyle jobs click this together in the UI. The workflow I want is the file, so the steps are reviewed with the code.

## 335. What is Docker and why is it used in a DevOps environment?

**Answer:** Docker packages an application and its dependencies into an image that runs the same way on a laptop and in the cluster. The image is built once in CI and deployed by digest. That removes the 'it worked on my machine' class of failures that come from a different runtime or a missing library. It is not a security boundary by itself, and it is not a cluster. In a DevOps pipeline the image is the artifact between build and deploy. Kubernetes runs it. A registry stores it. I use it so the deploy is 'start this digest,' not 'install these packages on a server and hope they match last time.'

## 336. How do you troubleshoot a failed Jenkins pipeline?

**Answer:** A failed Jenkins pipeline gets the console of the failed stage and the agent it ran on. I check the recent changes to the Jenkinsfile and to the shared library, because a library change breaks every job that uses it. I check the agent disk and the Docker daemon if the step is a container build. I do not restart Jenkins as a diagnostic. I rerun the stage after I can say why it failed. If I cannot, the rerun is the experiment, and I watch the same line.

## 337. How do you monitor AWS resources in your project?

**Answer:** In this project AWS-side metrics are CloudWatch: ALB target health and 5xx, RDS CPU and connections, NAT bytes, and EC2 status checks. The application and the cluster are Prometheus and Grafana, because CloudWatch is a poor fit for per-pod application metrics. I still alarm in CloudWatch on the things only AWS knows, a failed status check or a storage full on RDS. Those alarms go to the same channel as the Prometheus alerts. One inbox, two sources.

## 338. What is Docker?

**Answer:** Docker is the tool that builds an image from a Dockerfile and runs a container from that image. The image is the package. The container is the running process in isolation, with its own filesystem layer and network. I use the docker CLI to build, run, and inspect. On a Kubernetes node the runtime is often containerd instead, and the image is still the same artifact. Docker the product and the image format are related and not the same word, and I keep them straight.

## 339. What is a Container Runtime?

**Answer:** A container runtime is the program that actually creates containers from images. It pulls the image, sets up the filesystem and the namespaces, and starts the process. containerd is what Kubernetes uses on current clusters. Docker Engine includes a runtime and also the docker CLI and build tools. CRI-O is another runtime some clusters use. I do not need the Docker daemon on a Kubernetes node to run containers there. The kubelet talks to containerd. When a pod is stuck in ContainerCreating, the runtime's log and crictl are where I look, not the Docker socket, unless the node really is using Docker.

## 340. What are Docker Volumes? Are they ephemeral?

**Answer:** A Docker volume is storage that outlives the container. It is not ephemeral. The container's writable layer is ephemeral. That layer goes away when the container is removed. A named volume stays until someone deletes the volume. I put database files and anything else I need after a restart on a volume. A tmpfs mount or the container layer is for scratch data. Volumes are still local to the Docker host unless I use a driver that puts them somewhere else. They are not a backup, and they are not shared across a Kubernetes cluster. In Kubernetes the equivalent idea is a PersistentVolume.

## 341. What is the difference between a Dockerfile and Docker Compose?

**Answer:** A Dockerfile builds one image. It is the instructions: base image, copy, install, command. Docker Compose runs several containers together on one machine for development: the API, the database, and the network between them, described in a compose file. Compose does not build the production topology and it does not replace a registry. I use the Dockerfile in CI to produce the image. I use Compose on a laptop so a developer can start the dependencies. Production runs the same image under Kubernetes, not under Compose.

## 342. Explain Dockerfile syntax: `RUN` vs `CMD` vs `ENTRYPOINT`.

**Answer:** RUN happens at build time and adds a layer. CMD and ENTRYPOINT happen at container start. ENTRYPOINT is the executable. CMD is the default arguments, replaced when I pass arguments to docker run. I write both as JSON arrays so a shell is not inserted as pid 1. RUN apt-get install belongs in the image. CMD that starts the server belongs at the bottom. Mixing them up, a CMD that installs packages, installs them on every start and loses them with the container.

## 343. What is a Multi-Stage Build and why would you use it?

**Answer:** Same idea, said as a Dockerfile practice. The first FROM is the builder. The second FROM is a slim runtime. I copy the binary or the built output from the builder and I set the user and the command in the runtime stage. Layer cache still works inside each stage. People skip this and ship the JDK they compiled with. The runtime stage is how I do not.

## 344. What are Distroless Docker Images?

**Answer:** A distroless image has the application and its runtime libraries, and it does not have a package manager or a shell. The attack surface is smaller and the image is smaller. The cost is that I cannot kubectl exec into a shell that is not there. I debug with a separate debug container or with logs and traces. Distroless is a good production base for a language that can run that way, such as a Go binary or a Java runtime image built for it. It is a poor choice if the application expects apt, a shell script entrypoint, or common Unix tools at startup. I do not put a shell back in 'temporarily' and ship it.

## 345. How can you change environment variables in a running container without stopping it?

**Answer:** I do not change the environment of a running process in place and call it done. The environment is applied when the process starts. docker exec export does not affect the process that is already running. The durable change is in the Deployment, the Compose file, or the service definition, followed by a restart or a rolling update. If the value is a secret, I update the secret and roll the pods. For a process that can re-read a config file, I mount the file and it can pick up a change without a new environment block. That is a property of the application, not of Docker. Anything else is a live edit that disappears on the next restart.

## 346. What is Infrastructure as Code (IaC)?

**Answer:** Infrastructure as code means the infrastructure is described in files I can review, diff, and rerun. Terraform, CloudFormation, and Kubernetes manifests are all forms of it. The benefit is that dev and prod can share the description, and a change is a pull request rather than a click. The state of the world should match the file. If it does not, I have drift. IaC is not only the tool. A Terraform file nobody plans or applies is a document. The pipeline that plans it is part of the practice.

## 347. Explain `terraform init`, `terraform plan`, `terraform apply` and `terraform destroy`.

**Answer:** init downloads providers and modules and connects the backend. It does not create a VPC. plan compares the code and the state with the live cloud and prints what would change. apply makes that change and writes the new state. destroy is an apply whose desired state is empty, so it deletes what this state owns. I run them in that order. I read the plan before apply. I do not run destroy against production because the name sounds like a cleanup of one resource. Removing one block and applying destroys that resource only.

## 348. What is the difference between `terraform validate` and `terraform fmt`?

**Answer:** terraform fmt rewrites the files to a standard layout. It does not check whether the infrastructure makes sense. terraform validate checks that the configuration is internally valid: known arguments, types that line up, references that resolve. It does not talk to the cloud and it does not compare state. A formatted, valid configuration can still destroy a database. That is what plan is for. I run fmt so reviews are about the change, and validate so a typo fails in seconds. I run plan before I trust it.

## 349. What is the significance of the Terraform State File?

**Answer:** The state file is how Terraform knows which real object belongs to which block in the code. Its significance is identity. Lose it, and the next plan wants to create a second copy of everything. It is also sensitive, because attributes such as passwords are stored in it. So it is both the memory Terraform cannot function without and a secret I have to protect. It is not a backup of customer data. It is the inventory of the infrastructure objects.

## 350. How do you troubleshoot DNS issues?

**Answer:** I run dig on the name that failed, and I note which server answered and what the status was: NXDOMAIN, SERVFAIL, or a wrong address. NXDOMAIN means the name is not there. SERVFAIL means the resolver could not complete the lookup. A correct address means I should stop looking at DNS. I check the machine's resolv.conf so I know I asked the resolver the application will ask. I flush nothing until I have seen the bad answer, or I destroy the evidence.

## 351. What is the difference between services and processes in Linux?

**Answer:** A process is a running program, with a pid, started by something. A service is how the operating system supervises that program: systemd unit, start on boot, restart when it dies, and a defined way to stop it. nginx can be a process I started by hand in a terminal. It dies when I log out. The nginx service is a unit that starts it the same way every boot and restarts it on failure. I manage services with systemctl. I inspect processes with ps. Troubleshooting often starts with 'is the service failed?' and then 'which process did it start, and what is that process doing?'

## 352. Which commands do you use to rename files, check logs, check RAM usage, check CPU usage and change file permissions?

**Answer:** Rename is mv. Logs are journalctl -u for a service, or tail on a file in /var/log when the service still writes files. Memory is free -h, and the top of ps sorted by RSS. CPU is top or mpstat, looking for the process and for steal time. Permissions are ls -l to read them and chmod to change them, with the symbolic form so I do not wipe the bits I did not mean. chown changes the owner. I check the unit file and the path before I chmod 777 a directory to make an error go away. That change is itself an incident.

## 353. What happens when you open a website? Explain the end-to-end flow.

**Answer:** The browser resolves the name. The resolver returns an address, from cache or from a recursive lookup down to the authoritative DNS. The browser opens a TCP connection to that address, usually on 443, then a TLS handshake, then it sends the HTTP request with the host header. A load balancer accepts it, picks a healthy target, and the application answers. The browser may then fetch more assets. If any step fails, the symptom is different: a DNS error, a timeout, a certificate warning, or an HTTP status. I name the step that failed before I name a fix. Caches, DNS TTL, and a CDN in front change where I am allowed to look for the fresh answer.

## 354. How do you configure WordPress?

**Answer:** From a DevOps point of view WordPress is a PHP application plus a database plus a writable uploads directory. I do not configure it by clicking a production server. The image is a known WordPress version. The database is RDS or a managed MySQL, with a secret for the password. The uploads live on a volume or on object storage, because a container filesystem will not keep them. wp-config.php comes from the environment or a mounted file, not from a copy baked into the image with the password. Updates are a new image, rolled forward, with a backup of the database taken first. A single VM with a manual install is acceptable for a demo and a poor fit for anything that has to be restored.

## 355. What is a Shebang (`#!`)?

**Answer:** The shebang is the first line of a script, #! followed by the interpreter, such as #!/usr/bin/env bash. The kernel reads it when I execute the file and runs that interpreter with the script as the argument. Without it, executing the file depends on whatever shell I happen to be in. I use /usr/bin/env bash so I am not tied to one absolute path, and I still require bash when the script uses bash features. The file also needs the executable bit. The shebang is not a comment that bash ignores when the kernel has already used it. It is how the script chooses its own interpreter.

## 356. Explain file permissions, Sticky Bit, SUID and different ways to modify permissions.

**Answer:** Each file has an owner, a group, and mode bits for user, group, and others: read, write, execute. chmod 640 means the owner can read and write, the group can read, and everyone else cannot. The symbolic form, u+x, changes one bit. SUID on an executable runs it as the owner, which is how passwd works and how a careless SUID binary becomes a privilege escalation. SGID on a directory makes new files inherit the directory's group. The sticky bit on a directory, the t on /tmp, means users can delete only their own files even if the directory is world-writable. I check with ls -l and namei. I do not use 777. I set the owner to the account the service runs as, and I keep secrets at 600.

## 357. How do you make a service start automatically after a reboot?

**Answer:** On systemd I enable the unit: systemctl enable name. That links it into the boot target. enable does not start it now. start does. enable --now does both. I check with systemctl is-enabled and is-active. A Docker container with a restart policy of always comes back when the daemon starts, and the daemon itself must be enabled. In Kubernetes a Deployment does not need a boot script. The control plane recreates the pods when the node returns, as long as the node joins the cluster. A crontab with @reboot is a last resort I would rather replace with a unit.

## 358. How do you troubleshoot SSH issues?

**Answer:** SSH failures are a sequence. I read the client message. Permission denied is the key or the user. Connection refused is nothing listening, or a firewall. Connection timed out is a route or a security group dropping packets. I check that I am using the key the server has in authorized_keys, that the file permissions on .ssh are tight enough for sshd to accept them, and that the username exists. On AWS I prefer SSM so I am not debugging port 22 on a public address. If I must, the security group allows 22 only from the jump host, and the instance profile is not the fix for a bad key. The server log, /var/log/secure or journalctl -u ssh, tells me whether the packet arrived.

## 359. GitHub Actions vs Jenkins --- when would you choose each and why?

**Answer:** I choose GitHub Actions when the code is on GitHub and the workflow can live in the repository next to it. Hosted runners, pull request checks, and OIDC into the cloud are the reasons. I choose Jenkins when the organization already runs it, when the build must sit on a private network next to systems GitHub's runners cannot reach, or when the pipeline is a large existing Groovy estate. Jenkins is mine to patch, to back up, and to give agents to. Actions is GitHub's to run, with the limit that a self-hosted runner is still mine. I do not run both for the same service without a reason. One system should be the one that is allowed to deploy to production.

## 360. Explain the stages of a CI/CD pipeline.

**Answer:** The stages I name are checkout, build, test, security scan, package or image, publish, deploy, and verify. Verify is the smoke check or the rollout status, and it is a stage, not an afterthought. Publish and deploy are separate so I can promote the same artifact. A failure in test never reaches publish. I draw them in a line and I say which ones run on a pull request and which ones run only on main.

## 361. What is Kubernetes? Explain its basic working.

**Answer:** Kubernetes runs containers across a set of machines and keeps them matching a declared state. I apply a Deployment that says I want three replicas of an image. The control plane stores that in etcd. The scheduler places pods on nodes. The kubelet on the node starts the containers. If a pod dies, a controller creates another. A Service gives the pods a stable address. I do not SSH to a node to start the process. I change the manifest and the cluster converges. The hard parts are the things the manifest forgets: requests and limits, probes, and a way for traffic to get in.

## 362. What is Argo CD?

**Answer:** Argo CD is a GitOps controller. It watches a Git repository and a cluster, and it applies what Git says. If someone changes the cluster by hand, Argo marks the application out of sync and can change it back. The App of Apps pattern is one parent application whose job is to create the child applications. I point the parent at a directory of application manifests, one per service or per environment. Adding a service is a pull request that adds a child, not a click in the Argo UI. The parent should be the only thing I create by hand. Sync waves and health checks stop a child from going green before its namespace and its secrets exist.

## 363. What is the App of Apps concept in Argo CD?

**Answer:** App of Apps means one Argo CD Application whose Git directory contains the manifests of other Applications. I create the parent once. The parent syncs, and the children appear, one per service or per environment. Adding a service is a commit that adds a child manifest, which the parent then applies. I use sync waves so a namespace exists before the application that needs it. The parent is the index. The children are the deploys. I do not click each new application into the UI.

## 364. How would you troubleshoot high CPU usage on a production Linux server?

**Answer:** On Linux I use top or pidstat to name the process, then I decide. One hot process gets a profile or a look at what it is doing in strace only if I can afford it. Load average far above the CPU count means a queue. I check iowait. High iowait with low user CPU is a disk problem wearing a CPU costume. I check whether this is a cron at this minute. I capture the top output into the ticket before I restart the service, so I still know which process it was.

## 365. How would you identify memory leaks and OOM kills?

**Answer:** A memory leak is a process whose resident memory climbs without a matching climb in traffic, until the OOM killer logs a victim in dmesg or the container status is OOMKilled. I chart RSS over hours. A spike at startup that stays flat is not a leak. A line that never comes down is. I capture a heap profile if the runtime allows it. The Kubernetes signal is the same chart against the limit. I fix the allocator or I bound the cache. Raising the limit forever is how the node becomes the thing that dies.

## 366. How would you debug intermittent network connectivity from Linux?

**Answer:** Intermittent connectivity is loss, not a permanent bad route. I run mtr or a long ping and look at where the loss starts. I check the interface counters for errors and drops. I look for a flap in the link or in the route, and for a conntrack table that is full if this is a NAT host. A packet capture for a minute during the symptom beats an hour of theory. If the loss is only to one destination, the fault is on that path. If it is to everything, the fault is local or the default gateway.

## 367. Write a Bash approach to monitor disk usage and alert on thresholds.

**Answer:** A short script reads df -P, skips tmpfs, and compares the use percentage with a threshold I pass in. Above the threshold it prints the mount and exits 1. Cron or systemd runs it every few minutes. The monitoring agent alerts on a non-zero exit, or the script posts to the chat webhook. I use set -euo pipefail. I do not alert on a single spike of a tiny volume. The check is the same one I can run by hand, so the page and the shell agree.

## 368. How would you safely manage processes, signals and graceful shutdowns?

**Answer:** A process should stop on SIGTERM, finish the request it has, and exit. SIGKILL cannot be caught and is what happens when the grace period ends. In practice I trap TERM in a shell script only if the script is pid 1, and I prefer the application to be pid 1 in exec form so the signal is not eaten by a shell. Docker stop and a Kubernetes termination send TERM, wait terminationGracePeriodSeconds, then KILL. I set that period longer than the application's real shutdown. PreStop can deregister the pod from the load balancer before TERM arrives, so in-flight requests are not cut. I test this by deleting a pod during a request, not by assuming the trap works.

## 369. How would you troubleshoot DNS, ports and connection failures?

**Answer:** I take them in order. DNS: dig the name. Port: ss on the server to see the listener, and nc or curl from the client to that address and port. A timeout is a filter or a route. A refusal is a reachable host with nothing on that port. I do not change security groups until I know which of those I saw. The fix follows the symptom. Adding a DNS record does not open a closed port.

## 370. How would you automate log analysis using Bash and standard Unix tools?

**Answer:** When the log stack is down or I am in a hurry, I use the files on the host. grep for the error code, awk to pull the field, sort and uniq -c to count, tail to watch. For a request id I grep that id across the service log. I wrap the one-liner I keep repeating into a script in git with a usage line. I do not build a second logging product in bash. The script is for the hour the indexer is late. The durable analysis stays in the log platform.

## 371. How would you reduce Docker image size and build time?

**Answer:** Size and build time are related but not the same fix. Size is multi-stage, a small base, and a dockerignore. Build time is layer order: copy the dependency manifest, install, then copy the source, so a code change does not reinstall dependencies. I also use the registry cache or BuildKit cache in CI so yesterday's layers are reused. Forty services should build in parallel only after each Dockerfile is cache-friendly. I measure with the build log's cache hits, not with a feeling that the pipeline is slow.

## 372. How would you troubleshoot a container that repeatedly restarts?

**Answer:** For a plain Docker container I use docker inspect for the exit code and the restart count, and docker logs for the output. A restart policy of always will keep starting a container whose command exits. I run it once in the foreground, without the restart policy, so I can see the error. The cause is the same set: the process exited, the OOM killer, or a missing file. Kubernetes adds probes on top. Docker on a VM does not. I do not docker rm in a loop and call that troubleshooting.

## 373. Explain container networking and DNS troubleshooting.

**Answer:** A container has its own network namespace and an address on a bridge or an overlay. Docker's embedded DNS answers service names on a user-defined network. Publishing a port maps a host port to a container port. In Kubernetes, every pod has an IP, CoreDNS answers Service names, and kube-proxy or the CNI sends the Service IP to a pod IP. When DNS fails I check the resolver the container is using and the CoreDNS pods. When DNS works and the port does not, I check the listener and the policy. I say which layer failed.

## 374. How would you securely manage secrets in containerized workloads?

**Answer:** The workload gets a secret at runtime from the platform, not from the image. On Kubernetes that is a volume projected from a Secret that an external-secrets controller filled from the cloud secret manager, or a CSI driver that mounts the secret without putting it in etcd in the clear. The file is readable by the process user only. The service account can read that one secret. Logs and crash dumps are checked so they do not print it. A different environment is a different secret. I rotate by writing a new version and rolling the pods.

## 375. How would you investigate container CPU and memory throttling?

**Answer:** Throttling means the container wanted more CPU than its limit, or more memory and got killed. CPU throttling shows up in the container CPU stats as periods throttled, and the symptom is latency while the node still looks idle. The limit is too low for the traffic, or there is no limit and the node is oversubscribed. I compare usage with the limit over the incident window. Memory pressure is the OOMKilled status and a climbing RSS. I set requests to typical use so the scheduler packs the node honestly, and limits to the ceiling I have tested. Raising a limit without looking at the node just moves the argument. If every pod is throttled at once, the node is too small or too full.

## 376. How would you scan images and prevent vulnerable builds?

**Answer:** The scan runs in the pipeline after the build and before the push to the production registry. Trivy or an equivalent scans the image for known vulnerabilities in OS packages and libraries. A critical finding with a fix available fails the job. I do not fail the job on a finding I have written down as accepted, with a reason and an expiry. The base image is a specific tag I update on purpose, not latest. The same scan runs on a schedule against what is already running, because a CVE published on Tuesday applies to the image I built last month. Blocking the build and never looking at the running cluster is half a control.

## 377. How would you troubleshoot a Pod stuck in `CrashLoopBackOff`?

**Answer:** I treat CrashLoopBackOff as a stable fact with a previous container to inspect. describe for why it died, logs --previous for what it said, and the probe configuration if the exit looks clean but the restarts continue. I compare the image digest with the one that last ran healthy. If they differ, the new image is the prime suspect. If they do not, something in the environment or the node changed. I do not raise the restart backoff. That only slows the evidence.

## 378. How would you debug Pending Pods caused by scheduling constraints?

**Answer:** Scheduling constraints are affinity, taints, topology spread, and resource requests. I read the scheduler event. It usually names the predicate that failed. I list nodes with the labels and the taints and see whether any node was eligible. A pod that asks for more memory than any node will Pending forever, and the autoscaler cannot invent a bigger instance type than the group allows. Topology spread that is impossible at the current replica count does the same. I relax the constraint or I change the node group. I can point at the one predicate.

## 379. How would you troubleshoot Service-to-Pod connectivity?

**Answer:** I test from the inside outward. A debug pod curls the application pod IP and port. Then it curls the Service name. If the pod IP fails, the process or the port is wrong. If the pod IP works and the Service fails, I check endpoints and the selector, then NetworkPolicy. If both work from inside the cluster and users still fail, the break is the ingress or the load balancer, which is outside this hop. I name the first hop that failed.

## 380. How would you diagnose failing readiness and liveness probes?

**Answer:** I describe the pod and read the probe events, which say the URL, the timeout, and the last message. A readiness failure leaves the pod Running and not Ready, and the Service endpoints drop it. A liveness failure shows a kill and a rising restart count. I curl the probe path from inside the pod. If the path is wrong, the application is fine and the probe is not. If the path hangs, the application is stuck and the probe is right. I check the timing. A period of one second and a failure threshold of one will flap a healthy app.

## 381. How would you perform a zero-downtime rolling deployment?

**Answer:** I set the Deployment strategy to RollingUpdate with maxSurge at least 1 and maxUnavailable 0, so a new pod is Ready before an old one is removed. The readiness probe is true only when the app can serve. I watch kubectl rollout status. If the new pods never Ready, the rollout stops and the old pods keep serving, which is the point of maxUnavailable 0. I send a steady request through the service during the roll and expect no errors. That is the zero-downtime check.

## 382. When would you use blue-green versus canary deployment?

**Answer:** I use canary when I want a small share of real traffic on the new version and I can measure the error rate of that share. I use blue-green when I want a single switch and an instant return to the old stack, and I can pay for two copies. Canary is the better default for a user-facing service with a good metric. Blue-green is the better default when partial traffic is hard, such as a consumer that must not split a queue across incompatible versions. If the schema migration cannot run with both versions, neither strategy is safe yet.

## 383. How would you manage Helm releases across environments?

**Answer:** One chart, many values files. The chart templates the Deployment, Service, and probes. values-dev.yaml and values-prod.yaml carry the replica count, the host name, and the size. The image digest is set at deploy time and is not a default in the chart. Helm releases have a name and a namespace per environment, so dev and prod are not the same release. I pin the chart version. A change to the chart is reviewed and installed in dev first. helm history and helm rollback exist for the chart contents. The image rollback can be a helm upgrade to the previous digest. Secrets stay out of the values file in git. An external secret or a sealed secret supplies them.

## 384. How would you troubleshoot node pressure and evictions?

**Answer:** Node pressure shows up as a condition on the node and as eviction events. I see which resource: memory, disk, or inodes. Disk is usually container logs. Memory is a pod without a limit. I describe the node, I look at allocated versus capacity, and I identify the pod that was evicted and its QoS class. BestEffort goes first. I set requests and limits, I cap log size, and I cordon the node if it is flapping. The eviction is kubelet protecting the node. Preventing the next one is fixing the pressure, not disabling eviction.

## 385. How would you design HA Kubernetes workloads across zones?

**Answer:** High availability across zones means no single zone holds the only copy of the service. The nodes spread across at least two zones. The Deployment has more than one replica, and topology spread or pod anti-affinity keeps those replicas off the same node and, where the scale allows, in different zones. A PodDisruptionBudget stops a drain from taking the last replicas. The load balancer has targets in each zone. The database is multi-AZ so the data plane matches the app. A zone failure should look like a capacity drop and a few restarts, not an outage. I test that by cordoning one zone's nodes, not by drawing it on a slide.

## 386. How would you debug a failing Jenkins pipeline?

**Answer:** I reproduce the failure on a branch if I can, with the same agent label. I add a line that prints the tool versions at the start of the job so the next failure has them in the log. I check the replay or the pipeline steps view to see which stage never ran. If the Jenkinsfile itself does not parse, the failure is before any stage and the error is a syntax or a shared-library problem. I fix that before I look at the application.

## 387. How would you design GitHub Actions workflows for multiple environments?

**Answer:** Each environment is a GitHub environment with its own secrets, its own variables, and its own protection rule. The workflow is one file. Pull requests run test and scan with contents: read. The deploy job uses the dev environment on main and the production environment only on a release or after approval. OIDC assumes a different cloud role per environment, so a dev run cannot touch prod even if the job is wrong. I pin actions by SHA. The image digest is passed between jobs as an output. I do not duplicate the workflow into deploy-dev.yml and deploy-prod.yml that drift apart.

## 388. How would you handle failed GitLab CI deployments and rollbacks?

**Answer:** A failed GitLab deploy is the same investigation as any other pipeline, with GitLab's environment and job log as the record. I open the failed job, read the first error, and see whether the cluster rejected the manifest, the image pull failed, or the rollout timed out. The environment page shows what was last deployed. Retrying the job is valid after a runner blip and useless after a bad manifest. Rollback is the previous pipeline's deploy job, or a revert of the commit that changed the manifest, followed by a pipeline. I protect the production environment so a failed experiment on a branch cannot reach it. The main branch, reviewed, is the only source of a production job.

## 389. How would you secure CI/CD credentials and secrets?

**Answer:** Credentials in CI are scoped and short-lived. The job that builds cannot deploy to production. The job that deploys assumes a cloud role with OIDC for the length of the job. Repository secrets are not printed in the logs, and the step that uses them is marked not to echo the command. Fork pull requests do not receive secrets. I rotate a secret by adding the new value, deploying, and then revoking the old one. A static cloud key in a Jenkins credential that everyone can bind to their job is the thing I replace first.

## 390. How would you add automated security and quality gates?

**Answer:** A gate fails the pipeline. A report does not. I put secret scanning and dependency review on the pull request, unit tests and SAST before the image is pushed, and a container scan before deploy. The rule is explicit: a critical finding with an available fix fails the job. A waiver is a recorded exception with an expiry, not a commented-out step. Production has an approval gate on top of the automatic ones. I can point at a run that went red because of a gate and say that was the point.

## 391. How would you design approval, promotion and rollback strategies?

**Answer:** Promotion means the artifact that passed dev is the artifact that reaches prod. I do not rebuild. An approval gate, a GitHub environment reviewer or a Jenkins input, sits in front of production. The approver sees the digest and the change. After approval the deploy waits for health. If health fails, the pipeline rolls back to the previous digest automatically or it stops and leaves the previous version serving. The approval is recorded. A second pipeline that 'just deploys latest' bypasses all of this, so that pipeline does not exist. Hotfix uses the same gate with a faster reviewer, not a laptop.

## 392. How would you troubleshoot an AWS/Azure/GCP production outage?

**Answer:** I find the blast radius before I change things. One service, one zone, or the whole account? The status page of the cloud, the recent deploys, and the error rate tell me which. If a zone is unhealthy, traffic should already be on the other zone. If a deploy matches the start, I roll back. If an AWS or GCP incident matches the symptom, I fail over only if my design actually has a second region. I communicate a short status while I look. I do not restart every component. After recovery I write down the trigger, the customer impact, and the one control that would have made it smaller. An outage without that note will be repeated.

## 393. How would you design HA load balancing across availability zones?

**Answer:** A load balancer in front of targets in more than one zone is the pattern. On AWS the ALB or NLB spans the subnets I give it, one subnet per zone. Targets register in each zone and only healthy ones receive traffic. Cross-zone load balancing sends traffic to targets in other zones so one large zone does not sit idle. On GCP the external application load balancer is global and the backends are regional groups. The health check is the real design. A check that always passes will keep sending users to a dead zone. I watch the healthy host count per zone. Losing a zone should drop that count and not drop the site.

## 394. How would you configure auto scaling for unpredictable traffic?

**Answer:** Unpredictable traffic wants a signal that moves with users and a headroom setting, not a schedule. I scale on request count per target or on CPU, with a short scale-out and a longer scale-in so I add capacity quickly and remove it slowly. On Kubernetes the Horizontal Pod Autoscaler does the pod count and the cluster autoscaler adds nodes when pods Pending. I set a maximum I can afford and an alarm when I am near it. A sudden flood that looks like traffic and is actually a retry storm needs a circuit breaker, not another ten nodes.

## 395. How would you troubleshoot EKS, AKS or GKE networking?

**Answer:** Managed Kubernetes networking fails at the joins between the cloud and the cluster. I check, in order, whether the pod has an IP, whether CoreDNS resolves the Service, whether a NetworkPolicy drops the flow, and whether the cloud security group or route allows it. On EKS the VPC CNI, the subnet free IPs, and the node security group are the usual cloud-side causes. On GKE I look at the VPC-native ranges and firewall rules, including the health-check ranges. On AKS I look at the Azure network policy and the attached NSG. A pod that can curl its own port and cannot curl a Service in another namespace is policy or DNS. A pod with no IP is the CNI or an exhausted range. I do not delete the CNI plugin as a first step.

## 396. How would you design disaster recovery with defined RPO/RTO?

**Answer:** Disaster recovery starts from two numbers. RPO is how much data I can lose. RTO is how long I can be down. A backup every night is an RPO of a day, whatever the slide says. I pick a pattern that meets the numbers: backups and a restore drill for a modest RTO, a warm standby for a short one, or a second region that is already serving if the business cannot wait. The database backup, the Terraform, and the image digests are all required. Restoring the database into an account I cannot rebuild from code is not a plan. I run the restore on a schedule. A backup I have not restored is a rumor. DNS or the load balancer is how I cut over, and I have timed that cutover.

## 397. How would you investigate sudden cloud cost increases?

**Answer:** I start with the bill broken down by service, compared with last week, not with a hunch. The usual jumps are NAT gateway bytes, a log index with no retention, an idle load balancer, a database that grew, or a scale-out that never scaled in. I tie the start of the increase to a deploy or a traffic change. Then I pick the largest line that is not earning its keep. Rightsizing, a lifecycle policy, a budget alert, and deleting unattached volumes are the boring wins. I do not turn off production redundancy to save the NAT line. I also check that a bug is not looping a Lambda or a pipeline. Cost anomalies are sometimes incidents.

## 398. How would you resolve Terraform state locking issues?

**Answer:** I read the lock error. It contains a lock id and who holds it. If that process is still running, I wait. If it is dead, I run terraform force-unlock with that id. Then I plan before I apply, because the crashed apply may have changed some resources. If state looks corrupted, I restore the previous version from the bucket's version history and plan again. I do not copy a local state over the remote one to clear the error.

## 399. How would you safely manage remote state across teams?

**Answer:** Across teams, each team has a state key for its stack, and a role that can write only that key. The network team does not apply the application state. Shared values are outputs read through a remote state data source or, better, through a small published contract such as an SSM parameter the network stack writes. Nobody uses a shared workspace name as the access control. The backend bucket policy is the access control. I can show which role can write prod.

## 400. How would you handle Terraform drift in production?

**Answer:** In production, drift handling is a reviewed plan, not a surprise apply. CI runs plan on a schedule and posts the diff. If the diff is a console change I do not want, I apply it in a window and the code wins. If the console change was an incident fix, I copy it into code first so the plan is empty. I never ignore_changes on a security group to silence the noise. Replacement of a database shows up as forces replacement and I stop. Drift that is an in-place tag change can go through the normal pipeline.

## 401. How would you structure reusable Terraform modules and environments?

**Answer:** I split the repository into modules and live environments. modules/vpc and modules/app hold the resources. live/dev and live/prod each have a backend key, a tfvars file, and a main.tf that calls the modules with versions pinned. The environment directory is boring on purpose. A change to a module is a version bump in dev, a plan, an apply, then the same bump in prod. I do not point prod at a module path on someone's branch.

## 402. When would you use Terraform versus Ansible?

**Answer:** Terraform creates and changes infrastructure through an API: networks, clusters, buckets, databases. Ansible configures machines over SSH: packages, files, and services. I use Terraform for what the cloud API owns, and Ansible for what is inside a VM when an image bake is not enough. I do not use Terraform remote-exec as a configuration management tool. I do not use Ansible to create a VPC if Terraform is already the source of truth for the account. They meet at the boundary. Terraform outputs the inventory or the addresses. Ansible consumes them. One resource is owned by one tool.

## 403. How do you troubleshoot high CPU or memory usage on a Linux server?

**Answer:** I split the question. CPU is top and the process. Memory is free, and dmesg for OOM kills, and the process RSS. They are different shortages. A box can be fine on CPU and swapping itself to death. I look at both, I name the process responsible, and I check the cgroup limits if it is a container. The response is either a limit that matches the need, a fix for a leak, or a bigger machine. I do not resize first and lose the process list.

## 404. A server is reachable but the application isn't. What do you check?

**Answer:** I can reach the server and the application does not answer. From the server I curl the application port on localhost. If that fails, the process is down, bound to the wrong address, or listening on the wrong port, and ss will show it. If localhost works, the path from outside is the firewall, the security group, or the load balancer health check. I compare the port I curled with the port the balancer uses. They are often not the same.

## 405. How do you troubleshoot disk and network issues?

**Answer:** Disk and network are two checks. For disk, df and the inode count, because a disk can have free bytes and no free inodes. For network, I confirm the address with ip, the route with ip route, and the listener with ss. Then I ping or curl the next hop. A full disk does not explain a timeout, and a bad route does not explain a full disk. I say which one I found. If both are wrong, the disk filled with logs because the network errors were loud, and the network is still the first fault.

## 406. A pipeline succeeds but deployment fails. What could be the reasons and how would you troubleshoot it?

**Answer:** The build produced an artifact and the deploy step could not make it run. I separate those. The image exists in the registry. The failure is apply, pull, or health. A wrong kubecontext deploys to the wrong cluster or fails to auth. A manifest error fails before pods exist. ImagePullBackOff means the node cannot pull, which is ECR permission or the wrong region. A rollout timeout means pods exist and are not Ready. I read the deploy log for the first kubectl error, then I look at the cluster. I do not rerun the whole build until the deploy itself succeeds against the image I already have.

## 407. How do you implement zero-downtime deployment?

**Answer:** Zero-downtime means new instances are serving before old ones stop. I run more than one replica, I surge one extra during the rollout, and I mark a pod not Ready until it can answer. The load balancer only sends traffic to Ready pods. I drain connections on shutdown with a preStop sleep or a deregistration delay so in-flight requests finish. The pipeline waits for the rollout. I verify by watching successful requests through the cutover, not by seeing the command succeed.

## 408. What is the difference between Blue-Green and Canary deployment?

**Answer:** Blue-green is two full environments and a switch of traffic from one to the other. Canary is one environment where a fraction of traffic goes to the new revision and the fraction grows. Rollback of blue-green is switching back. Rollback of canary is setting the fraction to zero. Blue-green costs more capacity during the release. Canary costs more observability, because I have to see the fraction separately. I do not call a rolling update a canary. A rolling update replaces pods without a deliberate traffic percentage.

## 409. How do you safely roll back a failed release?

**Answer:** I identify which layer failed. Application: roll back the digest and wait until the old pods are Ready and the error rate drops. Migration: follow the down migration only if I rehearsed it, otherwise restore the snapshot taken before the release. Infrastructure: do not destroy the stack. Fix forward or restore state and the data from the backup I took before apply. I declare the rollback done when the user-facing check passes, not when the command exits.

## 410. A container works locally but fails in production. Why might this happen?

**Answer:** Production is a different image configuration, a different set of environment variables, and a different network. Locally the app reads a dotfile and talks to localhost. In production those are absent, the port is the one Kubernetes set, and DNS for the database is a private name. I run the production image with the production environment locally. If it fails, I have the bug. If it runs, the difference is the cluster: secrets, IAM, network policy, or a read-only filesystem. I also check architecture. A laptop on ARM and a node on AMD64 will run an image that was never built for the node.

## 411. How do you troubleshoot `CrashLoopBackOff`?

**Answer:** Same first steps every time: status, last exit code, previous logs, events. I say them in that order in an interview so it is a method and not a pile of commands. Then I name the cause I found and the change that stops the restart. A crash loop I 'fixed' by deleting the pod is not fixed.

## 412. Pods are `Running` but users receive 5xx errors. What do you check?

**Answer:** 5xx from users is the load balancer's count first, so I know the errors are real and which code. 502 and 503 are the proxy. 500 is the application. I split the chart by the new pods versus the old pods. If only the new revision returns 500, I roll back. If all pods return 500, the dependency they share is down, usually the database. I take one request id from the access log and find that line in the application log.

## 413. How do you handle a Kubernetes node that is `NotReady`?

**Answer:** A NotReady node is a node the cluster will not schedule on, and existing pods may be evicted. I describe the node and read the conditions: MemoryPressure, DiskPressure, PIDPressure, or Ready false because the kubelet stopped posting. If the kubelet is dead, the node console or SSM shows why. If the pressure is disk or memory, I free it or I drain and replace the node. I cordon a flapping node so nothing new lands on it. The node group should replace a node that does not recover. I do not delete the node object and hope. I find out whether the instance is still alive in the cloud. A dead instance is an autoscaler problem. A live instance with a dead kubelet is an OS or configuration problem.

## 414. Terraform shows no drift but infrastructure was changed manually. What would you do next?

**Answer:** If the plan is empty after a manual change, Terraform is not looking at the attribute that changed. ignore_changes is the usual reason. A lifecycle block is telling Terraform to leave that field alone, so the plan looks clean while the console is different. I read the resource for ignore_changes. I also confirm I planned the state that owns the resource. A plan against the wrong backend is an empty story about a different world. The fix is to drop the ignore or to put the manual change into code and then refresh. An empty plan is not proof that the cloud matches the repository.

## 415. How do you manage Terraform state safely?

**Answer:** Safely means remote, encrypted, versioned, and locked, with one state per environment. Production apply runs in CI as a role that can touch that state and that account. I review the plan. I do not pass -auto-approve from a laptop. I keep the state out of git. If I need to move a resource, I use a moved block so the change is reviewed. That is the whole practice.

## 416. An EC2 instance is healthy but the application is unreachable. How do you troubleshoot it?

**Answer:** Healthy in EC2 means the status checks pass. Unreachable for the application is the path after that. I check the load balancer targets, the security group on the instance, and the port the process is listening on. A security group that allows 22 and not the application port is a classic. I also check that I am using the private address from inside the VPC and the load balancer from outside, not the instance's public IP if it has none. SSM can get me on the box to curl localhost. If localhost works and the load balancer does not, the instance is fine and the path is not.

## 417. How do you design highly available infrastructure?

**Answer:** Highly available infrastructure removes single points I can name. Two zones, a load balancer with health checks, more than one replica, and a database that fails over. Stateless tiers are replaced automatically. Stateful tiers are replicated and backed up. The design is not highly available if the only DNS record points at one instance's public IP. I also keep the pipeline and the state backend available, because an infrastructure I cannot change during an incident is only half up.

## 418. CPU and memory are normal, but latency increased 10x. What do you check?

**Answer:** Normal CPU and memory with a tenfold latency increase means the time is spent waiting. I look at the latency histogram by endpoint, then at the downstream: database query time, a lock, a connection pool with no idle connections, or DNS. A trace of one slow request shows the span that grew. A thread dump shows threads blocked on a call. I check whether a dependency's latency rose at the same minute. Scaling the application when every thread is waiting on the database adds waiters. I fix the wait or the pool.

## 419. Thousands of alerts fire at once. How do you find the real problem?

**Answer:** A flood of alerts is one cause with many symptoms. I sort by what started first, not by what is loudest. I look for the shared dependency: DNS, the database, a node failure, or a deploy that touched every service. I silence the downstream alerts once I can name the upstream one, so the channel is readable. Afterward I delete the alerts that fired and did not change anyone's actions. Those are the ones that will bury the next real page.

## 420. Logs look normal but users are reporting failures. What do you investigate next?

**Answer:** Users failing while logs look clean usually means I am not logging the failure, or I am looking at the wrong place. I reproduce one failing request and capture its id. If the request never reaches the pod, the log will be quiet and the load balancer log will not. If it reaches the pod and the app logs only successes, I add the error path or I look at the access log rather than the application log. Metrics help: a rising 4xx or 5xx with flat application errors means the failure is at the proxy, the TLS edge, or a client timeout. I also check whether I am searching the wrong namespace, the wrong cluster, or a delayed index. 'No errors in the log' is not the same as 'no errors.'

## 421. How do you perform Root Cause Analysis (RCA)?

**Answer:** I start with facts: impact, timeline, symptoms and what
changed before the incident. I build a timeline from monitoring, logs,
deployment history and system evidence, then use techniques such as the
five whys or fault-tree reasoning to identify the underlying cause
rather than the first symptom. The RCA should include contributing
factors, detection gaps, why existing controls did not prevent the
issue, and concrete corrective/preventive actions with owners. I keep
blame out of the RCA and focus on improving the system.

## 422. How would you design a highly available CI/CD platform?

**Answer:** A highly available CI system does not mean one big Jenkins with a RAID disk. The controller's home is backed up. Agents are ephemeral and replaceable, in more than one zone. The artifact registry is the system of record for what was built, so a lost agent does not lose the release. Secrets live in a store with its own availability, not only on the controller. Two runners can pick up jobs. Production deploys are gated so a controller outage stops new deploys and does not take down the running application.

## 423. How would you handle disaster recovery?

**Answer:** I decide how much data I can lose and how long I can be down, then I pick the cheapest design that meets those two numbers. For most systems that is a tested database restore plus infrastructure I can reapply from Terraform, and a DNS or load balancer cutover I have timed. I write down who declares the disaster and who runs the restore. I run the drill. A document that has never been used is not disaster recovery. If the business needs a few minutes, the drill has to show a standby that is already warm, not a backup I start downloading when the region is gone.

## 424. How would you design centralized monitoring and logging?

**Answer:** One pipeline for telemetry. Applications emit structured logs to stdout, metrics on /metrics, and traces through OpenTelemetry. Agents on each node collect logs and host metrics. A central store holds each signal: metrics in Prometheus, logs in OpenSearch, traces in Tempo. Grafana is the front door and the place alerts are defined. Retention and access are set per environment. I design the labels first, service and environment, so a team can find its own traffic without a second stack.

## 425. Tell me about yourself.

**Answer:** I am a DevOps engineer. I have spent the recent years of a long infrastructure career on the path from commit to production: Git, Jenkins and GitHub Actions, Terraform, AWS, Docker, and Kubernetes. I care that a change is reviewed, that the pipeline can deploy it again tomorrow, and that we can see it and undo it. A typical piece of work for me is taking a manual step, an instance build or a deploy, and turning it into code with a health check and a rollback. I work with development teams rather than throwing a platform over the wall. If something fails, I want the runbook and the dashboard to be enough for the next person, not a private memory of the last incident.

## 426. Explain your day-to-day activities in your current project.

**Answer:** A normal day is a mix of changes and follow-up. I review pull requests for the pipeline and for Terraform, I watch the deploy of anything going to production, and I look at the alerts that fired overnight to see which ones are real. I pair with a developer when a service needs a probe, a resource limit, or a secret moved out of the repo. I do not spend the day SSH-ing into servers. If a task is manual and it will happen again, I put it in the pipeline or in Ansible before I call the day done. Incidents take over the plan when they happen, and the note afterwards is part of the work, not an extra.

## 427. Explain your CI/CD pipeline.

**Answer:** In my project the pipeline is the path I would draw for one service. A developer opens a pull request. GitHub or Jenkins runs tests and a scan. Merge to main builds the image and deploys it to the dev cluster. Production is a protected environment: a person approves, the same digest rolls out, and the job waits for the new pods. I mention one real gate and one real rollback I can describe. I do not list every tool. I walk the artifact from commit to pod.

## 428. What is the difference between a private subnet and a public subnet?

**Answer:** Private versus public is whether the subnet's route table sends 0.0.0.0/0 to an internet gateway. Public does. Private does not. Private may send that route to a NAT gateway instead, which allows outbound connections only. Instances in a public subnet still need a public IP to be reached. Instances in a private subnet should not have one. I use the route table as the test, not the subnet's name.

## 429. Where are public and private subnets used?

**Answer:** Public subnets hold what must be reachable from the internet: the load balancer, the NAT gateway, and a bastion only if I still have one. Private subnets hold the application instances and the Kubernetes nodes. A third, data subnet, also private and often with no NAT route, holds RDS. I do not put the database in the public subnet to make a client tool on a laptop easier.

## 430. What is Prometheus and Grafana? Why are they used?

**Answer:** Prometheus collects and stores numeric time series by pulling /metrics endpoints. Grafana queries Prometheus and draws the dashboards and the alert views. I use them together because a database of metrics without a picture is hard to operate, and a dashboard without a store has nothing to show. Prometheus is not the log store and Grafana is not the collector.

## 431. Explain Auto Scaling and its policies.

**Answer:** Auto Scaling keeps a group at a desired size and changes that size from a policy. A target-tracking policy aims at a metric, such as average CPU. A step policy adds more instances as the metric gets worse. Scheduled scaling moves the minimum before a known peak. The group launches from a template, in the subnets I give it, and it terminates the instance a scale-in protection flag does not cover. Health checks replace bad instances. I set min, max, and the metric. Without a max, a hot loop is an unbounded bill.

## 432. What is Infrastructure?

**Answer:** Infrastructure is the part of the system that is not the application code and that the application needs in order to run: networks, compute, load balancers, databases, DNS, and the cluster. In this work it is also the pipeline and the identity that deploys it. I treat it as a product with a desired state, not as a pile of machines someone built once. If it cannot be recreated from code and a backup, it is a pet. The application's job is the feature. Infrastructure's job is to make that feature run in more than one place, survive a failure, and be changeable next week.

## 433. How do you use Terraform to deploy infrastructure in your project?

**Answer:** Terraform is how the project creates the cloud, not how it ships the app. The repository has modules for the network and the cluster, and a live directory per environment. A pull request runs plan. Merging to the environment branch runs apply with a locked remote state. Variables carry the differences: size, CIDR, and whether a database is multi-AZ. The application pipeline then deploys the image into what Terraform built. I do not also click in the console. The next plan would fight the click. Secrets the stack needs come from the CI role, not from a tfvars file in git.

## 434. Explain CloudWatch, Route 53, and Load Balancer.

**Answer:** CloudWatch provides AWS monitoring through metrics, logs,
alarms, dashboards and related operational features. Route 53 is AWS DNS
and can also provide health checks and routing policies such as
weighted, latency-based and failover routing. A load balancer
distributes traffic across healthy targets; ALB works at the HTTP/HTTPS
layer and NLB at the transport layer. In a typical application, Route 53
resolves the domain, the load balancer receives the request, and
CloudWatch monitors the health and performance of the components.

## 435. What tools are you using in your project?

**Answer:** The set I would name, because it matches the work, is GitHub or Jenkins for CI, Terraform for the cloud, Docker for the image, Kubernetes on EKS for runtime, Helm or manifests for the deploy, ECR for images, RDS for the database, and Prometheus with Grafana plus a log stack for visibility. Ansible appears when machines need configuration that does not belong in the image. I do not recite every tool I have touched. I say which one does which job in this project, and I can go one level down on any of them the interviewer picks.

## 436. What is the difference between a Security Group and NACL?

**Answer:** A Security Group is a stateful firewall associated with an
ENI/resource and supports allow rules. If inbound traffic is allowed,
the corresponding response traffic is automatically allowed. A Network
ACL is associated with a subnet, is stateless and supports both allow
and deny rules; return traffic therefore needs an explicit rule. I
normally use Security Groups for workload-level access control and NACLs
for broader subnet-level guardrails. NACL rule order matters, while
Security Group rules are evaluated as a set.

## 437. Explain the Terraform state file and why it is important.

**Answer:** The state file maps a resource address in code, such as aws_db_instance.main, to the real id in the cloud. Without it Terraform cannot update that database. It would try to create a new one. State also stores attributes, including secrets, so it belongs in an encrypted remote backend with a lock, not in git. It is not a backup of the data inside the database. It is only the identity of the infrastructure. Two people writing two state files will create two copies of the world. One state per environment, locked, is the rule.

## 438. What is a Terraform backend? Why do we use it?

**Answer:** A backend is where state is stored and how it is locked. The default is a local file, which is one person. A remote backend, S3 or GCS, lets the team share one state and stops two applies at once. I enable encryption and versioning. The backend block is configured before variables exist, so the bucket name is not a variable inside the block. Changing backends is a migration I do once, with terraform init -migrate-state, and then I stop using the old copy.

## 439. Explain the basic Jenkins CI/CD workflow.

**Answer:** The basic Jenkins workflow is a Jenkinsfile on the branch. A webhook starts a build. The controller schedules an agent. The agent checks out that commit and runs the stages in order. Artifacts and test results are archived on the build. The deploy stage uses a credential from the Jenkins store and talks to the cluster. The build status goes back to the commit. Freestyle jobs click this together in the UI. The workflow I want is the file, so the steps are reviewed with the code.

## 440. What is Docker and why is it used in a DevOps environment?

**Answer:** Docker packages an application and its dependencies into an image that runs the same way on a laptop and in the cluster. The image is built once in CI and deployed by digest. That removes the 'it worked on my machine' class of failures that come from a different runtime or a missing library. It is not a security boundary by itself, and it is not a cluster. In a DevOps pipeline the image is the artifact between build and deploy. Kubernetes runs it. A registry stores it. I use it so the deploy is 'start this digest,' not 'install these packages on a server and hope they match last time.'

## 441. How do you troubleshoot a failed Jenkins pipeline?

**Answer:** A failed Jenkins pipeline gets the console of the failed stage and the agent it ran on. I check the recent changes to the Jenkinsfile and to the shared library, because a library change breaks every job that uses it. I check the agent disk and the Docker daemon if the step is a container build. I do not restart Jenkins as a diagnostic. I rerun the stage after I can say why it failed. If I cannot, the rerun is the experiment, and I watch the same line.

## 442. How do you monitor AWS resources in your project?

**Answer:** In this project AWS-side metrics are CloudWatch: ALB target health and 5xx, RDS CPU and connections, NAT bytes, and EC2 status checks. The application and the cluster are Prometheus and Grafana, because CloudWatch is a poor fit for per-pod application metrics. I still alarm in CloudWatch on the things only AWS knows, a failed status check or a storage full on RDS. Those alarms go to the same channel as the Prometheus alerts. One inbox, two sources.

## 443. How do you design zero-downtime deployments for stateful applications on Kubernetes?

**Answer:** Stateful and zero-downtime together need a stable volume and a careful order. The StatefulSet rolls from the highest ordinal down, one at a time, and each pod remounts its existing claim. I set podManagementPolicy and a readiness gate so a pod that has the disk but cannot serve is not considered done. Sessions or partitions that lived on that pod must be accepted by the client retrying. I snapshot the volumes before the change. If the data format changes, I expand the schema first, roll the application, and only later remove the old format. Doing those in one step is the downtime.

## 444. Terraform state is huge (200MB) and `terraform plan` takes 12 minutes. How do you fix it?

**Answer:** A 200 MB state means one state owns too many resources, and plan is slow because every refresh talks to the API for all of them. I split the state on a lifecycle boundary: network in one, the cluster in another, applications in others. I pass ids through outputs. I also turn off refresh for a read-only plan when I am iterating, and I fix any resource that refreshes slowly because of a data source that lists the whole account. Twelve minutes becomes a minute or two after the split. I do not delete state to shrink it.

## 445. Pods are `Running` but users see 503 errors. Where do you debug?

**Answer:** A Running pod does not prove that traffic can reach a
healthy application. I debug the path: client → DNS → load
balancer/Ingress → Service → EndpointSlice → pod. I check Service
selectors, ready endpoints, readiness probes, target-group health,
Ingress rules, ports/targetPorts, NetworkPolicies/Security Groups and
application logs. A 503 often means the proxy/load balancer has no
healthy backend, so I focus on health and routing rather than the pod's
Running state alone.

## 446. How do you manage secrets across 50+ services without exposing Vault access?

**Answer:** Applications never log into Vault as a human and they never receive the root token. Each service has an identity, a Kubernetes service account mapped to a Vault role, and a policy that can read one path: secret/data/payments/prod. The pod authenticates with its service account token. Vault returns the secret, or a database username that expires. The application cannot list the other 49 services. Humans use OIDC and a different policy. CI uses its own role. I audit who read which path. I do not mount a token that can read secret/* into every namespace because it was easier to template. If Vault is sealed or down, the apps that need a new secret fail, so Vault is highly available and I have practiced unsealing.

## 447. How do you design GitOps for multiple teams with independent releases?

**Answer:** I would give each team clear ownership of its application
configuration and use Git as the source of truth. A GitOps controller
such as Argo CD or Flux continuously reconciles the desired state to the
cluster. Teams can have separate repositories or well-defined directory
boundaries, with protected branches and PR-based promotion. Environment
overlays or Helm/Kustomize can keep common configuration reusable while
allowing independent releases. RBAC, repository permissions, audit logs
and policy checks prevent one team's change from affecting another
team's workloads.

## 448. An image passed security scans but was later exploited. What did you miss?

**Answer:** A security scan is a point-in-time control, not proof that
an image is permanently safe. I would investigate whether the
vulnerability was newly disclosed, whether runtime behavior was outside
the scan scope, whether a dependency was compromised after the scan, or
whether credentials/configuration were the real attack path. I would add
continuous image/dependency monitoring, runtime controls,
provenance/signing, least privilege and rapid patch/rollback processes.
The lesson is to use defense in depth rather than treating a successful
scan as a security guarantee.

## 449. How do you implement SLO-based alerting without creating alert fatigue?

**Answer:** An SLO alert fires when the error budget burn is too fast, not when one host CPU moves. I define the indicator users feel, availability or latency, and a budget, for example 99.9 percent. A fast-burn alert pages quickly when the budget would be gone in hours. A slow-burn alert tickets when the month is at risk. Symptom alerts that duplicate the SLO get deleted or demoted to dashboards. I measure alert count per week. Fatigue is too many pages that were not the SLO.

## 450. CI builds 40 Docker images and takes 18 minutes. How do you optimize it?

**Answer:** I would profile the 18 minutes before optimizing. If the
images are independent, build them in parallel with matrix/parallel jobs
and use BuildKit/remote cache. Reuse common base and dependency layers,
avoid rebuilding unchanged components and publish immutable images. I
would also check whether every image really needs a full build and
whether multi-stage builds can reduce work. The goal is to reduce both
wall-clock time and CI resource consumption, so I would measure build
time per image, cache hit rate and runner utilization before and after
the change.

## 451. How do you upgrade a Kubernetes cluster with zero downtime?

**Answer:** I would first review the supported upgrade path, API
deprecations, add-ons and workload compatibility. For managed Kubernetes
such as EKS, I would upgrade the control plane first according to the
supported sequence, then update node groups using a rolling replacement
strategy. I would maintain capacity so workloads can be rescheduled, use
PodDisruptionBudgets appropriately and monitor application health during
each step. I would upgrade add-ons such as CNI, CoreDNS and kube-proxy
as required. The key is staged rollout, readiness checks and a tested
rollback/recovery plan.

## 452. How would you reduce cloud cost by 40% without impacting performance? Where do you start?

**Answer:** I start from the bill, largest service first, and I compare it with last month. The usual 40 percent is not one heroic rewrite. It is unattached volumes, oversized instances, dev running all night, NAT traffic that should have been a VPC endpoint, log retention, and idle load balancers. I turn on a budget alert before I cut. I rightsize from metrics, not from the instance name. I do not remove a second Availability Zone to hit the number. That saves money by spending the outage later.

## 453. A capture on the server shows a SYN arriving and no SYN-ACK leaving. What do you check before you blame the client?

**Answer:** The packet reached this host, so DNS and the path in are not the current fault. I check whether anything is listening on that port and address, with ss, and whether the host firewall dropped the reply. A process bound to 127.0.0.1 will not answer a SYN that arrived on the pod or instance address. I also check the return route: the SYN-ACK can be generated and then sent somewhere the capture on this interface will not show as a successful handshake. I do not restart the application until I know it was not listening.

## 454. Small health checks succeed through a VPN, and uploads over a few kilobytes hang. How do you prove path MTU?

**Answer:** I compare a small TCP payload with one that is larger than the tunnel can carry. If the small one completes and the large one stalls with no error, I suspect a hop that cannot forward the packet and also does not send fragmentation-needed. I check the tunnel MTU and whether TCP MSS clamping is on. I do not start by rewriting the application timeout. A longer timeout only hides a black hole. The fix is a smaller MSS or MTU on the tunnel, then a repeat of the large upload.

## 455. Two accounts both built 10.0.0.0/16 and the business wants them peered this week. What do you say?

**Answer:** I say the peering will not carry a route for a prefix that exists on both sides. Routing cannot tell the two networks apart. NAT in front of one side is a workaround with its own breakage, not a design I want under a deadline. The real fix is to renumber one account onto a range from the plan we should have written first. I will not invent overlapping routes and call the tunnel up. I show them the address map and the smallest renumber that unblocks the peer.

## 456. VPC A is peered to B and B is peered to C. A still cannot reach C. Is the peering broken?

**Answer:** The peerings can be healthy and A still cannot reach C, because cloud peering is not transitive. A talks to B, B talks to C, and nobody forwarded A's packets onward. I either peer A to C directly or I put a transit network in the middle and accept the extra hop and cost. I also check the routes and the firewalls on the pair I do create. A green peering status between A and B is the wrong screen once the destination is C.

## 457. The site-to-site VPN says phase 1 and phase 2 are up, and the database port still times out. Where do you look?

**Answer:** The encryption negotiated. That does not mean a route exists for the inner prefixes, or that a firewall on either side allows those inner packets. I check both route tables for the remote CIDR, then the security group or firewall for the real port, then a TCP connect from a host on one side. I do not keep recreating the tunnel. A green status page is the start of the check, not the end.

## 458. Browsers show a certificate name mismatch right after a new hostname starts pointing at the old listener. What did not move with DNS?

**Answer:** DNS now sends people to a listener whose certificate does not list the new name. The subject alternative name is what the client checks. I add the name to the certificate, or attach the certificate that already has it, and I reload the process that presents it. I also check that the load balancer, not only the backend, is the hop the browser talks to. Pointing DNS first and the certificate second is this outage.

## 459. The renewed certificate is on disk and clients still see the expired one. What is left to do?

**Answer:** The process loaded the old file and nobody told it to read the new one. I reload or restart the listener that terminates TLS, and I confirm the served certificate with a client against that address, not by reading the file. Then I fix the renewal so the reload is part of the job, and I alert weeks before expiry. A successful write to disk is not a completed renewal.

## 460. The load balancer health check returns 200 while users see database errors. How do you fix the check without emptying the fleet?

**Answer:** A check that cannot fail keeps broken instances in rotation. A check that requires the database marks every instance down together when the database blips, which is worse. I make the load balancer check local process health, and I alert on the database separately. If I do deepen the check, I do it on one instance first and I watch the healthy-host count. I never ship a handler that returns 200 unconditionally to make a dashboard green.

## 461. A rolling deploy produces a burst of 502s for about half a minute. What step was skipped?

**Answer:** The process was stopped while it still had requests. Connection draining, or a deregistration delay, stops new work and lets the in-flight requests finish. The readiness probe must fail before the process exits, so the load balancer removes the instance first. I also check the termination grace period against how long a request actually takes. Killing faster than that is the 502.

## 462. HTTP/3 works from a home network and fails on the office network. What is the office path doing differently?

**Answer:** HTTP/3 runs on QUIC, which is UDP on port 443. The office allows TCP 443 and drops UDP. Home does not. Browsers that fall back survive. A client that does not fall back fails. I test UDP 443 as its own path instead of assuming the TCP check covers it. If the office will not allow UDP, I keep the TCP fallback and I say so, rather than debugging the application.

## 463. A more specific BGP prefix was announced next to the one you meant. What traffic moves?

**Answer:** Longest prefix wins between networks the same way it wins in a host route table. A /25 announced beside a /24 attracts that half of the range, including traffic you did not mean to receive. I withdraw the specific prefix and I watch from more than one provider, because withdrawal is not instant everywhere. I also check that RPKI still matches what we are allowed to originate. I do not wait for DNS TTL. This is routing, not naming.

## 464. An anycast site is failing and users near it still arrive there. What is still being announced?

**Answer:** Anycast delivers the client to a nearby announcement of the same address. If the dead site is still announced, routing keeps handing it users. I withdraw that site's announcement, or I fail its health check in the system that withdraws for me. I do not expect the client to stick to a healthy site it visited earlier. Sessions are not pinned unless we built that on purpose.

## 465. CLOSE_WAIT sockets climb on one API after a release. Is the firewall the cause?

**Answer:** No. CLOSE_WAIT means the peer closed and this process has not closed its side. That is the application, usually a connection left open after the response. A firewall drop looks like a timeout or a SYN with no answer, not like a socket sitting in CLOSE_WAIT. I look at the release diff for a missed close, and I watch the count fall after the fix. Raising the file-descriptor limit only postpones the crash.

## 466. A stateful security group allows outbound 443, and a new stateless network ACL sits in front. Replies never come back. Why?

**Answer:** The security group tracks the connection and allows the reply. The stateless ACL judges every packet alone, so the return traffic needs its own rule, including the ephemeral ports. I add that return rule, or I stop putting a stateless list in front of a flow I already allowed statefully. The symptom is a timeout, which people misread as the remote service being down.

## 467. A container listens on 127.0.0.1 and the Service has endpoints, but nobody outside the container can connect. What do you change?

**Answer:** I change the bind address. 127.0.0.1 is the container's loopback, and the Service forwards to the pod IP, which is a different interface. Endpoints can exist because the process is running, and the connection still fails. I bind to all interfaces or to the pod IP, I keep the port aligned with the Service targetPort, and I confirm with a connect to the pod IP, not to localhost inside an exec session.

## 468. dig on a laptop and dig in a pod return different addresses for the same name. What is going on?

**Answer:** They are not using the same resolver. The laptop uses corporate or public DNS. The pod uses CoreDNS and the search list in its resolv.conf, and ndots may try several suffixes before the name I think I asked. Split horizon can also be intentional: a private address inside the VPC and a public address outside. I compare the server that answered, not just the address. I fix the zone the pod actually queries.

## 469. You lowered the DNS TTL at the moment of cutover, and some clients still use the old address an hour later. What kept the old answer?

**Answer:** Caches that already stored the previous TTL. Lowering the TTL does not expire an answer a resolver fetched this morning under the old, long TTL. The lower value applies to lookups after the change. I lower the TTL a day or more before a move, I check the authoritative server and a public resolver separately, and I do not call a stale cache a failed failover.

## 470. A layer-4 load balancer cannot send /api and /static to different pools. What do you put in front instead?

**Answer:** A layer-7 proxy that can read the HTTP path. Layer 4 only has the address and the port. If TLS is end-to-end, the balancer cannot see the path unless it terminates TLS or the protocol exposes the route another way. I terminate TLS at the proxy, route on the path, and I keep the certificate and the health checks on that proxy. I do not keep reconfiguring the layer-4 listener and hoping the URL will leak.

## 471. traceroute prints stars from hop 4, and the service is healthy. How do you explain the stars?

**Answer:** A star means that hop did not answer the probe. Many routers refuse traceroute and still forward traffic. It is not proof the hop is down, and the probes are often not even the TCP connection the user cares about. I confirm with a connect to the real port. I use traceroute to see where replies stop, and I stop treating a silent hop as an outage when the service is answering.

## 472. Private subnets reach S3 through NAT, and that is the expensive line on the bill. What path do you add?

**Answer:** A gateway endpoint, or the provider's private endpoint, so S3 traffic leaves the subnet without the NAT. I point the route at the endpoint and I check that DNS still resolves to the service in a way that matches that route. I do not remove NAT until I know what else uses it, such as package mirrors and external APIs. The endpoint removes the S3 bytes from the NAT. It does not replace egress for everything.

## 473. Cross-zone load balancing is off, and one Availability Zone becomes unhealthy. What do users pinned to that zone see?

**Answer:** They stay on the unhealthy zone, because the balancer was told not to send them elsewhere. The other zone can be idle while this one errors. I turn cross-zone on when I would rather pay the data charge than drop a zone, or I accept the failure domain and I make sure clients are not stuck. I watch healthy hosts per zone, not one global count that hides an empty zone.

## 474. A GitHub Actions job on pull_request_target checks out the pull request and runs its build script. What can that pull request do?

**Answer:** It can run in the base repository's context, which is where the secrets are. pull_request_target exists so a workflow can comment on a PR from a fork. It is not a place to execute the fork's code. I move the build to the pull_request event, which does not get those secrets, and I leave the privileged workflow with no checkout of the PR head. I rotate anything that job could already read.

## 475. A Jenkins shared library on main changed, and every team pipeline failed in the same hour. How should that library have been consumed?

**Answer:** Pinned. A @main include means the library's latest commit is part of every build, with no review in those repos. I pin a tag, I test the new tag in one pipeline, and then I move the pin. I also keep the library change small enough to roll back by moving the pin back. I do not restart the controller as the diagnosis. The console of one failed job already shows the library step.

## 476. A debug step printed the environment and a cloud key appeared in the build log. What do you rotate, and what do you change?

**Answer:** I rotate the key first. The log is a copy, and deleting the log line does not shrink the window during which it was valid. Then I remove the echo, I stop dumping the environment, and I bind the credential only inside the step that uses it. I check who can read old build logs. I treat the key as public from the moment it was printed.

## 477. A Helm upgrade failed in the middle and the release is stuck failed. What does atomic change the next time?

**Answer:** helm upgrade --atomic waits for the release to become ready and rolls back to the last good revision if it does not. Without it, I am left to notice the failed state and roll back myself, while traffic may already be on the broken revision. I still read why it failed before I retry. Atomic is the safety on the rollout. It is not a reason to skip the diff.

## 478. terraform plan wants to destroy a production database because a resource was renamed in the configuration. How do you keep the database?

**Answer:** I do not apply that plan. The rename changed the state address, so Terraform thinks the old object must go and a new one must be created. I add a moved block, or I move the state address, until the plan shows an update in place or no change. I take a snapshot before I touch it anyway. Deleting state to clear the plan is how the next apply creates a second copy and orphans the first.

## 479. Two people run terraform apply against the same state and one's changes vanish. What control was missing?

**Answer:** A lock on the remote state. Without it, both applies read the same state, both write, and the last write wins. I put the state in a backend that locks, and I treat force-unlock as a recovery for a dead process, not as a way to start my apply sooner. I also stop keeping a copy of the state on a laptop. That copy is how the lock gets bypassed.

## 480. An Ansible playbook restarts the service on every run, even when the config did not change. Where should that restart live?

**Answer:** In a handler notified by the task that renders the config. The task should report changed only when the file content changes. If it always reports changed, the handler always restarts, and every run is an outage window. I fix the task's comparison. I do not add a sleep. Idempotence means the second run is quiet.

## 481. Production pulled a different image overnight because the deploy uses the tag latest. How do you stop that?

**Answer:** I deploy the digest CI built, and I stop using a tag that can be moved. latest is a name, not a version. I also make the registry reject a retag of a release, or I ignore tags entirely in the manifest. The running pod should show the digest I approved. If it does not, the deploy is not done.

## 482. A pod is OOMKilled and its memory limit equals its request. What do you look at before you only raise the limit?

**Answer:** Why the process grew. A limit equal to the request means it cannot burst, so any growth kills it, but raising the limit on every node without a reason just moves the kill to the node. I look at the release, a cache with no bound, or a query that loaded the whole table. I set the request from the steady usage and the limit from the burst I am willing to pay for. I watch the next day rather than editing once and leaving.

## 483. A pod stays Pending with Insufficient cpu while the node graph shows idle CPU. Why did the scheduler refuse it?

**Answer:** Requests, not usage. Other pods have reserved the CPU, and the scheduler adds those requests up. The graph can look bored. I find the pods holding the reservation, I rightsize requests that were copied from a template, or I add a node. I do not delete the requests to make it schedule. A pod with no request is the first one evicted when the node actually gets busy.

## 484. Someone added a NetworkPolicy that selects the app pods and specifies no allow rules. The namespace goes quiet. What did the policy change?

**Answer:** Once a policy selects a pod, that direction defaults to deny. An empty policy is not a no-op. It is a lock. I add the ingress and egress the app actually needs, including DNS, or I remove the policy if it was applied by mistake. I test from a pod that should be allowed and from one that should not. I do not open 0.0.0.0/0 to get back to green and leave it there.

## 485. A PersistentVolumeClaim stays Pending and the event says the storage class was not found. What is mismatched?

**Answer:** The name on the claim does not match a StorageClass in the cluster. Nothing will provision. I either fix the name or I create the class the platform actually offers. I do not keep deleting the pod. The pod is waiting on the claim, and the claim is waiting on a class. A default class, if one exists, is what a claim with no class name uses. A wrong explicit name does not fall back to it.

## 486. A pod is in CrashLoopBackOff after a config change. How do you see the error from the crash before you edit again?

**Answer:** kubectl logs --previous on that container. The current container is waiting and has nothing to say. describe shows the exit code and the last state. I read those before I change the config a second time, because two untested edits hide which one failed. If the process dies before it opens a log, the previous log may be one line. That line is still the evidence.

## 487. A service is enabled and not active after a reboot, then the opposite on another host. What do those two words mean?

**Answer:** These are systemd words, read with systemctl. enabled means the unit is wired to start on boot. active means it is running now. I can have either one without the other. systemctl enable --now does both. is-enabled and is-active tell them apart. A unit that is enabled and failed still will not be up, and the reason is in the journal for that unit, not in a second reboot.

## 488. df shows free space and the deploy cannot create files. What other resource do you check?

**Answer:** Inodes. df -i. The filesystem can have bytes left and no free inodes, and every create fails. I find the directory full of small files, often a cache or a socket directory, and I clean it with the same care as a full disk. I also alert on inode use. A disk alert on bytes alone will stay green through this failure.

## 489. A Python CI step builds a shell command with an f-string that includes the branch name. Why is that dangerous?

**Answer:** The branch name becomes shell syntax. A branch called something with a semicolon runs a second command. I pass arguments as a list to subprocess and I do not use shell=True. The branch name stays one argument. I treat any string that came from a pull request as data, not as code, including file names.

## 490. release-preflight exits 1 on a pull request because it found a password assignment. Should the pipeline go green?

**Answer:** No. Exit 1 is a finding. The job should fail. Exit 0 would mean the tree passed. Exit 2 would mean the tool was invoked wrong. I do not print the password in the log to prove the finding. The path and the rule are enough. I remove the secret, I rotate it if it was real, and I rerun.

## 491. You need a CI check that reads JSON, applies three rules, and has a unit test. Why Python rather than a longer shell pipeline?

**Answer:** The shell is fine for one test and one exit code. JSON, branches, and a test I can run locally are why this becomes a small Python tool. I still pin it and I still exit non-zero on a finding. I do not start a web service. Ansible and Terraform keep their jobs. This is a check in the pipeline, which is the scope I want.

## 492. A GCP firewall rule targets a network tag. The replacement instance has no tag and is unreachable. What do you target instead?

**Answer:** The service account the instance runs as. A tag has to be remembered on the next template. The service account is already the identity of the workload. I also check that the rule's direction and priority are what I think, because a lower-priority deny still wins if I misread the numbers. The VPC being global does not apply the tag for me.

## 493. You are choosing between Cloud Run and GKE for a stateless HTTP service with no special node needs. How do you decide?

**Answer:** Cloud Run, unless I need something it does not have. The service scales with requests, including to zero, and I do not run a cluster to get that. I move to GKE when I need sidecars I cannot express, DaemonSets, a custom network policy model, or a long-lived worker that is not a request. I do not pick GKE because it is familiar and then pay for idle nodes.

## 494. A canary receives a small slice of traffic and the global dashboard looks fine. The canary is in fact failing. How do you see it?

**Answer:** I graph the canary's own error rate and latency, labeled by version, and I set the abort rule on that series. Five percent of a failure disappears inside the rest. I also send a synthetic check at the canary, not only at the stable service. I do not promote because the summed graph was flat. Flat is what a small slice looks like.

## 495. Only one region is timing out. The release is the same in both. What do you fail over, and what do you not touch yet?

**Answer:** I treat it as that region's dependency until I prove the release. I check the regional database, NAT, DNS answers, and capacity. I fail traffic away from the region if the dependency is dead and the other region can take the load. I do not roll back the healthy region to chase a fault it does not have. If both regions share one database and that database is the fault, failover of the app changes nothing.

## 496. Image pulls filled a node disk and kubelet is evicting pods. What do you do tonight, and what do you change so it does not repeat?

**Answer:** Tonight I free disk: unused images, and I confirm the eviction threshold has room again. I do not delete customer data volumes to make space for layers. Then I turn on image garbage collection, I alert on disk before the eviction line, and I stop a deploy strategy that pulls unbounded layers onto a small node. A bigger disk without an alert is the same incident later.

## 497. Every CPU spike pages someone, and real incidents are missed. How do you page on the SLO instead?

**Answer:** I define the user-facing indicator, availability or latency, and a budget. A fast burn pages. A slow burn becomes a ticket. CPU moves to a dashboard unless it predicts the budget burn. I delete or demote the alerts that fired last month and changed nobody's action. I count pages per week after the change. Fewer pages only counts if the missed incident would still have paged.

## 498. Prometheus memory climbs after a metric starts labeling by user id. What do you remove?

**Answer:** The user id label. That is unbounded cardinality, one series per user, and it will not level off. I keep labels that are small sets: service, code, a route template rather than the raw path. The per-user detail belongs in a log or a trace, where it is an event, not a series stored forever. I do not give Prometheus more memory as the design.

## 499. A trace says the service spent 40 milliseconds, and the user waited 4 seconds. Where is the missing time?

**Answer:** Outside the span I am looking at. Queueing before the request was recorded, a client retry, DNS, TLS, or a hop that is not in the trace. I look at the client timing and at the gaps between spans. I do not optimize the function that already took 40 milliseconds. The trace is evidence of what was measured. The wait the user felt includes what was not measured.

## 500. A node drain waits forever and the events blame a PodDisruptionBudget. What did the budget demand?

**Answer:** It demanded more available pods than a voluntary drain can leave. minAvailable set to the replica count means the drain must keep every pod, so it never starts. I set the budget to the number I can lose, usually one, and I keep enough replicas to satisfy it during the drain. A node crash is not voluntary and the budget will not stop that. I do not delete the budget to finish tonight's drain and leave the next one unprotected.
