# Jenkins

Jenkins is a CI server you run yourself. A Jenkinsfile in the repository is the job. An agent runs the steps. The controller keeps the configuration, the history, and the credentials.

```text
GitHub webhook
      │
      ▼
controller schedules a job
      │
      ▼
agent checks out the commit and runs the stages
      │
      ├── test
      ├── build and scan
      └── deploy, only from the protected branch
```

Use Jenkins when the build must sit on your network, or when the organization already runs it. Use GitHub Actions when the code is on GitHub and a hosted runner is enough. One of them should be allowed to deploy to production, not both for the same service.

The comparison with Bamboo and GitHub Actions is in [the CI/CD notes](../ci-cd/jenkins-bamboo-github-actions.md).

## The pages

- [Fundamentals](fundamentals.md) — controller, home, and what a build is
- [Jenkinsfile](jenkinsfile.md) — declarative pipelines
- [Agents](agents.md) — where the work runs
- [Credentials](credentials.md) — secrets that are not in the file
- [GitHub](github.md) — clone, webhook, and status
- [Troubleshooting](troubleshooting.md) — a red build

A pipeline that builds an image and pushes it is also described, as a file, in [Jenkinsfile](jenkinsfile.md).
