'use strict';
(()=>{
 const $=id=>document.getElementById(id);let renderer;
 try{renderer=new SourceMeshView($('diagram'));}catch(e){$('status').textContent=e.message;return;}
 renderer.arctic=true;
 let scene=null,view='3d',turns=0,serial=0;
 const camera=()=>{renderer.angle=-Math.PI/4+turns*Math.PI/2;renderer.elev=.55;};
 for(const event of ['onpointerdown','onpointermove','onpointerup','onpointercancel'])$('diagram')[event]=null;
 const selection=()=>({foundation:0,program:$('preset').value==='sauna'?'sauna':'studio',season:'summer',system:0,size:'m',storage:true,roof:0,terrace:2,window:1180,facade:0});
 const key=s=>`${s.program}-${s.size}-${s.storage?'storage':'open'}-r${s.roof}-t${s.terrace}-w${s.window}-f${s.facade}-b${s.foundation}${s.program==='studio'&&s.season==='summer'?'-summer':''}`;
 const buildTag=new URL(location.href).searchParams.get('build')||'local';
 const manifest=fetch('generated/manifest.json?build='+encodeURIComponent(buildTag)).then(r=>{if(!r.ok)throw Error('Authoring catalogue unavailable');return r.json();});
 function clear(){for(const m of renderer.meshes.values())for(const p of m.parts){renderer.gl.deleteBuffer(p.buffer);if(p.edgeBuffer)renderer.gl.deleteBuffer(p.edgeBuffer);}renderer.meshes.clear();renderer.setScene([]);}
 function show(){
  if(!scene)return;
  const s=selection(),solved=view==='solved';$('diagram').hidden=solved;$('solved-scroll').hidden=!solved;$('solved-view').hidden=false;$('rotate').disabled=solved;
  for(const b of document.querySelectorAll('[data-view]'))b.setAttribute('aria-pressed',String(b.dataset.view===view));
  $('solved-plan').src='generated/'+key(s)+'-plan.svg?build='+scene.source_revision;
  $('assembly-title').textContent=`${s.program==='studio'?'Studio':'Sauna'} ${s.size.toUpperCase()}${s.storage?(s.program==='studio'?' · storage shelves':' · external storage'):''}${solved?' · model plan':''}`;
  $('dimensions').textContent=`${scene.dimensions.length_mm+scene.dimensions.annex_length_mm} × ${scene.dimensions.width_mm} mm structural footprint · ${Math.round(scene.metrics.height_mm)} mm overall model height`;
  $('view-description').textContent=solved?'Plan generated from the selected 3D model, with dimensions authored in Python/GH.':view==='cut'?'Cut at 1.10 m above floor · fixed camera':'Fixed camera · Rotate 90° or scroll to zoom';
  clear();const data=view==='cut'?scene.cut:scene;data.models.forEach(m=>renderer.register(m));
  const layer=$('layer').value;const allowed=layer==='floor'?['floor','foundation','terrace']:layer==='walls'?['floor','foundation','terrace','walls','partitions','interior','facade','furniture','insulation']:null;
  const items=data.items.filter(i=>(!allowed||allowed.includes(i.stage)));renderer.setScene(items,{explode:Number($('explode').value)/100});camera();renderer.draw();
  window.OBTPStudioV3={scene,renderer,metrics:scene.metrics,selection:s,sourceRevision:scene.source_revision};
 }
 async function load(){
  if(!['sauna','studio'].includes($('preset').value))$('preset').value='studio';
  const request=++serial;scene=null;window.OBTPStudioV3=null;window.OBTPUpdatePDF?.();clear();$('status').textContent='Loading model…';
  try{
   const s=selection(),catalogue=await manifest,entry=catalogue.entries.find(e=>e.key===key(s));if(!entry)throw Error('Configuration is not in the verified export catalogue');
   const r=await fetch('generated/'+entry.file+'?sha='+entry.sha256);if(!r.ok)throw Error('Model export unavailable');const bytes=await r.arrayBuffer();
   const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),b=>b.toString(16).padStart(2,'0')).join('');
   if(hash!==entry.sha256)throw Error('Model export checksum mismatch');
   const decoded=entry.encoding==='gzip'?await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer():bytes;
   const next=JSON.parse(new TextDecoder().decode(decoded));if(request!==serial)return;
   if((next.config.program_type??0)!==(s.program==='studio'?1:0))throw Error('Requested program does not match export');
   if((next.config.system_type??0)!==s.system)throw Error('Requested construction system is not available');
   if(next.source_revision!==catalogue.source_revision||!Object.values(next.checks).every(Boolean))throw Error('Invalid or mismatched model export');scene=next;
   if(next.config.size!=='M'||!next.config.storage||next.config.roof_type!==0||next.config.foundation_type!==0||next.config.window_width!==1180)throw Error('Unsupported public configuration');
   if(next.source_geometry_sha256!==entry.geometry_sha256||next.documents_geometry_sha256!==entry.geometry_sha256)throw Error('Drawing/model identity mismatch');
   if(!next.documents?.components||!next.documents?.assembly)throw Error('Missing configuration PDFs');
   $('status').textContent=s.program==='studio'?'Your studio preview.':'Your sauna preview.';
   show();window.OBTPProgramRender?.();window.OBTPUpdatePDF?.();
  }catch(e){if(request!==serial)return;clear();$('status').textContent='Model unavailable: '+e.message;scene=null;window.OBTPStudioV3=null;window.OBTPUpdatePDF?.();}
 }
 for(const id of ['preset'])$(id).addEventListener('change',load);
 $('layer').addEventListener('change',show);

 for(const b of document.querySelectorAll('[data-view]'))b.addEventListener('click',()=>{view=b.dataset.view;show();});
 $('explode').addEventListener('input',()=>{$('amount').textContent=$('explode').value+'%';renderer.explode=Number($('explode').value)/100;renderer.draw();});
 $('rotate').addEventListener('click',()=>{turns=(turns+1)%4;camera();renderer.draw();});
 $('reset').addEventListener('click',()=>{turns=0;renderer.zoom=1;$('explode').value='0';$('amount').textContent='0%';renderer.explode=0;camera();renderer.draw();});
 window.OBTPReload=load;
 camera();load();
})();
