# systemd

> **systemd starts a process the same way every boot, restarts it when it dies, and records why it failed.**

```bash
systemctl status nginx
systemctl restart nginx
journalctl -u nginx -n 50 --no-pager
```

`status` shows whether the unit is active and the last log lines. `journalctl -u` is the log. A unit that is `failed` is not "down, maybe." It exited and systemd kept the reason.

## Boot

`systemctl enable nginx` links the unit into the boot target. It does not start it now. `start` starts it now and does not enable it. `enable --now` does both. `is-enabled` and `is-active` answer the two questions separately. A container host still needs the container runtime enabled, or the restart policy inside Docker never gets a chance to run.

## A unit you would write

```ini
[Service]
ExecStart=/usr/local/bin/app
Restart=on-failure
User=app
```

`User=app` means the process is not root. `Restart=on-failure` brings it back when it exits non-zero, not when you stopped it on purpose. `ExecStart` is the binary, not a shell pipeline, unless you truly need a shell.

## What people get wrong

Editing a unit under `/usr/lib` and losing the edit on package upgrade. The durable override is `systemctl edit`, which writes a drop-in. Forgetting to `daemon-reload` after a unit change, so the restart still runs the old file. Depending on a crontab `@reboot` line nobody can see. Replace that with a unit.

On a Kubernetes node you rarely write a unit for the application. You still read `kubelet` and `containerd` units when the node is NotReady and the pods are not the bug.
