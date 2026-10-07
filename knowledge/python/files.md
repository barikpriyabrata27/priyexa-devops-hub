# Files and JSON

> **Pipelines pass files. Python should read them as data, not as text it hopes is shaped a certain way.**

```python
import json
from pathlib import Path

def load_report(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))
```

`pathlib.Path` handles separators so the same code runs on a Linux agent and a Windows laptop. `read_text(encoding="utf-8")` avoids a default encoding that changes between machines. A missing file should be an error your `main` turns into exit code `2`, with the path in the message. A silent skip hides a deploy that checked the wrong directory.

## JSON lines

Logs and many CI exports are one JSON object per line, not one big array. Read them line by line. A huge file does not have to sit in memory.

```python
def iter_events(path: Path):
    for line in path.read_text(encoding="utf-8").splitlines():
        if line.strip():
            yield json.loads(line)
```

Count errors, collect services, and ignore blank lines. Fail the program if a line is not JSON when the file is supposed to be JSON. Swallowing `JSONDecodeError` turns a broken log shipper into a green report.

## What you write

Write JSON with `json.dumps` when the next step is another program. Humans can read a short text summary on stdout as well. Do not invent a private format. The next person will parse it badly.

Skip directories you do not own the meaning of, such as `.git`, and skip files that are clearly binary or enormous. A scanner that reads a disk image into a string is a denial of service against the pipeline.
