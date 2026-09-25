'use strict';
/* Text DXF with reusable CAD BLOCK/INSERT entities; no binary DWG impersonation. */
(function(root){
 function exportDXF(solution,plan,scene){
  if(!solution||solution.status!=='spatial-candidate')throw Error('No spatial candidate to export');
  const out=[],add=(...pairs)=>{for(let i=0;i<pairs.length;i+=2)out.push(String(pairs[i]),String(pairs[i+1]));};
  const line=(x1,y1,x2,y2,layer='EQUIPMENT')=>add(0,'LINE',8,layer,10,x1,20,y1,30,0,11,x2,21,y2,31,0);
  const rect=(x,y,w,h,layer)=>{line(x,y,x+w,y,layer);line(x+w,y,x+w,y+h,layer);line(x+w,y+h,x,y+h,layer);line(x,y+h,x,y,layer);};
  const block=(name,draw)=>{add(0,'BLOCK',8,'0',2,name,70,0,10,0,20,0,30,0,3,name,1,'');draw();add(0,'ENDBLK',8,'0');};
  const insert=(name,x,y,sx=1,sy=1,angle=0,layer='EQUIPMENT')=>add(0,'INSERT',8,layer,2,name,10,x,20,y,30,0,41,sx,42,sy,43,1,50,angle);
  const text=(value,x,y,layer='ANNOTATION')=>add(0,'TEXT',8,layer,10,x,20,y,30,0,40,90,1,value);
  add(0,'SECTION',2,'HEADER',9,'$ACADVER',1,'AC1015',9,'$INSUNITS',70,4,0,'ENDSEC');
  add(0,'SECTION',2,'TABLES',0,'TABLE',2,'LAYER',70,7);
  for(const [name,color] of [['SHELL_REFERENCE',8],['PROGRAM_UNBUILT',4],['ANNEX_UNBUILT',6],['EQUIPMENT',3],['EXTERIOR_STUDY',4],['DOOR_CANDIDATE',1],['ANNOTATION',7]])add(0,'LAYER',2,name,70,0,62,color,6,'CONTINUOUS');
  add(0,'ENDTAB',0,'ENDSEC',0,'SECTION',2,'BLOCKS');
  for(const name of ['OBTP_UPPER_BENCH','OBTP_FOOT_BENCH','OBTP_SHOWER','OBTP_OUTDOOR_SHOWER_STUDY','OBTP_OUTDOOR_SEAT_STUDY','OBTP_CHANGING_SEAT','OBTP_STORAGE_SHELF','OBTP_HEATER_SW80','OBTP_HEATER_SW90','OBTP_HEATER_CLUB_STUDY'])block(name,()=>{
   rect(0,0,1,1,'EQUIPMENT');
   if(name.includes('BENCH'))for(const y of [.2,.4,.6,.8])line(0,y,1,y);
   else if(name==='OBTP_SHOWER'||name==='OBTP_OUTDOOR_SHOWER_STUDY'){line(.1,.1,.9,.9);add(0,'CIRCLE',8,'EQUIPMENT',10,.5,20,.5,30,0,40,.08);}
   else if(name.startsWith('OBTP_HEATER_')){for(const x of [.25,.5,.75])line(x,.1,x,.9);}
   else line(.08,.7,.92,.7);
  });
  block('OBTP_DOOR_CANDIDATE',()=>{line(0,0,1,0,'DOOR_CANDIDATE');add(0,'ARC',8,'DOOR_CANDIDATE',10,0,20,0,30,0,40,1,50,0,51,90);});
  add(0,'ENDSEC',0,'SECTION',2,'ENTITIES');
  const width=scene.width||scene.spec?.width,length=scene.length||scene.spec?.pitch*scene.bays;
  if(!Number.isFinite(width)||!Number.isFinite(length))throw Error('System shell dimensions unavailable');
  const ox=(width-plan.gridWidthMm)/2,oy=(length-plan.gridLengthMm)/2;
  rect(0,0,width,length,'SHELL_REFERENCE');
  for(const [name,b] of Object.entries(solution.rooms)){rect(ox+b.x,oy+b.y,b.w,b.h,name==='storage'&&plan.storage?'ANNEX_UNBUILT':'PROGRAM_UNBUILT');text(name+(name==='storage'&&plan.storage?' - UNBUILT':''),ox+b.x+100,oy+b.y+130);}
  const names={'heater':plan.referenceHeater?.model?.includes('Club')?'OBTP_HEATER_CLUB_STUDY':plan.referenceHeater?.model?.includes('SW90')?'OBTP_HEATER_SW90':'OBTP_HEATER_SW80','bench':'OBTP_UPPER_BENCH','foot-bench':'OBTP_FOOT_BENCH','shower':'OBTP_SHOWER','outdoor-shower':'OBTP_OUTDOOR_SHOWER_STUDY','outdoor-seat':'OBTP_OUTDOOR_SEAT_STUDY','seat':'OBTP_CHANGING_SEAT','storage':'OBTP_STORAGE_SHELF'};
  for(const c of solution.components){const b=c.rect,layer=c.kind==='outdoor-shower'||c.kind==='outdoor-seat'?'EXTERIOR_STUDY':'EQUIPMENT';insert(names[c.kind],ox+b.x,oy+b.y,b.w,b.h,0,layer);text(c.id,ox+b.x+20,oy+b.y+Math.min(160,b.h/2));}
  for(const d of [...solution.doors,...solution.outside]){
   const exterior=solution.outside.includes(d);
   const baseX=d.axis==='y'?ox+d.start:exterior?(d.wall==='west'?0:d.wall==='annex-east'?ox+d.at:width):ox+d.at;
   const baseY=d.axis==='x'?oy+d.start:exterior?(d.wall==='front'?0:length):oy+d.at;
   const angle=d.axis==='x'?90:0,flip=d.wall==='front'||d.wall==='east'?-1:1;
   insert('OBTP_DOOR_CANDIDATE',baseX,baseY,d.width,flip*d.width,angle,'DOOR_CANDIDATE');
   text(d.id,baseX+45,baseY+45);
  }
  text('STUDY ONLY - NO CASSETTE OPENINGS OR FINISHED ROOM FACES',120,-180);
  if(plan.storage)text('RIGHT SIDE STORAGE ANNEX NOT GENERATED - SHOWER AND SEAT OPEN AIR',120,-550);
  if(plan.showerMode==='outdoor'||plan.showerMode==='both')text('EXTERIOR SHOWER PAD UNROOFED - FROST/WASTEWATER/LEGAL SITE REVIEW REQUIRED',120,-430);
  text('UNITS MM - front at Y=0 - CAD blocks are candidate reservations',120,-300);
  add(0,'ENDSEC',0,'EOF');return out.join('\r\n')+'\r\n';
 }
 const exported={exportDXF};if(typeof module!=='undefined')module.exports=exported;root.OBTPStudioCAD=exported;
})(typeof window==='undefined'?globalThis:window);
