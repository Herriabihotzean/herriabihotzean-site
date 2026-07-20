"use strict";
const HB_KEY="herria_langue";
const HB_DEFAULT="fr";
const HB_HISTORY=false;
const HB_TRANSLATIONS={"eu": {"Boutique": "Denda", "La boutique permet d’accéder aux livres, drapeaux et autres objets proposés par Herria Bihotzean.": "Dendak Herria Bihotzeanek eskaintzen dituen liburu, bandera eta bertze gaietara heltzeko bidea ematen du.", "Drapeaux": "Banderak", "Navarre": "Nafarroa", "Labourd": "Lapurdi", "Soule": "Zuberoa", "Béarn": "Biarnoa", "Livres": "Liburuak", "Livres de langue basque": "Euskarazko liburuak", "Recueils de prières": "Otoitz bildumak", "Autres": "Bertzeak", "Vêtements, objets et autres articles à venir.": "Jantziak, gauzak eta bertze artikulu batzuk laster etorriko dira.", "Danse": "Dantza", "Cette rubrique présentera les danses traditionnelles, avec des textes, des photographies et, lorsque cela sera possible, des vidéos.": "Atal honek dantza tradizionalak aurkeztuko ditu, testu, argazki eta, ahal denean, bideoekin.", "Les premiers contenus seront ajoutés prochainement.": "Lehen edukiak laster gehituko dira.", "Histoire des Basques": "Eskualdunen istoria", "Cette rubrique accueillera un texte consacré à l’histoire des Basques, consultable et écoutable en français, en basque et en béarnais.": "Atal honek Eskualdunen historiari buruzko testu bat bilduko du, frantsesez, eskuaraz eta biarnesez irakurri eta entzun daitekeena.", "Version française": "Frantsesezko bertsioa", "Euskaraz": "Eskuaraz", "En béarnais": "Biarnesez", "Langue basque": "Eskuar hizkuntza", "Cette rubrique rassemble les principaux ouvrages et méthodes destinés à l’apprentissage et au perfectionnement de la langue basque.": "Atal honek eskuara ikasteko eta hobetzeko liburu eta metodo nagusiak biltzen ditu.", "Méthode active — 1er cours": "Metodo aktiboa — lehen ikastaldia", "Méthode active — 2e cours": "Metodo aktiboa — bigarren ikastaldia", "Voulez-vous parler basque ?": "Euskaraz mintzatu nahi duzu?", "Manuel de la conversation": "Mintzatzeko esku-liburua", "Pièces de théâtre de l’abbé Larzabal": "Larzabal apezaren antzerkiak", "Littérature": "Literatura", "Cette rubrique présentera des œuvres de la littérature basque, avec des enregistrements audio lorsque cela sera utile.": "Atal honek euskal literaturako obrak aurkeztuko ditu, baliagarri denean soinu-grabaketekin.", "Vies de saints du père Johanateguy": "Johanateguy aitaren sainduen bizitzak", "Musique": "Musika", "Cette rubrique accueillera des enregistrements, des partitions et des présentations consacrés à la musique du Pays basque.": "Atal honek Eskual Herriko musikari buruzko grabaketak, partiturak eta aurkezpenak bilduko ditu.", "Prières et cantiques": "Otoitzak eta kantikak", "Cette rubrique rassemble les prières usuelles et les cantiques traditionnels en basque et en béarnais.": "Atal honek eskuarazko eta biarnesezko ohiko otoitzak eta kantika tradizionalak biltzen ditu.", "Basque": "Eskuara", "Prières usuelles": "Ohiko otoitzak", "Cantiques traditionnels": "Kantika tradizionalak", "Béarnais": "Biarnesa", "Symboles": "Ikurrak", "Cette rubrique sera consacrée aux emblèmes, aux blasons, aux drapeaux et aux autres symboles historiques du Pays basque.": "Atal hau Eskual Herriko ikur, armarri, bandera eta bertze sinbolo historikoei eskainia izanen da.", "Bienvenue sur le site herriabihotzean.fr, destiné à tous ceux qui aiment le Pays Basque et souhaitent perfectionner leur connaissance de notre belle petite patrie.": "Ongi etorri herriabihotzean.fr webgunera, Eskual Herria maite duten eta gure herri ederra hobeki ezagutu nahi duten guziei zuzendua.", "Nous contacter": "Gurekin harremanetan jarri", "← Retour à l’accueil": "← Harrera-orrira itzuli", "© Herria Bihotzean": "© Herria Bihotzean"}};
const HB_LABELS={"fr": {"fr": "français", "eu": "basque", "be": "béarnais"}, "eu": {"fr": "frantsesez", "eu": "eskuaraz", "be": "biarnesez"}, "be": {"fr": "francés", "eu": "bascou", "be": "biarnés"}};
function hbGeneralLanguage(){const l=localStorage.getItem(HB_KEY);return l==="eu"?"eu":"fr";}
function hbCurrentLanguage(){if(HB_HISTORY){const s=sessionStorage.getItem("herria_histoire_langue");if(["fr","eu","be"].includes(s))return s;}return hbGeneralLanguage();}
function hbLookup(text,lang){if(lang==="fr")return text;const clean=text.trim();const dict=HB_TRANSLATIONS[lang]||{};if(dict[clean])return text.replace(clean,dict[clean]);const m=clean.match(/^(\d+\.\s*)(.+)$/);if(m&&dict[m[2]])return text.replace(clean,m[1]+dict[m[2]]);return text;}
function hbTranslateNode(root=document.body,lang=hbCurrentLanguage()){
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
 nodes.forEach(n=>{if(!n.parentElement||["SCRIPT","STYLE","TEXTAREA"].includes(n.parentElement.tagName))return;if(n.parentElement.closest('.language-switcher'))return;const original=n.__hbOriginal??n.nodeValue;n.__hbOriginal=original;n.nodeValue=lang==="fr"?original:hbLookup(original,lang);});
 root.querySelectorAll?.('[placeholder],[title],[aria-label],[alt]').forEach(el=>{for(const a of ['placeholder','title','aria-label','alt']){if(!el.hasAttribute(a))continue;const k='hbOriginal'+a;el.dataset[k]=el.dataset[k]||el.getAttribute(a);el.setAttribute(a,lang==="fr"?el.dataset[k]:hbLookup(el.dataset[k],lang));}});
 document.documentElement.lang=lang==="eu"?"eu":lang==="be"?"oc":"fr";
 const t=document.querySelector('title');if(t){t.dataset.hbOriginal=t.dataset.hbOriginal||t.textContent;t.textContent=lang==="fr"?t.dataset.hbOriginal:hbLookup(t.dataset.hbOriginal,lang);}
}
function hbBuildSwitcher(){
 if(document.querySelector('.language-switcher'))return;
 const lang=hbCurrentLanguage();
 const nav=document.createElement('nav');
 nav.className='language-switcher';
 nav.setAttribute('aria-label','Choix de la langue');
 const langs=HB_HISTORY?['fr','eu','be']:['fr','eu'];
 const imgs={fr:'blason-france.svg',eu:'blason-navarre.svg',be:'blason-bearn.svg'};
 for(const l of langs){
  const b=document.createElement('button');
  b.type='button';
  b.className='language-choice';
  b.dataset.lang=l;
  const image=document.createElement('img');
  image.src=imgs[l];
  image.alt='';
  const label=document.createElement('span');
  label.className='language-label';
  label.textContent=HB_LABELS[lang][l];
  b.append(image,label);
  b.addEventListener('click',()=>hbSetLanguage(l));
  nav.appendChild(b);
 }
 document.body.insertBefore(nav,document.body.firstChild);
}
function hbUpdateButtons(lang){
 const labels=HB_LABELS[lang]||HB_LABELS.fr;
 document.querySelectorAll('.language-choice').forEach(b=>{
  const label=b.querySelector('.language-label');
  if(label)label.textContent=labels[b.dataset.lang]||'';
  b.classList.toggle('active',b.dataset.lang===lang);
  b.setAttribute('aria-pressed',b.dataset.lang===lang?'true':'false');
  b.setAttribute('aria-label',labels[b.dataset.lang]||'');
 });
}
function hbSetLanguage(lang){if(HB_HISTORY){sessionStorage.setItem('herria_histoire_langue',lang);if(lang!=='be')localStorage.setItem(HB_KEY,lang);document.querySelectorAll('[data-history-lang]').forEach(s=>s.hidden=s.dataset.historyLang!==lang);}else{localStorage.setItem(HB_KEY,lang);}hbTranslateNode(document.body,lang);hbUpdateButtons(lang);document.dispatchEvent(new CustomEvent('herria-language-change',{detail:{lang}}));}
document.addEventListener('DOMContentLoaded',()=>{hbBuildSwitcher();let lang=hbCurrentLanguage();if(HB_HISTORY)document.querySelectorAll('[data-history-lang]').forEach(s=>s.hidden=s.dataset.historyLang!==lang);hbTranslateNode(document.body,lang);hbUpdateButtons(lang);const obs=new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes)if(n.nodeType===1||n.nodeType===3)hbTranslateNode(n.nodeType===1?n:n.parentElement,lang);});obs.observe(document.body,{childList:true,subtree:true});document.addEventListener('herria-language-change',e=>lang=e.detail.lang);});
