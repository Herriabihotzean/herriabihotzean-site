"use strict";
const HB_KEY = "herria_langue";
const HB_TRANSLATIONS = {"eu": {"Boutique": "Denda", "La boutique permet d’accéder aux livres, drapeaux et autres objets proposés par Herria Bihotzean.": "Dendak Herria Bihotzeanek eskaintzen dituen liburu, bandera eta bertze gaietara heltzeko bidea ematen du.", "Drapeaux": "Banderak", "Navarre": "Nafarroa", "Labourd": "Lapurdi", "Soule": "Zuberoa", "Béarn": "Biarnoa", "Livres": "Liburuak", "Livres de langue basque": "Euskarazko liburuak", "Recueils de prières": "Otoitz bildumak", "Autres": "Bertzeak", "Vêtements, objets et autres articles à venir.": "Jantziak, gauzak eta bertze artikulu batzuk laster etorriko dira.", "Danse": "Dantza", "Cette rubrique présentera les danses traditionnelles, avec des textes, des photographies et, lorsque cela sera possible, des vidéos.": "Atal honek dantza tradizionalak aurkeztuko ditu, testu, argazki eta, ahal denean, bideoekin.", "Les premiers contenus seront ajoutés prochainement.": "Lehen edukiak laster gehituko dira.", "Histoire des Basques": "Eskualdunen istoria", "Cette rubrique accueillera un texte consacré à l’histoire des Basques, consultable et écoutable en français, en basque et en béarnais.": "Atal honek Eskualdunen historiari buruzko testu bat bilduko du, frantsesez, eskuaraz eta biarnesez irakurri eta entzun daitekeena.", "Version française": "Frantsesezko bertsioa", "Euskaraz": "Eskuaraz", "En béarnais": "Biarnesez", "Langue basque": "Eskuar hizkuntza", "Cette rubrique rassemble les principaux ouvrages et méthodes destinés à l’apprentissage et au perfectionnement de la langue basque.": "Atal honek eskuara ikasteko eta hobetzeko liburu eta metodo nagusiak biltzen ditu.", "Méthode active — 1er cours": "Metodo aktiboa — lehen ikastaldia", "Méthode active — 2e cours": "Metodo aktiboa — bigarren ikastaldia", "Voulez-vous parler basque ?": "Euskaraz mintzatu nahi duzu?", "Manuel de la conversation": "Mintzatzeko esku-liburua", "Pièces de théâtre de l’abbé Larzabal": "Larzabal apezaren antzerkiak", "Littérature": "Literatura", "Cette rubrique présentera des œuvres de la littérature basque, avec des enregistrements audio lorsque cela sera utile.": "Atal honek euskal literaturako obrak aurkeztuko ditu, baliagarri denean soinu-grabaketekin.", "Vies de saints du père Johanateguy": "Johanateguy aitaren sainduen bizitzak", "Musique": "Musika", "Cette rubrique accueillera des enregistrements, des partitions et des présentations consacrés à la musique du Pays basque.": "Atal honek Eskual Herriko musikari buruzko grabaketak, partiturak eta aurkezpenak bilduko ditu.", "Prières et cantiques": "Otoitzak eta kantikak", "Cette rubrique rassemble les prières usuelles et les cantiques traditionnels en basque et en béarnais.": "Atal honek eskuarazko eta biarnesezko ohiko otoitzak eta kantika tradizionalak biltzen ditu.", "Basque": "Eskuara", "Prières usuelles": "Ohiko otoitzak", "Cantiques traditionnels": "Kantika tradizionalak", "Béarnais": "Biarnesa", "Symboles": "Ikurrak", "Cette rubrique sera consacrée aux emblèmes, aux blasons, aux drapeaux et aux autres symboles historiques du Pays basque.": "Atal hau Eskual Herriko ikur, armarri, bandera eta bertze sinbolo historikoei eskainia izanen da.", "Bienvenue sur le site herriabihotzean.fr, destiné à tous ceux qui aiment le Pays Basque et souhaitent perfectionner leur connaissance de notre belle petite patrie.": "Ongi etorri herriabihotzean.fr webgunera, Eskual Herria maite duten eta gure herri ederra hobeki ezagutu nahi duten guziei zuzendua.", "Nous contacter": "Gurekin harremanetan jarri", "← Retour à l’accueil": "← Harrera-orrira itzuli", "© Herria Bihotzean": "© Herria Bihotzean"}};
const HB_LABELS = {"fr": {"fr": "français", "eu": "basque", "be": "béarnais"}, "eu": {"fr": "frantsesez", "eu": "eskuaraz", "be": "biarnesez"}, "be": {"fr": "francés", "eu": "bascou", "be": "biarnés"}};
const HB_LANGUAGES = ["fr", "eu"];
let hbLanguage = "fr";
const hbOriginalText = new WeakMap();
const hbOriginalAttributes = new WeakMap();

