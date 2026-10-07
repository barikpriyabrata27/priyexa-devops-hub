# Ansible Facts

> **Facts are variables Ansible learns by inspecting the host: OS, IP addresses, memory, disks, and virtualization.**

```yaml
- name: Use the discovered package manager facts
  ansible.builtin.debug:
    msg: "{{ ansible_facts['os_family'] }} {{ ansible_facts['distribution_version'] }}"
```

By default, at the start of a play Ansible runs the `setup` module. The result is `ansible_facts`. Older playbooks say `ansible_os_family`. Both work. Prefer `ansible_facts['os_family']` in new code so it is obvious the value was discovered, not set by you.

```text
play starts
    │
    ▼
gather facts          one SSH round trip, a blob of JSON
    │
    ▼
tasks can branch on OS, NIC names, memory
```

## Use them for differences the host actually has

```yaml
- name: Install Apache on Red Hat
  ansible.builtin.dnf:
    name: httpd
    state: present
  when: ansible_facts['os_family'] == "RedHat"
```

Branching on the OS family is fair. Branching on a fact to avoid writing proper inventory is how plays become unreadable. If prod and dev differ because you decided they differ, that is a group variable, not a fact.

## Turn gathering off when you do not need it

```yaml
- name: Bounce a service
  hosts: web
  gather_facts: false
```

Fact gathering is not free across hundreds of hosts. Disable it for a play that only restarts a service and already knows the hosts. Cache facts if many plays in a row need the same snapshot.

## Custom facts

Drop a file on the host under `/etc/ansible/facts.d/app.fact` that prints JSON. The next gather puts it in `ansible_facts['ansible_local']`. That is a way for an image build to declare "this AMI is revision 42" without SSH-time guesswork. Keep it small. It is not a database.

## Facts can be wrong for the task

They are a point in time. A play that gathers facts, then adds a disk, then expects the new disk to appear in `ansible_facts['devices']` will not see it until facts are gathered again (`ansible.builtin.setup`). If the task needs fresh data, gather again on purpose.
