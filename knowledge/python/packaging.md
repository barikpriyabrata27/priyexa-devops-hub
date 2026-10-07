# Packaging

> **If the pipeline runs it, pin it. A script that works because of whatever was on your laptop is not a tool yet.**

```toml
[project]
name = "release-preflight"
version = "0.1.0"
requires-python = ">=3.10"

[project.scripts]
preflight = "preflight.cli:main"
```

`pyproject.toml` names the package and the command. The pipeline installs that version. It does not `pip install` an unpinned name on every build and hope today's release is compatible. A lock file, or a committed constraints file, is what makes next Tuesday's agent match the test you ran.

## Tests

A scanner or a policy check without a test will be "fixed" by deleting the check the first time it fails a build. Keep a bad fixture and a good fixture. The test asserts the bad one fails and the good one does not. Run the tests in CI before anyone points the tool at a real repository.

## What you do not package

A one-off `python check.py` you ran once can stay a file. The moment a second person runs it, or Jenkins runs it, it gets the project file, the tests, and a version. Virtual environments keep that install off the agent's system Python. The agent image can contain the venv. It should not contain a pile of `pip install` commands from several jobs that share one interpreter and break each other.

The worked example is [release-preflight](../../projects/release-preflight/README.md).
