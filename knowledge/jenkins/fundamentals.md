# Jenkins Fundamentals

> **The controller decides what runs. The agent does the work. Jenkins home is the disk you must be able to restore.**

`JENKINS_HOME`, often `/var/lib/jenkins`, holds job definitions, plugin state, build records, and the credential store. A new machine with an empty home is a new Jenkins, even if you install the same package. Back that directory up, and treat the backup as secret, because `credentials.xml` and the secrets directory are in it. In a container, that path is a volume. Without the volume, every job disappears on restart.

## A build

A build is one run of one job against one commit. It has a number, a log, and a result. The log is the source of truth when someone says it failed. The changelog and the commit SHA should be on the build page so you are not guessing which revision produced the artifact.

## Freestyle and pipeline

A freestyle job is configured in the UI: click the SCM, click the shell step, click the post-build action. It works, and it cannot be reviewed as code. A pipeline job runs a Jenkinsfile. The steps live in git next to the application. Prefer the file. Leave freestyle for a one-off you intend to delete.

## Plugins

Install the ones the pipeline uses: Git, GitHub Branch Source, Pipeline, and Credentials. Pin the versions. Install them as code if you can. A controller with eighty plugins from old experiments fails the next upgrade. Remove a plugin nobody can name.

## Who may do what

Matrix or role-based authorization, not "everyone is admin." Admin can read the credential store. That is the production secret boundary. Developers can see their jobs and read the logs. They should not be able to change the global security realm or export every credential.
