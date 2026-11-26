# DevOps Interview Practice — 26 November 2026

DevOps Interview Practice — 26 November 2026
Questions, refined answers, and technical corrections from today's spoken practice.

Question 1: Explain CI/CD.
Answer: CI integrates code frequently, runs tests and security checks, builds a versioned artifact, and stores it in a registry. CD deploys or delivers that artifact to environments with verification and approvals as needed.

Question 2: What makes a good rollback plan?
Answer: Use immutable/versioned artifacts, automated health checks, clear failure triggers, a tested rollback procedure, and post-rollback validation. Database changes need special compatibility planning.

Question 3: How do you troubleshoot CrashLoopBackOff?
Answer: Check kubectl get pods, kubectl describe pod, kubectl logs --previous, events, probes, configuration, OOMKilled, dependencies and recent deployments.

Question 4: Explain Infrastructure as Code and a risk.
Answer: IaC defines infrastructure in version-controlled configuration such as Terraform or CloudFormation. Benefit: repeatability and reviewability. Risk: incorrect changes can impact many resources; mitigate with plans, reviews and policy checks.

Question 5: Terraform plan shows unexpected changes. What next?
Answer: Do not apply. Inspect the diff, variables, provider versions, state and AWS resources; identify drift or configuration changes. Reconcile intentionally through reviewed code, import when appropriate, and re-plan.

Question 6: Where do security scans belong in CI/CD?
Answer: Run SAST, secret and dependency scanning early; scan built images/artifacts; run DAST against a deployed test/staging application; gate promotion based on policy and severity.

Question 7: Can trunk-based development deploy to test before production?
Answer: Yes. Merge to main, build once, deploy the immutable artifact to test/staging, validate including DAST, then promote the same artifact to production. No release branch is required.

Question 8: How is GitFlow different?
Answer: Feature branches merge into develop; release branches stabilize versions before merging to main; production hotfixes branch from main and are merged back to main and develop. Both models still need CI gates.

Question 9: Why create a production hotfix from main?
Answer: Main tracks the released production baseline. Develop may contain unfinished changes; branching from main minimizes unrelated risk.

Question 10: Kubernetes deploy succeeds but load balancer returns 502. What checks?
Answer: Inspect pod readiness and application responses; Service selectors, endpoints and target ports; ingress/load-balancer target health, routing and protocol; then logs and recent configuration changes.

Question 11: High latency after deployment: first five minutes?
Answer: Compare before/after latency and errors; check dashboards and affected version; test internal versus external paths; inspect pods, saturation, dependencies and ingress; roll back or mitigate if customer impact is significant.

Question 12: How do you handle AWS Terraform drift and team communication?
Answer: Confirm drift with plan and cloud inspection, identify who changed what and why, agree on desired state, then revert the manual change or codify/import it through PR and review. Improve guardrails against untracked changes.

Question 13: Describe a CI/CD improvement example.
Answer: Radiology application example: moved manual build/test/deployment steps toward GitHub Actions, generated artifacts, used a Windows runner and VPN for private IIS deployment, and added testing/security controls. Quantify time savings only with measured figures.

Question 14: A GitHub Actions job fails immediately: where do you look?
Answer: Inspect the failed run and step logs, the triggering workflow under .github/workflows, referenced reusable workflows/actions, event conditions, permissions and runner configuration.

Question 15: A secret was committed to Git. Immediate response?
Answer: Revoke or rotate it immediately, assess exposure and audit usage, remove it from accessible history where feasible, and add secret scanning/prevention. Stopping deployments alone is insufficient.

Question 16: How would you isolate AWS dev and prod?
Answer: Use separate AWS accounts under AWS Organizations, least-privilege IAM roles, account-specific networks, SCP guardrails, centralized audit/logging and distinct deployment approvals. DR is a separate recovery design.

Question 17: How does GitHub Actions authenticate to AWS via OIDC?
Answer: GitHub issues an OIDC identity token. AWS validates its issuer/audience/subject against the IAM role trust policy; STS AssumeRoleWithWebIdentity returns short-lived credentials, avoiding stored long-lived keys.

Question 18: OIDC AssumeRoleWithWebIdentity access denied: three checks?
Answer: Verify IAM role trust policy and sub/aud conditions; target-account OIDC provider and audience; GitHub workflow id-token: write, role ARN and context. Main working while feature fails often indicates branch-specific sub restrictions.

Question 19: EKS pod has ImagePullBackOff: first checks?
Answer: Check image repository/tag and registry URL, ECR node-role permissions or imagePullSecrets, and kubectl describe pod events. Verify network access to registry and required endpoints.

Question 20: Balancing speed and safety in a hotfix?
Answer: Diagnose impact, choose the smallest validated change or rollback, run essential tests/security checks, obtain expedited approval, deploy with monitoring, and retain rollback readiness.

Question 21: OOMKilled: increase memory request, limit, or both?
Answer: Inspect pod events and memory metrics first. If a container exceeds its memory limit, a justified limit increase may help; align requests with observed normal use and scheduling capacity. Investigate leaks rather than masking them.

Question 22: OOMKilled versus Evicted?
Answer: OOMKilled generally means a container exceeded its memory limit (or encountered an OOM condition). Evicted means the kubelet terminated a pod under node resource pressure, such as memory or ephemeral storage.

Question 23: What happens when a Kubernetes node becomes NotReady?
Answer: Node controller detects failed health reporting, affected pods stop serving healthy traffic, and default not-ready/unreachable tolerations are commonly 300 seconds. Managed workloads may get replacement pods on healthy nodes, subject to capacity and eviction delays.

Question 24: Rolling update with six replicas: maxSurge and maxUnavailable?
Answer: For high availability, one option is maxSurge: 1 and maxUnavailable: 0, permitting up to seven pods while maintaining six available replicas during rollout, provided readiness checks and capacity permit.

