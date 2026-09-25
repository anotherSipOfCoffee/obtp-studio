const assert=require('node:assert/strict');
const api=require('../dist/system-source/cassette/system.js');
require('../dist/system-source/cassette/matrix.js');
const p=require('../dist/v3/presets.js');
for(const preset of ['studio','workshop','sauna']){
 assert.equal(p.PROGRAMS[preset].zones.length,p.PROGRAMS[preset].shares.length);
 assert(Math.abs(p.PROGRAMS[preset].shares.reduce((a,b)=>a+b,0)-1)<1e-9);
 const small=p.create(api,{preset,bays:p.PROGRAMS[preset].minBays});
 const near=p.create(api,{preset,bays:18});
 assert.equal(small.valid,true);assert.equal(near.valid,true);
 assert(near.metrics.area>49&&near.metrics.area<=50);
 assert(near.metrics.internalArea<near.metrics.area);
 assert.equal(near.metrics.height,2576);
 assert.equal(near.metrics.supportSpacing,4572);
 assert.equal(near.scene.allJoints.every(j=>j.capacity===null&&j.fasteners===null),true);
}
assert.throws(()=>p.create(api,{preset:'sauna',bays:4}),/range/);
assert.throws(()=>p.create(api,{preset:'studio',bays:19}),/range/);
assert.throws(()=>p.create(api,{preset:'residential',bays:4}),/Unknown/);
const high={...api,generate(options){const s=api.generate(options);return {...s,allItems:s.allItems.map(i=>i.stage==='roof'?{...i,translation:[i.translation[0],i.translation[1],i.translation[2]+3000]}:i)};}};
assert.throws(()=>p.create(high,{preset:'studio'}),/height/);
const wide={...api,worldBounds(item,asset){const b=api.worldBounds(item,asset);if(item.stage==='walls'&&item.id.startsWith('east-'))return [b[0].map((v,k)=>k===0?v+1000:v),b[1].map((v,k)=>k===0?v+1000:v)];return b;}};
assert.throws(()=>p.create(wide,{preset:'studio',bays:18}),/area/);
const longSpan={...api,worldBounds(item,asset){const b=api.worldBounds(item,asset);if(item.stage==='roof')return [b[0],[b[1][0]+2000,b[1][1],b[1][2]]];return b;}};
assert.throws(()=>p.create(longSpan,{preset:'studio'}),/supportSpacing/);
const compact=p.create(api,{preset:'matrix',columns:4,rows:4});
const matrix=p.create(api,{preset:'matrix',columns:8,rows:15});
assert.equal(compact.metrics.area,7.918596);
assert.equal(matrix.metrics.area,49.084596);
assert.equal(matrix.metrics.height,2576);
assert.equal(matrix.metrics.supportSpacing,4800);
assert.equal(matrix.valid,false,'Structural study must not be treated as a released preset');
assert.equal(matrix.researchHold,true);
assert.equal(matrix.scene.allJoints.every(j=>j.capacity===null&&j.fasteners===null),true);
assert.throws(()=>p.create(api,{preset:'matrix',columns:8,rows:16}),/area/);
assert.throws(()=>p.create(api,{preset:'matrix',columns:9,rows:4}),/columns/);
for(const bays of [8,10,18])for(const saunaWidth of [2,3,4])for(let saunaLength=2;saunaLength<=bays-3;saunaLength++)for(let washLength=2;washLength<=bays-3;washLength++){
 const result=p.create(api,{preset:'sauna',bays,saunaBlocks:{saunaWidth,saunaLength,washLength}}),plan=result.plan;
 assert.equal(plan.valid,true);assert(plan.changingLength>=2);
 assert.equal(plan.technicalValid,false);
 assert(Math.abs(plan.nominalVolumeM3-saunaWidth*saunaLength*0.36*2.1)<1e-9);
 assert.equal(plan.referenceHeaterVolumeInRange,plan.nominalVolumeM3>=7&&plan.nominalVolumeM3<=12);
 const cells=new Set();for(const block of plan.blocks)for(let y=block.y;y<block.y+block.length;y++)for(let x=block.x;x<block.x+block.width;x++){
  const key=x+','+y;assert(!cells.has(key),'Blocks overlap at '+key);cells.add(key);
 }
 assert.equal(cells.size,plan.columns*plan.rows,'Every grid cell must be allocated');
 assert(plan.blocks.filter(b=>b.id==='sauna'||b.id==='washing').every(b=>b.y===plan.changingLength));
 assert(plan.gridWidthMm<=result.scene.clear[0]&&plan.gridLengthMm<=result.scene.clear[1]);
 assert(result.metrics.area<=50&&result.metrics.height<=5000&&result.metrics.supportSpacing<=6000);
}
assert.throws(()=>p.create(api,{preset:'sauna',bays:8,saunaBlocks:{saunaLength:6}}),/Changing\/rest/);
assert.throws(()=>p.create(api,{preset:'sauna',bays:8,saunaBlocks:{saunaWidth:5}}),/block dimensions/);
for(const bays of [8,10,18])for(const circulation of ['deadEnd','through'])for(let saunaLength=2;saunaLength<=bays-5;saunaLength++)for(let washLength=2;washLength<=bays-3-saunaLength;washLength++){
 const result=p.create(api,{preset:'sauna',bays,saunaBlocks:{circulation,saunaLength,washLength}}),plan=result.plan;
 const cells=new Set();for(const block of plan.blocks)for(let y=block.y;y<block.y+block.length;y++)for(let x=block.x;x<block.x+block.width;x++){
  const key=x+','+y;assert(!cells.has(key),'Corridor blocks overlap at '+key);cells.add(key);
 }
 assert.equal(cells.size,plan.columns*plan.rows);assert.equal(plan.blocks.find(b=>b.id==='corridor').length,plan.rows);
 assert(plan.blocks.filter(b=>['sauna','washing','changing'].includes(b.id)).every(b=>b.x===2&&b.width===4));
 assert.equal(plan.exteriorAccessCandidates,circulation==='through'?2:1);assert.equal(plan.corridorAreaM2,1200*plan.rows*600/1e6);
 assert.equal(plan.technicalValid,false);assert(result.metrics.area<=50&&result.metrics.height<=5000&&result.metrics.supportSpacing<=6000);
}
const sharedTwo=p.create(api,{preset:'sauna',bays:10,saunaBlocks:{circulation:'sharedTwoAccess',saunaWidth:3,saunaLength:4,washLength:4}});
assert.equal(sharedTwo.plan.exteriorAccessCandidates,2);assert.equal(sharedTwo.plan.corridorAreaM2,0);
for(const bays of [12,18])for(const saunaWidth of [2,3,4])for(let saunaLength=2;saunaLength<=bays-8;saunaLength++)for(let washLength=2;washLength<=bays-8;washLength++){
 const result=p.create(api,{preset:'sauna',bays,saunaBlocks:{circulation:'wetLobby',saunaWidth,saunaLength,washLength}}),plan=result.plan;
 assert(plan.changingLength>=5);assert.equal(plan.blocks.find(b=>b.id==='lobby').length,2);
 const cells=new Set();for(const block of plan.blocks)for(let y=block.y;y<block.y+block.length;y++)for(let x=block.x;x<block.x+block.width;x++){
  const key=x+','+y;assert(!cells.has(key),'Wet-lobby blocks overlap at '+key);cells.add(key);
 }
 assert.equal(cells.size,plan.columns*plan.rows);assert.equal(plan.exteriorAccessCandidates,2);assert.equal(plan.lobbyAreaM2,4.32);
 assert.equal(plan.corridorAreaM2,0);assert.equal(plan.technicalValid,false);
 assert(result.metrics.area<=50&&result.metrics.height<=5000&&result.metrics.supportSpacing<=6000);
}
const lobby=p.create(api,{preset:'sauna',bays:12,saunaBlocks:{circulation:'wetLobby'}});
assert.equal(lobby.metrics.area,33.201504);assert.equal(lobby.plan.changingLength,5);
assert.equal(lobby.plan.blocks.find(b=>b.id==='sauna').y,7);
assert.throws(()=>p.create(api,{preset:'sauna',bays:10,saunaBlocks:{circulation:'wetLobby'}}),/at least 12/);
assert.throws(()=>p.create(api,{preset:'sauna',bays:12,saunaBlocks:{circulation:'wetLobby',saunaLength:5,washLength:4}}),/Changing\/rest/);
assert.throws(()=>p.create(api,{preset:'sauna',bays:8,saunaBlocks:{circulation:'through',saunaLength:4,washLength:4}}),/Changing\/rest/);
assert.throws(()=>p.create(api,{preset:'sauna',bays:10,saunaBlocks:{circulation:'bridge'}}),/Unknown Sauna circulation/);
const studio=p.create(api,{preset:'studio',bays:10}),workshop=p.create(api,{preset:'workshop',bays:10}),sauna=p.create(api,{preset:'sauna',bays:10}),again=p.create(api,{preset:'studio',bays:10});
assert.deepEqual([studio.metrics.area,workshop.metrics.area,sauna.metrics.area,again.metrics.area],Array(4).fill(studio.metrics.area));
assert.equal(again.plan,null);
assert.equal(p.create(api,{preset:'sauna',bays:10,saunaBlocks:{saunaWidth:3,saunaLength:4,washLength:4}}).plan.referenceHeaterVolumeInRange,true);
assert.equal(p.create(api,{preset:'sauna',bays:10,saunaBlocks:{saunaWidth:2,saunaLength:4,washLength:4}}).plan.referenceHeaterVolumeInRange,false);
console.log('PASS: shared Studio / Workshop / Sauna module, 49.75 m² bound, internal distinction, height and support gates');
