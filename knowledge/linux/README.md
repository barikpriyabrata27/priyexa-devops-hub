# Linux for DevOps

This folder is the Linux you need to operate a server, an agent, or a node. It is not a desktop guide and it is not a kernel course.

```text
a service fails
    │
    ├── is the process running?     processes
    ├── will it come back on boot?  systemd
    ├── can it read its files?      permissions
    ├── is the disk full?           disk
    └── can it reach the dependency? networking
```

You will see this on Jenkins agents, bastions, Kubernetes nodes, and the VM under a container when the container is not the whole story.

## The pages

- [Shell](shell.md) — the few habits that keep scripts from lying
- [Processes](processes.md) — who is using CPU and memory
- [systemd](systemd.md) — start, restart, and survive a reboot
- [Permissions](permissions.md) — owners, modes, and why 777 is an incident
- [Disk and logs](disk.md) — full disks and the files that filled them
- [Networking](networking.md) — DNS, ports, and routes
- [Users and SSH](ssh.md) — logins you can revoke
- [Troubleshooting](troubleshooting.md) — the order to check

Configuration of many machines belongs in [Ansible](../ansible/README.md). The cluster view belongs in [Kubernetes](../kubernetes/README.md).
