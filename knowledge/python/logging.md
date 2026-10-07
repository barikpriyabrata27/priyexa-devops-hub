# Logging

> **A pipeline log is the only place you will debug this script next week. Log the decision, not the secret.**

```python
import logging

logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
log = logging.getLogger("preflight")

log.info("scanned %s files", count)
log.error("secret-like value in %s", path)
```

`info` is progress. `error` is a finding or a failure. `debug` is for the run where you set the level because something is unclear. `print` is acceptable for the primary output of a CLI, the report a human reads. Logging is for the trail around it.

One line, structured if the job's log system expects JSON. Include the path, the check name, and the count. Do not include the secret you just found, the environment dictionary, or the full file. The finding "this file contains an AWS key" is enough. The key itself in the Jenkins log is a second copy of the leak.

## Levels in CI

Leave the default at info. A debug log of every file in a monorepo hides the one error. Fail the process with a non-zero exit after you have logged the findings, so the log and the build status agree. A green build with `error` lines in the middle is how people learn to ignore both.
