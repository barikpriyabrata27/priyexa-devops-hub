# Python for DevOps

Python here is the language for the automation a shell script cannot hold: JSON, HTTP APIs, a real exit code, and a test. It is not a web application course.

```text
a repeated check or a small CLI
        │
        ├── read files and JSON
        ├── call an HTTP API
        ├── run a command when you must
        └── log a result and exit 0 or 1
```

Use the shell for a one-liner on a host. Use Python when there are branches, when the input is JSON or YAML-shaped text, or when the pipeline should fail a test if the logic breaks. Use Ansible when the job is "make these machines match." Use Terraform when the job is "make this cloud match."

## The pages

- [Scripting](scripting.md) — arguments, exit codes, and the standard library
- [Files and JSON](files.md) — the data a pipeline actually passes
- [HTTP APIs](http.md) — health checks and webhooks without a framework
- [Running commands](subprocess.md) — when Python has to call another program
- [Logging](logging.md) — so a job is debuggable in CI
- [Packaging](packaging.md) — so the pipeline installs the same code you tested

## A project

[release-preflight](../../projects/release-preflight/README.md) is a small command-line tool in this repo. It scans a directory before a deploy and fails if it finds a likely secret, an image tagged `latest`, a container running as root, or a Kubernetes workload with no resource requests. Read the notes above, then run that tool and its tests.
