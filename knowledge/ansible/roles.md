# Ansible Roles

> **A role is a playbook you can reuse: tasks, templates, files, defaults, and handlers under one name.**

```text
roles/nginx/
  tasks/main.yml
  handlers/main.yml
  templates/nginx.conf.j2
  files/index.html
  defaults/main.yml
  vars/main.yml
  meta/main.yml
```

You do not have to create every directory. `ansible-galaxy init roles/nginx` creates the skeleton.

```yaml
roles:
  - role: nginx
    vars:
      nginx_port: 8080
```

## Defaults versus vars

`defaults/main.yml` is easy to override. Put the role's knobs there: ports, package names, feature flags.

`vars/main.yml` is hard to override. Put internal values there that callers should not casually replace. The precedence story is in [variable.md](variable.md). The practical rule: if a caller might need a different value per environment, it is a default, not a var.

## Dependencies

`meta/main.yml` can declare that this role needs another role first.

```yaml
dependencies:
  - role: common
```

Dependencies rerun if several roles need them, unless you allow duplicates to be skipped. Deep dependency trees become surprising. Prefer an explicit list in the play for anything an operator must see.

## Galaxy and collections

`ansible-galaxy` installs roles and collections other people published. Pin versions in a `requirements.yml` and install that in CI. An unpinned role is an unpinned dependency, the same risk as an unpinned Terraform module.

```yaml
roles:
  - name: geerlingguy.nginx
    version: 3.2.0
```

Read a role before you run it. It is code with root.

## What makes a role kind

- It does one job.
- It is idempotent.
- It supports check mode.
- It has defaults a caller can see.
- It does not contain the production password. Pass that in from vault or from outside.

A role that both configures nginx and deploys the application and edits the database will be copied and forked. Split it before the second environment exists.
