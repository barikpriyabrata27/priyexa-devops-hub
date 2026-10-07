# release-preflight

A small DevOps command that checks a directory before you ship it. It does not deploy anything and it does not call a cloud API. It fails the process when the tree looks like an accident.

```text
preflight ./release
    │
    ├── secret-like lines     keys, private keys, password assignments
    ├── Dockerfile            floating base image, or running as root
    └── Kubernetes workloads  :latest, privileged, or no resource requests
```

Exit `0` means the tree is clean. Exit `1` means there are findings. Exit `2` means the path is missing or the usage is wrong. A pipeline treats any non-zero exit as a failed gate.

## Run it

From this directory, with no install:

```bash
python src/preflight/__main__.py examples/bad
python src/preflight/__main__.py examples/good
```

The bad example should exit `1` and list findings. The good example should exit `0`.

Tests, from this directory:

```bash
python -m unittest discover -s tests -v
```

The standard library is the only dependency. Python 3.10 or newer is enough. Packaging notes for turning this into an installed command are in [Packaging](../../knowledge/python/packaging.md).

## What it will not catch

A custom secret format, a Helm template that only becomes `:latest` after render, or a password split across two lines. It is a fast gate, not a scanner with a vulnerability database. Secret scanning in the pipeline is the wider control, described in [secrets scanning](../../knowledge/devsecops/secrets-scanning.md).
