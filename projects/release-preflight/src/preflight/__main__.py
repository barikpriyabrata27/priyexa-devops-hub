"""Fail a release directory that is not safe to ship.

Checks are deliberately small and local. They do not call a cloud API.
"""

from __future__ import annotations

import re
import sys
from dataclasses import dataclass
from pathlib import Path

SKIP_DIRS = {".git", "__pycache__", "node_modules", ".venv", "venv"}
MAX_BYTES = 1_000_000
WORKLOADS = {"Deployment", "StatefulSet", "DaemonSet", "Pod", "Job", "CronJob"}

SECRET_PATTERNS = (
    (re.compile(r"AKIA[0-9A-Z]{16}"), "AWS access key id"),
    (re.compile(r"-----BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY-----"), "private key"),
    (re.compile(r"(?i)(password|passwd|secret|api[_-]?key)\s*[:=]\s*\S+"), "assigned secret"),
)


@dataclass(frozen=True)
class Finding:
    path: str
    line: int
    check: str
    message: str

    def format(self) -> str:
        return f"{self.path}:{self.line} {self.check}: {self.message}"


def scan(root: Path) -> list[Finding]:
    if not root.exists():
        raise FileNotFoundError(root)
    if root.is_file():
        return _scan_file(root, root.parent)
    findings: list[Finding] = []
    for path in sorted(root.rglob("*")):
        if any(part in SKIP_DIRS for part in path.parts):
            continue
        if path.is_file():
            findings.extend(_scan_file(path, root))
    return findings


def _scan_file(path: Path, root: Path) -> list[Finding]:
    if path.stat().st_size > MAX_BYTES:
        return []
    try:
        text = path.read_text(encoding="utf-8")
    except (UnicodeDecodeError, OSError):
        return []
    if "\0" in text:
        return []
    relative = path.relative_to(root).as_posix() if path != root else path.name
    findings = _secrets(relative, text)
    name = path.name.lower()
    if name == "dockerfile" or name.endswith(".dockerfile"):
        findings.extend(_dockerfile(relative, text))
    if name.endswith((".yml", ".yaml")):
        findings.extend(_manifests(relative, text))
    return findings


def _secrets(relative: str, text: str) -> list[Finding]:
    findings: list[Finding] = []
    for number, line in enumerate(text.splitlines(), start=1):
        for pattern, label in SECRET_PATTERNS:
            if pattern.search(line):
                findings.append(Finding(relative, number, "secret", label))
                break
    return findings


def _dockerfile(relative: str, text: str) -> list[Finding]:
    findings: list[Finding] = []
    saw_user = False
    for number, raw in enumerate(text.splitlines(), start=1):
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        parts = line.split()
        instruction = parts[0].upper()
        if instruction == "FROM" and len(parts) > 1:
            image = parts[1]
            if image.upper() == "SCRATCH":
                continue
            if ":" not in image.split("/")[-1] or image.endswith(":latest"):
                findings.append(Finding(relative, number, "image", "base image is floating or :latest"))
        elif instruction == "USER" and len(parts) > 1:
            saw_user = True
            if parts[1] == "root" or parts[1] == "0":
                findings.append(Finding(relative, number, "user", "container runs as root"))
    if not saw_user:
        findings.append(Finding(relative, 1, "user", "no USER instruction; image runs as root"))
    return findings


def _manifests(relative: str, text: str) -> list[Finding]:
    findings: list[Finding] = []
    for document in re.split(r"(?m)^---\s*$", text):
        if not document.strip():
            continue
        kind = _field(document, "kind")
        if kind not in WORKLOADS:
            continue
        for number, line in enumerate(document.splitlines(), start=1):
            stripped = line.strip()
            if stripped.startswith("image:"):
                image = stripped.split(":", 1)[1].strip().strip("'\"")
                if image.endswith(":latest") or ":" not in image.split("/")[-1]:
                    findings.append(Finding(relative, number, "image", f"{kind} uses a floating image tag"))
            if stripped in {"privileged: true", "privileged: 'true'", 'privileged: "true"'}:
                findings.append(Finding(relative, number, "privilege", f"{kind} sets privileged"))
        if not re.search(r"(?m)^\s*requests:\s*$", document):
            findings.append(Finding(relative, 1, "resources", f"{kind} has no resource requests"))
    return findings


def _field(document: str, name: str) -> str:
    match = re.search(rf"(?m)^{name}:\s*(\S+)\s*$", document)
    return match.group(1) if match else ""


def main(argv: list[str] | None = None) -> int:
    args = list(sys.argv[1:] if argv is None else argv)
    if len(args) != 1 or args[0] in {"-h", "--help"}:
        print("usage: preflight DIRECTORY", file=sys.stderr)
        return 2
    root = Path(args[0])
    try:
        findings = scan(root)
    except FileNotFoundError:
        print(f"not found: {root}", file=sys.stderr)
        return 2
    for finding in findings:
        print(finding.format())
    if findings:
        print(f"{len(findings)} finding(s)", file=sys.stderr)
        return 1
    print(f"clean: {root}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
