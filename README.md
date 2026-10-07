# bitwise-devops-hub

Root/index repository for a set of small, focused example repositories used to
learn and demonstrate different CI approaches and deployment targets. Each
linked repository is self-contained (its own README, pipeline, and manifests)
so it can be studied or reused independently.

All linked repos below are private under the `barikpriyabrata27` GitHub
account.

## CI understanding examples

Small repos that each illustrate a different source-control/CI shape.

| # | Type | Repo |
| - | ---- | ---- |
| 1 | C# small repo | [bitwise-devops-csharp](https://github.com/barikpriyabrata27/bitwise-devops-csharp) |
| 2 | Python small repo | [bitwise-devops-python](https://github.com/barikpriyabrata27/bitwise-devops-python) |
| 3 | Java small repo | [bitwise-devops-java](https://github.com/barikpriyabrata27/bitwise-devops-java) |
| 4 | Version-control-only repo (no build/CI) | [bitwise-devops-vcs](https://github.com/barikpriyabrata27/bitwise-devops-vcs) |
| 5 | Monorepo example | [bitwise-devops-monorepo](https://github.com/barikpriyabrata27/bitwise-devops-monorepo) |

## Deployment examples

Small repos that each illustrate deploying an app to a different target.

| # | Target | Repo |
| - | ------ | ---- |
| 1 | NAS deployment (Windows) | [bitwise-devops-nasw](https://github.com/barikpriyabrata27/bitwise-devops-nasw) |
| 2 | NAS deployment (Linux) | [bitwise-devops-nasl](https://github.com/barikpriyabrata27/bitwise-devops-nasl) |
| 3 | PCF (Pivotal/Tanzu Application Service) deployment | [bitwise-devops-pcf](https://github.com/barikpriyabrata27/bitwise-devops-pcf) |
| 4 | Kubernetes deployment | [bitwise-devops-kubernates](https://github.com/barikpriyabrata27/bitwise-devops-kubernates) |
| 5 | AWS deployment | [bitwise-devops-aws](https://github.com/barikpriyabrata27/bitwise-devops-aws) |
| 6 | GCP deployment | [bitwise-devops-gcp](https://github.com/barikpriyabrata27/bitwise-devops-gcp) |
| 7 | Cloud Run deployment | [bitwise-devops-cloudrun](https://github.com/barikpriyabrata27/bitwise-devops-cloudrun) |

## Shared infrastructure

| Purpose | Repo |
| ------- | ---- |
| Terraform modules used across the deployment examples | [bitwise-devops-terraform](https://github.com/barikpriyabrata27/bitwise-devops-terraform) |

## Knowledge

[`knowledge/`](knowledge/README.md) breaks the pipeline into topic docs that
link back to the repos above: [CI/CD](knowledge/ci-cd/README.md),
[Jenkins](knowledge/jenkins/README.md),
[Terraform](knowledge/terraform/README.md), [AWS](knowledge/aws/README.md),
[GCP](knowledge/gcp/README.md), [Ansible](knowledge/ansible/README.md),
[Docker](knowledge/docker/README.md), [Kubernetes](knowledge/kubernetes/README.md),
[DevSecOps](knowledge/devsecops/README.md),
[Authentication & Authorization](knowledge/auth/README.md),
[Observability](knowledge/observability/README.md),
[Linux](knowledge/linux/README.md), and
[Python](knowledge/python/README.md).

A small Python tool in this repo, [release-preflight](projects/release-preflight/README.md),
checks a directory for secrets, floating image tags, and risky Kubernetes
settings before a deploy.

## Interview quiz

[`quiz/`](quiz/) contains a standalone, interactive interview practice quiz
(practice and timed modes, rotating attempts), moved here from
`bitwise-devops-kubernates` so it can be shared across all the linked
example repos. Categories include Kubernetes, CI/CD, Docker, Terraform,
AWS, GCP, Ansible, Jenkins, observability, Linux, Python, DevSecOps, and authentication.

- `quiz/interview.html`, `interview.css`, `interview.js` – the quiz app.
- `quiz/interview-questions.json` – the question bank.
- `quiz/expand-interview-bank.py` – generator script used to extend the bank.

### Opening the quiz

The quiz loads its question bank from JSON at runtime, so it must be served
over HTTP rather than opened directly as a file.

- **GitHub Pages**: The Actions workflow publishes the repository root,
  including the quiz under `/quiz`. The root `index.html` redirects to the
  quiz, and it can also be opened directly at
  `https://barikpriyabrata27.github.io/priyexa-devops-hub/quiz/interview.html`.
  A `.nojekyll` file at the repo root skips Jekyll processing so the static
  HTML/CSS/JS/JSON files are served as-is.
- **Local testing**:
  ```bash
  python -m http.server 8000 --directory .
  ```
  then open `http://localhost:8000/quiz/interview.html`. The repository root must be served so QFI can load its interview-question guide from `knowledge/`.

## Status

The Kubernetes deployment example (`bitwise-devops-kubernates`) already
contains a working Flask app + Docker + kind CI/CD pipeline, migrated from
this repository's previous history. The rest of the linked repos are freshly
created placeholders (`README.md` only) and still need their example
content, pipelines, and manifests filled in.
