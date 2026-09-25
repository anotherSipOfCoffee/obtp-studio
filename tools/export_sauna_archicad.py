#!/usr/bin/env python3
"""Normalize six solver-derived CAD layouts and build a single six-plan DXF.

Requires ezdxf 1.4.x.  The browser's lightweight CAD text is an interchange
stage, not the published/downloadable DXF.  Run from any working directory.
"""
from __future__ import annotations

from pathlib import Path
import subprocess
import sys
import tempfile

import ezdxf
from ezdxf.addons import Importer

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'dist/v3/cad/r14'
OUT.mkdir(parents=True, exist_ok=True)
VARIANTS = [(size, storage) for size in 'SML' for storage in (False, True)]


def import_geometry(source: Path, target, layout):
    original = ezdxf.readfile(source)
    audit = original.audit()
    if audit.errors:
        raise RuntimeError(f'{source.name}: source has {len(audit.errors)} unfixable DXF errors')
    importer = Importer(original, target)
    importer.import_tables(['layers', 'linetypes'])
    importer.import_blocks([block.name for block in original.blocks if not block.name.startswith('*')])
    importer.import_modelspace(target_layout=layout)
    importer.finalize()


def new_drawing():
    result = ezdxf.new('R2010', setup=True)
    result.header['$INSUNITS'] = 4  # millimetres
    result.header['$MEASUREMENT'] = 1
    return result


def save_and_check(doc, path):
    doc.saveas(path)
    reread = ezdxf.readfile(path)
    audit = reread.audit()
    if audit.has_errors or audit.fixes:
        raise RuntimeError(f'{path}: {len(audit.errors)} DXF errors, {len(audit.fixes)} repairs')
    if reread.header['$INSUNITS'] != 4:
        raise RuntimeError(f'{path}: incorrect drawing units')
    return reread


with tempfile.TemporaryDirectory(prefix='obtp-sauna-') as scratch:
    subprocess.run(['node', str(ROOT / 'tools/export_sauna_variants.cjs'), scratch], check=True)
    all_plans = new_drawing()
    all_plans.layers.new('VARIANT_LABEL', dxfattribs={'color': 7})
    layout = all_plans.modelspace()
    for row, size in enumerate('SML'):
        for column, storage in enumerate((False, True)):
            stem = f'OBTP_Sauna_{size}_{"Side_Storage" if storage else "No_Storage"}_R13'
            raw = Path(scratch) / f'{stem}.dxf'
            output = OUT / f'OBTP_Sauna_{size}_{"Side_Storage" if storage else "No_Storage"}_Archicad_R14.dxf'
            one = new_drawing()
            import_geometry(raw, one, one.modelspace())
            save_and_check(one, output)
            block = all_plans.blocks.new(stem)
            import_geometry(raw, all_plans, block)
            x, y = column * 11000, (2 - row) * 7500
            layout.add_blockref(stem, (x, y))
            caption = f'{size} | {"SIDE STORAGE + OUTDOOR SHOWER + SEAT" if storage else "OUTDOOR SHOWER"}'
            layout.add_text(caption, dxfattribs={'height': 280, 'layer': 'VARIANT_LABEL', 'insert': (x, y + 4200)})
            print('Validated', output.name)
    master = OUT / 'OBTP_Sauna_All_Six_Plans_Archicad_R14.dxf'
    reread = save_and_check(all_plans, master)
    if len(reread.modelspace().query('INSERT')) != 6:
        raise RuntimeError('Combined file does not contain all six plan blocks')
    print('Validated', master.name, 'with six selectable plan BLOCK/INSERTs')
