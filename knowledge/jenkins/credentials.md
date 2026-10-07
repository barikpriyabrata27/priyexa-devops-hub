# Jenkins Credentials

> **A credential is a secret in the Jenkins store, bound into one step by id. It is not a string in the Jenkinsfile.**

```groovy
withCredentials([usernamePassword(
  credentialsId: "ecr-push",
  usernameVariable: "USER",
  passwordVariable: "PASS"
)]) {
  sh 'echo "$PASS" | docker login --username "$USER" --password-stdin'
}
```

The binding masks the value in the log if the shell does not deliberately print it. `echo $PASS` defeats the mask. Folder scope means the dev folder cannot read the production credential. A global credential that every job can bind is a shared root password.

## What to store

| Need | Store |
| --- | --- |
| GitHub clone | a GitHub App key, or a read-only deploy key |
| Registry push | a token, or do not store it and assume a cloud role instead |
| kubeconfig | a token for one namespace, not cluster-admin |
| Vault or cloud | a short-lived assume, not a permanent key, when the platform allows it |

A personal access token of a human expires badly when that person leaves. Prefer an app or a deploy key owned by the team.

## Docker and ECR

For Docker Hub, a username and token in the store is enough. For ECR, the better path is the agent's instance role and `aws ecr get-login-password` during the job, so there is no long-lived key in Jenkins at all. If you do store one, it is folder-scoped and rotated.

## Who can see them

Anyone who can configure a job in a folder can often use that folder's credentials, even if they cannot view the plain text. Treat "job configure" as secret access. Backups of Jenkins home are secret dumps. Encrypt them and limit who can restore.
