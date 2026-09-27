'use strict';
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{const browser=await chromium.launch({executablePath:process.env.OBTP_CHROMIUM_EXECUTABLE,headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-webgl']});
try{
 const base=process.env.OBTP_BASE_URL||'http://127.0.0.1:8765/';
 const page=await browser.newPage({viewport:{width:1440,height:1000},acceptDownloads:true}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{localStorage.setItem('obtp-preset','workshop');localStorage.setItem('obtp-size','l');localStorage.setItem('obtp-storage','false');});
 await page.goto(base+'configurator.html?preset=workshop&size=l&storage=false&roof=2#v2');
 const frame=page.frameLocator('#v3');
 async function ready(program){await page.waitForFunction(p=>{const s=document.getElementById('v3').contentWindow?.OBTPStudioV3?.scene;return s&&s.config.program_type===p;},program,{timeout:60000});}
 async function choose(program){await frame.locator('#preset + .choice-row [data-value="'+(program?'studio':'sauna')+'"]').click();await ready(program);}
 await ready(1);
 assert.equal(await page.locator('#customer-info,#v2,#v1').count(),0);
 assert.equal(await frame.locator('#customer-information,#customer-product,#studio-version').count(),0);
 assert.deepEqual(await frame.locator('#preset option').evaluateAll(xs=>xs.map(x=>x.value)),['sauna','studio']);
 assert.equal(await frame.locator('.choice-row').count(),1);
 assert(!page.url().includes('workshop'));
 await page.locator('#language').selectOption('en');
 for(const program of [0,1]){
  await choose(program);
  const data=await frame.locator('canvas').evaluate(()=>({s:OBTPStudioV3.scene,selected:OBTPStudioV3.selection}));
  assert.equal(data.s.config.size,'M');assert.equal(data.s.config.storage,true);assert.equal(data.s.config.roof_type,0);assert.equal(data.s.config.foundation_type,0);assert.equal(data.s.config.window_width,1180);
  assert.equal(data.s.documents_geometry_sha256,data.s.source_geometry_sha256);
  assert(data.s.items.some(x=>x.stage==='facade'));assert.equal(data.s.manufacturing.physical_pieces+data.s.manufacturing.cladding.physical_pieces,data.s.items.length);
  const before=data.s.source_geometry_sha256;
  await frame.locator('canvas').evaluate(()=>{document.getElementById('sauna-size').value='l';document.getElementById('sauna-storage').checked=false;document.getElementById('sauna-roof').value='2';OBTPReload();});await ready(program);
  assert.equal(await frame.locator('canvas').evaluate(()=>OBTPStudioV3.scene.source_geometry_sha256),before);
  await frame.locator('[data-view="cut"]').click();
  assert(await frame.locator('canvas').evaluate(()=>OBTPStudioV3.scene.cut.models.every(m=>m.assets.every(a=>a.vertices.every(v=>v[2]<=OBTPStudioV3.scene.dimensions.floor_top_mm+1100+.001)))));
  await frame.locator('[data-view="solved"]').click();await frame.locator('#solved-plan').evaluate(x=>x.decode());assert(await frame.locator('#diagram').isHidden());
  await frame.locator('[data-view="3d"]').click();
  const angle=await frame.locator('canvas').evaluate(()=>OBTPStudioV3.renderer.angle);await frame.locator('#rotate').click();assert.notEqual(await frame.locator('canvas').evaluate(()=>OBTPStudioV3.renderer.angle),angle);await frame.locator('#reset').click();
  await page.screenshot({path:'studio-fixed-'+program+'-desktop.png',fullPage:true});
  await page.locator('#customer-drawings').click();await frame.locator('#drawing-plan').evaluate(x=>x.decode());
  for(const [id,kind] of [['components-download','components'],['assembly-download','assembly']]){
   assert(await frame.locator('#'+id).isEnabled());const downloading=page.waitForEvent('download');await frame.locator('#'+id).click();const download=await downloading;
   assert.equal(download.suggestedFilename(),data.s.documents[kind]);const path=await download.path();const bytes=fs.readFileSync(path);assert.equal(bytes.subarray(0,5).toString(),'%PDF-');assert(bytes.length>10000);
   const hash=require('node:crypto').createHash('sha256').update(bytes).digest('hex');assert.equal(hash,data.s.document_sha256[kind]);
  }
  await page.screenshot({path:'studio-fixed-'+program+'-drawings.png',fullPage:true});await page.locator('#customer-config').click();
 }
 await page.locator('#language').selectOption('lt');assert.match(await frame.locator('#preset + .choice-row').textContent(),/Pirtis M su sandėliuku/);
 await page.setViewportSize({width:390,height:844});
 for(const program of [0,1]){
  await frame.locator('#mobile-config-toggle').click();await choose(program);await page.screenshot({path:'studio-fixed-'+program+'-mobile-controls.png',fullPage:true});await page.keyboard.press('Escape');
  assert.equal(await frame.locator('#mobile-config-toggle').getAttribute('aria-expanded'),'false');
  assert(await frame.locator('canvas').evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.screenshot({path:'studio-fixed-'+program+'-mobile.png',fullPage:true});
  await page.locator('#customer-drawings').click();assert(await frame.locator('#assembly-download').isEnabled());assert(await frame.locator('#components-download').isEnabled());await page.locator('#customer-config').click();
 }
 assert.deepEqual(errors,[]);
 await page.goto(base);assert.equal(await page.locator('.hero').count(),1);assert.equal(await page.locator('#presets .card').count(),3);
 console.log('PASS: two locked presets, URL/state guards, preserved 3D/cut/plan, rotation, both real PDF downloads for both presets, LT/EN and desktop/mobile; homepage retained');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
