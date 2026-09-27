"""Validate actual deployable PDFs, configuration identity and schedule IDs."""
import gzip,hashlib,json,pathlib,sys,unittest
from pypdf import PdfReader
ROOT=pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'tools'))
from generated_cache import validate_catalogue
sys.path.insert(0,str(ROOT/'_system/authoring/grasshopper'))
from obtp.model import build,parameters
from obtp.schedule_pdf import included
from obtp.manufacturing import schedule as part_schedule,cladding
from obtp.documentation import assembly,parts_layout
class PublicDocuments(unittest.TestCase):
 def test_pdf_contents_and_model_identity(self):
  path=ROOT/'dist/v3/generated';revision=json.loads((ROOT/'system.lock.json').read_text())['commit']
  self.assertEqual(validate_catalogue(path,revision),2)
  manifest=json.loads((path/'manifest.json').read_text())
  for entry in manifest['entries']:
   scene=json.loads(gzip.decompress((path/entry['file']).read_bytes()))
   self.assertEqual(scene['config']['size'],'M');self.assertTrue(scene['config']['storage'])
   self.assertEqual(scene['documents_geometry_sha256'],scene['source_geometry_sha256'])
   schedule=json.loads(gzip.decompress((path/scene['manufacturing']['schedule_file']).read_bytes()))
   ids={i['id'] for i in scene['items']}
   self.assertEqual({pid for row in schedule['primary_schedule']+schedule['cladding_schedule'] for pid in row['instances']},ids)
   canonical=build(parameters(3,program_type=scene['config']['program_type'],roof_type=0,window_width=1180,foundation_type=0,studio_winter_closed=not bool(scene['config']['program_type'])))
   self.assertEqual(canonical['geometry_sha256'],scene['source_geometry_sha256'])
   scoped=part_schedule([p for p in canonical['parts'] if included(p)])
   excluded={p['id'] for p in canonical['parts'] if cladding(p)}
   self.assertEqual(set(scene['document_scope']['excluded_part_ids']),excluded)
   self.assertFalse(scene['document_scope']['facade_cladding'])
   for recipe in (assembly,parts_layout):
    layout=recipe(canonical,include_cladding=False)
    shown={p['id'] for sheet in layout['sheets'] for detail in sheet['details'] for p in detail['view']['polygons']}
    self.assertTrue(shown)
    self.assertFalse(shown & excluded)
   for kind,name in entry['documents'].items():
    document=PdfReader(path/name);self.assertGreater(len(document.pages),1)
    text='\n'.join(page.extract_text() for page in document.pages)
    self.assertIn(scene['source_geometry_sha256'][:16],text)
    self.assertGreater(len(text),500)
    if kind=='components':
     compact=''.join(text.split())
     for row in scoped:self.assertIn(row['type_id'],compact)
     for row in schedule['cladding_schedule']:self.assertNotIn(row['type_id'],compact)
     self.assertNotIn('Separate facade cladding schedule',text)
     self.assertIn('Axonometric views are individually scaled',text)
     self.assertIn('core structure, panels and insulation only',text)
    elif kind=='assembly':
     self.assertIn('Connected wall runs retain all cassettes and opening frames',text)
     self.assertIn('45 degrees',text)
     self.assertIn('Facade cladding is excluded from this document',text)
    elif kind=='parts-layout':
     self.assertEqual(len(document.pages),4)
     self.assertIn('Detached cassette layout for identification',text)
if __name__=='__main__':unittest.main()
