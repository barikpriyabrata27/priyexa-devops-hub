# Ansible Variables

> **Variables are how one role configures many environments. Precedence is the whole difficulty. Set values in fewer places, not more.**

```yaml
nginx_port: 80
```

```yaml
- name: Listen
  ansible.builtin.template:
    src: nginx.conf.j2
    dest: /etc/nginx/nginx.conf
  vars:
    nginx_port: 8080
```

## Where a value may live

From lowest precedence to highest, the ones you will actually use:

```text
role defaults
inventory group_vars
inventory host_vars
play vars
extra vars on the command line     (-e) wins
```

There are more layers. If you need the full ladder to explain why a port is 80, you have too many layers. A healthy layout:

```text
group_vars/all.yml          timezone, org name
group_vars/web.yml          nginx settings for every web host
group_vars/prod.yml         sizes and names for production
host_vars/db-1.yml          the one thing unique to that box
```

Role defaults hold the fallback. Extra vars are for a one-off or for CI injecting a version. They override everything, which makes them a poor place to hide permanent configuration nobody can see in the repo.

## Names

Prefix role variables: `nginx_worker_processes`, not `workers`. Two roles that both set `port` will fight, and the winner is precedence, not intent.

## Registered variables

```yaml
- name: Read the release file
  ansible.builtin.slurp:
    src: /opt/app/VERSION
  register: release_file
```

`release_file.content` exists for the rest of the play on that host. It is not a fact. It disappears after the play. Do not build a configuration system out of registers.

## Secrets are variables with a different storage rule

A password in `group_vars/prod.yml` in plaintext will be copied into logs, tickets, and laptops. Put it in [vault](vault.md) or fetch it at runtime from a secret manager. `no_log: true` on a task keeps the value out of the output. It does not keep it out of the file you committed.

## Magic variables

`inventory_hostname`, `groups`, `hostvars`, and `ansible_facts` are always there. `hostvars['db-1']['ansible_host']` lets a web play discover the database address. That coupling is convenient and brittle. Prefer a group variable you set on purpose to scraping another host's facts.
