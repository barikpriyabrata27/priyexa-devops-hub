# Troubleshooting a Linux host

> **Name the symptom, then the layer. Restarting is the step that deletes the evidence, so it comes after you have captured the process and the log.**

```text
app does not answer
    1. curl localhost on the port the process should use
    2. ss -lntp                 is it listening, and on which address?
    3. systemctl status         did the unit fail?
    4. journalctl -u            what did it print?
    5. df and df -i             is the disk or inode table full?
    6. curl from another host   is the path the problem?
```

Localhost fails: the process, the port, or the bind address. Localhost works and the outside does not: firewall, security group, or a proxy health check on a different port.

## CPU, memory, disk

For CPU, `top` and write down the process name before you restart it. For memory, `free` and `dmesg` for an OOM kill. For disk, `df` then `du`. They are three shortages. A machine can be fine on CPU and unable to write a log.

## After you know

A one-off fix on the box will be gone at the next rebuild, or it will be the only box that works. Put the change in the unit, the image, or Ansible. If the host is a cattle node, replace it after you have the log. Nursing a unique server is how the next failure has no twin to compare.

The same order, one layer up, is in [CI/CD troubleshooting](../ci-cd/ci-cd-troubleshooting.md) when the failing machine is a build agent, and in [Kubernetes troubleshooting](../kubernetes/kubernetes-troubleshooting.md) when the failing thing is a pod.
