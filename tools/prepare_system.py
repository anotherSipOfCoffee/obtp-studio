"""Prepare deployment from a verified pinned System checkout."""
import json, pathlib, shutil, subprocess
root = pathlib.Path(__file__).resolve().parents[1]
lock = json.loads((root / "system.lock.json").read_text())
source = root / "_system"
head = subprocess.check_output(["git", "-C", str(source), "rev-parse", "HEAD"], text=True).strip()
if head != lock["commit"]:
    raise SystemExit("System checkout does not match lock")
target = root / lock["deployment_path"]
if target.exists():
    shutil.rmtree(target)
shutil.copytree(source / lock["source_path"], target)
print("Prepared System " + head)
