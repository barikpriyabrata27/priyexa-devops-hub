const QUESTION_COUNT = 20;
const SEEN_KEY = "clustercraft-seen-questions";
const QFI_SEEN_KEY = "clustercraft-qfi-seen-questions";
const HISTORY_KEY = "clustercraft-score-history";

// Knowledge base docs live in the same repo; more topic files land here over time.
const KNOWLEDGE_BASE_URL =
  "https://github.com/barikpriyabrata27/bitwise-devops-hub/blob/main/knowledge";

const KNOWLEDGE_PATHS = {
  knowledge: `${KNOWLEDGE_BASE_URL}/README.md`,
  ciCd: `${KNOWLEDGE_BASE_URL}/ci-cd/README.md`,
  terraform: `${KNOWLEDGE_BASE_URL}/terraform/README.md`,
  aws: `${KNOWLEDGE_BASE_URL}/aws/README.md`,
  gcp: `${KNOWLEDGE_BASE_URL}/gcp/README.md`,
  ansible: `${KNOWLEDGE_BASE_URL}/ansible/README.md`,
  docker: `${KNOWLEDGE_BASE_URL}/docker/README.md`,
  kubernetes: `${KNOWLEDGE_BASE_URL}/kubernetes/README.md`,
  devsecops: `${KNOWLEDGE_BASE_URL}/devsecops/README.md`,
  auth: `${KNOWLEDGE_BASE_URL}/auth/README.md`
};

const PHASE_KNOWLEDGE = {
  "Phase I — CI/CD": `${KNOWLEDGE_BASE_URL}/ci-cd/README.md`,
  "Phase II — Terraform": `${KNOWLEDGE_BASE_URL}/terraform/README.md`,
  "Phase III — AWS": `${KNOWLEDGE_BASE_URL}/aws/README.md`,
  "Phase IV — GCP": `${KNOWLEDGE_BASE_URL}/gcp/README.md`,
  "Phase V — Ansible": `${KNOWLEDGE_BASE_URL}/ansible/README.md`,
  "Phase VI — Docker": `${KNOWLEDGE_BASE_URL}/docker/README.md`,
  "Phase VII — Kubernetes": `${KNOWLEDGE_BASE_URL}/kubernetes/README.md`,
  "Phase VIII — DevSecOps": `${KNOWLEDGE_BASE_URL}/devsecops/README.md`,
  "Phase IX — Authentication & Authorization": `${KNOWLEDGE_BASE_URL}/auth/README.md`
};

const CATEGORY_KNOWLEDGE = {
  "CI/CD": `${KNOWLEDGE_BASE_URL}/ci-cd/README.md`,
  "GitHub Actions": `${KNOWLEDGE_BASE_URL}/ci-cd/github-actions.md`,
  "Bamboo": `${KNOWLEDGE_BASE_URL}/ci-cd/bamboo.md`,
  "Maven": `${KNOWLEDGE_BASE_URL}/ci-cd/maven.md`,
  "DevSecOps": `${KNOWLEDGE_BASE_URL}/devsecops/devsecops.md`,
  "Docker and Containers": `${KNOWLEDGE_BASE_URL}/docker/docker-and-containers.md`,
  "Nexus and Artifactory": `${KNOWLEDGE_BASE_URL}/ci-cd/nexus-artifactory.md`,
  "Kubernetes Fundamentals": `${KNOWLEDGE_BASE_URL}/kubernetes/kubernetes-fundamentals.md`,
  "Kubernetes Networking": `${KNOWLEDGE_BASE_URL}/kubernetes/kubernetes-networking.md`,
  "Kubernetes Operations": `${KNOWLEDGE_BASE_URL}/kubernetes/kubernetes-operations.md`,
  "Kubernetes Security": `${KNOWLEDGE_BASE_URL}/kubernetes/kubernetes-security.md`,
  "Kubernetes Storage": `${KNOWLEDGE_BASE_URL}/kubernetes/kubernetes-storage.md`,
  "Kubernetes Troubleshooting": `${KNOWLEDGE_BASE_URL}/kubernetes/kubernetes-troubleshooting.md`,
  "Helm": `${KNOWLEDGE_BASE_URL}/kubernetes/helm.md`,
  "AWS": `${KNOWLEDGE_BASE_URL}/aws/README.md`,
  "Terraform": `${KNOWLEDGE_BASE_URL}/terraform/README.md`,
  "GCP": `${KNOWLEDGE_BASE_URL}/gcp/README.md`,
  "Jenkins": `${KNOWLEDGE_BASE_URL}/jenkins/README.md`,
  "Observability": `${KNOWLEDGE_BASE_URL}/observability/README.md`,
  "Linux": `${KNOWLEDGE_BASE_URL}/linux/README.md`,
  "Python": `${KNOWLEDGE_BASE_URL}/python/README.md`,
  "Ansible": `${KNOWLEDGE_BASE_URL}/ansible/README.md`,
  "Authentication & Authorization": `${KNOWLEDGE_BASE_URL}/auth/authentication-and-authorization.md`
};


// ============================================================
// ROADMAP FROM YOUR HANDWRITTEN NOTES
// ============================================================

const ROADMAP_TOPICS = {

  "Phase I — CI/CD": [
    "Git / GitHub",
    "Branching Strategy",
    "Pull Requests",
    "Maven",
    "pom.xml",
    "Artifact / Version Management",
    "Nexus / Artifactory",
    "CI",
    "CD",
    "Build → Test → Scan → Package → Publish → Deploy",
    "Jenkins / Bamboo / GitHub Actions",
    "Pipeline YAML",
    "Variables / Secrets",
    "Environments",
    "Approvals",
    "Rollback",
    "Deployment Strategies",
    "Webhooks",
    "Runners / Agents",
    "Pipeline Security",
    "CI/CD Troubleshooting"
  ],

  "Phase II — Terraform": [
    "Terraform",
    "Provider",
    "Resource",
    "Variable",
    "Output",
    "State",
    "Module",
    "Backend",
    "Workspace",
    "Plan",
    "Apply",
    "Destroy"
  ],

  "Phase III — AWS": [
    "VPC",
    "Subnet",
    "Route Table",
    "Internet Gateway",
    "NAT",
    "Security Group",
    "IAM",
    "EC2",
    "RDS",
    "Serverless"
  ],

  "Phase IV — GCP": [
    "GCP Fundamentals",
    "GCP Console / CLI",
    "IAM",
    "Compute Engine",
    "Networking",
    "Load Balancing",
    "Cloud DNS",
    "Managed Instance Groups",
    "Cloud Storage",
    "Database",
    "Containers",
    "GKE",
    "Cloud Functions",
    "Cloud Run"
  ],

  "Phase V — Ansible": [
    "Inventory",
    "Ad-hoc Commands",
    "Playbook",
    "Task",
    "Module",
    "Variable",
    "Fact",
    "Template",
    "Handlers",
    "Roles",
    "Vault",
    "AWX"
  ],

  "Phase VI — Docker": [
    "Image",
    "Container",
    "Dockerfile",
    "Build",
    "Registry",
    "Run",
    "Network",
    "Volume"
  ],

  "Phase VII — Kubernetes": [
    "Cluster",
    "Control Plane",
    "Worker Node",
    "Pod",
    "Container",
    "Namespace",
    "Deployment",
    "ReplicaSet",
    "Service",
    "ConfigMap",
    "Secret",
    "Ingress",
    "Volume",
    "PVC",
    "StatefulSet",
    "DaemonSet",
    "Job / CronJob",
    "Probes",
    "Resource Requests / Limits"
  ],

  "Phase VIII — DevSecOps": [
    "SAST",
    "SCA",
    "DAST",
    "Secrets Scanning",
    "Container Scanning"
  ],

  "Phase IX — Authentication & Authorization": [
    "Users",
    "Groups",
    "Roles",
    "Permissions",
    "IAM",
    "Service Accounts",
    "API Keys",
    "Tokens",
    "SSH Keys",
    "Passwords",
    "Secrets",
    "Vault",
    "RBAC",
    "Authentication",
    "OIDC",
    "SSO",
    "Credential Rotation",
    "Least Privilege"
  ]
};

