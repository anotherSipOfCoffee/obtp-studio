const assert=require('node:assert/strict');
const api=require('../dist/system-source/cassette/system.js');
const p=require('../dist/v3/presets.js');
for(const preset of ['studio','workshop','sauna']){
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
console.log('PASS: shared Studio / Workshop / Sauna module, 49.75 m² bound, internal distinction, height and support gates');
