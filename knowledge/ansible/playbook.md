# Ansible Playbook

> **A playbook is an ordered list of plays. A play maps a group of hosts to a list of tasks.**

```yaml
- name: Configure web servers
  hosts: web
  become: true
  roles:
    - nginx
    - app

- name: Configure databases
  hosts: db
  become: true
  roles:
    - postgresql
```

Ansible runs the first play to completion, then the next. Inside a play, tasks run in order on each host, and by default many hosts run at once (`forks`). Order across hosts inside one task is not a promise unless you set `serial`.

```text
play "web"
   ├── all web hosts, task 1
   ├── all web hosts, task 2
   └── handlers
play "db"
   └── ...
```

## Serial and rolling restarts

```yaml
- name: Roll the web tier
  hosts: web
  serial: 1
  tasks:
    - name: Pull the new release
      ansible.builtin.include_role:
        name: app
```

`serial: 1` takes one host out at a time. That is a rolling restart. Combine it with a load balancer task that drains the host first, or you will restart a machine that is still serving. `max_fail_percentage` stops the play before a bad release walks the whole group.

## Check, diff, limit, tags

```bash
ansible-playbook site.yml --check --diff
ansible-playbook site.yml --limit web-1.internal
ansible-playbook site.yml --tags nginx
```

`--limit` is for a surgical rerun, not for pretending an inventory has environments. Tags let you run part of a playbook. They also let you skip the part that makes the change safe. Tag the smoke check with the change, or people will run the tag and skip the test.

## Where playbooks should live

```text
playbooks/
  site.yml              imports the plays
roles/
  nginx/
  app/
```

`site.yml` stays thin. Roles hold the work. A 900-line playbook with copy-pasted tasks for prod and dev will diverge the first time someone fixes only one of them. Variables hold the difference. The tasks stay one copy.

## Failure

A failed task stops that host and, depending on settings, the play. `ignore_errors: true` is almost always hiding a problem you will meet later. `block` / `rescue` / `always` is the honest version: try the deploy, run the rollback in rescue, always remove the maintenance page.
