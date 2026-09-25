'use strict';
// One source of plan geometry for all six user correction drawings.
const fs=require('node:fs'),path=require('node:path');
const api=require('../preview/system-source/cassette/system.js');
const presets=require('../dist/v3/presets.js');
const cad=require('../dist/v3/cad.js');
const out=process.argv[2]||path.join(__dirname,'../dist/v3/cad/r12');
fs.mkdirSync(out,{recursive:true});
const rows=[];
const esc=value=>String(value).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
for(const size of ['s','m','l'])for(const storage of [false,true]){
 const result=presets.create(api,{preset:'sauna',saunaSelection:{size,storage}});
 if(result.plan.subblocks.status!=='spatial-candidate')throw Error(`${size}/${storage} failed fit`);
 const filename=`OBTP_Sauna_${size.toUpperCase()}_${storage?'Side_Storage':'No_Storage'}_R12.dxf`;
 fs.writeFileSync(path.join(out,filename),cad.exportDXF(result.plan.subblocks,result.plan,result.scene));
 rows.push({size,storage,filename,bays:result.bays,shellArea:result.metrics.area,proposedBound:result.metrics.proposedArea||null,
  generatedValid:result.valid,plan:result.plan,components:result.plan.subblocks.components,doors:[...result.plan.subblocks.doors,...result.plan.subblocks.outside]});
}
fs.writeFileSync(path.join(out,'variants.json'),JSON.stringify(rows,null,2));
const panels=rows.map((r,i)=>{
 const x=30+(i%2)*450,y=75+Math.floor(i/2)*335,scale=.068,plan=r.plan;
 const shellW=plan.shellWidthMm*scale,shellL=plan.shellLengthMm*scale,ox=x+(plan.shellWidthMm-plan.gridWidthMm)/2*scale,oy=y+(plan.shellLengthMm-plan.gridLengthMm)/2*scale;
 const fills={sauna:'#e5d9b4',hall:'#dbe7d4',storage:'#eee1c9'};
 const p=[`<g><text x="${x}" y="${y-35}" class="title">${r.size.toUpperCase()} · ${r.storage?'side storage study':'no storage'}</text>`,`<rect x="${x}" y="${y}" width="${shellW}" height="${shellL}" fill="none" stroke="#333" stroke-width="3"/>`];
 for(const b of plan.blocks){let px=ox+b.x*600*scale,py=oy+b.y*600*scale,bw=b.width*600*scale,bh=b.length*600*scale;
  p.push(`<rect x="${px}" y="${py}" width="${bw}" height="${bh}" fill="${fills[b.id]}" stroke="${b.id==='storage'?'#b05040':'#56715f'}" stroke-dasharray="7 4" stroke-width="2"/>`,`<text x="${px+bw/2}" y="${py+bh/2}" text-anchor="middle" font-size="14">${esc(b.id==='storage'?'STORAGE / UNBUILT':b.id.toUpperCase())}</text>`);
 }
 for(const c of r.components){const b=c.rect,pad=c.kind==='outdoor-shower';p.push(`<rect x="${ox+b.x*scale}" y="${oy+b.y*scale}" width="${b.w*scale}" height="${b.h*scale}" fill="${pad?'#9dd4da':'#bc9169'}" fill-opacity=".55" stroke="${pad?'#268392':'#8c6848'}"/><text x="${ox+b.x*scale}" y="${oy+b.y*scale-4}" font-size="10">${esc(c.id)}</text>`);}
 for(const d of r.doors){const a=d.axis==='x'?ox+d.at*scale:ox+d.start*scale,b=d.axis==='x'?oy+d.start*scale:oy+d.at*scale;p.push(`<line x1="${a}" y1="${b}" x2="${a+(d.axis==='y'?d.width*scale:0)}" y2="${b+(d.axis==='x'?d.width*scale:0)}" stroke="#be542c" stroke-width="5"/>`);}
 p.push(`<text x="${x}" y="${y+shellL+25}" font-size="13">Shell ${r.shellArea.toFixed(2)} m² · ${r.bays} bays${r.storage?` · bound ${r.proposedBound.toFixed(2)} m²`:''}</text></g>`);
 return p.join('');
}).join('');
fs.writeFileSync(path.join(out,'OBTP_Sauna_Six_Variants_R12.svg'),`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 950 1110" width="950" height="1110"><style>text{font-family:system-ui,sans-serif;fill:#29392f}.title{font-size:21px;font-weight:bold}</style><rect width="100%" height="100%" fill="#fbfaf5"/><text x="30" y="29" font-size="22" font-weight="bold">OBTP Sauna · six correction plans</text>${panels}<text x="30" y="1080" font-size="13">Study only. Storage sits right of the hall, above the outside shower; its structure is not generated. Dimensions in CAD are mm.</text></svg>`);
console.log('Exported '+rows.length+' CAD variants and a six-panel preview to '+out);
