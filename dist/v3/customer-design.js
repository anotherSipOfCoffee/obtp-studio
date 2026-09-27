'use strict';
(()=>{
 const $=id=>document.getElementById(id);
 const choiceListeners=new WeakMap();
 window.OBTPChoiceRow=(id,labels)=>{
  const el=$(id),check=el.type==='checkbox';
  if(el.nextElementSibling?.classList.contains('choice-row'))el.nextElementSibling.remove();
  if(choiceListeners.has(el))el.removeEventListener('change',choiceListeners.get(el));
  labels=labels||[...el.options].map(o=>o.textContent);
  const row=document.createElement('div');row.className='choice-row'+(labels.some(x=>x.length>5)?' text-choice':'');row.role='radiogroup';row.setAttribute('aria-labelledby',id+'-label');const label=document.querySelector('label[for="'+id+'"]')||el.closest('label');label.id=id+'-label';if(check){label.after(el);label.classList.remove('toggle-line');}el.classList.add('native-choice');el.tabIndex=-1;el.setAttribute('aria-hidden','true');el.after(row);
  const sync=()=>{for(const [i,b]of [...row.children].entries()){const on=check?el.checked===Boolean(i):el.selectedIndex===i;b.disabled=!check&&el.options[i].disabled;b.setAttribute('aria-checked',on);b.tabIndex=on&&!b.disabled?0:-1;}};
  labels.forEach((text,i)=>{const b=document.createElement('button');b.type='button';b.role='radio';b.textContent=text;b.dataset.value=check?String(Boolean(i)):el.options[i].value;b.onclick=()=>{if(check)el.checked=Boolean(i);else el.selectedIndex=i;sync();el.dispatchEvent(new Event('change',{bubbles:true}));};b.onkeydown=e=>{if(!['ArrowRight','ArrowLeft','ArrowUp','ArrowDown','Home','End'].includes(e.key))return;e.preventDefault();const enabled=[...row.children].filter(x=>!x.disabled),index=enabled.indexOf(b),j=e.key==='Home'?0:e.key==='End'?enabled.length-1:(index+(['ArrowLeft','ArrowUp'].includes(e.key)?-1:1)+enabled.length)%enabled.length;enabled[j].click();enabled[j].focus();};row.append(b);});sync();choiceListeners.set(el,sync);el.addEventListener('change',sync);
 };
 OBTPChoiceRow('preset',['Sauna M with storage','Studio M with storage']);
 const fixed=document.createElement('div');fixed.id='fixed-options';
 const options=[['Size',['S','M','L'],1],['Storage',['No','Yes'],1],['Foundation',['Timber beams','Concrete grillage · study'],0],['Roof',['Flat','Single slope'],0],['Window width',['580 mm','880 mm','1180 mm'],2],['Terrace depth',['1200 mm'],0],['Facade',['Vertical timber'],0],['Sliding glass doors',['Open · summer','Closed · winter'],0]];
 for(const [name,values,selected] of options){
  const group=document.createElement('fieldset');group.className='locked-options';if(name==='Sliding glass doors')group.id='locked-season';
  const legend=document.createElement('legend');legend.textContent=name;group.append(legend);
  const row=document.createElement('div');row.className='choice-row locked-row'+(values.some(v=>v.length>5)?' text-choice':'');row.setAttribute('role','radiogroup');row.setAttribute('aria-label',name);
  values.forEach((value,i)=>{const button=document.createElement('button');button.type='button';button.role='radio';button.disabled=true;button.setAttribute('aria-checked',String(i===selected));button.className=i===selected?'fixed-selected':'locked-alternative';button.textContent=value;row.append(button);});group.append(row);fixed.append(group);
 }
 const note=document.createElement('p');note.className='fixed-note';note.textContent='Hatched options are unavailable for these presets.';fixed.prepend(note);
 const language=document.createElement('div');language.className='appearance';language.innerHTML='<label for="language">Language</label><select id="language"><option value="lt">Lietuvių</option><option value="en">English</option></select>';fixed.append(language);
 $('preset-field').after(fixed);$('language').value=OBTPLang.get();$('language').onchange=e=>{OBTPLang.set(e.target.value);if(parent!==window)parent.OBTPLang?.set(e.target.value);};
 const syncFixed=()=>{$('locked-season').hidden=$('preset').value!=='studio';};$('preset').addEventListener('change',syncFixed);syncFixed();

 const drawings=document.createElement('section');drawings.id='customer-drawings';drawings.className='customer-page';drawings.hidden=true;
 drawings.innerHTML='<h1>Your drawings.</h1><h2 id="drawing-selection"></h2><div class="drawing-actions"><button id="components-download" type="button" disabled>Parts schedule PDF</button><button id="assembly-download" type="button" disabled>Assembly PDF</button><button id="parts-layout-download" type="button" disabled>Loose parts layout PDF</button><button id="back-config" type="button">Configurator</button></div><p id="pdf-status" role="status">Loading model…</p><img id="drawing-plan" alt="Plan matching the selected configuration"><p class="document-note">Review documents — engineering and lifting remain unverified.</p>';
 document.body.append(drawings);
 window.OBTPCustomerView=value=>{const section=value==='drawings'?'drawings':'config';$('configurator').hidden=section!=='config';drawings.hidden=section!=='drawings';window.OBTPConfigOverlay?.(false);$('mobile-config-toggle').hidden=section!=='config';window.scrollTo(0,0);if(section==='drawings')window.OBTPUpdatePDF?.();};
 $('back-config').onclick=()=>OBTPCustomerView('config');$('show-drawings').onclick=()=>OBTPCustomerView('drawings');
 window.OBTPUpdatePDF=()=>{
   const scene=window.OBTPStudioV3?.scene;
   $('pdf-status').textContent=scene?'PDFs match the selected configuration.':'Loading model…';
   $('drawing-selection').textContent=scene?(scene.config.program_type===1?'Studio M with storage':'Sauna M with storage'):'';
   $('drawing-plan').hidden=!scene;
   if(scene)$('drawing-plan').src=$('solved-plan').src;else $('drawing-plan').removeAttribute('src');
   for(const [id,kind]of [['components-download','components'],['assembly-download','assembly'],['parts-layout-download','parts-layout']]){
    const b=$(id),file=scene?.documents?.[kind];b.disabled=!file;b.setAttribute('aria-disabled',String(!file));
    b.onclick=file?()=>{const a=document.createElement('a');a.href='generated/'+file+'?build='+scene.source_revision;a.download=file;document.body.append(a);a.click();a.remove();}:null;
   }
 };
 window.OBTPProgramRender=()=>{};
 const main=$('configurator'),panel=main.querySelector('aside'),preview=main.querySelector('section');
 panel.id='configuration-panel';
 const toggle=document.createElement('button');toggle.id='mobile-config-toggle';toggle.type='button';toggle.setAttribute('aria-controls',panel.id);toggle.setAttribute('aria-expanded','false');toggle.innerHTML='<span class="open-label">Configure</span><span class="close-label" hidden>Close configuration</span>';main.append(toggle);
 const backdrop=document.createElement('button');backdrop.id='config-backdrop';backdrop.type='button';backdrop.tabIndex=-1;backdrop.setAttribute('aria-label','Close configuration');backdrop.hidden=true;main.append(backdrop);
 const mobile=matchMedia('(max-width:850px)');
 window.OBTPConfigOverlay=open=>{open=Boolean(open&&mobile.matches);main.classList.toggle('config-open',open);toggle.setAttribute('aria-expanded',String(open));toggle.querySelector('.open-label').hidden=open;toggle.querySelector('.close-label').hidden=!open;backdrop.hidden=!open;preview.inert=open;panel.inert=mobile.matches&&!open;if(open){panel.setAttribute('role','dialog');panel.setAttribute('aria-label','Configuration');panel.setAttribute('aria-modal','true');panel.querySelector('.choice-row button[aria-checked="true"]:not(:disabled)')?.focus();}else{panel.removeAttribute('role');panel.removeAttribute('aria-modal');}};
 toggle.onclick=()=>OBTPConfigOverlay(toggle.getAttribute('aria-expanded')!=='true');backdrop.onclick=()=>{OBTPConfigOverlay(false);toggle.focus();};
 document.addEventListener('keydown',e=>{if(!main.classList.contains('config-open'))return;if(e.key==='Escape'){OBTPConfigOverlay(false);toggle.focus();}if(e.key==='Tab'){const focusable=[...panel.querySelectorAll('button,a,select,input')].filter(x=>!x.disabled&&x.tabIndex>=0&&x.getClientRects().length&&!x.classList.contains('native-choice'));focusable.push(toggle);const i=focusable.indexOf(document.activeElement);e.preventDefault();focusable[(i+(e.shiftKey?-1:1)+focusable.length)%focusable.length]?.focus();}});
 mobile.addEventListener('change',()=>OBTPConfigOverlay(false));OBTPConfigOverlay(false);
 OBTPCustomerView('config');
})();
