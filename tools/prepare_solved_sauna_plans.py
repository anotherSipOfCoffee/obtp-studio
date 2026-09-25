#!/usr/bin/env python3
"""Render owner-supplied six DXF plans as monochrome, source-faithful SVGs.

Usage: python tools/prepare_solved_sauna_plans.py /path/to/batches.dxf
Only linework is imported. The source drawing is never copied into the site.
This does not validate or alter the pinned System cassette geometry.
"""
from pathlib import Path
from collections import Counter
import argparse
import json

import ezdxf
from ezdxf import bbox
from ezdxf.addons import Importer
from ezdxf.addons.drawing import Frontend, RenderContext, config
from ezdxf.addons.drawing.layout import Page, Settings
from ezdxf.addons.drawing.svg import SVGBackend

parser = argparse.ArgumentParser()
parser.add_argument('dxf', type=Path)
args = parser.parse_args()
source = ezdxf.readfile(args.dxf)
audit = source.audit()
if audit.errors or audit.fixes or source.header.get('$INSUNITS') != 4:
    raise ValueError('Input must be an auditable millimetre DXF with no repairs')

# The source drawing is a 3-row x 2-column sheet with wide gaps between plans.
# Use world-space centers to classify the original INSERTs and six heater boxes.
groups = {(size, storage): [] for size in 'sml' for storage in (False, True)}
for entity in source.modelspace():
    extents = bbox.extents([entity])
    if not extents.has_data:
        continue
    x = (extents.extmin.x + extents.extmax.x) / 2
    y = (extents.extmin.y + extents.extmax.y) / 2
    size = 's' if y > 10000 else 'm' if y > 3000 else 'l'
    storage = x > 26000
    groups[(size, storage)].append(entity)

output = Path(__file__).resolve().parents[1] / 'dist/v3/solved-plans'
output.mkdir(parents=True, exist_ok=True)
manifest = []
for (size, storage), entities in groups.items():
    if len(entities) < 7 or not any(e.dxftype() == 'LWPOLYLINE' for e in entities):
        raise ValueError(f'Missing plan linework for {size}/{storage}')
    doc = ezdxf.new('R2010', setup=True)
    doc.header['$INSUNITS'] = 4
    importer = Importer(source, doc)
    importer.import_tables(['layers', 'linetypes'])
    importer.import_blocks([block.name for block in source.blocks if not block.name.startswith('*')])
    importer.import_entities(entities)
    importer.finalize()
    back = SVGBackend()
    Frontend(RenderContext(doc), back,
             config.Configuration(color_policy=config.ColorPolicy.BLACK,
                                  background_policy=config.BackgroundPolicy.WHITE,
                                  lineweight_policy=config.LineweightPolicy.ABSOLUTE)).draw_layout(doc.modelspace(), finalize=True)
    svg = back.get_string(Page(420, 225), settings=Settings(max_stroke_width=0.8, min_stroke_width=0.04))
    name = f'sauna-{size}-{"storage" if storage else "open"}.svg'
    (output / name).write_text(svg, encoding='utf-8')
    counts = Counter(e.dxftype() for e in entities)
    manifest.append({'size': size, 'storage': storage, 'file': name,
                     'insertCount': counts['INSERT'], 'heaterOutlineCount': counts['LWPOLYLINE']})
(output / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
print('Prepared six source-faithful, monochrome Sauna plan SVGs in', output)
