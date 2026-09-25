'use strict';
/* Program geometry only. No cassette opening, wet assembly or heater installation. */
(function(root){
 const MM=600;
 const box=b=>({x:b.x*MM,y:b.y*MM,w:b.width*MM,h:b.length*MM});
 const overlap=(a,b,margin=0)=>a.x<b.x+b.w+margin&&a.x+a.w+margin>b.x&&a.y<b.y+b.h+margin&&a.y+a.h+margin>b.y;
 const inside=(a,b)=>a.x>=b.x&&a.y>=b.y&&a.x+a.w<=b.x+b.w&&a.y+a.h<=b.y+b.h;
 const sharedEdge=(a,b)=>{
  if(a.x+a.w===b.x||b.x+b.w===a.x){const lo=Math.max(a.y,b.y),hi=Math.min(a.y+a.h,b.y+b.h);if(hi>lo)return {axis:'x',at:a.x+a.w===b.x?b.x:a.x,lo,hi,sideA:a.x+a.w===b.x?'east':'west'};}
  if(a.y+a.h===b.y||b.y+b.h===a.y){const lo=Math.max(a.x,b.x),hi=Math.min(a.x+a.w,b.x+b.w);if(hi>lo)return {axis:'y',at:a.y+a.h===b.y?b.y:a.y,lo,hi,sideA:a.y+a.h===b.y?'rear':'front'};}
  return null;
 };
 const component=(id,kind,room,rect,wall)=>({id,kind,room,rect,wall,status:'planning-only'});
 function door(id,from,to,rooms,{width=800,preferred='start',offset=250}={}){
  const a=rooms[from],b=rooms[to],edge=sharedEdge(a,b);if(!edge||edge.hi-edge.lo<width+300)return null;
  const start=preferred==='end'?edge.hi-offset-width:edge.lo+offset;
  if(start<edge.lo+150||start+width>edge.hi-150)return null;
  const side=edge.sideA;
  // A conservative square containing the whole outward door swing in the destination room.
  const sweep=edge.axis==='x'?{x:side==='east'?edge.at:edge.at-width,y:start,w:width,h:width}:{x:start,y:side==='rear'?edge.at:edge.at-width,w:width,h:width};
  if(!inside(sweep,b))return null;
  return {id,kind:'door',from,to,wall:side,axis:edge.axis,at:edge.at,start,width,sweep,hinge:'start',status:'candidate-only'};
 }
 function entry(id,room,rooms,edge,width=900,start){
  const r=rooms[room],at=edge==='front'?r.y:edge==='rear'?r.y+r.h:edge==='west'?r.x:r.x+r.w;
  const axis=edge==='front'||edge==='rear'?'y':'x';
  const span=start??(axis==='y'?r.x+(r.w-width)/2:r.y+(r.h-width)/2);
  if(span<(axis==='y'?r.x:r.y)+150||span+width>(axis==='y'?r.x+r.w:r.y+r.h)-150)return null;
  return {id,kind:'outside-door',room,wall:edge,axis,at,start:span,width,status:'candidate-only'};
 }
 function equip(sauna,washing,changing,doorWall){
  const t=60,side=doorWall==='west'?'east':'west';
  const upper={x:sauna.x+t,y:sauna.y+sauna.h-t-600,w:sauna.w-2*t,h:600};
  const foot={x:doorWall==='west'?sauna.x+t+450:sauna.x+t,y:upper.y-450,w:sauna.w-2*t-450,h:450};
  // Shallow corridor rooms pull the heater toward the entry wall instead of
  // copying R02's 320 mm offset and colliding with the foot bench.
  const heaterOffset=Math.max(100,Math.min(320,foot.y-sauna.y-430-90));
  const heater={x:side==='west'?sauna.x+t:sauna.x+sauna.w-t-260,y:sauna.y+heaterOffset,w:260,h:430};
  const shower={x:washing.x+washing.w-t-900,y:washing.y+washing.h-t-900,w:900,h:900};
  const seat={x:changing.x+t,y:changing.y+changing.h-t-550,w:1200,h:550};
  return [component('heater','heater','sauna',heater,side),component('upper-bench','bench','sauna',upper,'rear'),component('foot-bench','foot-bench','sauna',foot,'rear'),component('shower','shower','washing',shower,'rear/east'),component('changing-seat','seat','changing',seat,'west')];
 }
 function solve(plan,options={}){
  const rooms=Object.fromEntries(plan.blocks.map(b=>[b.id,box(b)]));
  const warnings=[],failures=[],candidates=[];
  const {sauna,washing,changing}=rooms;
  if(!sauna||!washing||!changing)return {status:'no-fit',failures:['Three main room blocks are required'],warnings,rooms,components:[],doors:[]};
  const routes=plan.circulation==='wetLobby'?[['sauna','lobby'],['washing','lobby'],['lobby','changing']]:
   plan.circulation==='deadEnd'||plan.circulation==='through'?[['sauna','corridor'],['washing','corridor'],['changing','corridor']]:
   [['sauna','washing'],['washing','changing']];
  const saunaAccess=sharedEdge(sauna,rooms[routes[0][1]]);
  const components=equip(sauna,washing,changing,saunaAccess?.sideA||'front');
  // Search the adjacent door boundary in 100 mm steps, preferring the side
  // nearest the approach. An entire swing square must fit the next room.
  for(const [from,to] of routes){let chosen=null;
   for(const offset of [250,350,450,550,650,750,850,950,1050,1150,1250,1350,1450,1550,1650,1750,1850,1950,2050]){
    const trial=door(from+'-'+to,from,to,rooms,{offset});
    if(!trial)continue;
    if(components.filter(i=>i.room===to).some(item=>overlap(trial.sweep,item.rect,40)))continue;
    if(candidates.some(other=>other.to===to&&overlap(trial.sweep,other.sweep,0)))continue;
    chosen=trial;break;
   }
   if(!chosen)failures.push('No 800 mm candidate door and swing fits '+from+' → '+to);
   else candidates.push(chosen);
  }
  for(const item of components)if(item.rect.w<=0||item.rect.h<=0||!inside(item.rect,rooms[item.room]))failures.push(item.id+' exceeds its nominal room');
  const [heater,upper,foot,shower,seat]=components;
  for(const [a,b] of [[heater,upper],[heater,foot],[upper,shower]])if(a.room===b.room&&overlap(a.rect,b.rect))failures.push(a.id+' intersects '+b.id);
  // Swing checks include the destination room only; construction thickness,
  // door leaf thickness and actual people movement require separate review.
  for(const d of candidates)for(const item of components.filter(i=>i.room===d.to))if(overlap(d.sweep,item.rect,40))failures.push(d.id+' swing intersects '+item.id);
  const outside=[];
  if(rooms.corridor){outside.push(entry('entry-front','corridor',rooms,'front',900));if(plan.circulation==='through')outside.push(entry('entry-rear','corridor',rooms,'rear',900));}
  else if(plan.circulation==='shared'||plan.singleEntry)outside.push(entry('entry-front','changing',rooms,'front',900));
  else {outside.push(entry('entry-west','changing',rooms,'west',900,changing.y+600));outside.push(entry('entry-east','changing',rooms,'east',900,changing.y+600));}
  if(outside.some(x=>!x))failures.push('An outside entry candidate does not fit its nominal wall');
  if(plan.circulation==='shared'||plan.circulation==='sharedTwoAccess')warnings.push('The preferred shower-linked route requires a new Sauna–washing partition door; the R02 manually placed heater must be reoriented.');
  if(plan.circulation==='wetLobby')warnings.push('The wet lobby keeps changing separate; Sauna and washing are reached through it, pending wet floor and real partitions.');
  warnings.push('60 mm face offsets, 800/900 mm candidate doors, 900 mm shower, 300 mm heater approach and 40 mm swing buffer are study assumptions, not code approvals or manufacturer installation clearances.');
  warnings.push('No opening, partition, bench anchorage, drainage, ventilation or heater safety guard is generated in Cassette 01.');
  if(!plan.referenceHeaterVolumeInRange)failures.push('The reference SW80 heater nominal volume is outside its 7–12 m³ published range');
  if(heater&&upper&&foot){const guard={x:heater.rect.x+(heater.wall==='west'?heater.rect.w:-300),y:heater.rect.y-70,w:300,h:heater.rect.h+140};if(overlap(guard,foot.rect))failures.push('Heater approach study zone intersects the foot bench');}
  return {status:failures.length?'no-fit':'spatial-candidate',rooms,components,doors:candidates,outside:outside.filter(Boolean),failures:[...new Set(failures)],warnings,route:routes.map(([a,b])=>a+' → '+b).join(' · '),technicalValid:false,source:'OBTP System plan blocks; all equipment is a placement study'};
 }
 const exported={solve,box,sharedEdge,door,overlap};if(typeof module!=='undefined')module.exports=exported;root.OBTPStudioSubblocks=exported;
})(typeof window==='undefined'?globalThis:window);
