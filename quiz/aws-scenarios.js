/* AWS interview practice, reviewed against linked AWS documentation on 2026-10-27. */
globalThis.AwsScenarios = [
  {
    "id": "aws-01",
    "title": "EC2 → S3 · same account",
    "category": "S3 & access",
    "question": "An application on EC2 must read invoices from an S3 bucket in the same account. The bucket must remain private. How would you provide access without embedding credentials?",
    "choices": [
      "Make the bucket public and rely on an obscure prefix.",
      "Attach a least-privilege IAM role through an instance profile and use the SDK credential provider chain.",
      "Store an administrator access key in the application configuration."
    ],
    "correct": 1,
    "explanation": "An instance role supplies temporary credentials. Public bucket access and long-lived administrator keys are unnecessary.",
    "answer": [
      "Attach an IAM role trusted by EC2 through an instance profile. Let the SDK obtain and refresh temporary credentials; do not hard-code keys.",
      "Allow s3:GetObject only on the invoice object prefix. Add s3:ListBucket on the bucket ARN only if listing is required, with a prefix condition where appropriate.",
      "Keep S3 Block Public Access enabled. In the same account, an identity policy can grant access without a separate bucket-policy allow, subject to ownership, applicable policies and explicit denies.",
      "For SSE-KMS, also authorize the needed KMS operations through IAM and the key policy. Verify network reachability and test both allowed and forbidden object prefixes."
    ],
    "sources": [
      "https://docs.aws.amazon.com/AmazonS3/latest/userguide/security_iam_service-with-iam.html",
      "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html"
    ],
    "sourceTitles": [
      "How Amazon S3 works with IAM",
      "IAM security best practices"
    ]
  },
  {
    "id": "aws-02",
    "title": "EC2 → S3 · private connectivity",
    "category": "S3 & access",
    "question": "EC2 runs in a private subnet with no NAT or internet route. It must read an S3 bucket in the same Region and account. Which network design fits?",
    "choices": [
      "Assign a private IP address directly to the S3 bucket.",
      "Give EC2 a public IPv4 address while keeping the subnet isolated.",
      "Associate an S3 gateway VPC endpoint with the EC2 subnet route table and authorize the workload role."
    ],
    "correct": 2,
    "explanation": "A gateway endpoint provides the S3 path without a NAT device or internet gateway. A bucket is not an EC2-style resource to which you assign a private IP.",
    "answer": [
      "Create the same-Region S3 gateway endpoint and associate the relevant subnet route tables; the S3 prefix-list route targets the endpoint.",
      "Permit HTTPS to S3 in the instance security group and the required traffic, including return traffic, in network ACLs. Confirm DNS resolves the regional S3 service correctly.",
      "Grant the EC2 role only the needed S3 actions. Restrict the endpoint policy as required; an endpoint policy filters access and does not independently grant bucket permissions.",
      "Optionally restrict bucket access with aws:SourceVpce after testing service and administrator exceptions. Such a deny can also block console access.",
      "The bucket does not receive a private IP. S3 interface endpoints are a different option with private ENIs, useful for additional connectivity requirements such as on-premises access."
    ],
    "sources": [
      "https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-s3.html",
      "https://docs.aws.amazon.com/AmazonS3/latest/userguide/example-bucket-policies-vpc-endpoint.html"
    ],
    "sourceTitles": [
      "S3 gateway endpoints",
      "Bucket policies for VPC endpoints"
    ]
  },
  {
    "id": "aws-03",
    "title": "EC2 A → S3 B · cross-account",
    "category": "S3 & access",
    "question": "An EC2 application in Account A needs read-only access to an S3 bucket owned by Account B. Use the EC2 role directly, without assuming a second role. What authorization is required?",
    "choices": [
      "An IAM allow for the role in A and a bucket-policy allow in B naming that role, with no applicable deny.",
      "Only an outbound security-group rule in A.",
      "An endpoint policy alone, because it replaces both accounts’ IAM policies."
    ],
    "correct": 0,
    "explanation": "Direct cross-account access requires authorization on both sides. Network access does not grant permission to read objects.",
    "answer": [
      "Use the EC2 instance role in Account A with temporary credentials. Allow required actions on Account B’s bucket and object ARNs in the role policy.",
      "In Account B, name the specific role ARN in a bucket policy and allow only the required actions and prefixes. Use bucket-owner-enforced Object Ownership where suitable rather than ACL-based sharing.",
      "Review explicit denies, organization policies and other applicable permission limits. For SSE-KMS, use a suitable customer-managed key with cross-account authorization in both IAM and its key policy.",
      "Test GetObject and any required listing, then a denied prefix. Audit relevant object operations with configured S3 data events.",
      "An alternative is to assume a role in B: A needs sts:AssumeRole, B needs a trust policy, and the assumed role needs S3 permissions. That is a different authorization design."
    ],
    "sources": [
      "https://docs.aws.amazon.com/AmazonS3/latest/userguide/example-walkthroughs-managing-access-example2.html",
      "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html"
    ],
    "sourceTitles": [
      "Cross-account S3 permissions",
      "IAM security best practices"
    ]
  },
  {
    "id": "aws-04",
    "title": "Cross-account S3 · private path",
    "category": "S3 & access",
    "question": "The same Account A EC2 role must read Account B’s same-Region S3 bucket, but traffic may not use a NAT device or the internet. What completes the design?",
    "choices": [
      "Place a NAT gateway in Account B and attach a security group to the bucket.",
      "Use an S3 gateway endpoint in A, allow B’s bucket in its endpoint policy, and retain the cross-account IAM and bucket-policy grants.",
      "Create VPC peering to the S3 bucket’s private subnet."
    ],
    "correct": 1,
    "explanation": "The endpoint supplies private connectivity; IAM and bucket policies supply authorization. S3 buckets do not live in customer subnets.",
    "answer": [
      "Create an S3 gateway endpoint in A’s VPC, in the bucket’s Region, and associate the EC2 subnet route tables.",
      "Allow the EC2 role and B’s bucket/object resources through the endpoint policy. Keep the role policy in A and bucket policy in B allowing the direct cross-account request.",
      "If B requires endpoint-only access, use a carefully tested aws:SourceVpce restriction for A’s endpoint, accounting for service and recovery paths.",
      "Authorize SSE-KMS access separately when needed. Keep HTTPS, DNS, security-group egress and network ACLs correct.",
      "Test using A’s role with the NAT/internet path absent, then test an unauthorized role or prefix. Do not try to assign a private IP to S3 or peer to a bucket."
    ],
    "sources": [
      "https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-s3.html",
      "https://docs.aws.amazon.com/AmazonS3/latest/userguide/example-bucket-policies-vpc-endpoint.html",
      "https://docs.aws.amazon.com/AmazonS3/latest/userguide/example-walkthroughs-managing-access-example2.html"
    ],
    "sourceTitles": [
      "S3 gateway endpoints",
      "Bucket policies for VPC endpoints",
      "Cross-account S3 permissions"
    ]
  },
  {
    "id": "aws-05",
    "title": "On-prem application → EC2",
    "category": "Migration",
    "question": "A business application and its dependencies run on-premises. You must rehost it on EC2 with an agreed cutover window. Which plan should come before moving production traffic?",
    "choices": [
      "Copy the binary to one public instance and immediately change DNS.",
      "Shut down the source before discovering dependencies or testing recovery.",
      "Assess dependencies, build the AWS landing environment, replicate, rehearse acceptance tests, then cut over with a rollback plan."
    ],
    "correct": 2,
    "explanation": "A successful migration includes discovery, secure target infrastructure, rehearsal, data consistency and a controlled traffic switch.",
    "answer": [
      "Inventory servers, dependencies, data stores, licenses and traffic. Agree recovery objectives, ownership, acceptance criteria, migration waves and rollback triggers.",
      "Build the target VPC, routing, private application subnets, least-privilege roles, security groups, connectivity, secrets, backups and monitoring using repeatable configuration.",
      "For a supported rehost, use AWS Transform MGN replication and configure EC2 launch settings. Choose another migration strategy if rehosting does not fit.",
      "Launch isolated test instances. Validate application behavior, dependency access, security, performance, backups and recovery; prevent test workloads from affecting production data.",
      "During the approved cutover, quiesce writes where needed, confirm synchronization, launch cutover instances and validate before switching load-balancer or DNS traffic. Monitor closely.",
      "Keep the source and rollback procedure for the agreed period. Reconcile any writes before a rollback, then finalize and decommission only after acceptance."
    ],
    "sources": [
      "https://docs.aws.amazon.com/mgn/latest/ug/launching-test-gs.html"
    ],
    "sourceTitles": [
      "MGN migration testing"
    ]
  },
  {
    "id": "aws-06",
    "title": "On-prem database → AWS",
    "category": "Migration",
    "question": "A busy on-prem database must move to a supported AWS database target with limited write downtime. Which strategy best controls data loss?",
    "choices": [
      "Assess schema compatibility, load existing data, replicate changes, validate, then pause writes and cut over after replication catches up.",
      "Copy a backup while writes continue and switch immediately without checking the gap.",
      "Assume DMS automatically migrates every stored procedure, user and database feature."
    ],
    "correct": 0,
    "explanation": "Full load plus change data capture reduces the cutover gap, but schema work, validation and a deliberate write freeze remain essential.",
    "answer": [
      "Choose the target engine and service, assess compatibility and sizing, and agree recovery objectives. Use native migration or schema-conversion tooling as appropriate; migrate users, code and unsupported objects separately.",
      "Establish encrypted source/target connectivity, least-privilege migration access, backups and the engine-specific transaction-log settings required for CDC.",
      "For supported source/target combinations, run DMS full load plus CDC. Monitor load errors and replication latency; CDC is asynchronous, not a zero-lag guarantee.",
      "Validate rows where supported and compare counts, business totals, constraints and application behavior. Test performance and recovery before cutover.",
      "Pause source writes, wait for the remaining changes to apply, validate the final state and switch application connections and secrets. Resume writes on the target and monitor.",
      "Define rollback before cutover: writes made on the new target must be reconciled or replicated back before reverting. Retain the old database until acceptance."
    ],
    "sources": [
      "https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Task.CDC.html",
      "https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Validating.html"
    ],
    "sourceTitles": [
      "DMS change data capture",
      "DMS data validation"
    ]
  },
  {
    "id": "aws-07",
    "title": "Secure a growing AWS workload",
    "category": "Security",
    "question": "A new team proposes shared administrator keys, public database access and manual production changes. Which baseline would you establish first?",
    "choices": [
      "Use one shared root login so all engineers have the same permissions.",
      "Use federated identities and workload roles, least privilege, protected root access, private data tiers and auditable changes.",
      "Depend on a firewall while leaving identity permissions unrestricted."
    ],
    "correct": 1,
    "explanation": "Security needs identity, network, data and operational controls together. A network perimeter does not compensate for shared administrator credentials.",
    "answer": [
      "Use federation or IAM Identity Center for people, MFA and short-lived credentials. Give workloads IAM roles; avoid shared users and embedded access keys.",
      "Apply least privilege, review unused permissions and protect root access. Separate accounts/environments and use organizational guardrails where appropriate.",
      "Keep databases private, restrict security-group rules, encrypt data in transit and at rest, and manage secrets outside application code.",
      "Record audit activity, monitor findings and operational alarms, patch dependencies and test backups, restores and incident response.",
      "Make reviewed, repeatable infrastructure changes and periodically test that denied access really fails. Match controls to the workload’s risks and shared-responsibility boundaries."
    ],
    "sources": [
      "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html"
    ],
    "sourceTitles": [
      "IAM security best practices"
    ]
  },
  {
    "id": "aws-08",
    "title": "NAT Gateway or Internet Gateway?",
    "category": "Networking",
    "question": "Private EC2 workers must download updates; a public web server needs direct IPv4 internet connectivity. Which description is correct?",
    "choices": [
      "Both can reach the internet with only a private IPv4 address and an IGW route.",
      "A NAT gateway allows internet clients to initiate arbitrary connections to private workers.",
      "Private workers use a public NAT gateway and an IGW path; direct public-server access also requires a public IPv4 address and suitable rules."
    ],
    "correct": 2,
    "explanation": "For this IPv4 design, a public NAT gateway supports initiated outbound connections and replies. An IGW route alone does not make a private IPv4 address internet-reachable.",
    "answer": [
      "The private subnet’s default route points to a public NAT gateway. Its public-subnet route points to the internet gateway, and the NAT gateway has an Elastic IP.",
      "The NAT gateway translates the source to its private address; the IGW maps that to the Elastic IP. Unsolicited inbound internet connections to the private worker are not enabled.",
      "For the public web instance, use a subnet route to an IGW plus a public IPv4 or Elastic IP and explicit security-group/network ACL permissions.",
      "A private NAT gateway is for private connectivity and does not provide an internet path through an IGW. IPv6 has different options, including egress-only internet gateways.",
      "For S3-only private access, consider a VPC endpoint instead of sending that traffic through NAT."
    ],
    "sources": [
      "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html",
      "https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html",
      "https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-s3.html"
    ],
    "sourceTitles": [
      "NAT gateways",
      "Internet gateways",
      "S3 gateway endpoints"
    ]
  },
  {
    "id": "aws-09",
    "title": "Trace a VPC timeout",
    "category": "Networking",
    "question": "An EC2 application times out when connecting to a private database. A colleague suggests opening every port. What is the best first response?",
    "choices": [
      "Identify the exact source, destination, protocol and port, then inspect DNS, forward/return paths and security controls using evidence.",
      "Open inbound 0.0.0.0/0 on both instances until the application works.",
      "Add an internet gateway because all database traffic must leave the VPC."
    ],
    "correct": 0,
    "explanation": "A timeout is not proof of a missing internet route. Diagnose the specific path before changing access controls.",
    "answer": [
      "Reproduce the failure and distinguish DNS failure, connection timeout, refused connection, TLS error and authentication failure. Confirm the resolved address and intended port.",
      "Inspect source and destination route tables, attachment state and the return path. In the same VPC, local routes normally handle private-address traffic.",
      "Check security-group source/destination rules and stateful behavior. Check stateless network ACLs in both directions, including ephemeral return ports, plus host firewall rules.",
      "Use Reachability Analyzer for supported static configuration paths and Flow Logs for accepted/rejected traffic evidence. Neither proves the database process is healthy.",
      "Verify the service listener, TLS and application/database permissions. Change the smallest relevant rule, retest, and document the cause instead of opening all ports."
    ],
    "sources": [
      "https://docs.aws.amazon.com/vpc/latest/reachability/what-is-reachability-analyzer.html"
    ],
    "sourceTitles": [
      "VPC Reachability Analyzer"
    ]
  },
  {
    "id": "aws-10",
    "title": "Connect VPCs with Transit Gateway",
    "category": "Networking",
    "question": "An organization has many VPCs and an on-prem network. Production must reach shared services while development stays isolated. What design fits?",
    "choices": [
      "Use one flat route table and assume security groups provide the desired routing isolation automatically.",
      "Use Transit Gateway attachments and separate route tables with deliberate associations, propagation and return routes.",
      "Use an S3 gateway endpoint as the router between all VPCs."
    ],
    "correct": 1,
    "explanation": "Transit Gateway is a regional routing hub. Its route-table design controls which attached networks can reach each other.",
    "answer": [
      "Plan non-overlapping address ranges and the intended connectivity matrix before creating attachments.",
      "Attach each VPC in the necessary Availability Zones and connect on-premises through a supported VPN or Direct Connect gateway design.",
      "Associate attachments with the appropriate TGW route tables; selectively propagate routes or add static routes to keep production, development and shared services segmented.",
      "Add VPC subnet routes to the TGW for remote CIDRs and ensure on-premises and TGW return routes exist. An attachment alone does not complete end-to-end routing.",
      "Validate permitted and denied paths, security groups and network ACLs. Review TGW Flow Logs, costs, quotas and resilience. TGW routes traffic; it is not an application firewall."
    ],
    "sources": [
      "https://docs.aws.amazon.com/vpc/latest/tgw/how-transit-gateways-work.html"
    ],
    "sourceTitles": [
      "How Transit Gateway works"
    ]
  },
  {
    "id": "aws-11",
    "title": "Choose ALB or NLB",
    "category": "Networking",
    "question": "One service needs host/path routing for HTTPS APIs. Another accepts a custom TCP protocol and requires stable per-AZ entry addresses. Which pairing fits?",
    "choices": [
      "Put both behind an ALB because it routes every TCP protocol.",
      "Use Route 53 instead of load balancers to inspect HTTP paths.",
      "Use ALB for HTTP host/path rules and NLB for the TCP service and its static-address requirements."
    ],
    "correct": 2,
    "explanation": "ALB makes application-layer routing decisions; NLB handles transport-layer connections. Choose based on protocol and routing requirements.",
    "answer": [
      "Use ALB listeners, certificates, host/path rules and target groups for the HTTPS API. Set meaningful health checks and expose only the required ports.",
      "Use NLB for the custom TCP service. For an internet-facing NLB, use its per-AZ static addresses and optionally assign Elastic IPs where required.",
      "Spread healthy targets across Availability Zones and review cross-zone behavior, client-IP handling, TLS termination and target security controls for the chosen type.",
      "Test failures, timeouts and connection draining under realistic traffic. Neither load balancer replaces application authentication or capacity planning."
    ],
    "sources": [
      "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html",
      "https://docs.aws.amazon.com/elasticloadbalancing/latest/network/introduction.html"
    ],
    "sourceTitles": [
      "Application Load Balancers",
      "Network Load Balancers"
    ]
  },
  {
    "id": "aws-12",
    "title": "Bastion / jump host access",
    "category": "Security",
    "question": "Administrators need controlled access to EC2 instances in private subnets. What purpose does a bastion serve, and what alternative can reduce inbound exposure?",
    "choices": [
      "A bastion is a controlled administrative entry point; Session Manager can remove the need for inbound SSH ports and stored SSH keys when its prerequisites are met.",
      "A bastion automatically makes every private instance publicly reachable.",
      "A bastion replaces IAM, operating-system permissions and audit requirements."
    ],
    "correct": 0,
    "explanation": "A jump host concentrates administrative access. It must be hardened; Session Manager often avoids maintaining that extra exposed host.",
    "answer": [
      "If using a bastion, tightly restrict its access path, patch it, use individual credentials and allow target SSH/RDP only from approved sources such as the bastion security group.",
      "Prefer Session Manager where suitable: configure the SSM agent, managed-node IAM permissions and outbound access to the required endpoints or service path.",
      "Authorize operators through IAM and MFA-backed access, and define session logging and retention where supported. SSH/port-forwarding session payloads are not captured by Session Manager logging.",
      "Test revocation and emergency access. A bastion is an administration pattern, not a substitute for workload routing, application authorization or host hardening."
    ],
    "sources": [
      "https://docs.aws.amazon.com/prescriptive-guidance/latest/patterns/access-a-bastion-host-by-using-session-manager-and-amazon-ec2-instance-connect.html",
      "https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html",
      "https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-logging.html"
    ],
    "sourceTitles": [
      "Secure bastion access",
      "Systems Manager Session Manager",
      "Session logging limitations"
    ]
  },
  {
    "id": "aws-13",
    "title": "Enable MFA · IAM users and root",
    "category": "Security",
    "question": "An audit finds that an IAM user and the account root sign-in lack a registered MFA device. Which remediation correctly separates the two identities?",
    "choices": [
      "Run an IAM enable-mfa-device command with the root email as --user-name.",
      "Register MFA for the IAM user in its security credentials, and separately register root MFA through the root security-credentials console workflow.",
      "Enable MFA on one IAM administrator and assume it protects root automatically."
    ],
    "correct": 1,
    "explanation": "Root is not an IAM user. Its MFA registration has a separate console workflow; enabling a user’s MFA does not protect root credentials.",
    "answer": [
      "For an IAM user, use IAM → Users → the user → Security credentials → Assign MFA device, with appropriate permissions. Enroll the selected device and verify sign-in.",
      "For an account retaining root credentials, sign in as root, open Security credentials and assign an MFA device. Prefer phishing-resistant passkeys/security keys where feasible.",
      "Protect recovery email/phone information and maintain an approved recovery procedure. Avoid root for routine administration and remove root access keys.",
      "For Organizations member accounts using centralized root-access management, follow that design: credentials may be removed instead of retaining a password-based root sign-in.",
      "MFA registration and MFA enforcement are separate concerns for IAM users and API sessions. Test applicable sign-in and session-policy requirements; never treat root as an IAM user in a command."
    ],
    "sources": [
      "https://docs.aws.amazon.com/IAM/latest/UserGuide/enable-mfa-for-root.html",
      "https://docs.aws.amazon.com/en_us/prescriptive-guidance/latest/aws-startup-security-baseline/acct-05.html"
    ],
    "sourceTitles": [
      "Root user MFA",
      "Configure MFA for account access"
    ]
  },
  {
    "id": "aws-14",
    "title": "CloudTrail or CloudWatch?",
    "category": "Operations",
    "question": "Latency is rising and an instance disappeared during the incident. Which evidence would you use to investigate both performance and who changed the infrastructure?",
    "choices": [
      "Use only CloudWatch CPU metrics to identify the person who terminated the instance.",
      "Use only CloudTrail and assume it measures application response time.",
      "Use CloudWatch for operational metrics/logs and CloudTrail for recorded API activity, correlated by time and resource."
    ],
    "correct": 2,
    "explanation": "The services answer complementary questions: operational health versus audit activity. Logging scope and retention must be configured for the evidence you need.",
    "answer": [
      "Use CloudWatch metrics, alarms and application logs to examine latency, errors, saturation and dependencies. Install/configure the CloudWatch agent or other instrumentation for OS memory or application details not provided by default.",
      "Search CloudTrail management events for the termination or configuration change, then inspect the principal/session, time, API action and affected resource. An assumed role may require following the session back to its origin.",
      "Event history covers recent management events; configure trails or event data stores for the required retention and event coverage. S3 object-level activity requires relevant data-event configuration.",
      "Correlate the timelines, preserve evidence and alert on critical changes. CloudTrail can deliver to CloudWatch Logs, but the two services do not replace each other."
    ],
    "sources": [
      "https://docs.aws.amazon.com/decision-guides/latest/decision-guides/cloudtrail-or-cloudwatch.html"
    ],
    "sourceTitles": [
      "CloudTrail and CloudWatch"
    ]
  },
  {
    "id": "aws-15",
    "title": "Respond to DDoS with AWS Shield",
    "category": "Security",
    "question": "A public application is targeted by a volumetric DDoS attack. Which protection statement should guide the response?",
    "choices": [
      "AWS provides automatic baseline DDoS protection; evaluate Shield Advanced for additional eligible-resource protection and response support, alongside a resilient architecture.",
      "Shield automatically fixes SQL injection vulnerabilities in application code.",
      "Buying Shield Advanced removes the need for capacity, monitoring or an incident runbook."
    ],
    "correct": 0,
    "explanation": "Shield addresses DDoS resilience. It complements architecture and operational response rather than replacing them.",
    "answer": [
      "Design the public entry layer for DDoS resilience using appropriate edge, DNS and load-balancing services; avoid exposing origins unnecessarily.",
      "Use AWS’s automatic baseline protections against common network/transport attack vectors. Evaluate Shield Advanced’s additional capabilities and eligible-resource coverage for critical workloads.",
      "Define alarms, response ownership and a tested incident runbook. Review protection enrollment and support requirements before an incident.",
      "Use AWS WAF for application-layer HTTP request filtering where supported and fix application vulnerabilities separately. Neither service guarantees the absence of downtime."
    ],
    "sources": [
      "https://docs.aws.amazon.com/waf/latest/developerguide/shield-chapter.html"
    ],
    "sourceTitles": [
      "AWS Shield"
    ]
  },
  {
    "id": "aws-16",
    "title": "Filter malicious requests with WAF",
    "category": "Security",
    "question": "An HTTPS application behind an ALB receives SQL-injection attempts and aggressive request bursts. How should you introduce AWS WAF safely?",
    "choices": [
      "Attach a web ACL to the database security group and expect it to inspect SQL queries.",
      "Associate a web ACL with the supported application resource, test managed/custom rules and rate controls, then enforce while monitoring false positives.",
      "Block every unfamiliar IP permanently without testing legitimate clients."
    ],
    "correct": 1,
    "explanation": "WAF evaluates HTTP(S) requests on supported resources. Rule tuning and observability help avoid blocking legitimate users.",
    "answer": [
      "Associate the correct-scope web ACL with the ALB, or protect the CloudFront distribution if that is the intended entry point.",
      "Start with appropriate managed rules and workload-specific rules. Evaluate in Count mode where suitable, inspect sampled requests/logs, and tune exclusions before switching to blocking.",
      "Add rate-based controls aligned with real traffic and shared-client/NAT behavior. Order rules and exceptions deliberately.",
      "Monitor allowed/blocked traffic and user impact, and keep a rollback path for problematic rules. WAF reduces exposure but does not replace parameterized queries, authentication or secure application code."
    ],
    "sources": [
      "https://docs.aws.amazon.com/waf/latest/developerguide/how-aws-waf-works.html"
    ],
    "sourceTitles": [
      "How AWS WAF works"
    ]
  },
  {
    "id": "aws-17",
    "title": "Publish application DNS with Route 53",
    "category": "Delivery",
    "question": "Your application runs on EC2 behind an ALB. You own example.com and want users to reach it securely by name. What does Route 53 do in this design?",
    "choices": [
      "It hosts the application process and replaces EC2 and the ALB.",
      "It copies the application files into DNS records.",
      "It provides authoritative DNS records, such as an alias to the ALB; compute and HTTPS still belong to the application stack."
    ],
    "correct": 2,
    "explanation": "Route 53 is the DNS layer. Alias records can point the domain apex or a subdomain to an ELB load balancer.",
    "answer": [
      "Create or use the public hosted zone and ensure the registrar delegates the domain to its assigned name servers. Registration and DNS hosting can be managed separately.",
      "Create the suitable alias A record to the ALB, plus AAAA where the endpoint’s IPv6 configuration supports it. Use an ACM certificate covering the hostname on the HTTPS listener.",
      "Verify listeners, target-group health, security rules and application host handling. Route 53 does not deploy application compute or terminate the ALB’s TLS.",
      "Check DNS resolution and HTTPS end to end. Choose routing/health-evaluation policies deliberately and plan for DNS caching during cutovers; DNS changes are not an instantaneous traffic switch."
    ],
    "sources": [
      "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-elb-load-balancer.html"
    ],
    "sourceTitles": [
      "Route 53 aliases to load balancers"
    ]
  },
  {
    "id": "aws-18",
    "title": "Use CloudFront for global delivery",
    "category": "Delivery",
    "question": "A global site serves images from S3 and authenticated APIs from an application origin. Which CloudFront design improves delivery without exposing private data?",
    "choices": [
      "Use a private S3 REST origin with origin access control, and configure separate cache behavior for static assets and authenticated APIs.",
      "Cache every API response by URL alone, ignoring authorization and user context.",
      "Assume CloudFront is the source database and remove the origin."
    ],
    "correct": 0,
    "explanation": "CloudFront is an edge delivery layer backed by origins. Cache and origin-access policies must respect the sensitivity of each response.",
    "answer": [
      "Use CloudFront for static assets, downloads or supported dynamic content so requests reach nearby edge locations and cacheable content avoids repeated origin fetches.",
      "For a private S3 REST origin, use origin access control and a bucket policy permitting the distribution; keep Block Public Access. An S3 website endpoint is a different, custom-origin design and does not support OAC.",
      "Separate static and API cache behaviors. Disable caching or use carefully designed cache keys and policies for authenticated/personalized responses; forward required headers, cookies and query strings.",
      "Configure the hostname, viewer TLS certificate, HTTPS origin connections, logging and monitoring. Use versioned assets or deliberate invalidations for updates; CloudFront still depends on a healthy origin."
    ],
    "sources": [
      "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html",
      "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html"
    ],
    "sourceTitles": [
      "CloudFront content delivery",
      "Private S3 origins with CloudFront"
    ]
  },
  {
    "id": "aws-19",
    "title": "Illustrative Lambda image pipeline",
    "category": "Serverless",
    "question": "Design a sample project that creates thumbnails when images arrive in S3. Events may be retried. Which implementation is robust? This is an illustrative project, not a claim about your past work.",
    "choices": [
      "Write thumbnails into the same unfiltered upload prefix and ignore duplicate events.",
      "Trigger Lambda for the upload prefix, write to a separate output location, and make processing idempotent with bounded resources and failure handling.",
      "Give the function administrator access and assume every image processes exactly once."
    ],
    "correct": 1,
    "explanation": "S3-triggered Lambda processing must handle retries and prevent the output from retriggering the same pipeline.",
    "answer": [
      "Define an input bucket/prefix and a separate output bucket or non-triggering prefix. Configure S3 object-created notifications and narrowly scoped permission for S3 to invoke Lambda.",
      "Give the function’s execution role only required object reads, output writes, logs and any KMS permissions. Validate file type/size and safely decode object keys.",
      "Implement thumbnail generation with bounded memory, timeout and temporary storage. Use an idempotency key such as bucket, key and version ID for versioned uploads; do not assume exactly-once delivery.",
      "Record processing state/results, configure asynchronous failure handling and alarms, and test duplicate events, invalid images, large files and permission failures.",
      "Package dependencies and deploy through reviewed infrastructure/code changes. Confirm that generated output cannot recursively trigger processing, and document cost/concurrency limits."
    ],
    "sources": [
      "https://docs.aws.amazon.com/lambda/latest/dg/with-s3.html",
      "https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html"
    ],
    "sourceTitles": [
      "S3 notifications with Lambda",
      "Lambda best practices"
    ]
  },
  {
    "id": "aws-20",
    "title": "Update servers with minimal downtime",
    "category": "Operations",
    "question": "A customer-facing service needs OS and application updates. It has multiple EC2 instances behind a load balancer. Which release approach best preserves service?",
    "choices": [
      "Reboot every instance at the same time and rely on DNS retries.",
      "Promise zero downtime even with one instance, local-only sessions and incompatible database changes.",
      "Roll out tested replacements in controlled batches or use blue/green, maintaining healthy capacity, draining connections and monitoring rollback signals."
    ],
    "correct": 2,
    "explanation": "Availability during updates depends on redundancy, application compatibility and health checks. A single-node or stateful design may require planned downtime.",
    "answer": [
      "Run enough capacity across Availability Zones and externalize session/state where appropriate. Test health checks, dependency resilience and backward-compatible data/schema changes.",
      "Build and test a patched image or release, then reference it in a versioned launch template. Keep a known-good version and a realistic rollback plan.",
      "For an Auto Scaling instance refresh, choose rolling batches, minimum/maximum healthy capacity, warmup, checkpoints and alarms deliberately. Ensure quotas and spare capacity allow the plan.",
      "Drain old targets and allow active requests to finish while new targets become healthy. Blue/green is another option when traffic switching and data compatibility are controlled.",
      "Observe error rate, latency and business signals; stop or roll back when thresholds fail. Stateful migrations and incompatible schemas need separate coordination, so do not promise unconditional zero downtime."
    ],
    "sources": [
      "https://docs.aws.amazon.com/autoscaling/ec2/userguide/instance-refresh-overview.html"
    ],
    "sourceTitles": [
      "Auto Scaling instance refresh"
    ]
  }
];
