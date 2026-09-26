import hashlib
import json
import pathlib
import sys
import tempfile
import unittest
import runpy
import shutil
from unittest.mock import patch

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / 'tools'))
from generated_cache import RECEIPT, reusable, seal


class ExportCacheTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.directory = pathlib.Path(self.temp.name)
        self.expected = {'source_revision': 'system-a', 'python': 'test-runtime'}
        self.geometry = b'compressed model fixture'
        self.manifest = {'source_revision': 'system-a', 'entries': [{
            'key': 'studio-m', 'file': 'studio-m.json.gz',
            'sha256': hashlib.sha256(self.geometry).hexdigest()}]}
        self.write_manifest()
        (self.directory / 'studio-m.json.gz').write_bytes(self.geometry)
        for suffix in ('.pdf', '-openings.pdf', '-components.pdf', '-assembly.pdf', '-plan.svg'):
            (self.directory / ('studio-m' + suffix)).write_bytes(b'drawing fixture')
        for name in ('OBTP_Grasshopper_Source.zip', 'OBTP_Grasshopper_R12.zip'):
            (self.directory / name).write_bytes(b'package fixture')
        seal(self.directory, self.expected)

    def write_manifest(self):
        (self.directory / 'manifest.json').write_text(json.dumps(self.manifest))

    def test_complete_same_revision_is_reused(self):
        self.assertTrue(reusable(self.directory, self.expected))

    def test_new_system_or_runtime_requires_regeneration(self):
        for change in ({'source_revision': 'system-b'}, {'python': 'new-runtime'}):
            self.assertFalse(reusable(self.directory, self.expected | change))

    def test_modified_pdf_is_rejected(self):
        (self.directory / 'studio-m-components.pdf').write_bytes(b'old revision')
        self.assertFalse(reusable(self.directory, self.expected))

    def test_missing_drawing_is_rejected(self):
        (self.directory / 'studio-m-assembly.pdf').unlink()
        self.assertFalse(reusable(self.directory, self.expected))
        with self.assertRaises(ValueError):
            seal(self.directory, self.expected)

    def test_geometry_corruption_is_rejected(self):
        (self.directory / 'studio-m.json.gz').write_bytes(b'corrupt')
        self.assertFalse(reusable(self.directory, self.expected))
        with self.assertRaises(ValueError):
            seal(self.directory, self.expected)

    def test_wrong_manifest_revision_cannot_be_sealed(self):
        self.manifest['source_revision'] = 'older-system'
        self.write_manifest()
        with self.assertRaises(ValueError):
            seal(self.directory, self.expected)

    def test_partial_run_without_receipt_is_rejected(self):
        (self.directory / RECEIPT).unlink()
        self.assertFalse(reusable(self.directory, self.expected))

    def test_corrupt_receipt_is_rejected(self):
        (self.directory / RECEIPT).write_text('{')
        self.assertFalse(reusable(self.directory, self.expected))

    def test_unexpected_stale_output_is_rejected(self):
        (self.directory / 'old-configuration.pdf').write_bytes(b'old drawing')
        self.assertFalse(reusable(self.directory, self.expected))

    def test_missing_source_package_is_rejected(self):
        (self.directory / 'OBTP_Grasshopper_Source.zip').unlink()
        self.assertFalse(reusable(self.directory, self.expected))

    def test_duplicate_and_unsafe_entries_cannot_be_sealed(self):
        self.manifest['entries'].append(dict(self.manifest['entries'][0]))
        self.write_manifest()
        with self.assertRaises(ValueError):
            seal(self.directory, self.expected)
        self.manifest['entries'] = [dict(self.manifest['entries'][0], key='../outside')]
        self.write_manifest()
        with self.assertRaises(ValueError):
            seal(self.directory, self.expected)


    def test_preparation_reuses_export_and_refreshes_studio_html(self):
        with tempfile.TemporaryDirectory() as temp:
            root = pathlib.Path(temp)
            (root / 'tools').mkdir()
            script = pathlib.Path(__file__).resolve().parents[1] / 'tools/prepare_system.py'
            shutil.copyfile(script, root / 'tools/prepare_system.py')
            (root / '_system/dist').mkdir(parents=True)
            (root / '_system/dist/renderer.js').write_text('canonical renderer')
            (root / 'system.lock.json').write_text(json.dumps({
                'commit': 'system-a', 'source_path': 'dist',
                'deployment_path': 'dist/system-source'}))
            shutil.copytree(self.directory, root / 'dist/v3/generated')
            for name in ('dist/index.html', 'dist/v2/index.html', 'dist/v2/app.js', 'dist/v3/index.html'):
                target = root / name
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_text('__STUDIO_BUILD__ / __SYSTEM_COMMIT__')
            with patch('generated_cache.identity', return_value=self.expected), \
                 patch('subprocess.check_output', side_effect=['system-a', 'new-studio']), \
                 patch('subprocess.Popen', side_effect=AssertionError('Unexpected rebuild')):
                runpy.run_path(str(root / 'tools/prepare_system.py'))
            self.assertEqual((root / 'dist/index.html').read_text(), 'new-studio / system-a')
            self.assertEqual((root / 'dist/system-source/renderer.js').read_text(), 'canonical renderer')
            self.assertTrue(reusable(root / 'dist/v3/generated', self.expected))


if __name__ == '__main__':
    unittest.main()
