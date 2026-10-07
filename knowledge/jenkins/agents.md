# Jenkins Agents

> **An agent is the machine that runs the steps. The controller should not also be the build machine.**

Builds compile, start Docker, and fill disks. Doing that on the controller puts the credential store next to untrusted code. Agents are separate. The controller only schedules.

```text
controller     queues the job, holds credentials, records the log
agent          checkout, test, docker build, push
```

## Labels

The Jenkinsfile asks for a label: `linux`, `docker`, `windows`. The agent that matches runs the job. A label with no agent means the job waits forever. That wait looks like a hang, not an error, until you look at the queue.

## Ephemeral agents

A VM or a pod that exists for one build and is deleted after it is the clean version. Nothing leaks from the previous job except what you archived on purpose. The image of that agent is pinned. "It worked on the agent someone apt-get installed last month" ends when the image is the definition.

If an agent disappears mid-build, that build fails. Other agents' finished stages stay finished. Rerun the failed stage when the pool is healthy. Do not share a workspace disk between agents and expect a half-written directory to be safe.

## Capacity

Too few agents and main waits behind a pull request. Too many and the registry or the Docker disk falls over. Cap parallelism. Give the production deploy label its own agent so a flood of feature builds cannot occupy the only machine allowed to deploy.

Drain an agent before you delete it. A hard shutdown during a deploy is a partial release plus a red build.
