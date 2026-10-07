# Ansible Module

> **A module is the program that does one kind of work on the host and reports whether anything changed.**

You rarely write a module. You call one from a task.

```yaml
- name: Install nginx
  ansible.builtin.apt:
    name: nginx
    state: present
```

`ansible.builtin.apt` knows how packages work on Debian. `ansible.builtin.dnf` does the Red Hat side. `ansible.builtin.package` picks a manager for you when the task is that simple. `community.general` and vendor collections cover the rest of the world. Install collections on purpose and pin them. A floating collection version will change a module's arguments under you.

## Changed, ok, failed

The module returns JSON. Ansible turns that into the line you see:

```text
changed    the module altered the host
ok         the host already matched
failed     it could not do the job
```

A module that always says `changed` breaks handlers and makes every run look dirty. Prefer a real module over `shell`. The shell module cannot know whether nginx was already installed, so people wrap it in `creates:` or `changed_when:` to fake the report. That is a clue you wanted the package module.

## Idempotence is the contract

`state: present` means "make it so." `state: absent` means "make it gone." `state: latest` means "upgrade," which is a different decision and will change the host whenever the repository has a newer package. Production playbooks usually pin a version or say `present`, and let an image bake or a scheduled, reviewed run do upgrades.

## Check mode

```bash
ansible-playbook site.yml --check --diff
```

Good modules honor check mode and tell you what they would change. `shell` often cannot. `--diff` shows file changes. A pull request that includes a check-mode run is easier to trust than one that says "I ran it in dev, trust me."

## When you do write one

Put it in a collection, accept arguments as a documented spec, return `changed`, and support check mode. If the logic is "run these four commands," a role with existing modules is the better contribution. Custom modules are for a real API, not for avoiding YAML.
