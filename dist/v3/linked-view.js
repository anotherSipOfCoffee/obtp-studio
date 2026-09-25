'use strict';
/* A Studio display adapter. System remains the source of cassette geometry. */
(function(root){
 const NS='http://www.w3.org/2000/svg',CUT_ABOVE_FLOOR_MM=1100;
 const element=(name,attributes={})=>{const e=document.createElementNS(NS,name);for(const [key,value] of Object.entries(attributes))e.setAttribute(key,String(value));return e;};
 const floorTop=scene=>(scene.spec?.joistDepth||220)+(scene.spec?.floorSkin||18);
 function cutScene(api,scene){
  const cutZ=floorTop(scene)+CUT_ABOVE_FLOOR_MM;
  const models=scene.models.map(m=>{
   const assets=m.assets.flatMap(a=>{
    const lo=a.bounds[0],hi=a.bounds[1];
    // Current System cassettes have upright box assets and rotate only in plan.
    const minZ=lo[2],maxZ=Math.min(hi[2],cutZ-(scene.items.find(i=>i.block===m.id)?.translation?.[2]||0));
    if(maxZ<=minZ)return [];
    return [api.box(a.id,lo,[hi[0]-lo[0],hi[1]-lo[1],maxZ-minZ],a.material)];
   });
   return assets.length?api.model(m.id+'-VIEW-CUT',assets):null;
  }).filter(Boolean);
  const ids=new Set(models.map(m=>m.id));
  const items=scene.items.filter(i=>i.stage!=='roof'&&ids.has(i.block+'-VIEW-CUT')).map(i=>({...i,block:i.block+'-VIEW-CUT'}));
  return {models,items,cutZ};
 }
 function outdoorView(api,scene,plan){
  const candidate=plan?.subblocks?.components.find(c=>c.kind==='outdoor-shower');
  if(!candidate)return {models:[],items:[]};
  const width=scene.width||scene.spec.width,ox=(width-plan.gridWidthMm)/2,oy=((scene.length||scene.spec.pitch*scene.bays)-plan.gridLengthMm)/2;
  const x=ox+candidate.rect.x,y=oy+candidate.rect.y,z=floorTop(scene);
  const assets=[
   api.box('unroofed-pad-study',[x,y,z],[900,900,25],'study'),
   api.box('wall-side-riser-study',[width+35,y+435,z+25],[35,35,1985],'study'),
   api.box('outward-arm-study',[width+35,y+435,z+2010],[x+450-width-35,35,35],'study'),
   api.box('shower-head-study',[x+425,y+385,z+1925],[70,140,90],'study')
  ];
  const model=api.model('OBTP-OUTDOOR-SHOWER-STUDY',assets);
  const models=[model],items=[{id:'outside-shower-study',block:model.id,stage:'study-outdoor-shower',translation:[0,0,0]}];
  // Sauna furniture is an independent placement study. The real cassette
  // dimensions and structure continue to come exclusively from System.
  for(const c of plan.subblocks.components.filter(c=>['bench','foot-bench','heater'].includes(c.kind))){
   const b=c.rect,bx=ox+b.x,by=oy+b.y,upper=c.kind==='bench',level=upper?900:450;
   const parts=[];
   if(c.kind==='heater')parts.push(api.box('heater-envelope',[bx,by,z],[b.w,b.h,700],'furniture-study'));
   else{
    const n=5,gap=12,depth=(b.h-(n-1)*gap)/n;
    for(let j=0;j<n;j++)parts.push(api.box('seat-slat-'+j,[bx,by+j*(depth+gap),z+level-38],[b.w,depth,38],'furniture-study'));
    for(const px of [bx+45,bx+b.w-90])for(const py of [by+45,by+b.h-90])parts.push(api.box('bench-leg-'+px+'-'+py,[px,py,z],[45,45,level-38],'furniture-study'));
   }
   const furnishing=api.model('SAUNA-'+c.id+'-STUDY',parts);models.push(furnishing);items.push({id:c.id+'-study',block:furnishing.id,stage:'study-furniture',translation:[0,0,0]});
  }
  const seat=plan.subblocks.components.find(c=>c.kind==='outdoor-seat');
  if(seat){const sx=ox+seat.rect.x,sy=oy+seat.rect.y;
   const sitting=api.model('OBTP-OUTDOOR-SEAT-STUDY',[
    api.box('seat-top-study',[sx,sy,z+410],[900,450,35],'study'),
    api.box('seat-leg-left-study',[sx+75,sy+75,z],[45,45,410],'study'),
    api.box('seat-leg-right-study',[sx+780,sy+75,z],[45,45,410],'study')]);
   models.push(sitting);items.push({id:'outside-seat-study',block:sitting.id,stage:'study-outdoor-seat',translation:[0,0,0],highlight:true});
  }
  return {models,items};
 }
 function renderPlan(svg,api,scene,plan,subblocks){
  const w=scene.width||scene.spec?.width||4572,l=scene.length||scene.spec?.pitch*scene.bays;
  if(!Number.isFinite(w)||!Number.isFinite(l))throw Error('Plan dimensions missing from System geometry');
  const p=240,exterior=plan?.showerMode==='outdoor'||plan?.showerMode==='both',z=floorTop(scene)+CUT_ABOVE_FLOOR_MM;
  svg.setAttribute('viewBox',`${-p} ${-p} ${w+2*p+(exterior?(plan?.storage?2400:1000):0)} ${l+2*p}`);
  svg.setAttribute('aria-label',`Generated cassette wall section at 1.10 m above floor, ${w} by ${l} mm${plan?'; dashed Sauna program allowances are unbuilt':''}`);
  svg.replaceChildren();
  svg.append(element('rect',{x:0,y:0,width:w,height:l,fill:'#fffef9',stroke:'#24332e','stroke-width':24}));
  const modelById=new Map(scene.models.map(m=>[m.id,m]));let wallSections=0;
  for(const item of scene.items.filter(i=>i.stage==='walls')){
   const model=modelById.get(item.block);if(!model)throw Error('Plan wall model missing: '+item.block);
   for(const asset of model.assets){const bounds=api.worldBounds(item,asset),lo=bounds[0],hi=bounds[1];
    if(lo[2]>=z||hi[2]<=z)continue;
    svg.append(element('rect',{x:lo[0],y:lo[1],width:hi[0]-lo[0],height:hi[1]-lo[1],fill:'#202a24'}));wallSections++;
   }
  }
  if(plan){
   const ox=(w-plan.gridWidthMm)/2,oy=(l-plan.gridLengthMm)/2;
   for(const block of plan.blocks){const x=ox+block.x*600,y=oy+block.y*600,bw=block.width*600,bh=block.length*600;
    const g=element('g',{'data-block':block.id});g.append(element('rect',{x,y,width:bw,height:bh,fill:({sauna:'#dfeaab',washing:'#d3e4e4',changing:'#e6e5d6',hall:'#e6e5d6',storage:'#f0eadc',lobby:'#c7ded9',corridor:'#d4ddcd',service:'#f0eadc'})[block.id]||'#f0eadc','fill-opacity':'.7',stroke:'#547061','stroke-width':16,'stroke-dasharray':'85 60'}));
    const label=element('text',{x:x+bw/2,y:y+bh/2,'text-anchor':'middle','dominant-baseline':'middle','font-size':Math.min(160,Math.max(110,bw/12)),fill:'#24332e'});label.textContent=block.id==='washing'&&plan.showerMode==='outdoor'?'Wet transition':({sauna:'Sauna',washing:'Washing',changing:'Changing / rest',hall:'Little hall',storage:'Storage',lobby:'Wet lobby',corridor:'Corridor',service:'Service study'})[block.id];g.append(label);svg.append(g);
   }
   if(subblocks){
    const fill={heater:'#b36a40',bench:'#b49763','foot-bench':'#cab88d',shower:'#80afbb','outdoor-shower':'#80afbb','outdoor-seat':'#a8ae8a',seat:'#a8ae8a',storage:'#b6ac83'};
    for(const item of subblocks.components){const b=item.rect,g=element('g',{'data-cad-block':item.id,'aria-label':item.kind+' candidate'});
     g.append(element('rect',{x:ox+b.x,y:oy+b.y,width:b.w,height:b.h,fill:fill[item.kind],stroke:'#24332e','stroke-width':12,...(item.kind==='outdoor-shower'?{'stroke-dasharray':'70 40'}:{})}));
     const name=element('text',{x:ox+b.x+b.w/2,y:oy+b.y+b.h/2,'text-anchor':'middle','dominant-baseline':'middle','font-size':Math.min(125,Math.max(85,b.w/11)),fill:'#24332e'});name.textContent=item.kind==='outdoor-shower'?'OUTDOOR':item.kind;g.append(name);svg.append(g);
    }
    for(const door of [...subblocks.doors,...subblocks.outside]){
     const exterior=subblocks.outside.includes(door),x=exterior?(door.wall==='west'?0:door.wall==='east'?w:ox+door.at):ox+door.at,y=exterior?(door.wall==='front'?0:door.wall==='rear'?l:oy+door.at):oy+door.at;
     const attrs=door.axis==='y'?{x1:ox+door.start,y1:y,x2:ox+door.start+door.width,y2:y}:{x1:x,y1:oy+door.start,x2:x,y2:oy+door.start+door.width};
     svg.append(element('line',{...attrs,'data-cad-door':door.id,stroke:'#ad5837','stroke-width':35,'stroke-dasharray':'65 30'}));
    }
   }
  }
  svg.dataset.wallSections=String(wallSections);svg.dataset.sectionZ=String(z);
 }
 const exported={cutScene,outdoorView,renderPlan,CUT_ABOVE_FLOOR_MM};
 if(typeof module!=='undefined')module.exports=exported;
 root.OBTPStudioLinkedView=exported;
})(typeof window==='undefined'?globalThis:window);
