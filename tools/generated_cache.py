"""Reuse only complete, byte-verified exports of the exact pinned System."""
import hashlib
import importlib.metadata
import json
import pathlib
import platform
import sys

RECEIPT = '.build-receipt.json'


def digest(path):
    with path.open('rb') as stream:
        return hashlib.file_digest(stream, 'sha256').hexdigest()


def identity(root, revision):
    return {
        'schema': 2,
        'pdf_enabled': False,
        'source_revision': revision,
        'python': platform.python_version(),
        'platform': platform.system() + '-' + platform.machine(),
        'packages': {name: importlib.metadata.version(name) for name in
                     ('reportlab', 'pillow', 'rhino3dm', 'charset-normalizer')},
        'preparation': {name: digest(root / 'tools' / name) for name in
                        ('prepare_system.py', 'generated_cache.py')},
    }


def inventory(directory):
    files = {}
    for path in directory.rglob('*'):
        if path.is_symlink():
            raise ValueError('Symlinks are not valid generated outputs')
        if path.is_file() and path.name != RECEIPT:
            files[path.relative_to(directory).as_posix()] = digest(path)
    return files


def validate_catalogue(directory, revision):
    manifest = json.loads((directory / 'manifest.json').read_text(encoding='utf-8'))
    if manifest['source_revision'] != revision or not manifest['entries']:
        raise ValueError('Wrong source revision or empty catalogue')
    if manifest.get('pdf_enabled') is not False or any(directory.glob('*.pdf')):
        raise ValueError('PDF generation must be disabled')
    keys = set()
    for entry in manifest['entries']:
        key = entry['key']
        if key in keys or pathlib.PurePath(key).name != key or '/' in key or '\\' in key:
            raise ValueError('Invalid or duplicate configuration key')
        keys.add(key)
        if entry.get('pdf') is not False:
            raise ValueError('PDF availability must be disabled')
        if entry['file'] != key + '.json.gz':
            raise ValueError('Unexpected geometry filename')
        if digest(directory / entry['file']) != entry['sha256']:
            raise ValueError('Geometry checksum mismatch')
        for suffix in ('-plan.svg',):
            if not (directory / (key + suffix)).is_file():
                raise ValueError('Incomplete drawing set: ' + key + suffix)
    for name in ('OBTP_Grasshopper_Source.zip', 'OBTP_Grasshopper_R12.zip'):
        if not (directory / name).is_file():
            raise ValueError('Missing Grasshopper package: ' + name)
    return len(keys)


def seal(directory, expected):
    count = validate_catalogue(directory, expected['source_revision'])
    receipt = {'identity': expected, 'files': inventory(directory)}
    (directory / RECEIPT).write_text(json.dumps(receipt, sort_keys=True), encoding='utf-8')
    return count


def reusable(directory, expected):
    try:
        receipt = json.loads((directory / RECEIPT).read_text(encoding='utf-8'))
        if receipt['identity'] != expected:
            return False
        validate_catalogue(directory, expected['source_revision'])
        return receipt['files'] == inventory(directory)
    except (OSError, ValueError, KeyError, TypeError):
        return False


if __name__ == '__main__':
    root = pathlib.Path(__file__).resolve().parents[1]
    revision = json.loads((root / 'system.lock.json').read_text())['commit']
    value = json.dumps(identity(root, revision), sort_keys=True).encode()
    print('obtp-export-v1-' + hashlib.sha256(value).hexdigest())
