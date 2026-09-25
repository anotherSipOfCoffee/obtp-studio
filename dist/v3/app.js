'use strict';
(()=>{
 const $=id=>document.getElementById(id),api=window.OBTPCassette,presets=window.OBTPStudioPresets;
 let renderer;
 try {renderer=new SourceMeshView($('diagram'));}
 catch(e){$('status').textContent=e.message;return;}
 // Studio owns configuration; System alone defines and places modules.
 const height=2100;
 $('bays').value='4';
 function render(){
  try {
   const bays=Number($('bays').value);
   const {scene,metrics,program,preset}=presets.create(api,{preset:$('preset').value,bays,height,layer:$('layer').value});
   for(const m of renderer.meshes.values())for(const p of m.parts)renderer.gl.deleteBuffer(p.buffer);
   renderer.meshes.clear();scene.models.forEach(m=>renderer.register(m));
   renderer.setScene(scene.items,{explode:Number($('explode').value)/100});
   $('assembly-title').textContent=bays+' module cassette · '+program.name;
   $('dimensions').textContent=scene.length.toLocaleString('en')+' × '+scene.width.toLocaleString('en')+' mm setting-out · '+height.toLocaleString('en')+' mm wall height';
   $('status').textContent=scene.items.length+' cassette instances · geometry ready';
   const fmt=n=>n.toFixed(2),mm=n=>(n/1000).toFixed(3);
   $('envelope').replaceChildren();
   const title=document.createElement('strong');title.textContent='LT I-group dimensional envelope · within limits';$('envelope').append(title);
   for(const line of [
    `Outside-wall plan area: ${fmt(metrics.area)} / 50.00 m² ✓`,
    `Internal clear floor estimate: ${fmt(metrics.internalArea)} m²`,
    `Modelled height: ${mm(metrics.height)} / 5.000 m ✓`,
    `Modelled roof span: ${mm(metrics.supportSpacing)} / 6.000 m ✓`]){const p=document.createElement('p');p.textContent=line;$('envelope').append(p);}
   const note=document.createElement('small');note.textContent='Designed for the LT I-group permit-free dimensional envelope. This is an outside-wall area cap, not a certified legal total floor area. Roof finish, terrain datum, foundation supports, openings and site / land-use conditions must be verified separately.';$('envelope').append(note);
   $('program').replaceChildren();const heading=document.createElement('strong');heading.textContent=program.name+' · program allowances';const use=document.createElement('p');use.textContent=program.use;const plan=document.createElement('div');plan.className='zone-plan';plan.setAttribute('aria-label',program.name+' conceptual program allocation');for(let i=0;i<program.zones.length;i++){const zone=document.createElement('span');zone.style.width=(program.shares[i]*100)+'%';zone.textContent=program.zones[i];plan.append(zone);}const caveat=document.createElement('small');caveat.textContent='Concept allocation across the interior length, without partitions, access openings, services or wet-room assembly in the generated model.';$('program').append(heading,use,plan,caveat);
   $('schedule').replaceChildren();
   for(const row of api.schedule(scene)){
    const tr=document.createElement('tr');
    const role=row.id.startsWith('F600')?'Floor cassette':row.id.startsWith('R600')?'Roof cassette':'Wall cassette';
    for(const value of [row.id,role,row.count]){const td=document.createElement('td');td.textContent=value;tr.append(td);}
    $('schedule').append(tr);
   }
   window.OBTPStudioV3={scene,items:scene.items,renderer,bays,preset,metrics,program};
  } catch(e){$('status').textContent=e.message;$('envelope').textContent='Outside I-group envelope · '+e.message;window.OBTPStudioV3=null;renderer.setScene([]);$('schedule').replaceChildren();}
 }
 $('preset').addEventListener('change',()=>{const min=presets.PROGRAMS[$('preset').value].minBays;if(Number($('bays').value)<min)$('bays').value=String(min);for(const o of $('bays').options)o.disabled=Number(o.value)<min;render();});
 for(const id of ['bays','layer'])$(id).addEventListener('change',render);
 $('explode').addEventListener('input',()=>{$('amount').textContent=$('explode').value+'%';renderer.explode=Number($('explode').value)/100;renderer.draw();});
 $('reset').addEventListener('click',()=>{$('explode').value='0';$('amount').textContent='0%';renderer.explode=0;renderer.reset();});
 render();
})();
