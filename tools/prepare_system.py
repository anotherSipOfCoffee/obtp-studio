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

# Every deployed Studio revision gets distinct nested-page and asset URLs.
revision = subprocess.check_output(["git", "-C", str(root), "rev-parse", "HEAD"], text=True).strip()
for relative in ["dist/index.html", "dist/v2/index.html", "dist/v2/app.js", "dist/v3/index.html"]:
    file = root / relative
    text = file.read_text()
    if "__STUDIO_BUILD__" not in text:
        raise SystemExit("Missing deployment version token: " + relative)
    file.write_text(text.replace("__STUDIO_BUILD__", revision).replace("__SYSTEM_COMMIT_SHORT__", head[:12]).replace("__SYSTEM_COMMIT__", head))
