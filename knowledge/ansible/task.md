# Ansible Task

> **A task is one module call, with a name a human can read in the output.**

```yaml
- name: Allow HTTPS through the firewall
  ansible.posix.firewalld:
    service: https
    permanent: true
    state: enabled
    immediate: true
```

The name is not decoration. At 2 a.m. the output says `TASK [Allow HTTPS through the firewall]`. `TASK [firewalld]` says nothing. Write the name as the intent.

## Control the blast of one task

```yaml
- name: Run the database migration
  ansible.builtin.command: /usr/local/bin/migrate
  run_once: true
  when: inventory_hostname == groups['db'][0]
```

`when` skips the task. `run_once` runs it on a single host even if the play targets a group. Migrations and "notify Slack" belong there. Forgetting `run_once` on a migration is how you migrate three times in parallel.

`register` saves the result. `changed_when` and `failed_when` correct a shell command that cannot speak Ansible's language. `until` and `retries` wait for a port to open without a sleep baked into a script.

```yaml
- name: Wait until the app answers
  ansible.builtin.uri:
    url: http://127.0.0.1:8080/health
  register: health
  retries: 12
  delay: 5
  until: health.status == 200
```

## Loops

```yaml
- name: Create service accounts
  ansible.builtin.user:
    name: "{{ item }}"
    state: present
  loop:
    - app
    - backup
```

Loop items should be data, not a reason to copy the task four times. If the list grows per environment, it is a variable.

## Privilege

```yaml
- name: Install nginx
  ansible.builtin.apt:
    name: nginx
    state: present
  become: true
```

`become` is sudo. The connection user should be an ordinary account allowed to escalate, not root SSH. `become` on the play raises everything. `become` on the task raises one action. Prefer the narrower one when only the install needs it.

## Handlers are not tasks you call

Notifying a handler is how a task says "if I changed something, restart later." The handler page is [handlers.md](handlers.md). Do not restart nginx in the middle of the play on every host while later tasks still need the old process for a moment, unless you mean to.
