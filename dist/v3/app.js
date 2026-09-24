'use strict';
(()=>{
 const $=id=>document.getElementById(id),api=window.OBTPCassette;
 let renderer;
 try {renderer=new SourceMeshView($('diagram'));}
 catch(e){$('status').textContent=e.message;return;}
 // Studio owns configuration; System alone defines and places modules.
 const height=2100;
 $('bays').value='4';
 function render(){
  try {
   const bays=Number($('bays').value);
   const scene=api.generate({bays,height,layer:$('layer').value,skin:false,connectionRevision:'revised'});
   for(const m of renderer.meshes.values())for(const p of m.parts)renderer.gl.deleteBuffer(p.buffer);
   renderer.meshes.clear();scene.models.forEach(m=>renderer.register(m));
   renderer.setScene(scene.items,{explode:Number($('explode').value)/100});
   $('assembly-title').textContent=bays+' module cassette studio';
   $('dimensions').textContent=scene.length.toLocaleString('en')+' × '+scene.width.toLocaleString('en')+' mm setting-out · '+height.toLocaleString('en')+' mm wall height';
   $('status').textContent=scene.items.length+' cassette instances · geometry ready';
   $('schedule').replaceChildren();
   for(const row of api.schedule(scene)){
    const tr=document.createElement('tr');
    const role=row.id.startsWith('F600')?'Floor cassette':row.id.startsWith('R600')?'Roof cassette':'Wall cassette';
    for(const value of [row.id,role,row.count]){const td=document.createElement('td');td.textContent=value;tr.append(td);}
    $('schedule').append(tr);
   }
   window.OBTPStudioV3={scene,items:scene.items,renderer,bays};
  } catch(e){$('status').textContent=e.message;throw e;}
 }
 for(const id of ['bays','layer'])$(id).addEventListener('change',render);
 $('explode').addEventListener('input',()=>{$('amount').textContent=$('explode').value+'%';renderer.explode=Number($('explode').value)/100;renderer.draw();});
 $('reset').addEventListener('click',()=>{$('explode').value='0';$('amount').textContent='0%';renderer.explode=0;renderer.reset();});
 render();
})();

