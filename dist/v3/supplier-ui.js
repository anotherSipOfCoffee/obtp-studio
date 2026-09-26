'use strict';
(()=>{
 const $=id=>document.getElementById(id);
 const field=document.createElement('div');field.className='field';
 const label=document.createElement('label');label.htmlFor='assembly-system';
 const select=document.createElement('select');select.id='assembly-system';select.add(new Option('OBTP Cassette','0'));field.append(label,select);
 document.querySelector('label[for="sauna-size"]').before(field);
 const panel=document.createElement('details');panel.id='supplier-information';
 const summary=document.createElement('summary');const content=document.createElement('div');panel.append(summary,content);$('customer-information').append(panel);
 let scene=null;
 const lt=()=>window.OBTPLang?.get()!=='en';
 function render(next){
  if(next)scene=next;if(!scene?.supplier_spec)return;
  const data=scene.supplier_spec,isLT=lt();label.textContent=isLT?'Surenkama konstrukcija':'Assembly system';summary.textContent=isLT?'Gamintojai ir gaminių duomenys':'Suppliers and product data';
  const previous=select.value;select.replaceChildren();
  for(const system of data.systems){const option=new Option(system.label+(system.enabled?'':isLT?' · ruošiama':' · in development'),String(system.id));option.disabled=!system.enabled;select.add(option);}
  select.value=previous||String(data.active_system.id);content.replaceChildren();
  const note=document.createElement('p');note.textContent=isLT?'Čia nurodyti parinkimo kandidatai ir dokumentacijos šaltiniai. Galutinė komplektacija dar tikslinama.':'These are product candidates and documentation sources. The final specification remains to be confirmed.';content.append(note);
  for(const record of data.products){
   const row=document.createElement('article');row.className='supplier-row';
   const brand=document.createElement('a');brand.href=record.url;brand.target='_blank';brand.rel='noopener';
   if(record.logo){const img=document.createElement('img');img.src='generated/supplier-assets/'+record.logo;img.alt=record.supplier;img.width=110;img.height=45;brand.append(img);}else brand.textContent=record.supplier;
   const details=document.createElement('div');const name=document.createElement('strong');name.textContent=(isLT?record.category_lt:record.category_en)+' · '+record.product;
   const status=document.createElement('p');status.textContent=isLT?record.status_lt:record.status_en;
   const description=document.createElement('p');description.textContent=isLT?record.scope_lt:record.scope_en;details.append(name,status,description);row.append(brand,details);content.append(row);
  }
  const alternative=data.systems.find(x=>!x.enabled);
  if(alternative){const row=document.createElement('article');row.className='supplier-row';const img=document.createElement('img');img.src='generated/supplier-assets/'+alternative.logo;img.alt=alternative.supplier;img.width=110;img.height=45;const text=document.createElement('p');text.textContent=isLT?'Hunton alternatyva ruošiama. Pirties sluoksniai, jungtys ir tiekimas Lietuvoje dar nesuderinti.':'Hunton alternative in development. Sauna layers, connections and supply to Lithuania remain unresolved.';row.append(img,text);content.append(row);}
 }
 window.OBTPSuppliersRender=render;
 select.addEventListener('change',()=>window.OBTPReload?.());
 window.addEventListener('obtp:language',()=>render());
 render(window.OBTPStudioV3?.scene);
})();
