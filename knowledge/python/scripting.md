# Scripting

> **A DevOps script is a command with arguments and an exit code. The pipeline is the caller.**

```python
import argparse
import sys

def main() -> int:
    parser = argparse.ArgumentParser(description="Check that a health URL answers.")
    parser.add_argument("url")
    parser.add_argument("--timeout", type=float, default=5)
    args = parser.parse_args()
    print(args.url)
    return 0

if __name__ == "__main__":
    sys.exit(main())
```

`main` returns an integer. `sys.exit` turns it into the process status. `0` is success. Anything else fails the job. Printing the error to stderr and returning `1` is the contract. Raising an unexpected traceback also fails the job, and the traceback is a reasonable log for a bug. It is a poor log for "the disk is full," which is a finding you already understand.

## Stay in the standard library until you need a dependency

`pathlib`, `json`, `urllib`, `argparse`, `subprocess`, and `logging` cover health checks, file scans, and small CLIs. A dependency is a version you must pin and a supply-chain choice. Add one when the standard library becomes the awkward part, not on the first script.

## Layout

One module is fine for a check. A tool you will keep gets a package, a `pyproject.toml`, and tests. The test is what lets you change the scanner without being afraid of the pipeline. See [packaging](packaging.md) and the [release-preflight](../../projects/release-preflight/README.md) project.

Do not put passwords in the source. Read them from the environment at runtime, and do not print that environment.
