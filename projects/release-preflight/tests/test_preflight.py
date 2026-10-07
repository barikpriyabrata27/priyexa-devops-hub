import subprocess
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MODULE = ROOT / "src" / "preflight" / "__main__.py"


def run(directory: Path) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        [sys.executable, str(MODULE), str(directory)],
        capture_output=True,
        text=True,
        check=False,
    )


class PreflightTests(unittest.TestCase):
    def test_good_example_is_clean(self) -> None:
        result = run(ROOT / "examples" / "good")
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertIn("clean:", result.stdout)

    def test_bad_example_lists_the_gates(self) -> None:
        result = run(ROOT / "examples" / "bad")
        self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
        report = result.stdout
        self.assertIn("secret", report)
        self.assertIn("image", report)
        self.assertIn("user", report)
        self.assertIn("privilege", report)
        self.assertIn("resources", report)
        self.assertNotIn("do-not-ship-this", report)

    def test_missing_path_exits_2(self) -> None:
        result = run(ROOT / "examples" / "missing")
        self.assertEqual(result.returncode, 2)


if __name__ == "__main__":
    unittest.main()
