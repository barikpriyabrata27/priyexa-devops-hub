# Jenkins and GitHub

> **GitHub starts the build and shows the result. Jenkins checks out the commit and runs it. A personal laptop key is not part of this.**

Install Git on the agent, the Pipeline plugin, and GitHub Branch Source so Jenkins can discover branches that contain a Jenkinsfile. Store a GitHub App private key, or a read-only deploy key, in the credential store. A personal access token tied to one engineer will break on the day they leave, and until then it acts as that person.

## The webhook

GitHub sends a push or pull-request event to Jenkins. The webhook has a shared secret. Jenkins rejects a payload that does not match, so a stranger cannot trigger builds. The job reports status back, and the commit shows a check. Branch protection on GitHub requires that check. Jenkins should not be able to push to main unless the job is the one that tags a release.

## What each side owns

```text
GitHub          the source, the review, the branch rule, the webhook
Jenkins         the agent, the stages, the credential to clone, the log
```

Authentication failures are usually the credential id in the job not matching the store, the app not being installed on the repository, or the webhook secret having been rotated on only one side. A clone that works from your laptop and fails on the agent is the agent, which does not have your SSH agent.

Pull requests from forks should not receive credentials. The Jenkinsfile from a fork is code the attacker wrote. It will print any secret you inject.
