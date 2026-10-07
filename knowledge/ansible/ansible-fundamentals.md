# Ansible Fundamentals

> **Ansible configures machines by pushing small tasks over SSH or WinRM. You describe the state you want. Modules make it true. There is no agent to install.**

```text
control node                         managed nodes
your laptop or AWX                   the servers
      │                                    │
      │  SSH, as a normal user             │
      ▼                                    ▼
playbook  →  modules  →  "nginx is installed and running"
```

Terraform builds the machine. Ansible, cloud-init, or an image bake decides what is inside it. Using Terraform remote-exec as a configuration system hurts. This is the tool shaped for that job.

## Why it feels different from a shell script

A shell script is a sequence of commands that assume a starting point. An Ansible module is written to be safe to run again. Installing nginx twice does not install it twice and fail. Copying a file that is already correct changes nothing and reports `ok`. That property is **idempotence**, and it is the reason you can run the same playbook every night.

```text
first run     changed
second run    ok
if someone hand-edits the file    changed, back to what the playbook says
```

## The vocabulary, once

| Word | Meaning |
| --- | --- |
| [Inventory](inventory.md) | the list of hosts |
| [Task](task.md) | one action |
| [Playbook](playbook.md) | plays that map tasks to hosts |
| [Module](module.md) | the code that performs a task |
| [Role](roles.md) | a reusable bundle of tasks, templates, and defaults |
| [Variable](variable.md) | a value that changes by host or environment |
| [Fact](fact.md) | a variable Ansible discovered about the host |
| [Handler](handlers.md) | a task that runs at the end, only if notified |
| [Template](template.md) | a file rendered from variables |
| [Vault](vault.md) | encrypted secrets inside the repo |
| [AWX](awx.md) | the web app and API in front of playbooks |

## A first useful run

```bash
ansible -i inventory.ini web -m ping
```

If ping works, SSH, Python on the target, and your inventory are fine. Everything harder builds on that.

## What Ansible will not do

It will not keep a process in spec every second the way Kubernetes reconciliation does, unless you schedule it. A playbook is a run, not a control loop. It also will not design your network. And it should not be the place you store an unencrypted production password "just for now." That is how "for now" becomes the breach.
