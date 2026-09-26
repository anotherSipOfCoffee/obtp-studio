'use strict';
(()=>{
 const exact={
 'Studio':'Studija','Studio size':'Studijos dydis','Storage shelves':'Medžiagų lentynos','Configure your studio.':'Susikurkite savo studiją.','Your studio preview.':'Jūsų studijos peržiūra.','Space to create.':'Erdvė kurti.','OBTP / MODULAR STUDIO':'OBTP / MODULINĖ STUDIJA',
 'Creative workspace · covered outdoor work area · preparation and storage.':'Kūrybos kambarys · dengta lauko darbo erdvė · paruošimas ir laikymas.',
 'Two enclosed workspaces around a covered outdoor work area. For creative work, preparation and material storage.':'Dvi uždaros darbo patalpos, kurias jungia dengta lauko erdvė. Skirta kūrybai, pasiruošimui ir medžiagoms laikyti.',
 'Studio envelope study: heating, ventilation and vapour control remain to be specified.':'Studijos atitvarų sprendiniai tikrinami. Šildymas, vėdinimas ir garų kontrolė dar neparinkti.',
 'Creative/hobby workspace and material preparation/storage; no sleeping or residential use.':'Kūrybos ir pomėgių erdvė, medžiagų paruošimas bei laikymas. Neskirta nakvynei ar gyvenimui.',
 'Covered centre counted in full roof/terrace area bound; classification and site-specific SLD requirements remain unverified.':'Dengta vidurinė dalis įtraukta į stogo ir terasos ploto ribą. Statinio klasifikavimas ir SLD poreikis tikrinami konkrečiam sklypui.',
 'Open-bay headers, foundations, connections, weatherproofing and roof bracing require engineering review.':'Atviros dalies sijas, pamatus, jungtis, sandarumą ir stogo standumą turi patikrinti projektuotojai.',
 'Window/door products, vapour control, heating and ventilation require project-specific selection.':'Langai, durys, garų kontrolė, šildymas ir vėdinimas parenkami konkrečiam projektui.',
 'Native Rhino/GH execution acceptance remains pending.':'Patikra Rhino / Grasshopper aplinkoje dar nebaigta.',

 'Configure':'Keisti pasirinkimus','Close configuration':'Uždaryti pasirinkimus','Configuration':'Pasirinkimai','Module type':'Modulio tipas','Window frame width':'Lango rėmo plotis','A3 · plan and sections 1:25 · window 1:10 · vertical window details 1:2.':'A3 · planas ir pjūviai 1:25 · langas 1:10 · vertikalūs lango mazgai 1:2.',
 'Envelope study: 195 mm wall insulation, 220 mm floor and ceiling insulation; sealed sauna foil and ventilated lining cavity. Heater, ventilation and moisture assessment remain to be confirmed.':'Tikrinama atitvarų sandara: sienose 195 mm, grindyse ir perdangoje 220 mm šiltinimo sluoksnis; sandari pirties folija ir oro tarpas už apdailos. Krosnelė, vėdinimas ir drėgminė būklė dar tikslinami.',
 'No':'Ne','Yes':'Taip','Flat':'Plokščias','Single slope':'Vienšlaitis','Gable':'Dvišlaitis','Appearance':'Vaizdavimas','White model':'Baltas modelis','Materials':'Medžiagos','Drawings':'Brėžiniai','Your drawings.':'Jūsų brėžiniai.','Download PDF':'Atsisiųsti PDF','Open PDF':'Atverti PDF','Plan, two sections, window schedule and reserved construction details.':'Planas, du pjūviai, lango žiniaraštis ir vieta konstrukcijų mazgams.','OBTP / SAUNA':'OBTP / PIRTIS','A place to slow down.':'Erdvė atsikvėpti.','A modular sauna with a small entrance hall, outdoor shower and optional storage. Choose the size and details that suit your space.':'Modulinė pirtis su nedideliu prieangiu, lauko dušu ir pasirenkamu sandėliuku. Pasirinkite jums tinkantį dydį ir detales.','Plan generated from the selected 3D model, with dimensions authored in Python/GH.':'Planas ir matmenys parengti pagal pasirinktą 3D modelį.',
 'Your sauna preview.':'Jūsų pirties peržiūra.',
 'GitHub ↗':'GitHub ↗','Additional information':'Papildoma informacija','Configurator':'Konfigūratorius','Language':'Kalba','Version':'Konstrukcijos sistema',
 'OBTP Cassette 01 · Sauna':'OBTP Cassette 01 · Pirtis','WikiHouse · source assembly':'WikiHouse · konstrukcijos peržiūra',
 'STUDIO V3 / CASSETTE 01':'OBTP / MODULINĖ PIRTIS','Configure your sauna.':'Susikurkite savo pirtį.',
 'Choose your size, roof, terrace and window.':'Pasirinkite dydį, stogą ir langą. Terasos gylis – 1200 mm.',
 'Preset':'Paskirtis','Sauna':'Pirtis','Studio · later':'Studija · ruošiama','Workshop · later':'Dirbtuvės · ruošiama','Matrix · research':'Modulių matrica · tyrimas',
 'Sauna size':'Pirties dydis','S · compact':'S · kompaktiška','M · standard':'M · standartinė','L · longer entrance in solved plan':'L · erdvesnis prieangis',
 'External storage + outdoor seat':'Sandėliukas ir lauko suolas','Roof':'Stogas','Flat · membrane':'Plokščias · membraninė danga','Single slope · metal':'Vienšlaitis · skarda','Gable · metal':'Dvišlaitis · skarda',
 'Terrace depth':'Terasos gylis','Window width':'Lango plotis','Façade':'Fasado apdaila','Vertical timber':'Vertikalios dailylentės','1,200 mm':'1 200 mm',
 'Cut':'Pjūvis','Plan':'Planas','Reset view':'Atkurti vaizdą','Rotate 90°':'Pasukti 90°',
 'Assembly layers':'Konstrukcijos sluoksniai','Complete cassette frame':'Visa konstrukcija','Floor + walls + roof':'Grindys, sienos ir stogas','Floor + walls':'Grindys ir sienos','Floor only':'Tik grindys','Exploded view':'Išskleistas vaizdas','Display offsets only, not an assembly sequence.':'Tai dalių peržiūra, ne montavimo seka.',
 'Design notes and model limits':'Projektavimo pastabos ir modelio ribos','Shown components · detailed schedule':'Elementų sąrašas','Object':'Elementas','Role':'Paskirtis','Quantity':'Kiekis','Modeled component':'Modelio elementas',
 'Fixed camera · Rotate 90° or scroll to zoom':'Fiksuotas vaizdas · pasukite 90° arba keiskite mastelį pelės ratuku',
 'Cut at 1.10 m above floor · fixed camera':'Pjūvis 1,10 m virš grindų · fiksuotas vaizdas',
 'Original owner reference drawing; new finishes, window and terrace are shown in the 3D model.':'Pradinis planavimo eskizas. Naują apdailą, langą ir terasą matysite 3D modelyje.',
 'Loading script-authored model…':'Įkeliamas modelis…','No valid output loaded':'Tinkamas modelis neįkeltas',
 'Download this revision’s GH authoring scripts':'Atsisiųsti šios versijos Grasshopper scenarijus',
 'LT I-group dimensional screen':'LT I grupės matmenų patikra',
 'Site and land-use conditions must be checked separately. The conservative area bound is not a certified legal area calculation.':'Sklypo ir žemės naudojimo sąlygos tikrinamos atskirai. Konservatyvi ploto riba nėra patvirtintas teisinis ploto skaičiavimas.',
 'Configuration preview. Final specifications and site requirements are confirmed separately.':'Konfigūracijos peržiūra. Galutinė specifikacija ir sklypo reikalavimai tikslinami atskirai.',
 'Technical details, quantities and reference drawings':'Techninė informacija, kiekiai ir eskizai',
 'Details for your current configuration. Return to the configurator to change your choices.':'Čia pateikiama pasirinktos konfigūracijos informacija. Parametrus galite keisti konfigūratoriuje.',
 'Inspect objects and connections ↗':'Elementai ir jungtys ↗','Open current System project ↗':'Konstrukcijų projektas ↗','Sauna layout and construction holds ↗':'Planavimo ir konstrukcijų pastabos ↗',
 'Design study, not a construction release. The model includes lining, cladding, openings and roof/terrace geometry. Engineering, foundations, heater clearances, waterproofing and native Rhino/GH acceptance remain open. Source plans are retained as references.':'Projektavimo modelis, ne statybai parengtas projektas. Konstrukcijų skaičiavimai, pamatai, krosnelės saugūs atstumai, hidroizoliacija ir patikra Rhino / Grasshopper aplinkoje dar nebaigti. Pradiniai planai pateikiami palyginimui.',
 'Geometry changes must be made in the pinned System Python/GH authoring core, then exported. Studio owns the controls and viewer.':'Geometrija keičiama susietame System Python / Grasshopper scenarijuje ir eksportuojama. Studio skirta parametrams pasirinkti ir modeliui peržiūrėti.',
 'Owner-plan fit not accepted: 1800 mm structural inside-face depth is a proposal.':'1800 mm atstumas tarp vidinių konstrukcijos paviršių dar derinamas su pradiniu planu.',
 'Source door offsets are retained in reference drawings; generated doors use explicit candidate parameters.':'Pradiniuose eskizuose išsaugotos durų vietos. Modelyje naudojami derinami durų padėties parametrai.',
 'Cassette end pieces, off-grid partitions and opening framing need connection review.':'Kasetės galų, pertvarų ir angų įrėminimo jungtys dar tikrinamos.',
 'No engineered lintel, fastener schedule, racking, foundation or roof-weathering design.':'Sąramų, tvirtinimo, standumo, pamatų ir stogo sandarumo sprendiniai dar nepatvirtinti.',
 'Lining is modeled; vapour control, waterproofing, glazing safety, finished clearances and heater ventilation require verification.':'Apdaila sumodeliuota. Dar tikrinama garo izoliacija, hidroizoliacija, stiklinimo sauga, laisvi atstumai ir krosnelės vėdinimas.',
 'Grasshopper/Rhino 8 execution acceptance is pending.':'Patikra Grasshopper / Rhino 8 aplinkoje dar nebaigta.',
 'floor':'grindys','roof':'stogas','walls':'sienos','partitions':'pertvaros','furniture':'įranga ir baldai','foundation':'pamatai','interior':'vidaus apdaila','ceiling':'lubos','facade':'fasadas','terrace':'terasa','canopy':'stoginė'
 };
 const patterns=[
 [/^Studio ([SML])(.*)$/,(_,s,t)=>`Studija ${s}${t.replace(' · storage shelves',' · lentynos').replace(' · model plan',' · planas pagal modelį')}`],
 [/^Enclosed floor area after wall finishes: (.*)$/,(_,v)=>`Uždarų patalpų plotas po sienų apdailos: ${v.replaceAll('.',',')}`],
 [/^Sauna ([SML])(.*)$/,(_,s,t)=>`Pirtis ${s}${t.replace(' · external storage',' · sandėliukas').replace(' · model plan',' · planas pagal modelį')}`],
 [/^(\d+) × (\d+) mm structural footprint · (\d+) mm overall model height$/,(_,a,b,h)=>`${a} × ${b} mm konstrukcijos matmenys · bendras aukštis ${h} mm`],
 [/^GH-R03 · (\d+) modeled parts · design study$/,(_,n)=>`Modelio peržiūra · ${n} elementų`],
 [/^Outdoor shower · (\d+) mm entrance terrace · (\d+) mm sauna window on entrance façade\.$/,(_,t,w)=>`Lauko dušas · ${t} mm terasa · ${w} mm langas įėjimo fasade.`],
 [/^Modeled wood: ([\d.]+) m³ · structure, plywood, lining, cladding and deck; furniture and waste excluded$/,(_,v)=>`Medienos kiekis modelyje: ${v.replace('.',',')} m³ · konstrukcija, fanera, apdaila ir terasa; baldai ir atliekos neįtraukti`],
 [/^Conservative roof\/terrace area bound: (.*)$/,(_,v)=>`Konservatyvi stogo ir terasos ploto riba: ${v.replaceAll('.',',')}`],
 [/^Height: (.*)$/,(_,v)=>`Aukštis: ${v.replaceAll('.',',')}`],[/^Maximum support spacing: (.*)$/,(_,v)=>`Didžiausias atstumas tarp atramų: ${v.replaceAll('.',',')}`],
 [/^Main internal rectangle before finishes: (.*)$/,(_,v)=>`Vidinis plotas iki apdailos: ${v.replaceAll('.',',')}`],[/^Terrace: (.*)$/,(_,v)=>`Terasa: ${v.replaceAll('.',',')}`],
 [/^Canonical Python\/GH source · (.*)$/,(_,v)=>`Pagrindinis Python / GH scenarijus · ${v}`],
 [/^Model unavailable: (.*)$/,()=>`Modelio įkelti nepavyko. Atnaujinkite puslapį arba pasirinkite kitą konfigūraciją.`]
 ];
 let lang=localStorage.getItem('obtp-language')==='en'?'en':'lt';const history=new WeakMap();
 function apply(){document.documentElement.lang=lang;const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;while(n=walker.nextNode()){
  if(['SCRIPT','STYLE','OPTION'].includes(n.parentElement?.tagName)&&n.parentElement?.tagName!=='OPTION')continue;
  const prev=history.get(n),source=prev&&n.nodeValue===prev.target?prev.source:n.nodeValue,trim=source.trim();let translated=trim;
  if(lang==='lt'){translated=exact[trim]??trim;if(translated===trim)for(const [re,fn]of patterns)if(re.test(trim)){translated=trim.replace(re,fn);break;}}
  const target=source.replace(trim,translated);history.set(n,{source,target});if(n.nodeValue!==target)n.nodeValue=target;
 }const select=document.getElementById('language');if(select)select.value=lang;document.title=lang==='lt'?'OBTP · Modulių konfigūratorius':'OBTP · Module configurator';}
 window.OBTPLang={set(value){lang=value==='en'?'en':'lt';localStorage.setItem('obtp-language',lang);apply();window.dispatchEvent(new Event('obtp:language'));for(const frame of document.querySelectorAll('iframe'))frame.contentWindow?.OBTPLang?.set(lang);},get:()=>lang};
 new MutationObserver(apply).observe(document.body,{childList:true,subtree:true,characterData:true});apply();
})();
