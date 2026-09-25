'use strict';
const fs=require('node:fs'),path=require('node:path');
const api=require('../_system/dist/cassette/system.js');
const presets=require('../dist/v3/presets.js');
const cad=require('../dist/v3/cad.js');
const output=path.join(__dirname,'../dist/v3/cad');fs.mkdirSync(output,{recursive:true});
for(const [bays,circulation,name] of [[10,'shared','sauna-10-shared-r06.dxf'],[12,'wetLobby','sauna-12-wet-lobby-r06.dxf']]){
 const result=presets.create(api,{preset:'sauna',bays,saunaBlocks:{circulation}});
 if(result.plan.subblocks.status!=='spatial-candidate')throw Error('No CAD layout: '+circulation);
 const text=cad.exportDXF(result.plan.subblocks,result.plan,result.scene);
 fs.writeFileSync(path.join(output,name),text,'utf8');console.log('Generated '+name+' ('+Buffer.byteLength(text)+' bytes)');
}
