# Ansible Inventory

> **The inventory is the list of machines Ansible may touch, grouped so a play can say "the web servers" instead of naming each box.**

```ini
[web]
web-1.internal
web-2.internal

[db]
db-1.internal

[prod:children]
web
db
```

```bash
ansible-inventory -i inventory.ini --graph
```

Groups can contain hosts or other groups (`:children`). A host can be in several groups. Variables attached to a group apply to its hosts. Child groups override parent groups when the same variable is set twice. Host variables override group variables. The full order is in [variable.md](variable.md).

## Static and dynamic

A file you edit is a static inventory. It is honest and it goes stale the day autoscaling replaces `web-1`. A dynamic inventory plugin or script asks AWS, GCP, or vSphere who exists right now and builds the groups from tags.

```text
tag Environment=prod, Role=web   →   group prod_web
```

Tag the instances in Terraform so the inventory is a view of the same source of truth, not a second list someone will forget to update.

## Where the connection details live

```ini
[web]
web-1.internal ansible_user=deploy ansible_port=22
```

`ansible_host` is the address to connect to when the inventory name is only an alias. `ansible_python_interpreter` matters when the target's Python is not where Ansible expects. Those are host variables, not a reason to fork the playbook.

## Ranges and patterns

```bash
ansible web -m ping
ansible 'web:&prod' -m ping
ansible 'all:!db' -m ping
```

`&` is intersection. `!` is exclusion. A play that targets `all` in a shared inventory is how a weekend change restarts the database. Target the narrowest group that is still honest.

## A layout that survives

```text
inventory/
  prod/
    hosts.yml
    group_vars/web.yml
    host_vars/db-1.yml
  dev/
    hosts.yml
```

Separate inventories for prod and dev beat one giant file and a `--limit` you hope you remembered. Limits are a scalpel for one run. They are not the environment boundary.
