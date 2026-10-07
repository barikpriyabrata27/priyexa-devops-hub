# Ansible Templates

> **A template is a file with placeholders. Ansible renders it on the control node and copies the result to the host.**

```jinja
# templates/nginx.conf.j2
worker_processes {{ nginx_worker_processes }};

server {
    listen {{ nginx_port }};
    server_name {{ inventory_hostname }};
}
```

```yaml
- name: Install the nginx config
  ansible.builtin.template:
    src: nginx.conf.j2
    dest: /etc/nginx/nginx.conf
    owner: root
    group: root
    mode: "0644"
  notify: Reload nginx
```

The module copies only when the rendered content changed, and it can notify a handler. That is the whole pattern for configuration files.

## Jinja, the part you need

```jinja
{% for backend in nginx_backends %}
server {{ backend }};
{% endfor %}

{% if nginx_tls_enabled %}
listen 443 ssl;
{% endif %}
```

`{{ }}` prints a value. `{% %}` is logic. Keep logic in the template thin. A template with nested conditionals for every environment is a program nobody will test. Put the variation in variables so the template reads like the config file it becomes.

## Whitespace

Jinja leaves blank lines where the logic was. `{%-` and `-%}` trim them when the target format cares (YAML, some INI). Nginx does not care. A generated systemd unit might.

## Secrets in templates

A template that prints a password will show the password in diffs and in Ansible output unless you are careful. `no_log: true` hides the task result. It does not encrypt the file on the host. The file mode should be `0600` if a secret must land on disk. Better: the application reads the secret from a file delivered by the platform's secret store, and the template only contains the path.

## `template` versus `copy`

`copy` places a file unchanged. Use it for a binary or a static asset. `template` renders. Using `copy` for a config you then `sed` in a shell task throws away idempotence. Using `template` for a file with no placeholders is harmless.

## Where the file lives

In a role, `src: nginx.conf.j2` looks in `roles/<name>/templates/`. You do not type the folder. A missing template fails the task with a clear path. Quote values that might contain `:` or start with `{{` in YAML so the parser does not eat them before Jinja does.
