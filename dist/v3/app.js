'use strict';
(()=>{
 const $=id=>document.getElementById(id);let renderer;
 try{renderer=new SourceMeshView($('diagram'));}catch(e){$('status').textContent=e.message;return;}
 renderer.arctic=true;
 let scene=null,view='3d',turns=0,serial=0;
 const camera=()=>{renderer.angle=-Math.PI/4+turns*Math.PI/2;renderer.elev=.55;};
 for(const event of ['onpointerdown','onpointermove','onpointerup','onpointercancel'])$('diagram')[event]=null;
 const selection=()=>({size:$('sauna-size').value,storage:$('sauna-storage').checked,roof:Number($('sauna-roof').value),terrace:Number($('terrace-depth').value)/600,window:Number($('window-width').value),facade:Number($('facade').value)});
 const key=s=>`sauna-${s.size}-${s.storage?'storage':'open'}-r${s.roof}-t${s.terrace}-w${s.window}-f${s.facade}`;
 const buildTag=new URL(location.href).searchParams.get('build')||'local';
 const manifest=fetch('generated/manifest.json?build='+encodeURIComponent(buildTag)).then(r=>{if(!r.ok)throw Error('Authoring catalogue unavailable');return r.json();});
 function clear(){for(const m of renderer.meshes.values())for(const p of m.parts){renderer.gl.deleteBuffer(p.buffer);if(p.edgeBuffer)renderer.gl.deleteBuffer(p.edgeBuffer);}renderer.meshes.clear();renderer.setScene([]);}
 function show(){
  if(!scene)return;
  const s=selection(),solved=view==='solved';$('diagram').hidden=solved;$('solved-scroll').hidden=!solved;$('solved-view').hidden=false;$('rotate').disabled=solved;
  for(const b of document.querySelectorAll('[data-view]'))b.setAttribute('aria-pressed',String(b.dataset.view===view));
  $('solved-plan').src='generated/'+key(s)+'-plan.svg?build='+scene.source_revision;
  $('assembly-title').textContent=`Sauna ${s.size.toUpperCase()}${s.storage?' · external storage':''}${solved?' · model plan':''}`;
  $('dimensions').textContent=`${scene.dimensions.length_mm+scene.dimensions.annex_length_mm} × ${scene.dimensions.width_mm} mm structural footprint · ${Math.round(scene.metrics.height_mm)} mm overall model height`;
  $('view-description').textContent=solved?'Plan generated from the selected 3D model, with dimensions authored in Python/GH.':view==='cut'?'Cut at 1.10 m above floor · fixed camera':'Fixed camera · Rotate 90° or scroll to zoom';
  clear();const data=view==='cut'?scene.cut:scene;data.models.forEach(m=>renderer.register(m));
  const layer=$('layer').value;const allowed=layer==='floor'?['floor','foundation','terrace']:layer==='walls'?['floor','foundation','terrace','walls','partitions','interior','facade','furniture']:null;
  const items=data.items.filter(i=>(!allowed||allowed.includes(i.stage))&&!i.stage.startsWith('insulation'));renderer.setScene(items,{explode:Number($('explode').value)/100});camera();renderer.draw();
  window.OBTPStudioV3={scene,renderer,metrics:scene.metrics,selection:s,sourceRevision:scene.source_revision};
 }
 async function load(){
  const request=++serial;scene=null;window.OBTPStudioV3=null;clear();$('status').textContent='Loading script-authored model…';$('wood-total').textContent='';$('schedule').replaceChildren();
  try{
   const s=selection(),catalogue=await manifest,entry=catalogue.entries.find(e=>e.key===key(s));if(!entry)throw Error('Configuration is not in the verified export catalogue');
   const r=await fetch('generated/'+entry.file+'?sha='+entry.sha256);if(!r.ok)throw Error('Model export unavailable');const bytes=await r.arrayBuffer();
   const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),b=>b.toString(16).padStart(2,'0')).join('');
   if(hash!==entry.sha256)throw Error('Model export checksum mismatch');
   const next=JSON.parse(new TextDecoder().decode(bytes));if(request!==serial)return;
   if(next.source_revision!==catalogue.source_revision||!Object.values(next.checks).every(Boolean))throw Error('Invalid or mismatched model export');scene=next;
   const m=scene.metrics;$('status').textContent='Your sauna preview.';
   $('sauna-circulation-note').textContent=`Outdoor shower · ${s.terrace*600} mm entrance terrace · ${s.window} mm sauna window on entrance façade.`;
   $('wood-total').textContent=`Modeled wood: ${m.total_wood_m3.toFixed(3)} m³ · structure, plywood, lining, cladding and deck; furniture and waste excluded`;
   $('envelope').replaceChildren();for(const text of ['LT I-group dimensional screen',`Conservative roof/terrace area bound: ${m.building_area_bound_m2.toFixed(2)} / 50.00 m² ✓`,`Height: ${(m.height_mm/1000).toFixed(2)} / 5.00 m ✓`,`Maximum support spacing: ${(m.max_bearing_line_span_mm/1000).toFixed(2)} / 6.00 m ✓`,`Main internal rectangle before finishes: ${m.main_clear_floor_less_partition_m2.toFixed(2)} m²`,`Terrace: ${m.terrace_area_m2.toFixed(2)} m²`,'Site and land-use conditions must be checked separately. The conservative area bound is not a certified legal area calculation.']){const p=document.createElement('p');p.textContent=text;$('envelope').append(p);}
   $('program').replaceChildren();if(scene.envelope_spec){const p=document.createElement('p');p.textContent='Envelope study: 195 mm wall insulation, 220 mm floor and ceiling insulation; sealed sauna foil and ventilated lining cavity. Heater, ventilation and moisture assessment remain to be confirmed.';$('program').append(p);}for(const text of scene.holds){const p=document.createElement('p');p.textContent=text;$('program').append(p);}
   const link=document.createElement('a');link.href=`https://github.com/anotherSipOfCoffee/obtp-system/tree/${scene.source_revision}/authoring/grasshopper`;link.target='_blank';link.rel='noopener';link.textContent=`Canonical Python/GH source · ${scene.source_revision.slice(0,12)}`;$('program').append(link);
   const download=document.createElement('p');const a=document.createElement('a');a.href='generated/OBTP_Grasshopper_R05.zip';a.textContent='Download this revision’s GH authoring scripts';download.append(a);$('program').append(download);
   $('function-screen').hidden=true;
   const groups={};for(const i of scene.items)groups[i.stage]=(groups[i.stage]||0)+1;
   for(const [role,count]of Object.entries(groups)){const tr=document.createElement('tr');for(const text of [role,'Modeled component',count]){const td=document.createElement('td');td.textContent=text;tr.append(td);}$('schedule').append(tr);}
   show();window.OBTPUpdatePDF?.();
  }catch(e){if(request!==serial)return;clear();$('status').textContent='Model unavailable: '+e.message;$('envelope').textContent='No valid output loaded';}
 }
 for(const id of ['sauna-size','sauna-storage','sauna-roof','terrace-depth','window-width','facade'])$(id).addEventListener('change',load);
 $('layer').addEventListener('change',show);
 document.addEventListener('change',e=>{if(e.target.id==='appearance'){renderer.arctic=e.target.value==='arctic';renderer.draw();}});
 for(const b of document.querySelectorAll('[data-view]'))b.addEventListener('click',()=>{view=b.dataset.view;show();});
 $('explode').addEventListener('input',()=>{$('amount').textContent=$('explode').value+'%';renderer.explode=Number($('explode').value)/100;renderer.draw();});
 $('rotate').addEventListener('click',()=>{turns=(turns+1)%4;camera();renderer.draw();});
 $('reset').addEventListener('click',()=>{turns=0;renderer.zoom=1;$('explode').value='0';$('amount').textContent='0%';renderer.explode=0;camera();renderer.draw();});
 $('bays-field').hidden=true;$('matrix-fields').hidden=true;$('sauna-fields').hidden=false;camera();load();
})();
