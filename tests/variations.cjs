'use strict';
const {chromium}=require('playwright'),assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-webgl']});
try{const page=await browser.newPage({viewport:{width:1440,height:1100}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto(process.env.OBTP_BASE_URL||'http://127.0.0.1:8765/');const v3=page.frameLocator('#v3'),v2=page.frameLocator('#v2');
assert.equal(await page.locator('html').getAttribute('lang'),'lt');await page.locator('#language').selectOption('en');
async function ready(){await v3.locator('#status').filter({hasText:/Your sauna preview/}).waitFor({timeout:60000});}
await ready();
assert.equal(await page.locator('iframe:not([hidden])').getAttribute('id'),'v3');
assert.deepEqual(await v3.locator('#studio-version option').evaluateAll(xs=>xs.map(x=>x.value)),['v2','v3']);
assert.equal(await v3.locator('#preset option:not([disabled])').count(),1);
assert.equal(await v3.locator('#terrace-depth').inputValue(),'1200');assert.equal(await v3.locator('#window-width').inputValue(),'1200');
assert.equal(await v3.locator('#facade option').count(),1);
assert(!(await v3.locator('#component-details').evaluate(x=>x.open)));assert(!(await v3.locator('#technical-notes').evaluate(x=>x.open)));
const initial=await v3.locator('canvas').evaluate(()=>OBTPStudioV3.scene.source_geometry_sha256);
for(const size of ['s','m','l']){await v3.locator('#sauna-size').selectOption(size);await ready();assert.equal(await v3.locator('canvas').evaluate(()=>OBTPStudioV3.selection.size),size);await page.screenshot({path:`studio-sauna-${size}.png`,fullPage:true});}
await v3.locator('#sauna-storage').check();await ready();assert(await v3.locator('canvas').evaluate(()=>OBTPStudioV3.scene.config.storage));
for(const width of ['600','900','1200']){await v3.locator('#window-width').selectOption(width);await ready();assert.equal(await v3.locator('canvas').evaluate(()=>OBTPStudioV3.scene.config.window_width),Number(width));}
await v3.locator('#terrace-depth').selectOption('600');await ready();assert.equal(await v3.locator('canvas').evaluate(()=>OBTPStudioV3.scene.config.terrace_steps),1);
for(const roof of ['0','1','2']){await v3.locator('#sauna-roof').selectOption(roof);await ready();assert.equal(await v3.locator('canvas').evaluate(()=>OBTPStudioV3.scene.config.roof_type),Number(roof));}
await v3.locator('[data-view="cut"]').click();assert(!(await v3.locator('canvas').evaluate(()=>OBTPStudioV3.renderer.items.some(x=>['roof','ceiling'].includes(x.stage)))));
assert(await v3.locator('canvas').evaluate(()=>OBTPStudioV3.renderer.items.some(x=>x.stage==='interior')));
const angle=await v3.locator('canvas').evaluate(()=>OBTPStudioV3.renderer.angle);await v3.locator('#rotate').click();assert(Math.abs(await v3.locator('canvas').evaluate(()=>OBTPStudioV3.renderer.angle)-(angle+Math.PI/2))<1e-9);
await v3.locator('#reset').click();await page.screenshot({path:'studio-sauna-panels-cut.png',fullPage:true});
await v3.locator('#sauna-size').selectOption('m');await ready();await v3.locator('#sauna-storage').uncheck();await ready();await v3.locator('#sauna-roof').selectOption('1');await ready();await v3.locator('#terrace-depth').selectOption('1200');await ready();
assert.equal(await v3.locator('canvas').evaluate(()=>OBTPStudioV3.scene.source_geometry_sha256),initial);
await page.locator('#customer-info').click();assert(await v3.locator('#customer-information').isVisible());
await v3.locator('#component-details summary').click();assert(await v3.locator('#schedule tr').count()>0);
assert.match(await v3.locator('#wood-total').textContent(),/Modeled wood: \d+[.]\d{3} m³/);
await page.locator('#customer-config').click();assert(await v3.locator('#configurator').isVisible());
await page.locator('#customer-info').click();await v3.locator('#studio-version').selectOption('v2');await v2.locator('#status').filter({hasText:/component instances · ready/}).waitFor();assert(await v2.locator('#bays').isVisible());await v2.locator('#studio-version').selectOption('v3');await page.locator('#customer-config').click();await ready();
await page.setViewportSize({width:390,height:844});await v3.locator('[data-view="solved"]').click();await v3.locator('#solved-plan').evaluate(img=>img.decode());assert(await v3.locator('#solved-scroll').evaluate(x=>x.scrollWidth<=x.clientWidth && x.scrollHeight<=x.clientHeight));assert(await v3.locator('body').evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:'studio-sauna-plan-mobile.png',fullPage:true});
await page.locator('#language').selectOption('lt');assert.equal(await v3.locator('html').getAttribute('lang'),'lt');assert.match(await v3.locator('h1').first().textContent(),/Susikurkite savo pirtį/);await page.locator('#customer-info').click();assert.match(await v3.locator('#customer-information h1').textContent(),/Techninė informacija/);await page.locator('#customer-config').click();assert.equal(await v3.locator('#window-width').inputValue(),'1200');await v3.locator('[data-view="3d"]').click();await page.screenshot({path:'studio-customer-lt-mobile.png',fullPage:true});await page.setViewportSize({width:1440,height:1100});await page.screenshot({path:'studio-customer-lt.png',fullPage:true});await page.locator('#customer-info').click();await page.screenshot({path:'studio-information-lt.png',fullPage:true});
assert.deepEqual(errors,[]);console.log('PASS: R03 exported-model defaults, all buyer controls, source identity roundtrip, cut, locked camera, wood, reference plans, mobile and WikiHouse version');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
