# Disk and logs

> **A full disk stops deploys, breaks databases, and gets pods evicted. Find which filesystem, then which directory, before you delete something you cannot name.**

```bash
df -h
df -i
du -xh /var | sort -h | tail
```

`df` is the filesystem. `df -i` is inodes. A disk can have free bytes and no free inodes, and writes still fail. `du` finds the directory. `sort -h` understands `K` and `G`.

Deleted files still held open do not show up in `du`. The space returns when the process exits. `lsof` shows them. Truncate or rotate a log. Deleting a file a running process has open does not free the space.

## Logs

`journalctl -u name` for a systemd service. `/var/log` when the service still writes files. Container logs on a node live under the runtime directory and will fill the disk if rotation is off. A chatty pod plus no log agent is how a Kubernetes node hits disk pressure and evicts other pods.

Ship logs to the collector described in [logs](../observability/logs.md). Keep a rotation limit on the node so the collector being down does not fill the disk overnight. Alert at 80 percent. One hundred percent is too late to investigate calmly, especially on a database volume.

## What not to delete

`/var/lib/jenkins`, etcd data, a database directory, or a Terraform state volume, just because `du` says they are large. Those are the product. Move or expire logs, images, and old build workspaces. `docker system prune` on a build agent is fair. The same command on a node that is running production containers is not, unless you know it will not remove something in use.
