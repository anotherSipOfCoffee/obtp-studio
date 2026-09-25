'use strict';
const assert=require('node:assert/strict');
const api=require('../_system/dist/cassette/system.js');
const presets=require('../dist/v3/presets.js');
const filter=require('../dist/v3/function-screen.js');

const studio=bays=>{const result=presets.create(api,{preset:'studio',bays});return [result,filter.screen('studio',result.scene,result.metrics)];};
assert.equal(studio(4)[1].spatialCandidate,false,'The one-person desk brief must flag insufficient clear area');
assert.equal(studio(5)[1].spatialCandidate,true);
assert.equal(studio(5)[0].metrics.internalArea,10.91502);
assert(studio(18)[0].metrics.area<=50);

const sauna=(bays,circulation,extra={})=>{const result=presets.create(api,{preset:'sauna',bays,saunaBlocks:{circulation,...extra}});return [result,filter.screen('sauna',result.scene,result.metrics,result.plan)];};
for(const circulation of ['shared','sharedTwoAccess','wetLobby','deadEnd','through']){
 const [result,screen]=sauna(12,circulation);
 assert.equal(screen.spatialCandidate,true,`${circulation} must fit the three nominal functions at twelve modules`);
 assert.equal(result.plan.technicalValid,false,'A geometry and block screen must never release a technical sauna');
 assert(screen.holds.length>0);
}
assert.deepEqual([sauna(10,'deadEnd')[0].plan.changingLength,sauna(10,'through')[0].plan.changingLength],[3,3], 'Direct generator defaults must agree with UI corridor defaults');
assert.equal(sauna(8,'shared')[1].spatialCandidate,true);
assert.match(sauna(8,'shared')[1].holds.join(' '),/simultaneous changing/);
assert.equal(sauna(10,'shared',{saunaWidth:4})[1].spatialCandidate,false,'1.2 m washing allowance fails the shower-and-approach brief');
assert.equal(sauna(10,'shared',{saunaLength:2,washLength:4})[1].spatialCandidate,false,'Nominal area compliance must not override heater/bench fit');
assert.throws(()=>sauna(10,'wetLobby'),/at least 12/);
assert(sauna(12,'wetLobby')[1].holds.some(x=>x.includes('unbuilt')));
let gridStates=0,spatialCandidates=0;
for(const circulation of ['shared','sharedTwoAccess','wetLobby','deadEnd','through'])for(let bays=8;bays<=18;bays++)
 for(let saunaWidth=2;saunaWidth<=4;saunaWidth++)for(let saunaLength=2;saunaLength<=15;saunaLength++)for(let washLength=2;washLength<=15;washLength++){
  let plan;try{plan=presets.saunaPlan({bays,saunaWidth,saunaLength,washLength,circulation});}catch{continue;}
  gridStates++;
  const hot=plan.blocks.find(b=>b.id==='sauna'),wash=plan.blocks.find(b=>b.id==='washing'),changing=plan.blocks.find(b=>b.id==='changing');
  const volume=hot.width*hot.length*.36*2.1;
  plan.referenceHeaterVolumeInRange=volume>=7&&volume<=12;
  if(!filter.screenSauna(plan).spatialCandidate)continue;
  spatialCandidates++;
  assert(hot.width>=3&&hot.length>=3&&wash.width>=3&&wash.length>=3);
  assert(changing.width*changing.length>=hot.width*hot.length);
  assert(plan.referenceHeaterVolumeInRange);
 }
assert(gridStates>spatialCandidates&&spatialCandidates>0);
console.log(`PASS: functional research screen; ${spatialCandidates} of ${gridStates} geometrically allocated Sauna parameter states pass its narrow spatial brief, none a technical release`);
