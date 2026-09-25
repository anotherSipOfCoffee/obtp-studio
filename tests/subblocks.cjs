'use strict';
const assert=require('node:assert/strict');
const api=require('../_system/dist/cassette/system.js');
const presets=require('../dist/v3/presets.js');
const sub=require('../dist/v3/subblocks.js');
const cad=require('../dist/v3/cad.js');
const layout=(bays,circulation,saunaBlocks={})=>presets.create(api,{preset:'sauna',bays,saunaBlocks:{circulation,...saunaBlocks}});
const shared=layout(10,'shared');
assert.equal(shared.plan.subblocks.status,'spatial-candidate');
assert.equal(shared.plan.subblocks.doors[0].id,'sauna-washing','The compact Nordic route must reach washing directly from heat');
assert.equal(shared.plan.subblocks.components.find(c=>c.kind==='heater').wall,'west','The entry and heater occupy opposite wall roles');
assert.equal(shared.plan.subblocks.technicalValid,false);
assert.equal(shared.plan.technicalValid,false);
const wet=layout(12,'wetLobby');
assert.equal(wet.plan.subblocks.status,'spatial-candidate');
assert.deepEqual(wet.plan.subblocks.doors.map(d=>d.id),['sauna-lobby','washing-lobby','lobby-changing']);
assert.equal(wet.plan.subblocks.outside.length,2);
assert.equal(wet.plan.subblocks.components.find(c=>c.kind==='shower').rect.w,900);
const corridor=layout(10,'through');
assert.equal(corridor.plan.subblocks.status,'spatial-candidate');
const heater=corridor.plan.subblocks.components.find(c=>c.kind==='heater'),foot=corridor.plan.subblocks.components.find(c=>c.kind==='foot-bench');
assert(!sub.overlap(heater.rect,foot.rect),'A shallow rotated room must move the heater toward its front wall');
assert.equal(corridor.plan.subblocks.outside.length,2);
assert.equal(layout(12,'sharedTwoAccess',{saunaLength:9,washLength:9}).plan.subblocks.status,'no-fit','A short changing band cannot host two side entries');
const drawing=cad.exportDXF(wet.plan.subblocks,wet.plan,wet.scene);
for(const tag of ['OBTP_HEATER_SW80','OBTP_UPPER_BENCH','OBTP_FOOT_BENCH','OBTP_SHOWER','OBTP_CHANGING_SEAT','OBTP_DOOR_CANDIDATE','SHELL_REFERENCE','PROGRAM_UNBUILT'])assert(drawing.includes(tag),tag);
assert(drawing.includes('AC1015')&&drawing.includes('INSUNITS'));
assert.throws(()=>cad.exportDXF({status:'no-fit'},wet.plan,wet.scene),/No spatial candidate/);
let eligible=0,withPlacement=0;
for(const circulation of ['shared','sharedTwoAccess','wetLobby','deadEnd','through'])for(let bays=8;bays<=18;bays++)
 for(let saunaWidth=2;saunaWidth<=4;saunaWidth++)for(let saunaLength=2;saunaLength<=15;saunaLength++)for(let washLength=2;washLength<=15;washLength++){
  let plan;try{plan=presets.saunaPlan({bays,saunaWidth,saunaLength,washLength,circulation});}catch{continue;}
  const hot=plan.blocks.find(b=>b.id==='sauna'),volume=hot.width*hot.length*.36*2.1;
  plan.referenceHeaterVolumeInRange=volume>=7&&volume<=12;
  if(!plan.referenceHeaterVolumeInRange)continue;
  eligible++;
  const fit=sub.solve(plan);
  if(fit.status==='spatial-candidate'){
   withPlacement++;
   assert(fit.doors.length>=2&&fit.components.length===5);
   assert(fit.components.every(c=>c.rect.w>0&&c.rect.h>0));
  }else assert(fit.failures.length>0,'A failed placement must explain why');
 }
assert(withPlacement>0&&withPlacement<eligible);
console.log(`PASS: shared Sauna sub-block solver and CAD block references, ${withPlacement} nominal placements from ${eligible} heater-compatible grid states`);
