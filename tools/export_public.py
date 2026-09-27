"""Export exactly two public presets using the pinned canonical System recipes.
No geometry formulas live here. Every remaining selection has matching PDFs.
"""
import gzip,hashlib,itertools,json,sys,shutil,zipfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'_system/authoring/grasshopper'
sys.path.insert(0,str(SOURCE))
from obtp.model import build,parameters,VERSION
from obtp.export import browser_scene,COLORS
from obtp.cut_view import parts_below
from obtp.drawings import svg
from obtp.manufacturing import analyse,cladding
from obtp.schedule_pdf import write as schedule_pdf
from obtp.documentation import assembly,parts_layout
from obtp.ssp_preview import pdf

def export(target,revision):
 target=Path(target);target.mkdir(parents=True,exist_ok=True);entries=[]
 for program,roof,window,foundation in itertools.product(range(2),(0,),(1180,),(0,)):
  for winter in ([False] if program else [True]):
   scene=build(parameters(3,program_type=program,roof_type=roof,window_width=window,foundation_type=foundation,studio_winter_closed=winter))
   assert scene['config']['storage'] and scene['config']['size']=='M' and all(scene['checks'].values())
   key=scene['config']['id']+f'-r{roof}-t2-w{window}-f0-b{foundation}'+('-summer' if program and not winter else '')
   scene.update(display_revision=VERSION,document_date='2026-09-27')
   web=browser_scene(scene)
   for field in ('config','dimensions','checks','foundation_spec','cell_spec','envelope_spec','window_spec','seasonal_spec','object_library','supplier_spec'):web[field]=scene.get(field)
   web.update(source_revision=revision,authoring_version=VERSION)
   cut=dict(scene,parts=parts_below(scene));clipped=browser_scene(cut);web['cut']={k:clipped[k] for k in ('models','items')}
   for chunk in (web,web['cut']):
    for model in chunk['models']:
     for asset in model['assets']:asset['color']=[v/255 for v in COLORS.get(asset['material'],COLORS['object'])[:3]]
   web['drawings']=dict(schema=scene['drawings']['schema'],source_geometry_sha256=scene['geometry_sha256'])
   (target/(key+'-plan.svg')).write_text(svg(scene['drawings']['views']['concept-plan']))
   counts=analyse(scene,details=True)
   for field in ('type_keys','assembly_keys'):counts.pop(field)
   schedule_file=key+'-manufacturing.json.gz';(target/schedule_file).write_bytes(gzip.compress(json.dumps(counts,separators=(',',':')).encode(),mtime=0))
   web['manufacturing']={k:v for k,v in counts.items() if not k.endswith('_schedule')};web['manufacturing']['schedule_file']=schedule_file
   web['documents']={kind:key+'-'+kind+'.pdf' for kind in ('components','assembly','parts-layout')}
   schedule_pdf(scene,target/web['documents']['components'],revision,include_cladding=False)
   pdf(assembly(scene,include_cladding=False),target/web['documents']['assembly'])
   pdf(parts_layout(scene,include_cladding=False),target/web['documents']['parts-layout'])
   web['document_scope']={'facade_cladding':False,'excluded_part_ids':[p['id'] for p in scene['parts'] if cladding(p)]}
   web['documents_geometry_sha256']=scene['geometry_sha256']
   doc_hashes={kind:hashlib.sha256((target/file).read_bytes()).hexdigest() for kind,file in web['documents'].items()}
   web['document_sha256']=doc_hashes
   data=gzip.compress(json.dumps(web,separators=(',',':')).encode(),mtime=0);(target/(key+'.json.gz')).write_bytes(data)
   entries.append(dict(key=key,file=key+'.json.gz',encoding='gzip',sha256=hashlib.sha256(data).hexdigest(),geometry_sha256=scene['geometry_sha256'],pdf=True,documents=web['documents'],document_sha256=doc_hashes))
   print('Exported',key,flush=True)
 (target/'manifest.json').write_text(json.dumps(dict(version=VERSION,source_revision=revision,pdf_enabled=True,document_kinds=['components','assembly','parts-layout'],defaults=dict(program='studio',size='m',storage=True,foundation=0,roof=0,window=1180,season='summer'),entries=entries),indent=2))
 with zipfile.ZipFile(target/'OBTP_Grasshopper_Source.zip','w',zipfile.ZIP_DEFLATED) as z:
  for p in SOURCE.rglob('*'):
   if p.is_file() and p.suffix in ('.py','.md','.json') and not any(x in p.parts for x in ('__pycache__','exports','review-r15')):z.write(p,p.relative_to(SOURCE))
 print('Public catalogue:',len(entries),'configurations;',len(entries)*3,'PDFs')
if __name__=='__main__':export(sys.argv[1],sys.argv[2])
