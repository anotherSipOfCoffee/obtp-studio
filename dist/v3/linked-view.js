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
 function renderPlan(svg,api,scene,plan){
  const w=scene.width||scene.spec?.width||4572,l=scene.length||scene.spec?.pitch*scene.bays;
  if(!Number.isFinite(w)||!Number.isFinite(l))throw Error('Plan dimensions missing from System geometry');
  const p=240,z=floorTop(scene)+CUT_ABOVE_FLOOR_MM;
  svg.setAttribute('viewBox',`${-p} ${-p} ${w+2*p} ${l+2*p}`);
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
    const g=element('g',{'data-block':block.id});g.append(element('rect',{x,y,width:bw,height:bh,fill:({sauna:'#dfeaab',washing:'#d3e4e4',changing:'#e6e5d6',lobby:'#c7ded9',corridor:'#d4ddcd',service:'#f0eadc'})[block.id]||'#f0eadc','fill-opacity':'.7',stroke:'#547061','stroke-width':16,'stroke-dasharray':'85 60'}));
    const label=element('text',{x:x+bw/2,y:y+bh/2,'text-anchor':'middle','dominant-baseline':'middle','font-size':Math.min(160,Math.max(110,bw/12)),fill:'#24332e'});label.textContent=({sauna:'Sauna',washing:'Washing',changing:'Changing / rest',lobby:'Wet lobby',corridor:'Corridor',service:'Service study'})[block.id];g.append(label);svg.append(g);
   }
  }
  svg.dataset.wallSections=String(wallSections);svg.dataset.sectionZ=String(z);
 }
 const exported={cutScene,renderPlan,CUT_ABOVE_FLOOR_MM};
 if(typeof module!=='undefined')module.exports=exported;
 root.OBTPStudioLinkedView=exported;
})(typeof window==='undefined'?globalThis:window);
