const assert=require('node:assert/strict');
const api=require('../preview/system-source/cassette/system.js');
const presets=require('../dist/v3/presets.js');
const cad=require('../dist/v3/cad.js');
const screen=require('../dist/v3/function-screen.js');

for(const [size,offBays,onBays,offArea,onArea,heater] of [
 ['s',4,4,11.140704,11.140704,'SW80'],
 ['m',5,5,13.898304,13.898304,'SW90'],
 ['l',6,6,16.655904,16.655904,'CLUB_STUDY']
])for(const storage of [false,true]){
 const bays=storage?onBays:offBays,area=storage?onArea:offArea;
 const result=presets.create(api,{preset:'sauna',saunaSelection:{size,storage}}),plan=result.plan;
 assert.equal(result.bays,bays);
 assert.equal(result.metrics.area,area);
 assert.equal(result.metrics.valid,true);
 assert.equal(result.metrics.height,2576);
 assert.equal(result.metrics.supportSpacing,4572);
 assert.deepEqual(plan.blocks.map(b=>b.id),storage?['sauna','hall','storage']:['sauna','hall']);
 assert.equal(plan.showerMode,'outdoor');
 assert.equal(plan.subblocks.status,'spatial-candidate',plan.subblocks.failures.join(', '));
 assert.equal(plan.subblocks.doors.length,1);
 assert.deepEqual(plan.subblocks.outside.map(d=>d.id),storage?['entry-front','storage-entry-side']:['entry-front']);
 assert.equal(plan.subblocks.components.some(c=>c.kind==='shower'),false);
 assert.equal(plan.subblocks.components.some(c=>c.kind==='storage'),storage);
 assert.equal(plan.subblocks.components.filter(c=>c.kind==='outdoor-shower').length,1);
 assert.equal(plan.subblocks.components.filter(c=>c.kind==='outdoor-seat').length,storage?1:0);
 assert.equal(plan.referenceHeater.model.includes(heater==='CLUB_STUDY'?'Club':heater),true);
 assert.equal(plan.referenceHeaterVolumeInRange,true);
 const functional=screen.screen('sauna',result.scene,result.metrics,plan);
 assert.equal(functional.spatialCandidate,!storage);
 assert.equal(result.valid,!storage);
 if(storage)assert(result.metrics.proposedArea>result.metrics.area);
 assert.equal(plan.blocks.find(b=>b.id==='sauna').width,4);
 assert.equal(plan.blocks.find(b=>b.id==='sauna').length,{s:3,m:4,l:5}[size]);
 if(storage){
  const hall=plan.blocks.find(b=>b.id==='hall'),store=plan.blocks.find(b=>b.id==='storage');
  assert.equal(store.x,hall.x+hall.width+1);
  assert.equal(store.y,0);
  assert.equal(store.width*store.length*plan.stepMm*plan.stepMm/1e6,1.44);
  assert.equal(plan.subblocks.outside.find(d=>d.id==='storage-entry-side').wall,'annex-east');
  const shower=plan.subblocks.components.find(c=>c.kind==='outdoor-shower').rect;
  const seat=plan.subblocks.components.find(c=>c.kind==='outdoor-seat').rect;
  assert(shower.y>=store.length*plan.stepMm,'Shower must sit below side store');
  assert.equal(seat.x,shower.x+1000);
  assert(seat.y>=shower.y&&seat.y+seat.h<=shower.y+shower.h);
  assert(result.metrics.proposedArea>result.metrics.area+(seat.w*seat.h+shower.w*shower.h)/1e6);
 }
 assert.equal(plan.technicalValid,false);
 assert.equal(plan.functionallyValid,false);
 const drawing=cad.exportDXF(plan.subblocks,plan,result.scene);
 assert.match(drawing,/OBTP_OUTDOOR_SHOWER_STUDY/);
 assert.match(drawing,new RegExp('OBTP_HEATER_'+heater));
 if(storage)assert.match(drawing,/storage-shelf/);
 if(storage)assert.match(drawing,/OBTP_OUTDOOR_SEAT_STUDY/);
}
assert.throws(()=>presets.compactSaunaPlan('xl',false),/S, M or L/);
assert.throws(()=>presets.compactSaunaPlan('m','yes'),/boolean/);
assert.equal(presets.create(api,{preset:'studio',bays:4}).metrics.area,11.140704);
assert.equal(presets.create(api,{preset:'workshop',bays:8}).metrics.valid,true);
assert.equal(presets.create(api,{preset:'sauna',saunaSelection:{size:'m',storage:true}}).plan.storage,true);
assert.equal(presets.create(api,{preset:'sauna',saunaSelection:{size:'s',storage:false}}).plan.storage,false);
console.log('PASS: S/M/L Sauna with unbuilt side storage off/on, outside-only shower, proposed area gate, CAD and switching');
