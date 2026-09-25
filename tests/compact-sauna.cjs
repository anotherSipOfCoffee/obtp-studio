const assert=require('node:assert/strict');
const api=require('../preview/system-source/cassette/system.js');
const presets=require('../dist/v3/presets.js');
const cad=require('../dist/v3/cad.js');
const screen=require('../dist/v3/function-screen.js');

for(const [size,offBays,onBays,offArea,onArea,heater] of [
 ['s',4,6,11.140704,16.655904,'SW80'],
 ['m',5,7,13.898304,19.413504,'SW90'],
 ['l',6,8,16.655904,22.171104,'CLUB_STUDY']
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
 assert.deepEqual(plan.subblocks.outside.map(d=>d.id),storage?['entry-front','shower-access','storage-entry-rear']:['entry-front','shower-access']);
 assert.equal(plan.subblocks.components.some(c=>c.kind==='shower'),false);
 assert.equal(plan.subblocks.components.some(c=>c.kind==='storage'),storage);
 assert.equal(plan.subblocks.components.filter(c=>c.kind==='outdoor-shower').length,1);
 assert.equal(plan.referenceHeater.model.includes(heater==='CLUB_STUDY'?'Club':heater),true);
 assert.equal(plan.referenceHeaterVolumeInRange,true);
 const functional=screen.screen('sauna',result.scene,result.metrics,plan);
 assert.equal(functional.spatialCandidate,true);
 assert.equal(plan.technicalValid,false);
 assert.equal(plan.functionallyValid,false);
 const drawing=cad.exportDXF(plan.subblocks,plan,result.scene);
 assert.match(drawing,/OBTP_OUTDOOR_SHOWER_STUDY/);
 assert.match(drawing,new RegExp('OBTP_HEATER_'+heater));
 if(storage)assert.match(drawing,/storage-shelf/);
}
assert.throws(()=>presets.compactSaunaPlan('xl',false),/S, M or L/);
assert.throws(()=>presets.compactSaunaPlan('m','yes'),/boolean/);
assert.equal(presets.create(api,{preset:'studio',bays:4}).metrics.area,11.140704);
assert.equal(presets.create(api,{preset:'workshop',bays:8}).metrics.valid,true);
assert.equal(presets.create(api,{preset:'sauna',saunaSelection:{size:'m',storage:true}}).plan.storage,true);
assert.equal(presets.create(api,{preset:'sauna',saunaSelection:{size:'s',storage:false}}).plan.storage,false);
console.log('PASS: S/M/L compact Sauna with rear storage off/on, outside-only shower, area, span, CAD, shared generator and switching');
