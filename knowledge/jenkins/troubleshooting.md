# Jenkins Troubleshooting

> **Open the red build, read the first failed stage, and compare it with the last green build of the same job.**

```text
queue forever          no agent for the label
fails before a stage   the Jenkinsfile or the shared library does not parse
fails in checkout      credential, branch, or GitHub
fails in test          the commit, or a flake
fails on docker push   auth, region, or an immutable tag
agent offline          disk, the VM, or a scale-in during the job
green, app still old   the deploy step did not wait for rollout
```

The console log is the artifact. A screenshot of the red ball is not. Note the build number, the commit, and the first error line.

## Yesterday it worked

Diff the Jenkinsfile, the shared library revision, the agent image, and the plugins. A library change breaks every job that loads it, which looks like a sudden outage of unrelated services. A full disk on the agent looks like a random shell failure. `df` on that agent is part of the check when the error is nonsense.

Rerun once if you suspect a dead network. A pass on rerun is a flake to file, not a healthy pipeline. Change one thing between runs or you will not know what fixed it.

## The deploy said success

The last step exited 0 and did not wait. `kubectl apply` returning does not mean the new pods are Ready. Add `kubectl rollout status` or the Helm wait, and fail the build on timeout. Then look at the cluster for the digest the job claimed to deploy. If the deployment still has the old digest, the job targeted the wrong cluster or swallowed a permission error.

More on pipeline failures in general is in [CI/CD troubleshooting](../ci-cd/ci-cd-troubleshooting.md).