const ROADMAP_FOLDERS = {
  "Phase I — CI/CD": "ci-cd",
  "Phase II — Terraform": "terraform",
  "Phase III — AWS": "aws",
  "Phase IV — GCP": "gcp",
  "Phase V — Ansible": "ansible",
  "Phase VI — Docker": "docker",
  "Phase VII — Kubernetes": "kubernetes",
  "Phase VIII — DevSecOps": "devsecops",
  "Phase IX — Authentication & Authorization": "auth"
};

function getRoadmapKnowledgeLink(phase, topic) {
  const folder = ROADMAP_FOLDERS[phase];
  const filename = String(topic || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return folder && filename
    ? `${KNOWLEDGE_BASE_URL}/${folder}/${filename}.md`
    : KNOWLEDGE_PATHS.knowledge;
}


// ============================================================
// TOPIC → KNOWLEDGE BASE MAPPING
// ============================================================

const TOPIC_KNOWLEDGE = {
  "Git / GitHub": `${KNOWLEDGE_BASE_URL}/ci-cd/git-github.md`,
  "Branching Strategy": `${KNOWLEDGE_BASE_URL}/ci-cd/branching-strategy.md`,
  "Pull Requests": `${KNOWLEDGE_BASE_URL}/ci-cd/pull-requests.md`,
  "Maven": `${KNOWLEDGE_BASE_URL}/ci-cd/maven.md`,
  "pom.xml": `${KNOWLEDGE_BASE_URL}/ci-cd/maven.md`,
  "Artifact / Version Management": `${KNOWLEDGE_BASE_URL}/ci-cd/README.md`,
  "Nexus / Artifactory": `${KNOWLEDGE_BASE_URL}/ci-cd/nexus-artifactory.md`,
  "CI": `${KNOWLEDGE_BASE_URL}/ci-cd/README.md`,
  "CD": `${KNOWLEDGE_BASE_URL}/ci-cd/README.md`,
  "Build → Test → Scan → Package → Publish → Deploy": `${KNOWLEDGE_BASE_URL}/ci-cd/README.md`,
  "Jenkins / Bamboo / GitHub Actions": `${KNOWLEDGE_BASE_URL}/ci-cd/README.md`,
  "Pipeline YAML": `${KNOWLEDGE_BASE_URL}/ci-cd/README.md`,
  "Variables / Secrets": `${KNOWLEDGE_BASE_URL}/ci-cd/variables-secrets.md`,

  "Terraform": `${KNOWLEDGE_BASE_URL}/terraform/overview.md`,
  "Provider": `${KNOWLEDGE_BASE_URL}/terraform/overview.md`,
  "Resource": `${KNOWLEDGE_BASE_URL}/terraform/overview.md`,
  "Variable": `${KNOWLEDGE_BASE_URL}/terraform/overview.md`,
  "Output": `${KNOWLEDGE_BASE_URL}/terraform/overview.md`,
  "State": `${KNOWLEDGE_BASE_URL}/terraform/state.md`,
  "Module": `${KNOWLEDGE_BASE_URL}/terraform/overview.md`,
  "Backend": `${KNOWLEDGE_BASE_URL}/terraform/backend.md`,
  "Workspace": `${KNOWLEDGE_BASE_URL}/terraform/workspace.md`,
  "Plan": `${KNOWLEDGE_BASE_URL}/terraform/overview.md`,
  "Apply": `${KNOWLEDGE_BASE_URL}/terraform/overview.md`,
  "Destroy": `${KNOWLEDGE_BASE_URL}/terraform/overview.md`,

  "VPC": `${KNOWLEDGE_BASE_URL}/aws/vpc.md`,
  "Subnet": `${KNOWLEDGE_BASE_URL}/aws/vpc.md`,
  "Route Table": `${KNOWLEDGE_BASE_URL}/aws/vpc.md`,
  "Internet Gateway": `${KNOWLEDGE_BASE_URL}/aws/vpc.md`,
  "NAT": `${KNOWLEDGE_BASE_URL}/aws/vpc.md`,
  "Security Group": `${KNOWLEDGE_BASE_URL}/aws/vpc.md`,
  "IAM": `${KNOWLEDGE_BASE_URL}/aws/iam.md`,
  "EC2": `${KNOWLEDGE_BASE_URL}/aws/ec2.md`,
  "RDS": `${KNOWLEDGE_BASE_URL}/aws/rds.md`,
  "Serverless": `${KNOWLEDGE_BASE_URL}/aws/README.md`,

  "GCP Fundamentals": `${KNOWLEDGE_BASE_URL}/gcp/README.md`,
  "GCP Console / CLI": `${KNOWLEDGE_BASE_URL}/gcp/README.md`,
  "Compute Engine": `${KNOWLEDGE_BASE_URL}/gcp/README.md`,
  "Networking": `${KNOWLEDGE_BASE_URL}/gcp/networking.md`,
  "Load Balancing": `${KNOWLEDGE_BASE_URL}/gcp/networking.md`,
  "Cloud DNS": `${KNOWLEDGE_BASE_URL}/gcp/networking.md`,
  "Managed Instance Groups": `${KNOWLEDGE_BASE_URL}/gcp/README.md`,
  "Cloud Storage": `${KNOWLEDGE_BASE_URL}/gcp/README.md`,
  "Database": `${KNOWLEDGE_BASE_URL}/gcp/README.md`,
  "Containers": `${KNOWLEDGE_BASE_URL}/docker/README.md`,
  "GKE": `${KNOWLEDGE_BASE_URL}/gcp/README.md`,
  "Cloud Functions": `${KNOWLEDGE_BASE_URL}/gcp/README.md`,
  "Cloud Run": `${KNOWLEDGE_BASE_URL}/gcp/README.md`,

  "Inventory": `${KNOWLEDGE_BASE_URL}/ansible/inventory.md`,
  "Ad-hoc Commands": `${KNOWLEDGE_BASE_URL}/ansible/README.md`,
  "Playbook": `${KNOWLEDGE_BASE_URL}/ansible/playbook.md`,
  "Task": `${KNOWLEDGE_BASE_URL}/ansible/playbook.md`,
  "Module": `${KNOWLEDGE_BASE_URL}/ansible/README.md`,
  "Variable": `${KNOWLEDGE_BASE_URL}/ansible/README.md`,
  "Fact": `${KNOWLEDGE_BASE_URL}/ansible/README.md`,
  "Template": `${KNOWLEDGE_BASE_URL}/ansible/README.md`,
  "Handlers": `${KNOWLEDGE_BASE_URL}/ansible/README.md`,
  "Roles": `${KNOWLEDGE_BASE_URL}/ansible/README.md`,
  "Vault": `${KNOWLEDGE_BASE_URL}/ansible/README.md`,
  "AWX": `${KNOWLEDGE_BASE_URL}/ansible/README.md`,

  "Image": `${KNOWLEDGE_BASE_URL}/docker/README.md`,
  "Container": `${KNOWLEDGE_BASE_URL}/docker/README.md`,
  "Dockerfile": `${KNOWLEDGE_BASE_URL}/docker/dockerfile.md`,
  "Build": `${KNOWLEDGE_BASE_URL}/docker/README.md`,
  "Registry": `${KNOWLEDGE_BASE_URL}/docker/registry.md`,
  "Run": `${KNOWLEDGE_BASE_URL}/docker/README.md`,
  "Network": `${KNOWLEDGE_BASE_URL}/docker/README.md`,
  "Volume": `${KNOWLEDGE_BASE_URL}/docker/README.md`,

  "Cluster": `${KNOWLEDGE_BASE_URL}/kubernetes/README.md`,
  "Control Plane": `${KNOWLEDGE_BASE_URL}/kubernetes/README.md`,
  "Worker Node": `${KNOWLEDGE_BASE_URL}/kubernetes/README.md`,
  "Pod": `${KNOWLEDGE_BASE_URL}/kubernetes/pod.md`,
  "Namespace": `${KNOWLEDGE_BASE_URL}/kubernetes/README.md`,
  "Deployment": `${KNOWLEDGE_BASE_URL}/kubernetes/deployment.md`,
  "ReplicaSet": `${KNOWLEDGE_BASE_URL}/kubernetes/README.md`,
  "Service": `${KNOWLEDGE_BASE_URL}/kubernetes/service.md`,
  "ConfigMap": `${KNOWLEDGE_BASE_URL}/kubernetes/README.md`,
  "Secret": `${KNOWLEDGE_BASE_URL}/kubernetes/README.md`,
  "Ingress": `${KNOWLEDGE_BASE_URL}/kubernetes/README.md`,
  "PVC": `${KNOWLEDGE_BASE_URL}/kubernetes/README.md`,
  "StatefulSet": `${KNOWLEDGE_BASE_URL}/kubernetes/README.md`,
  "DaemonSet": `${KNOWLEDGE_BASE_URL}/kubernetes/README.md`,
  "Job / CronJob": `${KNOWLEDGE_BASE_URL}/kubernetes/README.md`,
  "Probes": `${KNOWLEDGE_BASE_URL}/kubernetes/README.md`,
  "Resource Requests / Limits": `${KNOWLEDGE_BASE_URL}/kubernetes/README.md`,

  "SAST": `${KNOWLEDGE_BASE_URL}/devsecops/sast.md`,
  "SCA": `${KNOWLEDGE_BASE_URL}/devsecops/README.md`,
  "DAST": `${KNOWLEDGE_BASE_URL}/devsecops/README.md`,
  "Secrets Scanning": `${KNOWLEDGE_BASE_URL}/devsecops/secrets-scanning.md`,
  "Container Scanning": `${KNOWLEDGE_BASE_URL}/devsecops/README.md`,

  "Users": `${KNOWLEDGE_BASE_URL}/auth/README.md`,
  "Groups": `${KNOWLEDGE_BASE_URL}/auth/README.md`,
  "Roles": `${KNOWLEDGE_BASE_URL}/auth/README.md`,
  "Permissions": `${KNOWLEDGE_BASE_URL}/auth/README.md`,
  "Service Accounts": `${KNOWLEDGE_BASE_URL}/auth/README.md`,
  "API Keys": `${KNOWLEDGE_BASE_URL}/auth/README.md`,
  "Tokens": `${KNOWLEDGE_BASE_URL}/auth/README.md`,
  "SSH Keys": `${KNOWLEDGE_BASE_URL}/auth/README.md`,
  "Passwords": `${KNOWLEDGE_BASE_URL}/auth/README.md`,
  "Secrets": `${KNOWLEDGE_BASE_URL}/auth/README.md`,
  "Vault": `${KNOWLEDGE_BASE_URL}/auth/vault.md`,
  "RBAC": `${KNOWLEDGE_BASE_URL}/auth/rbac.md`,
  "Authentication": `${KNOWLEDGE_BASE_URL}/auth/README.md`,
  "OIDC": `${KNOWLEDGE_BASE_URL}/auth/oidc.md`,
  "SSO": `${KNOWLEDGE_BASE_URL}/auth/README.md`,
  "Credential Rotation": `${KNOWLEDGE_BASE_URL}/auth/README.md`,
  "Least Privilege": `${KNOWLEDGE_BASE_URL}/auth/README.md`
};

function normalizeCategory(value) {
  return String(value || "").trim().toLowerCase();
}

function getKnowledgeLink(category) {
  const normalizedCategory = normalizeCategory(category);

  const directTopic = Object.entries(TOPIC_KNOWLEDGE)
    .find(([key]) => normalizeCategory(key) === normalizedCategory);

  if (directTopic) {
    return directTopic[1];
  }

  const directCategory = Object.entries(CATEGORY_KNOWLEDGE)
    .find(([key]) => normalizeCategory(key) === normalizedCategory);

  if (directCategory) {
    return directCategory[1];
  }

  const phaseMatch = Object.entries(PHASE_KNOWLEDGE)
    .find(([key]) => normalizeCategory(key) === normalizedCategory);

  if (phaseMatch) {
    return phaseMatch[1];
  }

  return KNOWLEDGE_PATHS.knowledge;
}


function learnMoreLink(category) {
  return `
    <a
      class="learn-more-link"
      href="${getKnowledgeLink(category)}"
      target="_blank"
      rel="noopener"
    >
      Learn more: ${escapeHTML(category)} →
    </a>
  `;
}


// ============================================================
// APPLICATION STATE
// ============================================================

const state = {
  questions: [],
  quizQuestions: [],
  qfiQuestions: [],
  current: 0,
  answers: [],
  mode: "practice",
  timerId: null,
  secondsLeft: 1500,
  selectedSet: [],
  filters: {
    category: "All",
    difficulty: "All",
    type: "All"
  }
};


// ============================================================
// DOM HELPERS
// ============================================================

const $ = (selector) => document.querySelector(selector);

const views = {
  setup: $("#setup-view"),
  quiz: $("#quiz-view"),
  results: $("#results-view")
};


// ============================================================
// UTILITY FUNCTIONS
// ============================================================

function shuffle(items) {

  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {

    const randomIndex =
      Math.floor(Math.random() * (index + 1));

    [copy[index], copy[randomIndex]] =
      [copy[randomIndex], copy[index]];
  }

  return copy;
}


function getSeenIds() {
  return JSON.parse(
    localStorage.getItem(SEEN_KEY) || "[]"
  );
}


function saveSeenIds(ids) {
  localStorage.setItem(
    SEEN_KEY,
    JSON.stringify(ids)
  );
}


function getHistory() {
  return JSON.parse(
    localStorage.getItem(HISTORY_KEY) || "[]"
  );
}


function saveHistory(history) {
  localStorage.setItem(
    HISTORY_KEY,
    JSON.stringify(history.slice(-8))
  );
}


function escapeHTML(value) {

  return String(value).replace(
    /[&<>'"]/g,
    (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;"
    }[char])
  );
}


const TECHNICAL_TERMS = new Set(
  `alb alert alertmanager ami ansible api application apply architecture artifact autoscaling availability aws backup backend branch build canary certificate ci cd cloud cloudformation cloudfront cloudwatch cluster config configuration container controller count cpu cronjob cve cdk cni crashloopbackoff credential daemonset database deployment devops digest disaster disk docker dockerfile dns drift ebs ec2 ecr eks elasticsearch endpoint entrypoint error errors exporter failover file filesystem firewall fluentbit foreach gateway git gitops github githubactions grafana graceful helm hpa http https iam iac image incident infrastructure init internet interpreter jenkins jaeger job json kibana kubectl kubernetes kubelet latency leadership linux loadbalancer localexec log logstash metric microservice monitoring nat network networkpolicy nginx node nlb oauth oidc opentelemetry oom ownership p1 php permission pipeline pod poddisruptionbudget policy process prometheus promql provisioner probe provider proxy pvc rbac rca rds readiness recovery release replica repository request resource response rollback root route rpo rto runtime s3 sast scale scaling sca scrape script secret security server service sdlc shebang shell shutdown signal sla sli slo snapshot socket ssh ssl state statefulset status sticky subnet suid systemd target tcp terraform test tf tls trace tracing traffic troubleshoot uptime variable vpc volume workflow yaml`
    .toLowerCase()
    .split(" ")
    .map(normalizeAnswerWord)
);
const TECHNICAL_PHRASES = [
  "alb listener",
  "availability zone",
  "blue-green deployment",
  "bash script",
  "cloudwatch alarm",
  "container image",
  "continuous delivery",
  "continuous integration",
  "ci cd",
  "distributed tracing",
  "disaster recovery",
  "error budget",
  "error rate",
  "exit code",
  "for each",
  "graceful shutdown",
  "health check",
  "http 5xx",
  "horizontal pod autoscaler",
  "iam policy",
  "iam role",
  "image pull secret",
  "internet gateway",
  "jenkins credentials",
  "jenkins home directory",
  "git checkout",
  "git repository",
  "least privilege",
  "load balancer",
  "liveness probe",
  "multi-stage build",
  "local exec",
  "nat gateway",
  "network policy",
  "persistent volume claim",
  "pod disruption budget",
  "production incident",
  "release rollback",
  "remote exec",
  "readiness probe",
  "remote backend",
  "request latency",
  "reverse proxy",
  "route table",
  "secret manager",
  "security group",
  "service account",
  "service discovery",
  "service selector",
  "service level indicator",
  "service level objective",
  "service-to-pod connectivity",
  "sticky bit",
  "startup probe",
  "state locking",
  "terraform state",
  "version control",
  "personal access token",
  "docker registry",
  "declarative pipeline",
  "root cause analysis",
  "roll back",
  "http 503",
  "http 502",
  "5xx error",
  "file permission"
];
const QUESTION_TECHNICAL_RUBRICS = {
  1: ["devops", "ci cd", "terraform", "kubernetes", "aws", "monitoring"],
  4: ["logging", "fluentbit", "elasticsearch", "kibana", "logstash"],
  28: ["automation", "ci cd", "monitoring", "metrics", "deployment"],
  29: ["metrics", "logs", "traces", "deployment", "rollback", "dependencies"],
  36: ["dns", "tcp", "tls", "http", "load balancer"],
  41: ["terraform", "count", "for each", "resource", "state"],
  45: ["terraform", "local exec", "remote exec", "provisioner", "ssh"],
  49: ["sdlc", "ci cd", "automation", "deployment", "monitoring"],
  57: ["iac", "terraform", "state", "module", "version control"],
  62: ["bash", "shell", "script", "automation", "exit code"],
  121: ["incident", "metrics", "logs", "rollback", "root cause analysis"],
  140: ["incident", "metrics", "logs", "traces", "mitigation", "root cause analysis"],
  141: ["deployment", "secret", "least privilege", "monitoring", "rollback"],
  198: ["architecture", "ci cd", "aws", "terraform", "kubernetes", "monitoring"],
  205: ["jenkins", "jenkins home directory", "workspace", "plugin", "configuration"],
  206: ["github", "jenkins", "git checkout", "git repository", "credentials"],
  207: ["jenkins", "github", "plugin", "webhook", "source control"],
  208: ["docker", "jenkins credentials", "docker registry", "secret", "pipeline"],
  209: ["github", "jenkins", "ssh", "personal access token", "credentials"],
  210: ["jenkins", "declarative pipeline", "stage", "agent", "credentials"],
  218: ["terraform", "hcl", "provider", "resource", "configuration"],
  230: ["dns", "route table", "security group", "load balancer", "ingress"],
  240: ["deployment", "rollback", "health check", "artifact", "canary"],
  254: ["pod disruption budget", "availability", "replica", "drain"],
  265: ["fluentbit", "logstash", "elasticsearch", "kibana", "microservice"],
  268: ["ingress", "service", "endpoint", "readiness probe", "pod"],
  270: ["gitops", "argocd", "kubernetes", "rbac", "release"],
  317: ["http 502", "http 503", "load balancer", "ingress", "endpoint"],
  327: ["infrastructure", "compute", "network", "storage", "cloud"],
  330: ["ci cd", "aws", "terraform", "docker", "kubernetes", "prometheus"],
  346: ["iac", "terraform", "state", "module", "version control"],
  353: ["dns", "tcp", "tls", "http", "load balancer", "ingress"],
  354: ["wordpress", "php", "mysql", "nginx", "tls", "database"],
  355: ["shebang", "bash", "shell", "interpreter", "script", "permission"],
  368: ["signal", "graceful shutdown", "process", "container", "kubernetes"],
  379: ["service-to-pod connectivity", "service", "endpoint", "selector", "network policy"],
  404: ["server", "process", "port", "firewall", "logs"],
  409: ["release rollback", "deployment", "artifact", "health check", "terraform state"],
  412: ["http 5xx", "service", "endpoint", "readiness probe", "ingress", "pod"],
  420: ["logs", "metrics", "traces", "correlation", "alert"],
  421: ["root cause analysis", "incident", "timeline", "impact", "remediation", "prevention"],
  423: ["disaster recovery", "backup", "failover", "rpo", "rto"],
  432: ["infrastructure", "compute", "network", "storage", "cloud"],
  435: ["ci cd", "aws", "terraform", "docker", "kubernetes", "prometheus"],
  445: ["ingress", "service", "endpoint", "readiness probe", "pod"],
  447: ["gitops", "argocd", "kubernetes", "rbac", "release"]
};
const HUMAN_READABLE_CONNECTORS = new Set(
  "a an and are as at be because by can for from has have if in into is it of on or should so that the then these this to was were when which while will with would".split(" ")
);
const ANSWER_ACTION_WORDS = new Set(
  "allow apply build check choose compare configure connect control collect create define deploy determine detect enable ensure evaluate explain expose handle identify maintain manage monitor prevent provide reconcile reduce remove replace require restart return route run scale schedule secure select send show store support use uses validate verify work".split(" ")
);


function parseQfiQuestionBank(markdown) {

  const headings = [
    ...markdown.matchAll(/^###\s+(\d+)\.\s+(.+?)\s*$/gm)
  ];

  return headings.map((heading, index) => {

    const blockStart = heading.index + heading[0].length;
    const blockEnd = headings[index + 1]?.index ?? markdown.length;
    const block = markdown.slice(blockStart, blockEnd);
    const answerStart = block.indexOf("**Answer:**");
    const answerMarkdown = answerStart < 0
      ? ""
      : block
          .slice(answerStart + "**Answer:**".length)
          .split(/\r?\n(?:#{1,6}\s|---\s*$)/m)[0]
          .trim();

    return {
      id: Number(heading[1]),
      question: heading[2].trim(),
      category: "Questions from interviews",
      difficulty: "Open answer",
      referenceAnswer: answerMarkdown
        .replace(/\*\*|__|`/g, "")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .trim()
    };
  });
}


function normalizeAnswerWord(word) {

  const irregularTerms = {
    devops: "devops",
    kubernetes: "kubernetes",
    prometheus: "prometheus",
    jenkins: "jenkins",
    ingress: "ingress",
    process: "process",
    analysis: "analysis",
    status: "status",
    https: "https",
    metrics: "metric",
    logs: "log",
    traces: "trace",
    errors: "error",
    applications: "application",
    deployments: "deployment",
    permissions: "permission",
    provisioners: "provisioner",
    policies: "policy",
    services: "service",
    volumes: "volume",
    variables: "variable",
    credentials: "credential",
    resources: "resource",
    processes: "process",
    scripts: "script",
    replicas: "replica",
    targets: "target",
    checks: "check",
    modules: "module",
    dependencies: "dependency"
  };

  if (irregularTerms[word]) {
    return irregularTerms[word];
  }

  if (word.length > 5 && word.endsWith("ies")) {
    return word.slice(0, -3) + "y";
  }

  if (word.length > 4 && word.endsWith("ing")) {
    const stem = word.slice(0, -3);
    return stem.length > 2 && stem.at(-1) === stem.at(-2)
      ? stem.slice(0, -1)
      : stem;
  }

  if (word.length > 4 && word.endsWith("s") && !word.endsWith("ss")) {
    return word.slice(0, -1);
  }

  return word;
}


function getAnswerWords(text) {

  return String(text || "")
    .toLowerCase()
    .match(/[a-z][a-z0-9+#]*(?:\.[a-z0-9+#]+)*/g)
    ?.map(normalizeAnswerWord) || [];
}


function containsAnswerPhrase(words, phrase) {

  const phraseWords = getAnswerWords(phrase);

  return words.some((_, index) =>
    phraseWords.every((word, offset) => words[index + offset] === word)
  );
}


function getQfiKeyTerms(question) {

  if (QUESTION_TECHNICAL_RUBRICS[question.id]) {
    return QUESTION_TECHNICAL_RUBRICS[question.id];
  }

  const answerWords = getAnswerWords(question.referenceAnswer);
  const genericAnswerPatterns = [
    /^a strong senior-level answer should start/i,
    /^a typical pipeline is/i,
    /^start with the failed stage and console log/i,
    /^use a remote, access-controlled backend/i,
    /^authenticate the build agent to ecr/i
  ];
  const specificAnswer = !genericAnswerPatterns.some((pattern) =>
    pattern.test(question.referenceAnswer)
  );
  const sourceWords = specificAnswer
    ? answerWords
    : getAnswerWords(question.question);
  const phrases = TECHNICAL_PHRASES.filter((phrase) =>
    containsAnswerPhrase(sourceWords, phrase)
  );
  const coveredWords = new Set(phrases.flatMap(getAnswerWords));
  const terms = sourceWords.filter((word) =>
    TECHNICAL_TERMS.has(word) && !coveredWords.has(word)
  );

  return [...new Set([...phrases, ...terms])].slice(0, 10);
}


function getAnswerReadabilityIssue(response) {

  const words = getAnswerWords(response);
  const connectors = words.filter((word) =>
    HUMAN_READABLE_CONNECTORS.has(word)
  ).length;
  const hasAction = words.some((word) => ANSWER_ACTION_WORDS.has(word));
  const commaSeparatedFragments = String(response)
    .split(/[.!?;]+/)
    .flatMap((sentence) => sentence.split(","))
    .filter((fragment) => fragment.trim());
  const isKeywordDump =
    commaSeparatedFragments.length >= 4 &&
    commaSeparatedFragments.every((fragment) => getAnswerWords(fragment).length <= 3);

  return words.length < 7 || connectors < 2 || !hasAction || isKeywordDump
    ? "Write a short, readable answer rather than a list of technical terms."
    : "";
}


function scoreQfiAnswer(question, response) {

  const keyTerms = getQfiKeyTerms(question);
  const answerWords = getAnswerWords(response);
  const matchedKeywords = keyTerms.filter((term) =>
    containsAnswerPhrase(answerWords, term)
  );
  const missingKeywords = keyTerms.filter((term) =>
    !containsAnswerPhrase(answerWords, term)
  );

  return {
    keyTerms,
    matchedKeywords,
    missingKeywords,
    percent: keyTerms.length
      ? Math.round((matchedKeywords.length / keyTerms.length) * 100)
      : 0
  };
}


// ============================================================
// QUESTION FILTERING
// ============================================================

function filteredBank() {

  return state.questions.filter(
    (question) =>
      (
        state.filters.category === "All" ||
        question.category === state.filters.category
      ) &&
      (
        state.filters.difficulty === "All" ||
        question.difficulty === state.filters.difficulty
      ) &&
      (
        state.filters.type === "All" ||
        (question.type || "concept") === state.filters.type
      )
  );
}


// ============================================================
// QUICK FILTERS
// ============================================================

function renderQuickFilters() {

  const categories = [
    ...new Set(
      state.questions.map(
        (question) => question.category
      )
    )
  ].sort();

  const counts = categories.reduce(
    (accumulator, category) => {

      accumulator[category] =
        state.questions.filter(
          (question) =>
            question.category === category
        ).length;

      return accumulator;

    },
    {}
  );

  $("#quick-filter-list").innerHTML = [

    {
      category: "All",
      label: "All"
    },

    ...categories.map(
      (category) => ({
        category,
        label: category
      })
    )

  ].map(
    ({ category, label }) => {

      const count =
        category === "All"
          ? state.questions.length
          : counts[category];

      const selectedClass =
        state.filters.category === category
          ? "selected"
          : "";

      return `
        <button
          class="quick-filter-chip ${selectedClass}"
          type="button"
          data-category="${escapeHTML(category)}"
        >
          ${escapeHTML(label)}
          <span>${count}</span>
        </button>
      `;
    }
  ).join("");


  document
    .querySelectorAll(".quick-filter-chip")
    .forEach((button) => {

      button.addEventListener(
        "click",
        () => {

          const selectedCategory =
            button.dataset.category;

          state.filters.category =
            selectedCategory;

          $("#category-select").value =
            selectedCategory;

          renderQuickFilters();
        }
      );

    });
}


// ============================================================
// QUESTION PREPARATION
// ============================================================

function prepareQuestions(questions) {

  return questions.map(
    (question) => ({
      ...question,

      options: shuffle(
        question.options.map(
          (text, index) => ({
            text,
            original: index
          })
        )
      )
    })
  );
}


// ============================================================
// QUESTION SET
// ============================================================

function makeQuestionSet(retry = false) {

  const bank = filteredBank();

  if (bank.length < QUESTION_COUNT) {

    alert(
      `This filter has ${bank.length} questions. ` +
      `Choose a broader filter with at least ` +
      `${QUESTION_COUNT} questions.`
    );

    return null;
  }


  if (
    retry &&
    state.selectedSet.length
  ) {
    return state.selectedSet;
  }


  const seen =
    new Set(getSeenIds());


  let fresh =
    shuffle(
      bank.filter(
        (question) =>
          !seen.has(question.id)
      )
    );


  if (fresh.length < QUESTION_COUNT) {

    localStorage.removeItem(
      SEEN_KEY
    );

    seen.clear();

    fresh =
      shuffle(bank);

    $("#cycle-label").textContent =
      "New question cycle started";
  }


  const selected =
    fresh.slice(
      0,
      QUESTION_COUNT
    );


  saveSeenIds([
    ...seen,
    ...selected.map(
      (question) => question.id
    )
  ]);


  return selected;
}


function makeQfiSet(retry = false) {

  if (retry && state.selectedSet.length) {
    return state.selectedSet;
  }

  const seen = new Set(
    JSON.parse(localStorage.getItem(QFI_SEEN_KEY) || "[]")
  );
  let fresh = shuffle(
    state.qfiQuestions.filter((question) => !seen.has(question.id))
  );

  if (fresh.length < QUESTION_COUNT) {
    localStorage.removeItem(QFI_SEEN_KEY);
    seen.clear();
    fresh = shuffle(state.qfiQuestions);
    $("#cycle-label").textContent = "New QFI question cycle started";
  }

  const selected = fresh.slice(0, QUESTION_COUNT);
  localStorage.setItem(
    QFI_SEEN_KEY,
    JSON.stringify([...seen, ...selected.map((question) => question.id)])
  );

  return selected;
}


// ============================================================
// VIEW MANAGEMENT
// ============================================================

function showView(name) {

  Object.entries(views).forEach(
    ([key, view]) => {

      view.classList.toggle(
        "hidden",
        key !== name
      );

    }
  );

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


function updateSetupMeta() {

  const qfiMode = state.mode === "qfi";
  const seen = JSON.parse(
    localStorage.getItem(qfiMode ? QFI_SEEN_KEY : SEEN_KEY) || "[]"
  ).length;
  const totalQuestions = qfiMode
    ? state.qfiQuestions.length
    : state.quizQuestions.length;


  $("#cycle-label").textContent =
    seen
      ? `${seen} of ${totalQuestions} ${qfiMode ? "QFI questions" : "questions"} seen`
      : qfiMode
        ? `${totalQuestions} interview questions · fresh cycle`
        : "Fresh question cycle";


  $("#setup-history").textContent =
    getHistory().length
      ? `${getHistory().length} saved rounds · your progress stays in this browser`
      : "No saved rounds yet";
}


// ============================================================
// START SESSION
// ============================================================

function startSession(retry = false) {

  const qfiMode = state.mode === "qfi";
  const set = qfiMode
    ? makeQfiSet(retry)
    : makeQuestionSet(retry);

  if (!set) {
    return;
  }


  state.selectedSet =
    set;

  state.questions = qfiMode
    ? set
    : prepareQuestions(set);

  state.current =
    0;

  state.answers =
    [];

  state.secondsLeft =
    1500;


  $("#quiz-mode-label").textContent =
    state.mode.toUpperCase();


  $("#timer").classList.toggle(
    "hidden",
    state.mode !== "interview"
  );


  showView("quiz");


  if (
    state.mode === "interview"
  ) {
    startTimer();
  }


  renderQuestion();
}


// ============================================================
// TIMER
// ============================================================

function startTimer() {

  clearInterval(
    state.timerId
  );


  state.timerId =
    setInterval(
      () => {

        state.secondsLeft -= 1;

        renderTimer();


        if (
          state.secondsLeft <= 0
        ) {

          clearInterval(
            state.timerId
          );

          finishSession();
        }

      },
      1000
    );


  renderTimer();
}


function renderTimer() {

  const minutes =
    Math.floor(
      state.secondsLeft / 60
    )
      .toString()
      .padStart(2, "0");


  const seconds =
    (
      state.secondsLeft % 60
    )
      .toString()
      .padStart(2, "0");


  $("#timer").textContent =
    `${minutes}:${seconds}`;
}


// ============================================================
// RENDER QUESTION
// ============================================================

function renderQuestion() {

  const question =
    state.questions[
      state.current
    ];
  const qfiMode = state.mode === "qfi";


  $("#progress-text").textContent =
    `Question ${
      (state.current + 1)
        .toString()
        .padStart(2, "0")
    } of ${QUESTION_COUNT}`;


  $("#progress-bar").style.width =
    `${
      (state.current / QUESTION_COUNT) * 100
    }%`;


  $("#question-number").textContent =
    (
      state.current + 1
    )
      .toString()
      .padStart(2, "0");


  $("#question-category").textContent =
    question.category;


  $("#question-difficulty").textContent =
    question.difficulty;


  $("#question-type").classList.toggle(
    "hidden",
    qfiMode || question.type !== "scenario"
  );


  $("#question-title").textContent =
    question.question;

  $("#question-kicker").textContent =
    qfiMode ? `QFI · Source question ${question.id}` : "Question";

  $("#question-difficulty").textContent =
    qfiMode ? "Open answer" : question.difficulty;

  $("#options").classList.toggle("hidden", qfiMode);
  $("#qfi-answer-panel").classList.toggle("hidden", !qfiMode);
  $("#qfi-feedback").classList.add("hidden");
  $("#qfi-answer").value = "";
  $("#qfi-answer").disabled = false;
  $("#grade-answer-button").disabled = false;


  $("#answered-label").textContent =
    qfiMode
      ? "Write a readable answer in your own words, then score its technical concepts."
      : state.mode === "practice"
        ? "Choose the answer that best fits."
        : "Commit to an answer before moving on.";


  $("#next-button").textContent =
    state.current === QUESTION_COUNT - 1
      ? qfiMode ? "Finish QFI →" : "Finalize answer →"
      : qfiMode ? "Next question →" : "Lock answer →";


  $("#next-button").disabled =
    true;


  $("#explanation").classList.add(
    "hidden"
  );


  $("#options").innerHTML =
    (question.options || [])
      .map(
        (option, index) => `
          <button
            class="option"
            type="button"
            data-index="${index}"
            role="radio"
          >
            <span class="option-letter">
              ${String.fromCharCode(65 + index)}
            </span>

            <span>
              ${escapeHTML(option.text)}
            </span>
          </button>
        `
      )
      .join("");


  document
    .querySelectorAll(".option")
    .forEach(
      (button) => {

        button.addEventListener(
          "click",
          () =>
            chooseAnswer(
              Number(
                button.dataset.index
              )
            )
        );

      }
    );
}

function submitQfiAnswer() {

  const response = $("#qfi-answer").value.trim();
  const readabilityIssue = getAnswerReadabilityIssue(response);

  if (readabilityIssue) {
    $("#qfi-feedback").innerHTML =
      `<p>${escapeHTML(readabilityIssue)}</p>`;
    $("#qfi-feedback").classList.remove("hidden");
    return;
  }

  const question = state.questions[state.current];
  const score = scoreQfiAnswer(question, response);
  const answer = {
    questionId: question.id,
    response,
    referenceAnswer: question.referenceAnswer,
    ...score,
    locked: true
  };

  state.answers[state.current] = answer;
  $("#qfi-answer").disabled = true;
  $("#grade-answer-button").disabled = true;
  $("#next-button").disabled = false;

  const keywordList = score.keyTerms.map((term) => {
    const matched = score.matchedKeywords.includes(term);
    return `<span class="qfi-keyword ${matched ? "matched" : "missing"}">${escapeHTML(term)}</span>`;
  }).join("");

  $("#qfi-feedback").innerHTML = `
    <div class="qfi-score-line"><strong>${score.percent}%</strong><span>technical-term match</span></div>
    <p>${score.matchedKeywords.length} of ${score.keyTerms.length} technical terms matched</p>
    <div class="qfi-keywords">${keywordList}</div>
    <details><summary>Reference answer</summary><p>${escapeHTML(question.referenceAnswer || "No reference answer is available for this question.")}</p></details>
  `;
  $("#qfi-feedback").classList.remove("hidden");
  $("#answered-label").textContent = "Answer scored. Review the technical terms, then continue.";
}


// ============================================================
// ANSWER
// ============================================================

function chooseAnswer(index) {

  const question =
    state.questions[
      state.current
    ];


  const chosen =
    question.options[index];


  const correct =
    chosen.original ===
    question.answer;


  state.answers[
    state.current
  ] = {

    questionId:
      question.id,

    selected:
      chosen.text,

    correct,

    correctAnswer:
      question.options.find(
        (option) =>
          option.original ===
          question.answer
      ).text,

    locked:
      state.mode === "practice"
  };


  document
    .querySelectorAll(".option")
    .forEach(
      (button, buttonIndex) => {

        button.disabled =
          true;


        if (
          buttonIndex === index &&
          correct
        ) {

          button.classList.add(
            "correct"
          );
        }


        if (
          buttonIndex === index &&
          !correct
        ) {

          button.classList.add(
            "wrong"
          );
        }


        if (
          question.options[
            buttonIndex
          ].original ===
          question.answer
        ) {

          button.classList.add(
            "correct"
          );
        }

      }
    );


  $("#next-button").disabled =
    false;


  if (
    state.mode === "practice"
  ) {

    revealAnswerExplanation();
  }
}


// ============================================================
// ANSWER EXPLANATION
// ============================================================

function revealAnswerExplanation() {

  const question =
    state.questions[
      state.current
    ];


  const answer =
    state.answers[
      state.current
    ];


  if (!answer) {
    return;
  }


  answer.locked =
    true;


  const learnMore =
    answer.correct
      ? ""
      : `
        <div class="learn-more-wrap">
          ${learnMoreLink(
            question.category
          )}
        </div>
      `;


  $("#explanation").innerHTML =
    `
      <strong>
        ${
          answer.correct
            ? "Good call."
            : "Not quite."
        }
      </strong>

      ${escapeHTML(
        question.explanation
      )}

      ${learnMore}
    `;


  $("#explanation").classList.remove(
    "hidden"
  );


  $("#next-button").textContent =
    state.current === QUESTION_COUNT - 1
      ? "Finish session →"
      : "Next question →";
}


// ============================================================
// NEXT QUESTION
// ============================================================

function nextQuestion() {

  if (
    !state.answers[
      state.current
    ]
  ) {

    return;
  }


  if (
    !state.answers[
      state.current
    ].locked
  ) {

    revealAnswerExplanation();

    return;
  }


  if (
    state.current ===
    QUESTION_COUNT - 1
  ) {

    finishSession();

  } else {

    state.current += 1;

    renderQuestion();
  }
}


// ============================================================
// FINISH SESSION
// ============================================================

function finishSession() {

  clearInterval(
    state.timerId
  );

  if (state.mode === "qfi") {
    const gradedAnswers = state.answers.filter(Boolean);
    const averageScore = gradedAnswers.length
      ? Math.round(
          gradedAnswers.reduce((total, answer) => total + answer.percent, 0) /
            gradedAnswers.length
        )
      : 0;

    saveHistory([
      ...getHistory(),
      {
        score: averageScore,
        total: 100,
        mode: "QFI",
        date: new Date().toISOString()
      }
    ]);

    renderQfiResults(averageScore);
    showView("results");
    return;
  }


  const score =
    state.answers.filter(
      (answer) =>
        answer &&
        answer.correct
    ).length;


  const result = {

    score,

    total:
      QUESTION_COUNT,

    mode:
      state.mode,

    date:
      new Date().toISOString()
  };


  saveHistory([
    ...getHistory(),
    result
  ]);


  renderResults(
    score
  );


  showView(
    "results"
  );
}


function renderQfiResults(averageScore) {

  $("#results-title").textContent = "Your QFI results";
  $("#new-set-button").innerHTML = "New QFI set <span>→</span>";
  $("#score-value").textContent = `${averageScore}%`;
  $("#score-detail").textContent = "average technical-term match across this round";
  $("#results-view .result-panel .eyebrow").textContent = "Scoring method";
  $("#category-results").innerHTML = `
    <p class="muted">Each question is scored by the share of expected technical terms found in your answer. This is a keyword heuristic, not semantic grading.</p>
  `;
  $("#review-list").innerHTML = state.questions.map((question, index) => {
    const answer = state.answers[index];
    const keywords = (answer?.keyTerms || []).map((term) => {
      const matched = answer.matchedKeywords.includes(term);
      return `<span class="qfi-keyword ${matched ? "matched" : "missing"}">${escapeHTML(term)}</span>`;
    }).join("");

    return `
      <article class="review-item qfi-review-item">
        <header><h3>${index + 1}. ${escapeHTML(question.question)}</h3><span class="review-result ${answer?.percent < 50 ? "incorrect" : ""}">${answer?.percent ?? 0}% MATCH</span></header>
        <p><strong>Your answer:</strong> ${escapeHTML(answer?.response || "Not answered")}</p>
        <div class="qfi-keywords">${keywords}</div>
        <details><summary>Reference answer</summary><p>${escapeHTML(question.referenceAnswer || "No reference answer is available for this question.")}</p></details>
      </article>
    `;
  }).join("");
}


// ============================================================
// RESULTS
// ============================================================

function renderResults(score) {

  $("#results-title").textContent = "Your operating picture";
  $("#results-view .result-panel .eyebrow").textContent = "By focus area";
  $("#new-set-button").innerHTML = "New question set <span>→</span>";

  $("#score-value").textContent =
    `${Math.round(
      (score / QUESTION_COUNT) * 100
    )}%`;


  $("#score-detail").textContent =
    `${score} of ${QUESTION_COUNT} correct`;


  const categories =
    [
      ...new Set(
        state.questions.map(
          (question) =>
            question.category
        )
      )
    ];


  $("#category-results").innerHTML =
    categories
      .map(
        (category) => {

          const indexes =
            state.questions
              .map(
                (question, index) =>
                  question.category ===
                  category
                    ? index
                    : -1
              )
              .filter(
                (index) =>
                  index >= 0
              );


          const correct =
            indexes.filter(
              (index) =>
                state.answers[
                  index
                ]?.correct
            ).length;


          const percent =
            Math.round(
              (correct /
                indexes.length) *
                100
            );


          return `
            <div class="category-row">

              <span>
                ${escapeHTML(category)}
              </span>

              <div class="category-track">

                <div
                  class="category-fill"
                  style="width:${percent}%"
                ></div>

              </div>

              <strong>
                ${percent}%
              </strong>

            </div>
          `;
        }
      )
      .join("");


  $("#review-list").innerHTML =
    state.questions
      .map(
        (question, index) => {

          const answer =
            state.answers[index];


          const learnMore =
            answer?.correct
              ? ""
              : `
                <p class="learn-more-wrap">
                  ${learnMoreLink(
                    question.category
                  )}
                </p>
              `;


          return `
            <article class="review-item">

              <header>

                <h3>
                  ${index + 1}.
                  ${escapeHTML(
                    question.question
                  )}
                </h3>

                <span
                  class="review-result ${
                    answer?.correct
                      ? ""
                      : "incorrect"
                  }"
                >
                  ${
                    answer?.correct
                      ? "CORRECT"
                      : "REVIEW"
                  }
                </span>

              </header>

              <p>
                <strong>
                  Answer:
                </strong>

                ${escapeHTML(
                  question.options.find(
                    (option) =>
                      option.original ===
                      question.answer
                  ).text
                )}
              </p>

              <p>
                ${escapeHTML(
                  question.explanation
                )}
              </p>

              ${learnMore}

            </article>
          `;
        }
      )
      .join("");
}


// ============================================================
// HISTORY
// ============================================================

function renderHistory() {

  const history =
    getHistory().reverse();


  $("#history-list").innerHTML =
    history.length

      ? history
          .map(
            (item) => `
              <div class="history-entry">

                <span>
                  ${
                    new Date(
                      item.date
                    ).toLocaleDateString()
                  }
                  ·
                  ${item.mode}
                </span>

                <strong>
                  ${item.score}/${item.total}
                </strong>

              </div>
            `
          )
          .join("")

      : `
          <p class="muted">
            No rounds recorded yet.
          </p>
        `;


  $("#history-dialog").classList.remove(
    "hidden"
  );
}


// ============================================================
// INITIALIZATION
// ============================================================

async function init() {

  const [quizResponse, qfiResponse] = await Promise.all([
    fetch("interview-questions.json"),
    fetch("../knowledge/scenario_based_questions.md")
  ]);

  if (!quizResponse.ok || !qfiResponse.ok) {
    throw new Error("Could not load both question banks");
  }

  state.quizQuestions = await quizResponse.json();
  state.questions = state.quizQuestions;
  state.qfiQuestions = parseQfiQuestionBank(await qfiResponse.text());

  if (state.qfiQuestions.length !== 452) {
    throw new Error(`Expected 452 QFI questions, found ${state.qfiQuestions.length}`);
  }


  $("#bank-count").textContent =
    `${state.quizQuestions.length} quiz · ${state.qfiQuestions.length} QFI`;


  [
    ...new Set(
      state.questions.map(
        (question) =>
          question.category
      )
    )
  ]
    .sort()
    .forEach(
      (category) => {

        $("#category-select")
          .insertAdjacentHTML(
            "beforeend",
            `
              <option
                value="${escapeHTML(category)}"
              >
                ${escapeHTML(category)}
              </option>
            `
          );

      }
    );


  renderQuickFilters();

  updateSetupMeta();
}


// ============================================================
// EVENT LISTENERS
// ============================================================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    init().catch(
      () => {

        $("#question-title").textContent =
          "The question bank could not be loaded.";

      }
    );


    document
      .querySelectorAll(".mode-card")
      .forEach(
        (button) => {

          button.addEventListener(
            "click",
            () => {

              document
                .querySelectorAll(
                  ".mode-card"
                )
                .forEach(
                  (card) =>
                    card.classList.remove(
                      "selected"
                    )
                );


              button.classList.add(
                "selected"
              );


              state.mode =
                button.dataset.mode;

              state.questions = state.mode === "qfi"
                ? state.qfiQuestions
                : state.quizQuestions;

              const qfiMode = state.mode === "qfi";
              $(".filters").classList.toggle("hidden", qfiMode);
              $("#quick-filter-list").classList.toggle("hidden", qfiMode);

              if (!qfiMode) {
                renderQuickFilters();
              }

              updateSetupMeta();
            }
          );

        }
      );


    $("#category-select")
      .addEventListener(
        "change",
        (event) => {

          state.filters.category =
            event.target.value;

          renderQuickFilters();
        }
      );


    $("#difficulty-select")
      .addEventListener(
        "change",
        (event) => {

          state.filters.difficulty =
            event.target.value;
        }
      );


    $("#type-select")
      .addEventListener(
        "change",
        (event) => {

          state.filters.type =
            event.target.value;
        }
      );


    $("#start-button")
      .addEventListener(
        "click",
        () =>
          startSession()
      );


    $("#next-button")
      .addEventListener(
        "click",
        nextQuestion
      );


    $("#grade-answer-button")
      .addEventListener(
        "click",
        submitQfiAnswer
      );


    $("#quit-button")
      .addEventListener(
        "click",
        () => {

          clearInterval(
            state.timerId
          );

          showView(
            "setup"
          );

          updateSetupMeta();
        }
      );


    $("#new-set-button")
      .addEventListener(
        "click",
        () =>
          startSession()
      );


    $("#retry-button")
      .addEventListener(
        "click",
        () =>
          startSession(true)
      );


    $("#reset-button")
      .addEventListener(
        "click",
        () => {

          localStorage.removeItem(
            state.mode === "qfi" ? QFI_SEEN_KEY : SEEN_KEY
          );

          updateSetupMeta();

          startSession();
        }
      );


    $("#change-session-button")
      .addEventListener(
        "click",
        () => {
          showView("setup");
          updateSetupMeta();
        }
      );


    $("#history-button")
      .addEventListener(
        "click",
        renderHistory
      );


    $("#close-history")
      .addEventListener(
        "click",
        () =>
          $("#history-dialog")
            .classList.add(
              "hidden"
            )
      );


    $("#clear-history")
      .addEventListener(
        "click",
        () => {

          localStorage.removeItem(
            HISTORY_KEY
          );

          renderHistory();

          updateSetupMeta();
        }
      );

  }
);
