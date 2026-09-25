'use strict';
(()=>{
 const $=id=>document.getElementById(id),api=window.OBTPCassette,presets=window.OBTPStudioPresets,linked=window.OBTPStudioLinkedView,functionScreen=window.OBTPStudioFunctionScreen;
 let renderer;
 try {renderer=new SourceMeshView($('diagram'));}
 catch(e){$('status').textContent=e.message;return;}
 // Architecture's fixed view: 45° in plan, with wheel zoom still available.
 // The cut and plan buttons change only the display of the generated scene.
 const fixedCamera=()=>{renderer.angle=-Math.PI/4;renderer.elev=.55;};
 $('diagram').onpointerdown=$('diagram').onpointermove=$('diagram').onpointerup=$('diagram').onpointercancel=null;
 renderer.reset=()=>{fixedCamera();renderer.zoom=1;renderer.draw();};fixedCamera();
 let view='3d',currentScene=null,currentPlan=null,cut=null;
 function showView(){
  const isPlan=view==='plan';$('diagram').hidden=isPlan;$('floor-plan').toggleAttribute('hidden',!isPlan);
  for(const button of document.querySelectorAll('[data-view]'))button.setAttribute('aria-pressed',String(button.dataset.view===view));
  $('view-description').textContent=isPlan?'Model wall section at 1.10 m above floor · dashed Sauna blocks are unbuilt allowances':view==='cut'?'Frame clipped at 1.10 m above floor · roof hidden · fixed camera':'Fixed 45° camera · scroll to zoom';
  if(!currentScene)return;
  if(isPlan){
   const {preset,bays,columns,rows}=window.OBTPStudioV3;
   const source=preset==='matrix'?window.OBTPMatrix.generate({columns,rows,layer:'all',skin:true}):api.generate({bays,height,layer:'all',skin:true,connectionRevision:'revised'});
   linked.renderPlan($('floor-plan'),api,source,currentPlan,currentPlan?.subblocks);
  }else{if(view==='cut'&&!cut){cut=linked.cutScene(api,currentScene);cut.models.forEach(m=>renderer.register(m));}
   renderer.setScene(view==='cut'?cut.items:currentScene.items,{explode:Number($('explode').value)/100});fixedCamera();renderer.draw();}
 }
 // Studio owns configuration; System alone defines and places modules.
 const height=2100;
 $('bays').value='4';
 for(const [id,count] of [['columns',8],['rows',18]])for(let n=1;n<=count;n++){
  const option=document.createElement('option');option.value=String(n);option.textContent=n+' '+(id==='columns'?'columns':'rows')+' · '+(n*.6).toFixed(1)+' m';$(id).append(option);
 }
 $('columns').value='4';$('rows').value='4';
 function limitSauna(){
  const variants=presets.SAUNA_CATALOGUE[$('sauna-size').value];
  for(const option of $('sauna-circulation').options)option.disabled=!Object.hasOwn(variants,option.value);
  if(!Object.hasOwn(variants,$('sauna-circulation').value))$('sauna-circulation').value=Object.keys(variants)[0];
  const chosen=presets.curatedSauna($('sauna-size').value,$('sauna-circulation').value);
  $('sauna-circulation-note').textContent=chosen.bays+' cassette modules · '+(chosen.circulation==='through'?'two site accesses required; the through corridor is a conditional study':chosen.circulation==='wetLobby'?'wet lobby and one proposed outside entry; its original two-access drawing requires revision':'one entry and a shared changing/rest route')+'. Outdoor-only and combined showers need a year-round exterior route, frost-safe supply and wastewater design before selection.';
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
   const sauna=$('preset').value==='sauna';
   const selection=sauna?{size:$('sauna-size').value,circulation:$('sauna-circulation').value,shower:$('sauna-shower').value}:null;
   const bays=sauna?presets.curatedSauna(selection.size,selection.circulation,selection.shower).bays:Number($('bays').value);
   const columns=Number($('columns').value),rows=Number($('rows').value),isMatrix=$('preset').value==='matrix';
   const {scene,metrics,program,preset,plan,researchHold}=presets.create(api,{preset:$('preset').value,bays,columns,rows,height,layer:$('layer').value,saunaSelection:selection});
   for(const m of renderer.meshes.values())for(const p of m.parts)renderer.gl.deleteBuffer(p.buffer);
   renderer.meshes.clear();scene.models.forEach(m=>renderer.register(m));
   currentScene=scene;currentPlan=plan;cut=null;
   $('assembly-title').textContent=isMatrix?columns+' × '+rows+' Matrix cells · research prototype':sauna?'Sauna '+selection.size.toUpperCase()+' · '+bays+' cassette modules':bays+' module cassette · '+program.name;
   $('dimensions').textContent=isMatrix?scene.clear[0].toLocaleString('en')+' × '+scene.clear[1].toLocaleString('en')+' mm inner-face grid · '+height.toLocaleString('en')+' mm wall height':scene.length.toLocaleString('en')+' × '+scene.width.toLocaleString('en')+' mm setting-out · '+height.toLocaleString('en')+' mm wall height';
   $('status').textContent=isMatrix?scene.items.length+' study components · geometry preview only':scene.items.length+' cassette instances · geometry ready'+(plan?' · Sauna plan under review':'');
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
    heading.textContent='Sauna '+selection.size.toUpperCase()+' · curated indoor plan study';
    const diagram=document.createElement('div');diagram.className='sauna-plan';diagram.setAttribute('role','img');diagram.setAttribute('aria-label','Plan grid: '+plan.access);
    diagram.style.gridTemplateColumns=`repeat(${plan.columns},1fr)`;diagram.style.gridTemplateRows=`repeat(${plan.rows},minmax(28px,1fr))`;
    for(const block of plan.blocks){const el=document.createElement('div');el.className='sauna-block '+block.id;el.style.gridColumn=`${block.x+1} / span ${block.width}`;el.style.gridRow=`${block.y+1} / span ${block.length}`;el.textContent=`${block.label} · ${(block.width*.6).toFixed(1)} × ${(block.length*.6).toFixed(1)} m allocated`;diagram.append(el);}
    for(const side of ({shared:['front'],sharedTwoAccess:['west','east'],wetLobby:['front'],deadEnd:['front'],through:['front','rear']})[plan.circulation]){const mark=document.createElement('span');mark.className='plan-door '+side;mark.setAttribute('aria-hidden','true');if(plan.circulation==='shared'||plan.circulation==='wetLobby')mark.style.left='43%';diagram.append(mark);}
    const facts=document.createElement('div');facts.className='block-facts';
    const p=document.createElement('p');p.textContent=`Planning grid ${plan.gridWidthMm.toLocaleString('en')} × ${plan.gridLengthMm.toLocaleString('en')} mm within ${scene.clear[0].toLocaleString('en')} × ${scene.clear[1].toLocaleString('en')} mm clear interior; perimeter residual and partition/finish thickness remain unassigned.`;facts.append(p);
    const flow=document.createElement('p');flow.textContent=`${plan.access}. ${plan.exteriorAccessCandidates} candidate outside ${plan.exteriorAccessCandidates===1?'access':'accesses'}; ${plan.corridorAreaM2.toFixed(2)} m² allocated to a separate corridor${plan.lobbyAreaM2?`; ${plan.lobbyAreaM2.toFixed(2)} m² to the wet lobby`:''}.`;facts.append(flow);
    const heater=document.createElement('p');heater.textContent=`Reference ${plan.referenceHeater.model}: nominal Sauna volume ${plan.nominalVolumeM3.toFixed(2)} m³ / ${plan.referenceHeater.minVolumeM3}–${plan.referenceHeater.maxVolumeM3} m³ published room range · ${plan.referenceHeaterVolumeInRange?'within preliminary range':'outside preliminary range; another heater or block size is needed'}. Finished volume and installation remain unverified.`;facts.append(heater);
    const caveat=document.createElement('small');caveat.textContent='Program plan only. Brown marks are proposed outside access edges; no partitions or openings are generated. Heater, bench, wet-room and passage details remain under review.';
    const placement=document.createElement('p');placement.textContent='Generated sub-block fit: '+(plan.subblocks.status==='spatial-candidate'?'candidate · heater, upper/foot benches, shower, changing seat and door edges placed':'no fit · '+plan.subblocks.failures.join('; '))+'. The plan view shows these reservations.';
    const download=document.createElement('button');download.type='button';download.id='download-cad';download.textContent='Download CAD blocks · DXF';download.disabled=plan.subblocks.status!=='spatial-candidate'||!functionScreen.screenSauna(plan).spatialCandidate;
    download.addEventListener('click',()=>{const contents=window.OBTPStudioCAD.exportDXF(plan.subblocks,plan,scene),url=URL.createObjectURL(new Blob([contents],{type:'application/dxf'})),a=document.createElement('a');a.href=url;a.download=`obtp-sauna-${plan.circulation}-${bays}-study.dxf`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
    const cadNote=document.createElement('small');cadNote.textContent='Editable BLOCK/INSERT CAD study. DXF opens in DWG-capable software; no native DWG file or built opening is generated.';
    const reference=document.createElement('p'),link=document.createElement('a');link.href='https://github.com/anotherSipOfCoffee/obtp-studio/blob/main/docs/SAUNA_CURATED_SIZES_R07.md';link.target='_blank';link.rel='noopener';link.textContent='Review curated Sauna plans and unresolved details ↗';reference.append(link);$('program').append(diagram,facts,placement,download,cadNote,caveat,reference);
   }else{const diagram=document.createElement('div');diagram.className='zone-plan';diagram.setAttribute('aria-label',program.name+' conceptual program allocation');for(let i=0;i<program.zones.length;i++){const zone=document.createElement('span');zone.style.width=(program.shares[i]*100)+'%';zone.textContent=program.zones[i];diagram.append(zone);}const caveat=document.createElement('small');caveat.textContent='Concept allocation across the interior length, without partitions, access openings, services or wet-room assembly in the generated model.';$('program').append(diagram,caveat);}
   const functionResult=functionScreen.screen(preset,scene,metrics,plan);
   $('function-screen').replaceChildren();$('function-screen').hidden=!functionResult;
   if(functionResult){const title=document.createElement('strong');title.textContent='Function screen · '+(functionResult.spatialCandidate?'spatial candidate, unverified':'needs a task-specific revision');const summary=document.createElement('p');summary.textContent=functionResult.brief+'. '+functionResult.benchmark+'.';$('function-screen').append(title,summary);
    for(const reason of [...functionResult.reasons,...functionResult.holds.slice(0,2)]){const line=document.createElement('p');line.textContent='• '+reason;$('function-screen').append(line);}
    const detail=document.createElement('a');detail.href='https://github.com/anotherSipOfCoffee/obtp-studio/blob/main/docs/FUNCTIONAL_VARIANTS_R01.md';detail.target='_blank';detail.rel='noopener';detail.textContent='Read variant comparison and remaining checks ↗';$('function-screen').append(detail);}
   $('schedule').replaceChildren();
   for(const row of api.schedule(scene)){
    const tr=document.createElement('tr');
    const role=row.id.startsWith('F600')||row.id.startsWith('M-F')?'Floor cassette':row.id.startsWith('R600')||row.id.startsWith('M-R')?'Roof cassette':row.id.startsWith('M-CORNER')?'Corner study':'Wall cassette';
    for(const value of [row.id,role,row.count]){const td=document.createElement('td');td.textContent=value;tr.append(td);}
    $('schedule').append(tr);
   }
   window.OBTPStudioV3={scene,items:scene.items,renderer,bays,columns,rows,preset,metrics,program,plan,researchHold,functionResult};
   showView();
  } catch(e){$('status').textContent=e.message;$('envelope').textContent='Outside I-group envelope · '+e.message;window.OBTPStudioV3=null;currentScene=null;cut=null;renderer.setScene([]);$('floor-plan').replaceChildren();$('function-screen').replaceChildren();$('schedule').replaceChildren();}
 }
 $('preset').addEventListener('change',()=>{const matrix=$('preset').value==='matrix',sauna=$('preset').value==='sauna';$('matrix-fields').hidden=!matrix;$('bays-field').hidden=matrix||sauna;$('sauna-fields').hidden=!sauna;
  if(matrix){$('rows').value=$('bays').value;limitMatrix('rows');}
  else if(!sauna){const min=presets.PROGRAMS[$('preset').value].minBays;if(Number($('bays').value)<min)$('bays').value=String(min);for(const o of $('bays').options)o.disabled=Number(o.value)<min;}
  if(sauna)limitSauna();render();});
 for(const id of ['columns','rows'])$(id).addEventListener('change',()=>{limitMatrix(id);render();});
 $('bays').addEventListener('change',render);
 for(const id of ['sauna-size','sauna-circulation'])$(id).addEventListener('change',()=>{limitSauna();render();});
 $('sauna-shower').addEventListener('change',render);
 $('layer').addEventListener('change',render);
 for(const button of document.querySelectorAll('[data-view]'))button.addEventListener('click',()=>{view=button.dataset.view;showView();});
 $('explode').addEventListener('input',()=>{$('amount').textContent=$('explode').value+'%';renderer.explode=Number($('explode').value)/100;renderer.draw();});
 $('reset').addEventListener('click',()=>{$('explode').value='0';$('amount').textContent='0%';renderer.explode=0;renderer.reset();});
 limitMatrix('rows');render();
})();
