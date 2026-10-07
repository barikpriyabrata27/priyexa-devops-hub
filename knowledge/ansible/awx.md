# Ansible AWX

> **AWX is the open-source web interface and API in front of Ansible. It runs playbooks on a schedule, from a button, or from a webhook, with credentials that are not on someone's laptop.**

The Red Hat supported product built from the same upstream is Ansible Automation Platform. Interviews say both names. The ideas match.

```text
project            a git repo of playbooks
inventory          static or synced from the cloud
credential         SSH key, cloud token, vault password
job template       project + inventory + playbook + credential
job                one run, with logs and a status
```

## Why bother

Running `ansible-playbook` from a laptop works until the laptop is off, the SSH key is personal, and nobody can see what ran last Thursday. AWX records the run, who launched it, and the output. Credentials stay in AWX. The operator has permission to launch a job template, not a copy of the root key.

## The objects, in the order you create them

1. A credential for SSH and a credential for vault.
2. A project that pulls git.
3. An inventory. A cloud inventory source syncs hosts by tag.
4. A job template that pins the playbook path and should not allow arbitrary extra vars from every user.
5. A schedule or a webhook from the pipeline.

Surveys ask the operator for a version or a limit before launch, with types and choices, instead of a free-text extra var that can retarget the play.

## Isolation

Jobs run in an execution environment, a container image with the Ansible version and collections you pinned. "It worked on my laptop" ends where the image begins. Pin the image. Update it on purpose.

Separate teams get separate organizations or separate permissions on job templates. The template that can touch production is not launchable by everyone who can edit a dev playbook.

## What AWX does not fix

A bad playbook at scale is still a bad playbook. AWX will cheerfully roll a broken role across the fleet if the template says so. RBAC, credentials, and an approval workflow (another job that has to succeed first, or an external change ticket) are how you slow that down. The playbook itself still needs check mode, serial rollout, and handlers that do not restart the world.
