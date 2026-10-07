# Running commands

> **subprocess is how Python runs Git, kubectl, or terraform when there is no library worth taking. Capture the result. Do not build the command with string concatenation.**

```python
import subprocess

def git_rev() -> str:
    completed = subprocess.run(
        ["git", "rev-parse", "HEAD"],
        check=True,
        capture_output=True,
        text=True,
    )
    return completed.stdout.strip()
```

The argument list is not a shell. `git` is the program, and each argument is separate, so a branch name with a space or a `;` cannot become a second command. `shell=True` with an f-string is how a filename becomes an injection. Use it only when you truly need a shell, and never with untrusted text.

`check=True` raises when the exit code is non-zero. That is what you want for "this command must work." When a non-zero exit is a finding, leave `check` off and read `returncode` yourself.

## Output

`capture_output=True` and `text=True` give you strings. A command that prints a secret will put that secret in your variable. Do not log `stderr` blindly if the command was a login helper. A timeout on `run` stops a hung `kubectl` from owning the job.

Prefer a library or an HTTP API over wrapping a CLI when the CLI's output is meant for humans and changes between versions. Parse `--format=json` when the tool has it. Parsing `kubectl get pods` table text will break the day a column moves.