function hbStoredLanguage() {
  return localStorage.getItem(HB_KEY) === "eu" ? "eu" : "fr";
}

function hbLookup(text, language) {
  if (language === "fr") return text;
  const clean = text.trim();
  const dictionary = HB_TRANSLATIONS[language] || {};
  let translated = dictionary[clean];
  if (!translated) {
    const numbered = clean.match(/^(\d+\.\s*)(.+)$/);
    if (numbered && dictionary[numbered[2]]) translated = numbered[1] + dictionary[numbered[2]];
  }
  return translated ? text.replace(clean, translated) : text;
}

function hbTranslateElement(root, language) {
  if (!root) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);
  textNodes.forEach(node => {
    const parent = node.parentElement;
    if (!parent || parent.closest(".language-switcher") || ["SCRIPT","STYLE","TEXTAREA"].includes(parent.tagName)) return;
    if (!hbOriginalText.has(node)) hbOriginalText.set(node, node.nodeValue);
    const original = hbOriginalText.get(node);
    node.nodeValue = language === "fr" ? original : hbLookup(original, language);
  });

  if (root.querySelectorAll) {
    root.querySelectorAll("[placeholder],[title],[aria-label],[alt]").forEach(element => {
      if (element.closest(".language-switcher")) return;
      let originals = hbOriginalAttributes.get(element);
      if (!originals) { originals = {}; hbOriginalAttributes.set(element, originals); }
      ["placeholder","title","aria-label","alt"].forEach(attribute => {
        if (!element.hasAttribute(attribute)) return;
        if (!(attribute in originals)) originals[attribute] = element.getAttribute(attribute);
        const original = originals[attribute];
        element.setAttribute(attribute, language === "fr" ? original : hbLookup(original, language));
      });
    });
  }

  document.documentElement.lang = language === "eu" ? "eu" : "fr";
  const title = document.querySelector("title");
  if (title) {
    if (!title.dataset.hbOriginal) title.dataset.hbOriginal = title.textContent;
    title.textContent = language === "fr" ? title.dataset.hbOriginal : hbLookup(title.dataset.hbOriginal, language);
  }
}

function hbUpdateLanguageButtons(language) {
  const labels = HB_LABELS[language] || HB_LABELS.fr;
  document.querySelectorAll(".language-choice").forEach(button => {
    const code = button.dataset.lang;
    const label = button.querySelector(".language-label");
    if (label) label.textContent = labels[code] || "";
    const active = code === language;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
    button.setAttribute("aria-label", labels[code] || "");
  });
}

function hbSetLanguage(language, save = true) {
  hbLanguage = language === "eu" ? "eu" : "fr";
  if (save) localStorage.setItem(HB_KEY, hbLanguage);
  hbTranslateElement(document.body, hbLanguage);
  hbUpdateLanguageButtons(hbLanguage);
  document.dispatchEvent(new CustomEvent("herria-language-change", { detail: { lang: hbLanguage } }));
}

function hbBuildLanguageSwitcher() {
  if (document.querySelector(".language-switcher")) return;
  const nav = document.createElement("nav");
  nav.className = "language-switcher";
  nav.setAttribute("aria-label", "Choix de la langue");
  const images = { fr: "blason-france.svg", eu: "blason-navarre.svg" };
  HB_LANGUAGES.forEach(code => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "language-choice";
    button.dataset.lang = code;
    button.innerHTML = `<img src="${images[code]}" alt=""><span class="language-label"></span>`;
    button.addEventListener("click", () => hbSetLanguage(code));
    nav.appendChild(button);
  });
  document.body.insertBefore(nav, document.body.firstChild);
}

document.addEventListener("DOMContentLoaded", () => {
  hbLanguage = hbStoredLanguage();
  hbBuildLanguageSwitcher();
  hbSetLanguage(hbLanguage, false);

  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => mutation.addedNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) hbTranslateElement(node, hbLanguage);
      else if (node.nodeType === Node.TEXT_NODE && node.parentElement) hbTranslateElement(node.parentElement, hbLanguage);
    }));
    hbUpdateLanguageButtons(hbLanguage);
  });
  observer.observe(document.body, { childList: true, subtree: true });

  window.addEventListener("storage", event => {
    if (event.key === HB_KEY) hbSetLanguage(event.newValue === "eu" ? "eu" : "fr", false);
  });
});
