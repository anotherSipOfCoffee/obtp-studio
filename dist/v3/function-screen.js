'use strict';
/* A task-based planning filter. Values below are study briefs, never legal limits. */
(function(root){
 const area=b=>b.width*b.length*.36;
 function screenStudio(scene,metrics){
  const reasons=[],holds=[];
  // Finnish Institute of Occupational Health: 10–12 m² is guidance for one
  // assigned office room. Apply the lower edge to this one-person desk brief.
  if(metrics.internalArea<10)reasons.push('One-person desk brief: clear unpartitioned area is below the 10 m² workspace guidance used for this study. Smaller hobby uses need their own equipment fit.');
  holds.push('No real door, daylight opening or ventilation is generated; confirm the work surface, circulation and storage against the chosen task.');
  holds.push('Art involving solvents, aerosols or dust needs a task-specific extraction and services study.');
  return {brief:'One-person, non-residential clean design/work studio',spatialCandidate:reasons.length===0,reasons,holds,benchmark:'10 m² one-person workspace guidance; not a Lithuanian legal minimum'};
 }
 function screenSauna(plan){
  const reasons=[],holds=[],blocks=Object.fromEntries(plan.blocks.map(b=>[b.id,b]));
  if(plan.subblocks?.status==='no-fit')reasons.push(...plan.subblocks.failures.map(x=>'Sub-block fit: '+x));
  if(!['sauna','washing','changing'].every(id=>blocks[id]&&area(blocks[id])>0))reasons.push('The hot room, wet approach and changing/rest functions must each have an allocated block.');
  if(blocks.sauna&&blocks.washing){
   const s=blocks.sauna,w=blocks.washing;
   if(s.width<3||s.length<3)reasons.push('The sauna block is below the 1.8 m width × 1.8 m length planning floor for this heater/bench study.');
   if(w.width<3||w.length<3)reasons.push('The wet approach is below the 1.8 × 1.8 m study allocation.');
   if(!plan.referenceHeaterVolumeInRange)reasons.push('The current reference heater is outside its nominal room-volume range; change equipment or block dimensions.');
   if(plan.showerMode!=='outdoor'&&area(w)<1.5*area(s))holds.push('Washing is below the 1.5× hot-room size rule of thumb; verify shower approach and expected number of users.');
  }
  if(plan.showerMode==='outdoor'||plan.showerMode==='both'){
   if(!plan.subblocks?.components.some(c=>c.kind==='outdoor-shower')||!plan.subblocks?.outside.some(d=>d.id==='shower-access'))reasons.push('No aligned exterior shower and access candidate fits the shell.');
   holds.push('Exterior shower is an unroofed 900 × 900 mm candidate beside an uncut wall; provide a winter-safe route, supply, drainage, wastewater and privacy design. Exterior site area classification is unresolved.');
   if(plan.showerMode==='outdoor')reasons.push('Year-round outdoor-only washing remains functionally unverified until frost-safe services, finished wet transition and winter access are designed.');
  }
  if(blocks.changing&&blocks.sauna){
   if(area(blocks.changing)<area(blocks.sauna))reasons.push('Changing/rest is smaller than the hot room in this shared-use brief.');
   else if(area(blocks.changing)<2*area(blocks.sauna))holds.push('Changing/rest is below the 2× hot-room rule of thumb; check seating and simultaneous changing.');
  }
  if(plan.circulation==='shared'||plan.circulation==='sharedTwoAccess')holds.push('Wet-room users return through the changing/rest room; a dry rest area has not been demonstrated.');
  if(plan.circulation==='deadEnd'||plan.circulation==='through')holds.push('The separate side corridor consumes '+plan.corridorAreaM2.toFixed(2)+' m²; room access and the rotated heater/bench arrangement have not been fitted.');
  if(plan.circulation==='wetLobby')holds.push('The wet lobby separates changing from wet-room approaches in plan; floor falls, enclosure and drying remain unbuilt.');
  if(plan.exteriorAccessCandidates===2)holds.push('Two exterior entrances are only candidates; verify privacy and whether both are useful for the site.');
  holds.push('Candidate door and equipment rectangles are geometric studies; finished clearances, actual openings, benches, ventilation and waterproof construction remain unbuilt/unverified.');
  return {brief:'Small non-residential Finnish-style sauna with heat, shower and changing/rest',spatialCandidate:reasons.length===0,reasons,holds,benchmark:'1.8 m study blocks; 1.5× indoor washing and 2× changing are advisory comparisons, not legal rules'};
 }
 function screen(preset,scene,metrics,plan){return preset==='studio'?screenStudio(scene,metrics):preset==='sauna'?screenSauna(plan):null;}
 const exported={screen,screenStudio,screenSauna};if(typeof module!=='undefined')module.exports=exported;root.OBTPStudioFunctionScreen=exported;
})(typeof window==='undefined'?globalThis:window);
