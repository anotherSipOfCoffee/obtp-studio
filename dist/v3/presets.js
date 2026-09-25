'use strict';
/* Studio owns program and envelope validation. OBTP System owns every cassette. */
(function(root){
 const LIMITS=Object.freeze({outsidePlanAreaM2:50,heightMm:5000,supportSpacingMm:6000});
 const PROGRAMS=Object.freeze({
  studio:{name:'Studio',use:'Non-residential creative / hobby workspace',zones:['Open workspace','Optional service / storage'],shares:[.8,.2],defaultBays:4,minBays:1},
  workshop:{name:'Workshop',use:'Non-residential auxiliary workshop',zones:['Uninterrupted work area','Work bench / storage allowance'],shares:[.85,.15],defaultBays:8,minBays:1},
  sauna:{name:'Sauna',use:'Non-residential sauna / pirtis',zones:['Sauna room allowance','Washing allowance','Changing / rest allowance','Technical allowance'],shares:[.35,.2,.35,.1],defaultBays:10,minBays:8},
  matrix:{name:'Matrix',use:'Non-residential open grid · research prototype',zones:['Unassigned open grid'],shares:[1],defaultBays:4,minBays:1}
 });
 // A spatial planning layer only. Coordinates follow the 600 mm cassette
 // setting-out; no internal walls or openings are added to System geometry.
 function saunaPlan({bays,saunaWidth=3,saunaLength=4,washLength=4,circulation='shared'}={}){
  if(!Number.isInteger(bays)||bays<8||bays>18)throw Error('Sauna needs 8–18 cassette modules');
  if(!['shared','sharedTwoAccess','wetLobby','deadEnd','through'].includes(circulation))throw Error('Unknown Sauna circulation study');
  if(circulation==='wetLobby'&&bays<12)throw Error('Wet-lobby Sauna study needs at least 12 cassette modules');
  const columns=6,rows=bays-1,washWidth=columns-saunaWidth;
  if(![saunaWidth,saunaLength,washLength].every(Number.isInteger)||saunaWidth<2||saunaWidth>4||saunaLength<2||washLength<2)
   throw Error('Sauna block dimensions must be whole 600 mm steps within their ranges');
  const lobby=circulation==='wetLobby',shared=circulation==='shared'||circulation==='sharedTwoAccess'||lobby;
  const wetLength=shared?Math.max(saunaLength,washLength):saunaLength+washLength,lobbyLength=lobby?2:0,changingLength=rows-wetLength-lobbyLength,wetY=changingLength+lobbyLength;
  if(changingLength<(lobby?5:2))throw Error('Changing/rest block needs more 600 mm steps for this circulation study');
  const blocks=shared?[
   {id:'changing',label:'Changing / rest + access',x:0,y:0,width:columns,length:changingLength},
   ...(lobby?[{id:'lobby',label:'Wet lobby / access',x:0,y:changingLength,width:columns,length:lobbyLength}]:[]),
   {id:'sauna',label:'Sauna',x:0,y:wetY,width:saunaWidth,length:saunaLength},
   {id:'washing',label:'Washing / bathing',x:saunaWidth,y:wetY,width:washWidth,length:washLength}
  ]:[
   {id:'corridor',label:'Side corridor / access',x:0,y:0,width:2,length:rows},
   {id:'changing',label:'Changing / rest',x:2,y:0,width:4,length:changingLength},
   {id:'washing',label:'Washing / bathing',x:2,y:changingLength,width:4,length:washLength},
   {id:'sauna',label:'Sauna',x:2,y:changingLength+washLength,width:4,length:saunaLength}
  ];
  if(shared&&saunaLength<wetLength)blocks.push({id:'service',label:'Service / unassigned',x:0,y:wetY+saunaLength,width:saunaWidth,length:wetLength-saunaLength});
  if(shared&&washLength<wetLength)blocks.push({id:'service',label:'Service / unassigned',x:saunaWidth,y:wetY+washLength,width:washWidth,length:wetLength-washLength});
  const access={shared:'One outside entry into changing/rest; both wet blocks meet its rear boundary',sharedTwoAccess:'Two candidate outside side entrances cross changing/rest; both wet blocks meet its rear boundary',wetLobby:'Two candidate outside side entrances cross dry changing/rest; a wet lobby separates both wet-room approaches',deadEnd:'One candidate outside end entrance; side corridor terminates at rear',through:'Candidate outside end entrances at both ends of a continuous side corridor'}[circulation];
  return {columns,rows,blocks,stepMm:600,gridWidthMm:3600,gridLengthMm:rows*600,changingLength,circulation,access,exteriorAccessCandidates:circulation==='shared'||circulation==='deadEnd'?1:2,corridorAreaM2:shared?0:1200*rows*600/1e6,lobbyAreaM2:lobby?6*2*600*600/1e6:0,valid:true};
 }
 function bounds(api,scene,filter){
  const models=new Map(scene.models.map(m=>[m.id,m])),low=[Infinity,Infinity,Infinity],high=[-Infinity,-Infinity,-Infinity];
  for(const item of scene.allItems.filter(filter)){
   const model=models.get(item.block);if(!model)throw Error('Missing cassette model '+item.block);
   for(const asset of model.assets){const b=api.worldBounds(item,asset);for(let k=0;k<3;k++){low[k]=Math.min(low[k],b[0][k]);high[k]=Math.max(high[k],b[1][k]);}}
  }
  if(low.some(v=>!Number.isFinite(v))||high.some(v=>!Number.isFinite(v)))throw Error('Incomplete geometric bounds');
  return {low,high};
 }
 function measure(api,scene){
  // The wall outside-face rectangle is deliberately stricter than the statutory
  // total floor area, which needs a measured enclosed plan and legal review.
  const walls=bounds(api,scene,i=>i.stage==='walls');
  const all=bounds(api,scene,()=>true);
  const roof=scene.allItems.filter(i=>i.stage==='roof');
  const roofModels=new Map(scene.models.map(m=>[m.id,m]));
  const roofWidth=Math.max(...roof.map(i=>{const b=bounds(api,{models:scene.models,allItems:[i]},()=>true);return b.high[0]-b.low[0];}));
  if(!Number.isFinite(roofWidth)||!roofModels.size)throw Error('Roof bearing geometry missing');
  const planWidth=walls.high[0]-walls.low[0],planLength=walls.high[1]-walls.low[1];
  const area=planWidth*planLength/1e6;
  const clear=scene.clear;
  const internalArea=clear[0]*clear[1]/1e6;
  // Continuous side wall cassettes are joined at 600 mm. The full roof
  // cassette crosswise width is used conservatively for the bearing span.
  const wallPitch=scene.spec.pitch;
  const supportSpacing=Math.max(roofWidth,wallPitch);
  const height=all.high[2]-Math.min(0,all.low[2]);
  const checks={area:area>0&&area<=LIMITS.outsidePlanAreaM2+1e-9,height:height>0&&height<=LIMITS.heightMm,supportSpacing:supportSpacing>0&&supportSpacing<=LIMITS.supportSpacingMm};
  return {area,internalArea,height,supportSpacing,planWidth,planLength,checks,valid:Object.values(checks).every(Boolean)};
 }
 function create(api,{preset='studio',bays=4,columns=4,rows=4,height=2100,layer='all',saunaBlocks}={}){
  if(!Object.hasOwn(PROGRAMS,preset))throw Error('Unknown non-residential preset');
  if(preset==='matrix'){
   if(height!==2100)throw Error('Matrix prototype has fixed 2,100 mm walls');
   if(!root.OBTPMatrix)throw Error('Pinned System Matrix source is missing');
   const full=root.OBTPMatrix.generate({columns,rows,layer:'all',skin:true});
   const metrics=measure(api,full);
   // No transverse bearer has been designed. Count the entire clear width as
   // the possible roof support distance, not the shorter tiled panel width.
   metrics.supportSpacing=Math.max(metrics.supportSpacing,full.clear[0]);
   metrics.checks.supportSpacing=metrics.supportSpacing>0&&metrics.supportSpacing<=LIMITS.supportSpacingMm;
   metrics.valid=Object.values(metrics.checks).every(Boolean);
   if(!metrics.valid)throw Error('Outside LT I-group dimensional envelope: '+Object.entries(metrics.checks).filter(([,ok])=>!ok).map(([key])=>key).join(', '));
   const scene=root.OBTPMatrix.generate({columns,rows,layer,skin:false});
   return {scene,metrics,program:PROGRAMS.matrix,preset,valid:false,geometryValid:true,researchHold:true,classificationVerified:false,openingsEnabled:false};
  }
  if(!Number.isInteger(bays)||bays<PROGRAMS[preset].minBays||bays>18)throw Error('Module count outside supported preset range');
  // Full roof and outside skins are always measured, even in a filtered frame view.
  const full=api.generate({bays,height,layer:'all',skin:true,connectionRevision:'revised'});
  const metrics=measure(api,full);
  if(!metrics.valid)throw Error('Outside LT I-group dimensional envelope: '+Object.entries(metrics.checks).filter(([,ok])=>!ok).map(([key])=>key).join(', '));
  const scene=api.generate({bays,height,layer,skin:false,connectionRevision:'revised'});
  const plan=preset==='sauna'?saunaPlan({bays,...saunaBlocks}):null;
  if(plan&&(scene.clear[0]<plan.gridWidthMm||scene.clear[1]<plan.gridLengthMm))throw Error('Sauna planning grid exceeds the generated clear interior');
  if(plan){
   const block=plan.blocks.find(b=>b.id==='sauna');
   plan.nominalVolumeM3=block.width*plan.stepMm*block.length*plan.stepMm*scene.clear[2]/1e9;
   plan.referenceHeater={model:'Harvia The Wall SW80',minVolumeM3:7,maxVolumeM3:12};
   plan.referenceHeaterVolumeInRange=plan.nominalVolumeM3>=7&&plan.nominalVolumeM3<=12;
   plan.technicalValid=false; // Nominal heater volume never proves finished fit or installation.
  }
  return {scene,metrics,program:PROGRAMS[preset],preset,plan,valid:true,classificationVerified:false,openingsEnabled:false};
 }
 const exported={LIMITS,PROGRAMS,bounds,measure,saunaPlan,create};
 if(typeof module!=='undefined')module.exports=exported;
 root.OBTPStudioPresets=exported;
})(typeof window==='undefined'?globalThis:window);
