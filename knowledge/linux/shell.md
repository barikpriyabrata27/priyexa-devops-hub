# Shell

> **The shell is how you look at a machine and how a pipeline starts a command. Treat a script like a program: it should fail when something is wrong.**

```bash
#!/usr/bin/env bash
set -euo pipefail
```

`set -e` stops on a failed command. `set -u` stops on an unset variable. `pipefail` makes a pipeline fail when an earlier command fails, not only the last one. Without those, `grep something missing-file | wc -l` can look successful.

Quote expansions: `"$file"`, not `$file`. Unquoted values split on spaces and glob. A log path with a space will become two arguments and the script will act on the wrong thing.

## What belongs in a script

A check you will run again: disk over a threshold, a health URL, a count of error lines while the log index is down. The script lives in git. Secrets come from the environment, not from the file.

```bash
usage=$(df -P / | awk 'NR==2 {print $5}' | tr -d '%')
if [ "$usage" -ge 80 ]; then
  echo "disk ${usage}% on /" >&2
  exit 1
fi
```

Exit 0 is success. Exit 1 is a finding. Cron, systemd, or the monitoring agent can alert on the non-zero exit. Do not parse `ls`. Use `find` or a glob.

## What does not

Application logic, a second logging product, or a 400-line deploy. If it has to run on more than one machine and be reviewed, it is an [Ansible](../ansible/README.md) task or a step in the pipeline. If the logic has branches, JSON, and tests, it is [Python](../python/README.md).

The shebang `#!/usr/bin/env bash` is how the kernel picks the interpreter when you execute the file. The file also needs the executable bit. A script that only works because you pasted it into an interactive bash will fail in Jenkins, where the shell is not your login shell.
