# GitHub Actions

## 1. What is GitHub Actions?

GitHub Actions is GitHub's native automation and CI/CD platform.

It allows us to automate activities such as:

- Building applications
- Running unit tests
- Performing code-quality checks
- Running security scans
- Packaging applications
- Publishing artifacts
- Building Docker images
- Deploying applications
- Running infrastructure automation
- Running scheduled jobs

A simplified flow is:

```text
Developer
    |
    v
GitHub Repository
    |
    v
GitHub Actions
    |
    +---- Build
    +---- Test
    +---- Scan
    +---- Package
    +---- Publish
    +---- Deploy
```

The workflow file in the repo is the source of truth. A run is one execution of that file for one commit. You can rerun a failed job without pretending the YAML on your laptop is what actually ran.

## 2. The words

```text
workflow     a YAML file in .github/workflows
event        what starts it: push, pull_request, schedule, workflow_dispatch
job          a set of steps on one runner, in parallel with other jobs unless you need them
step         one shell command or one action
action       a reusable step, pinned by commit or tag
runner       the machine, GitHub-hosted or self-hosted
```

```yaml
name: ci
on:
  pull_request:
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: ./mvnw -B verify
```

`uses` brings in someone else's code with your repository's credentials available to the job. Pin third-party actions to a commit SHA when the workflow can deploy or read production secrets. A moving tag can move to a malicious commit.

## 3. Permissions and secrets

The default token can do more than a build needs. Set the permission you intend at the top of the workflow:

```yaml
permissions:
  contents: read
```

A job that deploys assumes a cloud role with [OIDC](../auth/oidc.md) instead of storing an access key. Repository secrets are available to workflows you trust. Pull requests from forks should not receive secrets. Environment protection rules on `production` — required reviewers, a named branch — are how a workflow file change does not become an instant production deploy.

## 4. When it fails

Read the first red step. Confirm the runner image and the commit SHA in the log header. A rerun that passes is a flake until you know why. The longer pass over pipeline failure is [CI/CD troubleshooting](ci-cd-troubleshooting.md). How this compares with Jenkins and Bamboo is [Jenkins, Bamboo, and GitHub Actions](jenkins-bamboo-github-actions.md).
