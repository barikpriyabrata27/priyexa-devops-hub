# Processes

> **A process is a running program. A service is how the machine supervises it. When something is slow or dead, name the process before you restart the box.**

`ps` lists processes. `top` or `pidstat` shows who is using CPU. Sort by memory when the question is RAM: a process whose resident size climbs for hours is a leak or a cache with no bound. Load average above the number of CPUs means work is waiting. High `iowait` with low user CPU is a disk problem wearing a CPU costume.

```text
CPU pinned, one process     the app or a runaway job
CPU idle, app slow          it is waiting: disk, lock, or network
memory climbs, then a kill  the OOM killer, see dmesg
```

The kernel logs an out-of-memory kill with the process name. Read that before you start the service again, or the evidence is the restart.

## Signals

`SIGTERM` asks a process to stop. A well-behaved server finishes the current request and exits. `SIGKILL` cannot be caught. `systemctl stop` and `docker stop` send TERM, wait, then KILL. If your application is pid 1 in a container and the shell swallowed the signal, the stop becomes a kill and in-flight work dies. Prefer the exec form of a container command so the application is pid 1.

## Foreground and leftovers

A process started in an SSH session dies when the session ends unless a service or a supervisor owns it. `nohup` and `screen` are how one-off jobs survive a disconnect. They are also how forgotten processes keep running after the person leaves. A real long-running process is a systemd unit or a container with a restart policy, not a background command in someone's history.

See [systemd](systemd.md) for the supervisor and [troubleshooting](troubleshooting.md) for the order of checks.
