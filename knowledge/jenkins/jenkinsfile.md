# Jenkinsfile

> **A Jenkinsfile is the pipeline, checked in with the code. Declarative form is the one other people can read.**

```groovy
pipeline {
  agent { label "linux" }
  options { timestamps() }
  stages {
    stage("Test") {
      steps { sh "./mvnw -B verify" }
    }
    stage("Image") {
      steps { sh "docker build -t app:${env.GIT_COMMIT} ." }
    }
    stage("Deploy") {
      when { branch "main" }
      steps { sh "kubectl rollout status deploy/app" }
    }
  }
  post {
    always { cleanWs() }
  }
}
```

`agent` is where it runs. `stages` run in order. `when` keeps deploy off a pull request. `post` runs after, including when a stage failed. `cleanWs()` stops the next build from inheriting a dirty directory.

## Declarative and scripted

Declarative is the block above. Jenkins checks the shape. Scripted is a Groovy program and can do anything the controller can do, which is why a bug in it is worse. Use declarative for test, build, scan, push, and deploy. Drop into a `script` block for the one step that does not fit. Put repeated steps in a shared library so forty Jenkinsfiles do not copy them.

## What the file must not contain

Passwords, cloud keys, and kubeconfigs. Bind those from the credential store for the one stage that needs them. Do not print the environment at the top of the job to "see if the secret arrived." The log will keep it.

## Parallel and artifacts

Stages without a dependency can run inside `parallel`. The deploy stage `needs` the image to exist, so it waits. Archive the test report on the build. Pass the image by digest, not by assuming the workspace of another agent still has the tar.

A multibranch job discovers a Jenkinsfile on each branch. The pull-request build stops before deploy. Main deploys. That split is `when { branch "main" }`, plus a credential the pull-request build is not allowed to use.
