"""Prepare deployment from a verified pinned System checkout."""
import json, pathlib, shutil, subprocess, sys, time
from generated_cache import identity, reusable, seal
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


# Cache only the canonical export, never Studio HTML or its revision tokens.
generated=root/'dist/v3/generated'
expected = identity(root, head)
started = time.monotonic()
if reusable(generated, expected):
    print(f'Reused verified System export in {time.monotonic()-started:.1f}s', flush=True)
else:
    print('No complete matching export; generating the full catalogue.', flush=True)
    if generated.exists():shutil.rmtree(generated)
    process = subprocess.Popen([sys.executable, '-u',
        str(source / 'authoring/grasshopper/export_web.py'),
        str(generated), '--revision', head])
    while True:
        try:
            code = process.wait(timeout=30)
            break
        except subprocess.TimeoutExpired:
            count = sum(1 for _ in generated.glob('*.json.gz'))
            print(f'Export running: {count} configurations written; '
                  f'{time.monotonic()-started:.0f}s elapsed', flush=True)
    if code:
        raise SystemExit(code)
    count = seal(generated, expected)
    print(f'Verified {count} configurations in {time.monotonic()-started:.1f}s', flush=True)
