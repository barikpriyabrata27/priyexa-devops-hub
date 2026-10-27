/* Educational simulations only; never contacts AWS or executes commands. */
globalThis.AwsLabs = {
  cases: {
  "aws-01": {
    "description": "Read an invoice in the same account. The bucket stays private; HTTPS reachability is assumed.",
    "nodes": [
      "EC2 workload",
      "Instance profile",
      "IAM authorization",
      "Private S3 bucket"
    ],
    "controls": [
      {
        "id": "identity",
        "label": "Application credentials",
        "options": [
          {
            "value": "ready",
            "label": "EC2 role · temporary credentials"
          },
          {
            "value": "missing",
            "label": "Embedded long-lived key"
          }
        ],
        "expected": "ready",
        "pass": "The SDK uses rotating role credentials.",
        "fail": "Replace the embedded key with an EC2 instance profile.",
        "node": 1
      },
      {
        "id": "permission",
        "label": "S3 permission",
        "options": [
          {
            "value": "ready",
            "label": "GetObject · invoice prefix"
          },
          {
            "value": "missing",
            "label": "No object permission"
          }
        ],
        "expected": "ready",
        "pass": "The role permits the requested invoice object.",
        "fail": "The role cannot read this object prefix.",
        "node": 2
      },
      {
        "id": "scope",
        "label": "Permission scope",
        "options": [
          {
            "value": "ready",
            "label": "Invoice prefix only"
          },
          {
            "value": "missing",
            "label": "Administrator access"
          }
        ],
        "expected": "ready",
        "pass": "The grant is limited to the needed prefix.",
        "fail": "The read might work, but administrator access fails the least-privilege goal.",
        "node": 2
      }
    ],
    "success": "The simulated invoice read is authorized with scoped temporary credentials.",
    "command": "aws s3api get-object --bucket amzn-s3-demo-invoices --key invoices/example.pdf invoice.pdf"
  },
  "aws-02": {
    "description": "Read same-Region S3 from an isolated subnet. DNS, HTTPS security rules and object ownership are assumed correct.",
    "nodes": [
      "Private EC2",
      "Subnet route table",
      "S3 gateway endpoint",
      "S3 authorization"
    ],
    "controls": [
      {
        "id": "path",
        "label": "S3 route",
        "options": [
          {
            "value": "ready",
            "label": "Gateway endpoint route"
          },
          {
            "value": "missing",
            "label": "No S3 route"
          }
        ],
        "expected": "ready",
        "pass": "The S3 prefix-list route targets the gateway endpoint.",
        "fail": "There is no route to S3. Associate the endpoint with this subnet route table.",
        "node": 2
      },
      {
        "id": "role",
        "label": "Workload role",
        "options": [
          {
            "value": "ready",
            "label": "Allows GetObject"
          },
          {
            "value": "missing",
            "label": "No S3 grant"
          }
        ],
        "expected": "ready",
        "pass": "The EC2 role permits this object read.",
        "fail": "Private connectivity alone does not grant S3 permissions.",
        "node": 3
      },
      {
        "id": "endpoint",
        "label": "Endpoint policy",
        "options": [
          {
            "value": "ready",
            "label": "Allows this role + bucket"
          },
          {
            "value": "missing",
            "label": "Denies this bucket"
          }
        ],
        "expected": "ready",
        "pass": "The endpoint policy permits the request to continue.",
        "fail": "The endpoint policy blocks this bucket even though the role allows it.",
        "node": 2
      }
    ],
    "success": "The read uses the endpoint path; no private IP is assigned to the S3 bucket.",
    "command": "aws s3api get-object --bucket amzn-s3-demo-invoices --key invoices/example.pdf invoice.pdf"
  },
  "aws-03": {
    "description": "Read an SSE-KMS invoice in B using the EC2 role from A directly. Connectivity and bucket ownership are assumed correct.",
    "nodes": [
      "EC2 · Account A",
      "Role policy · A",
      "Bucket policy · B",
      "KMS key · B",
      "S3 object · B"
    ],
    "controls": [
      {
        "id": "role",
        "label": "Account A identity policy",
        "options": [
          {
            "value": "ready",
            "label": "Allows B invoice read"
          },
          {
            "value": "missing",
            "label": "No S3 grant in A"
          }
        ],
        "expected": "ready",
        "pass": "A authorizes its role to read B’s invoice.",
        "fail": "Add the required object permission to A’s role.",
        "node": 1
      },
      {
        "id": "bucket",
        "label": "Account B bucket policy",
        "options": [
          {
            "value": "ready",
            "label": "Allows A’s role ARN"
          },
          {
            "value": "missing",
            "label": "No bucket grant to A"
          }
        ],
        "expected": "ready",
        "pass": "B accepts the exact role principal from A.",
        "fail": "The bucket owner has not allowed A’s role.",
        "node": 2
      },
      {
        "id": "key",
        "label": "SSE-KMS authorization",
        "options": [
          {
            "value": "ready",
            "label": "IAM + key allow decrypt"
          },
          {
            "value": "missing",
            "label": "KMS access missing"
          }
        ],
        "expected": "ready",
        "pass": "Both sides permit the needed decrypt operation.",
        "fail": "The S3 grant is insufficient: authorize the customer-managed KMS key too.",
        "node": 3
      }
    ],
    "success": "The cross-account read passes identity, bucket and KMS authorization.",
    "command": "aws s3api get-object --bucket amzn-s3-demo-invoices --key invoices/example.pdf invoice.pdf"
  },
  "aws-04": {
    "description": "Use a gateway endpoint in A to read B’s same-Region S3 bucket. KMS permissions, HTTPS rules and DNS are assumed correct.",
    "nodes": [
      "EC2 · Account A",
      "S3 endpoint · A",
      "Role policy · A",
      "Bucket policy · B",
      "S3 object · B"
    ],
    "controls": [
      {
        "id": "path",
        "label": "Private network path",
        "options": [
          {
            "value": "ready",
            "label": "Gateway endpoint in A"
          },
          {
            "value": "missing",
            "label": "No endpoint route"
          }
        ],
        "expected": "ready",
        "pass": "The request uses A’s S3 gateway endpoint.",
        "fail": "Create and associate the same-Region S3 gateway endpoint.",
        "node": 1
      },
      {
        "id": "identity",
        "label": "Account A role policy",
        "options": [
          {
            "value": "ready",
            "label": "Allows B bucket / prefix"
          },
          {
            "value": "missing",
            "label": "No identity allow"
          }
        ],
        "expected": "ready",
        "pass": "A’s role has the necessary S3 permission.",
        "fail": "A must authorize its own role as well as B authorizing the resource.",
        "node": 2
      },
      {
        "id": "bucket",
        "label": "Account B bucket policy",
        "options": [
          {
            "value": "ready",
            "label": "Role + SourceVpce match"
          },
          {
            "value": "missing",
            "label": "Wrong SourceVpce"
          }
        ],
        "expected": "ready",
        "pass": "B allows the principal arriving through the expected endpoint.",
        "fail": "The endpoint condition in B rejects this request.",
        "node": 3
      },
      {
        "id": "endpoint",
        "label": "Endpoint policy in A",
        "options": [
          {
            "value": "ready",
            "label": "Permits B bucket / prefix"
          },
          {
            "value": "missing",
            "label": "Only A buckets allowed"
          }
        ],
        "expected": "ready",
        "pass": "The endpoint permits this destination bucket.",
        "fail": "Include B’s required bucket and object resources in A’s endpoint policy.",
        "node": 1
      }
    ],
    "success": "Private routing and cross-account authorization both pass in this model.",
    "command": "aws s3api get-object --bucket amzn-s3-demo-invoices --key invoices/example.pdf invoice.pdf"
  },
  "aws-05": {
    "description": "Rehearse an on-prem application rehost. This models cutover readiness; it does not replicate servers or migrate production data.",
    "nodes": [
      "On-prem app",
      "Target foundation",
      "MGN replication",
      "Acceptance test",
      "Traffic cutover"
    ],
    "controls": [
      {
        "id": "foundation",
        "label": "Target foundation",
        "options": [
          {
            "value": "ready",
            "label": "Dependencies prepared"
          },
          {
            "value": "missing",
            "label": "Dependencies unknown"
          }
        ],
        "expected": "ready",
        "pass": "Target networking, access and dependencies are documented.",
        "fail": "Discover dependencies and prepare secure target infrastructure before cutover.",
        "node": 1
      },
      {
        "id": "replication",
        "label": "Replication state",
        "options": [
          {
            "value": "ready",
            "label": "Healthy · cutover caught up"
          },
          {
            "value": "missing",
            "label": "Replication lag / errors"
          }
        ],
        "expected": "ready",
        "pass": "The rehearsal reports replication ready after the write pause.",
        "fail": "Do not switch traffic while required source changes are missing.",
        "node": 2
      },
      {
        "id": "rehearsal",
        "label": "Acceptance and recovery",
        "options": [
          {
            "value": "ready",
            "label": "Tests + rollback rehearsed"
          },
          {
            "value": "missing",
            "label": "Untested cutover"
          }
        ],
        "expected": "ready",
        "pass": "Acceptance tests and the write-aware rollback procedure pass.",
        "fail": "Rehearse functional tests and rollback before moving production traffic.",
        "node": 3
      }
    ],
    "success": "The simulation permits a controlled traffic switch after the approved write pause."
  },
  "aws-06": {
    "description": "Rehearse a supported database migration with DMS full load + CDC. Schema conversion, users and engine prerequisites are handled separately.",
    "nodes": [
      "Source database",
      "Full load + CDC",
      "Data validation",
      "Write pause",
      "Target cutover"
    ],
    "controls": [
      {
        "id": "cdc",
        "label": "Replication readiness",
        "options": [
          {
            "value": "ready",
            "label": "Full load + CDC caught up"
          },
          {
            "value": "missing",
            "label": "CDC lag remains"
          }
        ],
        "expected": "ready",
        "pass": "The source write pause leaves no modeled replication backlog.",
        "fail": "Pause writes and let remaining changes apply before switching.",
        "node": 1
      },
      {
        "id": "validation",
        "label": "Data checks",
        "options": [
          {
            "value": "ready",
            "label": "Data validation passed"
          },
          {
            "value": "missing",
            "label": "Unresolved mismatches"
          }
        ],
        "expected": "ready",
        "pass": "The final validation checks pass.",
        "fail": "Resolve missing or mismatched data and validate application behavior.",
        "node": 2
      },
      {
        "id": "rollback",
        "label": "Rollback plan",
        "options": [
          {
            "value": "ready",
            "label": "Target writes reconciled"
          },
          {
            "value": "missing",
            "label": "Blind switch to source"
          }
        ],
        "expected": "ready",
        "pass": "Rollback accounts for writes accepted on the new target.",
        "fail": "Blindly returning to the source can lose target-side writes.",
        "node": 4
      }
    ],
    "success": "The modeled database cutover is ready; real CDC latency and engine compatibility still need testing."
  },
  "aws-07": {
    "description": "Review a simplified security baseline. A passing result covers these three controls, not a complete security audit.",
    "nodes": [
      "People & workloads",
      "Least privilege",
      "Private data tier",
      "Audit & recovery"
    ],
    "controls": [
      {
        "id": "identity",
        "label": "Identity model",
        "options": [
          {
            "value": "ready",
            "label": "Federation + roles + MFA"
          },
          {
            "value": "missing",
            "label": "Shared administrator keys"
          }
        ],
        "expected": "ready",
        "pass": "People and workloads use individual, short-lived access.",
        "fail": "Replace shared administrator keys with appropriate identities and roles.",
        "node": 0
      },
      {
        "id": "data",
        "label": "Data exposure",
        "options": [
          {
            "value": "ready",
            "label": "Private + scoped + encrypted"
          },
          {
            "value": "missing",
            "label": "Public database access"
          }
        ],
        "expected": "ready",
        "pass": "The data tier has scoped network access and encryption.",
        "fail": "Remove unnecessary public database access and restrict its callers.",
        "node": 2
      },
      {
        "id": "operations",
        "label": "Operational controls",
        "options": [
          {
            "value": "ready",
            "label": "Logs + patches + restore tests"
          },
          {
            "value": "missing",
            "label": "No audit / restore tests"
          }
        ],
        "expected": "ready",
        "pass": "Audit records, patching and recovery tests are included.",
        "fail": "Enable audit/monitoring and rehearse patching, restore and incident response.",
        "node": 3
      }
    ],
    "success": "The selected security baseline passes; other risks require workload-specific review."
  },
  "aws-08": {
    "description": "Trace private-worker outbound IPv4. Security groups, network ACLs and DNS are assumed to allow the required traffic.",
    "nodes": [
      "Private EC2",
      "Private default route",
      "Public NAT gateway",
      "Internet gateway",
      "Internet"
    ],
    "controls": [
      {
        "id": "route",
        "label": "Private subnet default route",
        "options": [
          {
            "value": "ready",
            "label": "Default route → public NAT"
          },
          {
            "value": "missing",
            "label": "Default route → IGW only"
          }
        ],
        "expected": "ready",
        "pass": "Private traffic selects the public NAT gateway.",
        "fail": "An IGW route alone cannot give a private IPv4-only instance internet access.",
        "node": 1
      },
      {
        "id": "nat",
        "label": "Public NAT gateway",
        "options": [
          {
            "value": "ready",
            "label": "Available · Elastic IP"
          },
          {
            "value": "missing",
            "label": "Unavailable"
          }
        ],
        "expected": "ready",
        "pass": "The public NAT gateway translates and tracks the outbound connection.",
        "fail": "Restore an available public NAT gateway with an Elastic IP.",
        "node": 2
      },
      {
        "id": "igw",
        "label": "NAT subnet route",
        "options": [
          {
            "value": "ready",
            "label": "Default route → IGW"
          },
          {
            "value": "missing",
            "label": "No IGW route"
          }
        ],
        "expected": "ready",
        "pass": "The IGW maps the NAT address to its Elastic IP.",
        "fail": "The public NAT subnet also needs an internet gateway path.",
        "node": 3
      }
    ],
    "success": "The simulated outbound request succeeds; unsolicited inbound access remains unavailable.",
    "command": "aws ec2 describe-route-tables --route-table-ids rtb-example"
  },
  "aws-09": {
    "description": "Diagnose EC2 → private RDS TCP/5432. The database listener and credentials are assumed healthy; these controls isolate network faults.",
    "nodes": [
      "Application",
      "DNS resolution",
      "Forward / return routes",
      "SG + NACL checks",
      "Database listener"
    ],
    "controls": [
      {
        "id": "dns",
        "label": "Database DNS result",
        "options": [
          {
            "value": "ready",
            "label": "Correct private RDS address"
          },
          {
            "value": "missing",
            "label": "Wrong / stale address"
          }
        ],
        "expected": "ready",
        "pass": "DNS resolves to the intended private database.",
        "fail": "Correct the DNS target before editing unrelated firewall rules.",
        "node": 1
      },
      {
        "id": "routes",
        "label": "Route reachability",
        "options": [
          {
            "value": "ready",
            "label": "Forward + return routes"
          },
          {
            "value": "missing",
            "label": "Return route missing"
          }
        ],
        "expected": "ready",
        "pass": "Both directions have matching routes.",
        "fail": "A one-way route is insufficient; inspect the return path.",
        "node": 2
      },
      {
        "id": "rules",
        "label": "Security controls",
        "options": [
          {
            "value": "ready",
            "label": "SG + NACL allow both ways"
          },
          {
            "value": "missing",
            "label": "NACL blocks return ports"
          }
        ],
        "expected": "ready",
        "pass": "The modeled SG and stateless NACL checks pass.",
        "fail": "Allow the required return traffic in the NACL; do not open every port.",
        "node": 3
      }
    ],
    "success": "The modeled TCP path is available. Static configuration alone does not prove application health.",
    "command": "aws ec2 describe-route-tables --route-table-ids rtb-example"
  },
  "aws-10": {
    "description": "Connect production to shared services through TGW while isolating development. CIDRs do not overlap and attachments are healthy.",
    "nodes": [
      "Production VPC",
      "VPC route to TGW",
      "TGW route table",
      "Shared-services VPC",
      "Return route"
    ],
    "controls": [
      {
        "id": "vpc",
        "label": "VPC routes",
        "options": [
          {
            "value": "ready",
            "label": "Remote CIDRs → TGW"
          },
          {
            "value": "missing",
            "label": "Attachment only"
          }
        ],
        "expected": "ready",
        "pass": "The subnet routes send remote CIDRs to the TGW.",
        "fail": "An attachment alone does not update your VPC subnet routes.",
        "node": 1
      },
      {
        "id": "segmentation",
        "label": "TGW routing policy",
        "options": [
          {
            "value": "ready",
            "label": "Prod ↔ shared · dev isolated"
          },
          {
            "value": "missing",
            "label": "All attachments share routes"
          }
        ],
        "expected": "ready",
        "pass": "Associations and propagation preserve the intended isolation.",
        "fail": "A flat shared route table violates this lab’s segmentation goal.",
        "node": 2
      },
      {
        "id": "return",
        "label": "Return path",
        "options": [
          {
            "value": "ready",
            "label": "Return routes present"
          },
          {
            "value": "missing",
            "label": "No return route"
          }
        ],
        "expected": "ready",
        "pass": "Shared services can route the response back to production.",
        "fail": "Add the required return routes and verify both directions.",
        "node": 4
      }
    ],
    "success": "Production reaches shared services while the modeled development route stays isolated."
  },
  "aws-11": {
    "description": "Choose entry points for an HTTPS API and a separate custom TCP service. Listener permissions and certificates are assumed correct.",
    "nodes": [
      "HTTPS / TCP clients",
      "Load balancer choice",
      "Listener rules",
      "Healthy targets"
    ],
    "controls": [
      {
        "id": "api",
        "label": "HTTPS API entry",
        "options": [
          {
            "value": "ready",
            "label": "ALB · host/path rules"
          },
          {
            "value": "missing",
            "label": "NLB · expecting path rules"
          }
        ],
        "expected": "ready",
        "pass": "ALB evaluates the API’s HTTP host/path rules.",
        "fail": "NLB does not provide ALB-style HTTP path routing.",
        "node": 1
      },
      {
        "id": "tcp",
        "label": "Custom TCP entry",
        "options": [
          {
            "value": "ready",
            "label": "NLB · static entry addresses"
          },
          {
            "value": "missing",
            "label": "ALB · custom TCP"
          }
        ],
        "expected": "ready",
        "pass": "NLB fits the custom TCP and static-address requirements.",
        "fail": "ALB does not accept arbitrary custom TCP listener protocols.",
        "node": 1
      },
      {
        "id": "health",
        "label": "Target readiness",
        "options": [
          {
            "value": "ready",
            "label": "Healthy targets across AZs"
          },
          {
            "value": "missing",
            "label": "All targets unhealthy"
          }
        ],
        "expected": "ready",
        "pass": "Multiple AZs have healthy application targets.",
        "fail": "Restore healthy targets before treating the entry layer as ready.",
        "node": 3
      }
    ],
    "success": "The two services use load balancers appropriate to their protocols."
  },
  "aws-12": {
    "description": "Use Session Manager to administer a private EC2 instance without public inbound SSH. This is an alternative to a hardened bastion.",
    "nodes": [
      "Operator identity",
      "Session authorization",
      "SSM managed node",
      "Private EC2 session"
    ],
    "controls": [
      {
        "id": "operator",
        "label": "Operator access",
        "options": [
          {
            "value": "ready",
            "label": "Scoped IAM session access"
          },
          {
            "value": "missing",
            "label": "Unauthorized operator"
          }
        ],
        "expected": "ready",
        "pass": "The operator has the required scoped session permissions.",
        "fail": "Authorize the operator’s identity for this managed node.",
        "node": 1
      },
      {
        "id": "agent",
        "label": "Managed-node setup",
        "options": [
          {
            "value": "ready",
            "label": "SSM agent + node role ready"
          },
          {
            "value": "missing",
            "label": "Agent / node role missing"
          }
        ],
        "expected": "ready",
        "pass": "The node is registered with the required SSM setup.",
        "fail": "Configure the agent and appropriate managed-node role permissions.",
        "node": 2
      },
      {
        "id": "connectivity",
        "label": "SSM service connectivity",
        "options": [
          {
            "value": "ready",
            "label": "SSM service path available"
          },
          {
            "value": "missing",
            "label": "No SSM service path"
          }
        ],
        "expected": "ready",
        "pass": "The agent can reach the required service endpoints.",
        "fail": "Provide the required SSM connectivity; opening public inbound SSH is not the fix.",
        "node": 2
      }
    ],
    "success": "The simulated session opens without an inbound SSH rule. SSH/port-forwarding payload logging has separate limitations."
  },
  "aws-13": {
    "description": "Enroll MFA separately for an IAM user and an account retaining root credentials. No codes, secrets or real account details are entered.",
    "nodes": [
      "IAM user",
      "User MFA enrollment",
      "Root console identity",
      "Root MFA enrollment",
      "Sign-in verification"
    ],
    "controls": [
      {
        "id": "user",
        "label": "IAM user enrollment",
        "options": [
          {
            "value": "ready",
            "label": "User MFA device assigned"
          },
          {
            "value": "missing",
            "label": "No user MFA device"
          }
        ],
        "expected": "ready",
        "pass": "The IAM user has its own enrolled MFA device.",
        "fail": "Enroll a device for the IAM user; another identity’s MFA does not protect it.",
        "node": 1
      },
      {
        "id": "root",
        "label": "Root enrollment path",
        "options": [
          {
            "value": "ready",
            "label": "Root console · MFA enrolled"
          },
          {
            "value": "missing",
            "label": "Treat root as an IAM user"
          }
        ],
        "expected": "ready",
        "pass": "Root MFA is enrolled through the separate console workflow.",
        "fail": "Root is not an IAM user. Do not use an IAM-user command with the root email.",
        "node": 3
      },
      {
        "id": "recovery",
        "label": "Verification and recovery",
        "options": [
          {
            "value": "ready",
            "label": "Sign-ins + recovery verified"
          },
          {
            "value": "missing",
            "label": "No verification / recovery"
          }
        ],
        "expected": "ready",
        "pass": "Both enrollments are verified with an approved recovery process.",
        "fail": "Verify the sign-ins and protect recovery contact information.",
        "node": 4
      }
    ],
    "success": "Both modeled identities have verified MFA. Organizations accounts with removed root credentials use a different root-access design."
  },
  "aws-14": {
    "description": "Investigate elevated latency and an instance termination. This models evidence selection, not a query against real logs.",
    "nodes": [
      "Incident timeline",
      "CloudWatch health",
      "CloudTrail activity",
      "Correlated evidence"
    ],
    "controls": [
      {
        "id": "performance",
        "label": "Performance evidence",
        "options": [
          {
            "value": "ready",
            "label": "CloudWatch metrics + logs"
          },
          {
            "value": "missing",
            "label": "CloudTrail alone for latency"
          }
        ],
        "expected": "ready",
        "pass": "Operational telemetry explains the performance timeline.",
        "fail": "API audit records do not replace application latency metrics and logs.",
        "node": 1
      },
      {
        "id": "audit",
        "label": "Change evidence",
        "options": [
          {
            "value": "ready",
            "label": "CloudTrail termination event"
          },
          {
            "value": "missing",
            "label": "CPU chart as actor identity"
          }
        ],
        "expected": "ready",
        "pass": "The audit event identifies the principal/session and API action.",
        "fail": "A CPU chart cannot identify who terminated an instance.",
        "node": 2
      },
      {
        "id": "coverage",
        "label": "Evidence coverage",
        "options": [
          {
            "value": "ready",
            "label": "Events + retention configured"
          },
          {
            "value": "missing",
            "label": "Required records missing"
          }
        ],
        "expected": "ready",
        "pass": "The selected event coverage and retention include the incident.",
        "fail": "Missing coverage or expired records prevent a complete investigation.",
        "node": 3
      }
    ],
    "success": "The modeled timeline combines operational and audit evidence; configured data-event coverage is separate."
  },
  "aws-15": {
    "description": "Review an internet-facing application during a volumetric DDoS exercise. Baseline AWS protections are automatic; Advanced is an additional option.",
    "nodes": [
      "Internet traffic",
      "Resilient edge",
      "Protected origin",
      "Detection & response"
    ],
    "controls": [
      {
        "id": "architecture",
        "label": "Entry architecture",
        "options": [
          {
            "value": "ready",
            "label": "Resilient edge + origin guard"
          },
          {
            "value": "missing",
            "label": "Unrestricted origin bypass"
          }
        ],
        "expected": "ready",
        "pass": "The origin is not a trivial bypass around the intended entry layer.",
        "fail": "Reduce unnecessary origin exposure and design for resilient ingress.",
        "node": 1
      },
      {
        "id": "protection",
        "label": "Protection review",
        "options": [
          {
            "value": "ready",
            "label": "Baseline + Advanced reviewed"
          },
          {
            "value": "missing",
            "label": "Assume no default protection"
          }
        ],
        "expected": "ready",
        "pass": "The team understands automatic baseline protection and evaluates additional needs.",
        "fail": "AWS provides baseline protections; assess coverage before choosing additional controls.",
        "node": 2
      },
      {
        "id": "response",
        "label": "Response readiness",
        "options": [
          {
            "value": "ready",
            "label": "Alarms + runbook tested"
          },
          {
            "value": "missing",
            "label": "No incident ownership"
          }
        ],
        "expected": "ready",
        "pass": "The team can detect and respond using the agreed runbook.",
        "fail": "Assign incident ownership and test monitoring and response.",
        "node": 3
      }
    ],
    "success": "The modeled DDoS readiness checks pass. This is not an attack generator or an availability guarantee."
  },
  "aws-16": {
    "description": "Tune WAF for an ALB-hosted HTTPS application. This models enforcement readiness rather than inspecting actual malicious payloads.",
    "nodes": [
      "HTTPS requests",
      "Associated web ACL",
      "Rule evaluation",
      "Application origin"
    ],
    "controls": [
      {
        "id": "resource",
        "label": "Protection association",
        "options": [
          {
            "value": "ready",
            "label": "Web ACL attached to ALB"
          },
          {
            "value": "missing",
            "label": "Web ACL not associated"
          }
        ],
        "expected": "ready",
        "pass": "The supported application resource uses the web ACL.",
        "fail": "An unattached web ACL cannot inspect this application’s requests.",
        "node": 1
      },
      {
        "id": "tuning",
        "label": "Rule rollout",
        "options": [
          {
            "value": "ready",
            "label": "Count reviewed + rules tuned"
          },
          {
            "value": "missing",
            "label": "Untested blanket blocking"
          }
        ],
        "expected": "ready",
        "pass": "The modeled rules were observed before enforcement.",
        "fail": "Review legitimate traffic and tune rules before enforcing broadly.",
        "node": 2
      },
      {
        "id": "rates",
        "label": "Rate controls",
        "options": [
          {
            "value": "ready",
            "label": "Workload-aware rate limits"
          },
          {
            "value": "missing",
            "label": "Blocks shared clients"
          }
        ],
        "expected": "ready",
        "pass": "Rate controls account for legitimate shared-client traffic.",
        "fail": "Tune aggregation and thresholds to avoid blocking legitimate users.",
        "node": 2
      }
    ],
    "success": "The modeled ACL is ready for a monitored rollout; application security fixes remain necessary."
  },
  "aws-17": {
    "description": "Publish an HTTPS hostname pointing to an existing healthy ALB. DNS caches can delay changes; Route 53 does not host application compute.",
    "nodes": [
      "Browser DNS query",
      "Delegated hosted zone",
      "Alias → ALB",
      "HTTPS listener",
      "Healthy application"
    ],
    "controls": [
      {
        "id": "delegation",
        "label": "Authoritative DNS",
        "options": [
          {
            "value": "ready",
            "label": "Correct zone delegation"
          },
          {
            "value": "missing",
            "label": "Wrong name servers"
          }
        ],
        "expected": "ready",
        "pass": "Resolvers can discover the intended authoritative zone.",
        "fail": "Correct registrar delegation; records in an undelegated zone will not serve the domain.",
        "node": 1
      },
      {
        "id": "alias",
        "label": "Application DNS record",
        "options": [
          {
            "value": "ready",
            "label": "Alias → intended ALB"
          },
          {
            "value": "missing",
            "label": "Record → old target"
          }
        ],
        "expected": "ready",
        "pass": "The hostname resolves through the ALB alias.",
        "fail": "Fix the alias target; DNS records do not deploy or move application compute.",
        "node": 2
      },
      {
        "id": "tls",
        "label": "HTTPS readiness",
        "options": [
          {
            "value": "ready",
            "label": "Matching cert + listener"
          },
          {
            "value": "missing",
            "label": "Hostname not in certificate"
          }
        ],
        "expected": "ready",
        "pass": "The application endpoint is ready for this hostname.",
        "fail": "Provision the matching certificate and configure the HTTPS listener.",
        "node": 3
      }
    ],
    "success": "The simulated hostname reaches the ALB over HTTPS after DNS resolution."
  },
  "aws-18": {
    "description": "Deliver static images and an authenticated API through CloudFront. The S3 origin is a REST endpoint, not a website endpoint.",
    "nodes": [
      "Viewer HTTPS",
      "CloudFront behavior",
      "Cache policy",
      "Private S3 / API origin"
    ],
    "controls": [
      {
        "id": "origin",
        "label": "S3 origin access",
        "options": [
          {
            "value": "ready",
            "label": "OAC + private bucket policy"
          },
          {
            "value": "missing",
            "label": "Public bucket / open origin"
          }
        ],
        "expected": "ready",
        "pass": "CloudFront is authorized to read the private S3 origin.",
        "fail": "Use an appropriate OAC and bucket policy rather than public bucket access.",
        "node": 3
      },
      {
        "id": "cache",
        "label": "Authenticated API caching",
        "options": [
          {
            "value": "ready",
            "label": "Safe API cache behavior"
          },
          {
            "value": "missing",
            "label": "Cache ignores user context"
          }
        ],
        "expected": "ready",
        "pass": "The modeled cache behavior avoids sharing personalized responses.",
        "fail": "Do not cache user-specific responses with a key that ignores identity context.",
        "node": 2
      },
      {
        "id": "tls",
        "label": "Transport security",
        "options": [
          {
            "value": "ready",
            "label": "Viewer + origin HTTPS"
          },
          {
            "value": "missing",
            "label": "HTTP origin path"
          }
        ],
        "expected": "ready",
        "pass": "Both viewer and origin connections use the intended HTTPS configuration.",
        "fail": "Configure the relevant viewer/origin TLS settings and signing behavior.",
        "node": 1
      }
    ],
    "success": "The simulated delivery separates static caching from authenticated API responses."
  },
  "aws-19": {
    "description": "Rehearse the illustrative S3 thumbnail pipeline with a repeated event. There are no real uploads, image transforms or personal project claims.",
    "nodes": [
      "Upload prefix",
      "S3 notification",
      "Lambda processing",
      "Idempotency check",
      "Thumbnail output"
    ],
    "controls": [
      {
        "id": "destination",
        "label": "Output location",
        "options": [
          {
            "value": "ready",
            "label": "Separate output location"
          },
          {
            "value": "missing",
            "label": "Same unfiltered prefix"
          }
        ],
        "expected": "ready",
        "pass": "Generated output cannot trigger the same pipeline again.",
        "fail": "The output re-enters the trigger and risks recursive invocations.",
        "node": 4
      },
      {
        "id": "duplicates",
        "label": "Duplicate-event handling",
        "options": [
          {
            "value": "ready",
            "label": "Object-version idempotency"
          },
          {
            "value": "missing",
            "label": "Assume exactly-once events"
          }
        ],
        "expected": "ready",
        "pass": "The repeated modeled event is recognized rather than processed twice.",
        "fail": "Handle duplicate delivery with an appropriate idempotency key and state.",
        "node": 3
      },
      {
        "id": "operations",
        "label": "Execution safeguards",
        "options": [
          {
            "value": "ready",
            "label": "Scoped + bounded + monitored"
          },
          {
            "value": "missing",
            "label": "Admin access / no limits"
          }
        ],
        "expected": "ready",
        "pass": "Execution has scoped access, bounded resources and failure handling.",
        "fail": "Constrain permissions/resources and configure failure handling and alarms.",
        "node": 2
      }
    ],
    "success": "The repeated simulated event is handled idempotently without recursive output notifications."
  },
  "aws-20": {
    "description": "Rehearse a rolling replacement behind a load balancer. Database changes are assumed backward-compatible; the model cannot guarantee zero downtime.",
    "nodes": [
      "Current fleet",
      "New launch template",
      "Healthy replacement",
      "Connection drain",
      "Rolling promotion"
    ],
    "controls": [
      {
        "id": "capacity",
        "label": "Availability budget",
        "options": [
          {
            "value": "ready",
            "label": "Redundant + spare capacity"
          },
          {
            "value": "missing",
            "label": "Single node / no spare"
          }
        ],
        "expected": "ready",
        "pass": "Healthy capacity remains available during replacement.",
        "fail": "Add redundancy and enough capacity before promising uninterrupted service.",
        "node": 0
      },
      {
        "id": "health",
        "label": "Replacement checks",
        "options": [
          {
            "value": "ready",
            "label": "Healthy after warmup"
          },
          {
            "value": "missing",
            "label": "Promote before ready"
          }
        ],
        "expected": "ready",
        "pass": "The new target is healthy after its warmup period.",
        "fail": "Wait for meaningful application health before shifting traffic.",
        "node": 2
      },
      {
        "id": "release",
        "label": "Release safeguards",
        "options": [
          {
            "value": "ready",
            "label": "Drain + checkpoints + rollback"
          },
          {
            "value": "missing",
            "label": "Terminate old fleet at once"
          }
        ],
        "expected": "ready",
        "pass": "Traffic drains and a checkpoint precedes further promotion.",
        "fail": "Drain active requests and use monitored checkpoints with a viable rollback.",
        "node": 3
      }
    ],
    "success": "The modeled batch can advance while healthy targets remain; state and schema changes still need coordination."
  }
},
  initial(id, working = false) {
    const lab = Object.hasOwn(this.cases, id) ? this.cases[id] : null;
    if (!lab) return null;
    return Object.fromEntries(lab.controls.map((control, index) => [
      control.id, !working && index === lab.controls.length - 1 ? 'missing' : control.expected
    ]));
  },
  evaluate(id, state) {
    const lab = Object.hasOwn(this.cases, id) ? this.cases[id] : null;
    if (!lab) return null;
    const checks = lab.controls.map(control => {
      const passed = state?.[control.id] === control.expected;
      return { id: control.id, label: control.label, node: control.node,
        passed, message: passed ? control.pass : control.fail };
    });
    return { passed: checks.every(check => check.passed), checks,
      outcome: checks.every(check => check.passed) ? lab.success : 'Needs attention: ' + checks.filter(check => !check.passed).map(check => check.message).join(' ') };
  }
};
