'use strict';
(()=>{
 const $=id=>document.getElementById(id),api=window.OBTPCassette,presets=window.OBTPStudioPresets;
 let renderer;
 try {renderer=new SourceMeshView($('diagram'));}
 catch(e){$('status').textContent=e.message;return;}
 // Studio owns configuration; System alone defines and places modules.
 const height=2100;
 $('bays').value='4';
 for(const [id,count] of [['columns',8],['rows',18]])for(let n=1;n<=count;n++){
  const option=document.createElement('option');option.value=String(n);option.textContent=n+' '+(id==='columns'?'columns':'rows')+' · '+(n*.6).toFixed(1)+' m';$(id).append(option);
 }
 $('columns').value='4';$('rows').value='4';
 for(const id of ['sauna-length','wash-length'])for(let n=2;n<=15;n++){
  const option=document.createElement('option');option.value=String(n);option.textContent=n+' steps · '+(n*.6).toFixed(1)+' m allocated';$(id).append(option);
 }
 $('sauna-length').value='4';$('wash-length').value='4';
 function saunaBlocks(){return {saunaWidth:Number($('sauna-width').value),saunaLength:Number($('sauna-length').value),washLength:Number($('wash-length').value)};}
 function limitSauna(changed){
  const available=Number($('bays').value)-3; // one perimeter row plus two changing rows
  for(const id of ['sauna-length','wash-length']){
   if(Number($(id).value)>available)$(id).value=String(available);
   for(const option of $(id).options)option.disabled=Number(option.value)>available;
  }
  if(changed==='sauna-length'||changed==='wash-length'){
   const value=Number($(changed).value);if(value>available)$(changed).value=String(available);
  }
 }
 const area=(c,r)=>((600*c+414)*(600*r+414))/1e6;
 function limitMatrix(changed){
  let c=Number($('columns').value),r=Number($('rows').value);
  if(changed==='columns')while(r>1&&area(c,r)>50)r--;
  if(changed==='rows')while(c>1&&area(c,r)>50)c--;
  $('columns').value=String(c);$('rows').value=String(r);
  for(const o of $('columns').options)o.disabled=area(Number(o.value),r)>50;
  for(const o of $('rows').options)o.disabled=area(c,Number(o.value))>50;
 }
 function render(){
  try {
   const bays=Number($('bays').value);
   const columns=Number($('columns').value),rows=Number($('rows').value),isMatrix=$('preset').value==='matrix';
   const {scene,metrics,program,preset,plan,researchHold}=presets.create(api,{preset:$('preset').value,bays,columns,rows,height,layer:$('layer').value,saunaBlocks:saunaBlocks()});
   for(const m of renderer.meshes.values())for(const p of m.parts)renderer.gl.deleteBuffer(p.buffer);
   renderer.meshes.clear();scene.models.forEach(m=>renderer.register(m));
   renderer.setScene(scene.items,{explode:Number($('explode').value)/100});
   $('assembly-title').textContent=isMatrix?columns+' × '+rows+' Matrix cells · research prototype':bays+' module cassette · '+program.name;
   $('dimensions').textContent=isMatrix?scene.clear[0].toLocaleString('en')+' × '+scene.clear[1].toLocaleString('en')+' mm inner-face grid · '+height.toLocaleString('en')+' mm wall height':scene.length.toLocaleString('en')+' × '+scene.width.toLocaleString('en')+' mm setting-out · '+height.toLocaleString('en')+' mm wall height';
   $('status').textContent=isMatrix?scene.items.length+' study components · geometry preview only':scene.items.length+' cassette instances · geometry ready';
   const fmt=n=>n.toFixed(2),mm=n=>(n/1000).toFixed(3);
   $('envelope').replaceChildren();
   const title=document.createElement('strong');title.textContent=isMatrix?'LT I-group dimensional screen · Matrix prototype on hold':'LT I-group dimensional envelope · within limits';$('envelope').append(title);
   for(const line of [
    `Outside-wall plan area: ${fmt(metrics.area)} / 50.00 m² ✓`,
    `Internal clear floor estimate: ${fmt(metrics.internalArea)} m²`,
    `Modelled height: ${mm(metrics.height)} / 5.000 m ✓`,
    `${isMatrix?'Conservative clear-width bearing screen':'Modelled roof span'}: ${mm(metrics.supportSpacing)} / 6.000 m ✓`]){const p=document.createElement('p');p.textContent=line;$('envelope').append(p);}
   const note=document.createElement('small');note.textContent=isMatrix?'Geometric research only; NOT a valid structural preset/output. The continuous roof load path across tiled joints, 195 mm corners, floor perimeter, foundation supports, roof finishes and site conditions are unresolved. Dimensional screening cannot establish permit exemption.':'Designed for the LT I-group permit-free dimensional envelope. This is an outside-wall area cap, not a certified legal total floor area. Roof finish, terrain datum, foundation supports, openings and site / land-use conditions must be verified separately.';$('envelope').append(note);
   $('program').replaceChildren();const heading=document.createElement('strong');heading.textContent=isMatrix?'Matrix · 600 mm coordination':program.name+' · program allowances';const use=document.createElement('p');use.textContent=program.use;$('program').append(heading,use);
   if(isMatrix){const detail=document.createElement('p');detail.textContent=(columns*rows)+' planning cells · '+columns+' columns × '+rows+' rows. Straight wall bays use the shared 600 mm cassette; floors and roofs are grouped up to 2,400 × 1,200 mm with separate perimeter pieces.';const caveat=document.createElement('small');caveat.textContent='Walls follow only the outside boundary. The corner posts and bearing details are placeholders; no room partitions, openings, supports or verified connections are generated.';$('program').append(detail,caveat);}
   else if(plan){
    heading.textContent='Sauna · adjustable program blocks';
    const diagram=document.createElement('div');diagram.className='sauna-plan';diagram.setAttribute('role','img');diagram.setAttribute('aria-label','Plan grid: entry at front; changing/rest connects to sauna and washing blocks at rear');
    diagram.style.gridTemplateColumns=`repeat(${plan.columns},1fr)`;diagram.style.gridTemplateRows=`repeat(${plan.rows},minmax(28px,1fr))`;
    for(const block of plan.blocks){const el=document.createElement('div');el.className='sauna-block '+block.id;el.style.gridColumn=`${block.x+1} / span ${block.width}`;el.style.gridRow=`${block.y+1} / span ${block.length}`;el.textContent=`${block.label} · ${(block.width*.6).toFixed(1)} × ${(block.length*.6).toFixed(1)} m allocated`;diagram.append(el);}
    const facts=document.createElement('div');facts.className='block-facts';
    const p=document.createElement('p');p.textContent=`Planning grid ${plan.gridWidthMm.toLocaleString('en')} × ${plan.gridLengthMm.toLocaleString('en')} mm within ${scene.clear[0].toLocaleString('en')} × ${scene.clear[1].toLocaleString('en')} mm clear interior; perimeter residual and partition/finish thickness remain unassigned.`;facts.append(p);
    const caveat=document.createElement('small');caveat.textContent='Program plan only. Blocks are not generated partitions or openings. Heater clearance, bench fit, waterproofing, ventilation, drainage and service connections remain to be designed.';
    const reference=document.createElement('p'),link=document.createElement('a');link.href='https://github.com/anotherSipOfCoffee/obtp-studio/blob/main/docs/SAUNA_MANUAL_PLAN_R01.md';link.target='_blank';link.rel='noopener';link.textContent='Review the 10-module manual plan R01 ↗';reference.append(link);$('program').append(diagram,facts,caveat,reference);
   }else{const diagram=document.createElement('div');diagram.className='zone-plan';diagram.setAttribute('aria-label',program.name+' conceptual program allocation');for(let i=0;i<program.zones.length;i++){const zone=document.createElement('span');zone.style.width=(program.shares[i]*100)+'%';zone.textContent=program.zones[i];diagram.append(zone);}const caveat=document.createElement('small');caveat.textContent='Concept allocation across the interior length, without partitions, access openings, services or wet-room assembly in the generated model.';$('program').append(diagram,caveat);}
   $('schedule').replaceChildren();
   for(const row of api.schedule(scene)){
    const tr=document.createElement('tr');
    const role=row.id.startsWith('F600')||row.id.startsWith('M-F')?'Floor cassette':row.id.startsWith('R600')||row.id.startsWith('M-R')?'Roof cassette':row.id.startsWith('M-CORNER')?'Corner study':'Wall cassette';
    for(const value of [row.id,role,row.count]){const td=document.createElement('td');td.textContent=value;tr.append(td);}
    $('schedule').append(tr);
   }
   window.OBTPStudioV3={scene,items:scene.items,renderer,bays,columns,rows,preset,metrics,program,plan,researchHold};
  } catch(e){$('status').textContent=e.message;$('envelope').textContent='Outside I-group envelope · '+e.message;window.OBTPStudioV3=null;renderer.setScene([]);$('schedule').replaceChildren();}
 }
 $('preset').addEventListener('change',()=>{const matrix=$('preset').value==='matrix',sauna=$('preset').value==='sauna';$('matrix-fields').hidden=!matrix;$('bays-field').hidden=matrix;$('sauna-fields').hidden=!sauna;
  if(matrix){$('rows').value=$('bays').value;limitMatrix('rows');}
  else{const min=presets.PROGRAMS[$('preset').value].minBays;if(Number($('bays').value)<min)$('bays').value=String(min);for(const o of $('bays').options)o.disabled=Number(o.value)<min;}
  if(sauna)limitSauna();render();});
 for(const id of ['columns','rows'])$(id).addEventListener('change',()=>{limitMatrix(id);render();});
 $('bays').addEventListener('change',()=>{if($('preset').value==='sauna')limitSauna();render();});
 for(const id of ['sauna-width','sauna-length','wash-length'])$(id).addEventListener('change',()=>{limitSauna(id);render();});
 $('layer').addEventListener('change',render);
 $('explode').addEventListener('input',()=>{$('amount').textContent=$('explode').value+'%';renderer.explode=Number($('explode').value)/100;renderer.draw();});
 $('reset').addEventListener('click',()=>{$('explode').value='0';$('amount').textContent='0%';renderer.explode=0;renderer.reset();});
 limitMatrix('rows');render();
})();
