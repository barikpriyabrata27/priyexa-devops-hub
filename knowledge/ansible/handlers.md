# Ansible Handlers

> **A handler is a task that runs at the end of the play, and only if some task notified it.**

```yaml
tasks:
  - name: Write the nginx config
    ansible.builtin.template:
      src: nginx.conf.j2
      dest: /etc/nginx/nginx.conf
    notify: Reload nginx

handlers:
  - name: Reload nginx
    ansible.builtin.service:
      name: nginx
      state: reloaded
```

If the template changes the file, it notifies the handler. If the file was already correct, there is no notification and nginx is not reloaded. That is the point. Reloading on every run hides real changes and drops connections for no reason.

```text
tasks run
   ├── template changed?  notify "Reload nginx"
   └── template ok?       silence
handlers flush once, at the end of the play
```

## Names must match

The notify value is the handler's name. A typo means a successful play that never reloads, and the new config sits on disk unused until someone notices. Keep handler names boring and identical to the notify string.

## They run once

Ten tasks can notify the same handler. It runs one time at the end. That is what you want for a reload. It is wrong for something that must happen immediately between two tasks. For that, use `meta: flush_handlers` at the moment you need the reload to have already happened, for example before a health check that depends on the new config.

## Listen, when several roles care

```yaml
handlers:
  - name: Reload nginx
    ansible.builtin.service:
      name: nginx
      state: reloaded
    listen: web config changed
```

Tasks notify the topic `web config changed`. Any handler listening to that topic runs. Roles can react without sharing one fragile name.

## Failure and handlers

If the play fails before the end, handlers that were notified do not run, unless you flush them. A changed config with a failed later task can leave the service on the old process. Sometimes that is the safe outcome. Sometimes you want `force_handlers: true` so a reload still happens. Choose it on purpose for that play, not as a global default you forgot about.

Handlers are still tasks. They can use modules, `become`, and `when`. They should stay tiny. A handler that deploys the application is a second playbook hiding at the bottom of the file.
