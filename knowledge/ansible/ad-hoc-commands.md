# Ad-hoc Commands

> **An ad-hoc command runs one module against a group, once, without a playbook. It is for the question you have right now, not for the change you must repeat.**

```bash
ansible web -i inventory/prod -m ping
ansible web -i inventory/prod -m ansible.builtin.command -a "uptime" -b
ansible web -i inventory/prod -m ansible.builtin.apt -a "name=nginx state=present" -b --check
```

`-m` is the module. `-a` is its arguments. `-b` is become. `--check` asks modules that support it to refrain from changing anything.

```text
good ad-hoc          "is SSH alive?"  "what version is installed?"
dangerous ad-hoc     "restart the database on all"
better as a playbook the same restart, reviewed, serial, logged in AWX
```

## Why playbooks still win

An ad-hoc command lives in shell history. It has no pull request, no handler strategy, and no record unless you wrap the shell. The moment a second person must run the same thing, write the task. The moment it might touch production, write the task even if you are the only person.

## Patterns that pay rent

```bash
ansible db -m ansible.builtin.service -a "name=postgresql state=started" --check
ansible 'web:&prod' -m ansible.builtin.setup -a "filter=ansible_distribution*"
```

Fact filters keep the JSON small. Patterns keep the group small. `all` plus a module that changes state is the shape of an outage report.

## Privilege and forks

Ad-hoc uses the same inventory, forks, and become rules as a playbook. You can restart 50 hosts in parallel by accident. `--forks 1` or a narrower pattern is the brake. `--limit` narrows further. Neither replaces thinking about whether this should have been `serial` in a play.

## From one command to a play

If you ran it twice, it is a task. Translate it directly:

```yaml
- name: Show uptime
  ansible.builtin.command: uptime
  changed_when: false
```

`changed_when: false` matters. The command module otherwise reports `changed` every time, which is a lie for a read-only command.
