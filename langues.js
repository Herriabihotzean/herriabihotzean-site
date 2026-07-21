"use strict";
const HB_KEY="herria_langue";
const HB_DEFAULT="fr";
const HB_HISTORY=false;
const HB_TRANSLATIONS={"eu":
  {"Boutique": "Saltokia",
   "La boutique permet d’accéder aux livres, drapeaux et autres objets proposés par Herria Bihotzean.": "Saltokiak Herria Bihotzeanek eskaintzen dituen liburu, bandera eta bertze gaietara heltzeko bidea emaiten du.",
   "Drapeaux": "Banderak",
   "Navarre": "Nabarra",
   "Labourd": "Lapurdi",
   "Soule": "Zibero", "Béarn": "Biarno",
   "Livres": "Liburuak",
   "Livres de langue basque":
     "Eskuarazko liburuak",
   "Recueils de prières": "Othoitz bildumak",
   "Autres": "Bertzeak",
   "Vêtements, objets et autres articles à venir.": "Jauntziak, gauzak eta bertze artikulu batzuek laster etorriko dira.",
   "Danse": "Dantza",
   "Cette rubrique présentera les danses traditionnelles, avec des textes, des photographies et, lorsque cela sera possible, des vidéos.": "Atal honek dantza tradizionalak aurkeztuko ditu, testu, argazki eta, ahal denean, bideoekin.",
   "Les premiers contenus seront ajoutés prochainement.": "Lehen edukiak laster gehituko dira.",
   "Histoire des Basques": "Eskualdunen istoria",
   "Cette rubrique accueillera un texte consacré à l’histoire des Basques, consultable et écoutable en français, en basque et en béarnais.": "Atal hunek Eskualdunen istoriari buruzko testu bat bilduko du, frantsesez, eskuaraz eta biarnesez irakurri eta entzun daitekeena.",
   "Version française": "Frantsesezko bertsioa",
   "Euskaraz": "Eskuaraz",
   "En béarnais": "Biarnesez",
   "Langue basque": "Eskualdunen hizkuntza",
   "Cette rubrique rassemble les principaux ouvrages et méthodes destinés à l’apprentissage et au perfectionnement de la langue basque.": "Atal honek eskuara ikasteko eta hobetzeko liburu eta metodo nagusiak biltzen ditu.",
   "Méthode active — 1er cours": "Metodo aktiboa — lehen ikaspena",
   "Méthode active — 2e cours": "Metodo aktiboa — bigarren ikaspena",
   "Voulez-vous parler basque ?": "Euskaraz mintzatu nahi duzu?",
   "Manuel de la conversation": "Esku-liburua mintzatzen ikasteko",
   "Pièces de théâtre de l’abbé Larzabal": "Larzabal apezaren antzerkiak",
   "Littérature": "Literatura",
   "Cette rubrique présentera des œuvres de la littérature basque, avec des enregistrements audio lorsque cela sera utile.": "Atal hunek eskual literaturako obrak ager-araziko ditu, baliagarri denean soinu-grabaketekin.",
   "Vies de saints du père Johanateguy": "Johanateguy aitaren sainduen bizitzak",
   "Musique": "Musika",
   "Cette rubrique accueillera des enregistrements, des partitions et des présentations consacrés à la musique du Pays basque.": "Atal honek Eskual Herriko musikari buruzko grabaketak, partiturak eta aurkezpenak bilduko ditu.",
   "Prières et cantiques": "Othoitzak eta kantikak",
   "Cette rubrique rassemble les prières usuelles et les cantiques traditionnels en basque et en béarnais.": "Atal hunek eskuarazko eta biarnesezko ohiko othoitzak eta kantika tradizionalak biltzen ditu.",
   "Basque": "Eskuara",
   "Prières usuelles": "Ohiko othoitzak",
   "Cantiques traditionnels": "Kantika tradizionalak",
   "Béarnais": "Biarnesa",
   "Symboles": "Ikurrak",
   "Cette rubrique sera consacrée aux emblèmes, aux blasons, aux drapeaux et aux autres symboles historiques du Pays basque.": "Atal hau Eskual Herriko ikur, armarri, bandera eta bertze sinbolo historikoei eskainia izanen da.",
   "Bienvenue sur le site herriabihotzean.fr, destiné à tous ceux qui aiment le Pays Basque et souhaitent perfectionner leur connaissance de notre belle petite patrie.": "Ongi etorri herriabihotzean.fr webgunean ! Webgune hau, Eskual Herria maite dutenentzat eta gure herri ederrako jakintza sakondu nahi dutenentzat xedatua izan da.",
   "Nous contacter": "Gurekin harremanetan jarri",
   "← Retour à l’accueil": "← Harrera-orrira itzuli",
   "© Herria Bihotzean": "© Herria Bihotzean"}};
const HB_LABELS={"fr": {"fr": "français", "eu": "basque", "be": "béarnais"}, "eu": {"fr": "frantsesez", "eu": "eskuaraz", "be": "biarnesez"}, "be": {"fr": "francés", "eu": "bascou", "be": "biarnés"}};

/* Moteur stable de sélection des langues — sans rechargement. */
(function () {
  "use strict";

  if (window.__HERRIA_LANGUAGE_ENGINE__) return;
  window.__HERRIA_LANGUAGE_ENGINE__ = true;

  const VALID_LANGUAGES = new Set(["fr", "eu", "be"]);
  const textOriginals = new WeakMap();
  const attributeOriginals = new WeakMap();
  let pageLanguage = null;
  let currentLanguage = "fr";
  let observer = null;
  let applying = false;

  function generalLanguage() {
    try {
      return localStorage.getItem(HB_KEY) === "eu" ? "eu" : "fr";
    } catch (_error) {
      return HB_DEFAULT || "fr";
    }
  }

  function lookup(original, language) {
    if (language === "fr") return original;
    const clean = String(original).trim();
    if (!clean) return original;
    const dictionary = (HB_TRANSLATIONS && HB_TRANSLATIONS[language]) || {};
    let translated = dictionary[clean];
    if (!translated) {
      const numbered = clean.match(/^(\d+\.\s*)(.+)$/);
      if (numbered && dictionary[numbered[2]]) {
        translated = numbered[1] + dictionary[numbered[2]];
      }
    }
    return translated ? String(original).replace(clean, translated) : original;
  }

  function rememberTextNode(node) {
    if (!textOriginals.has(node)) textOriginals.set(node, node.nodeValue || "");
  }

  function translateTextNode(node, language) {
    if (!node || !node.parentElement) return;
    if (["SCRIPT", "STYLE", "TEXTAREA", "NOSCRIPT"].includes(node.parentElement.tagName)) return;
    if (node.parentElement.closest(".language-switcher")) return;
    rememberTextNode(node);
    const original = textOriginals.get(node);
    const next = language === "fr" ? original : lookup(original, language);
    if (node.nodeValue !== next) node.nodeValue = next;
  }

  function translateAttributes(element, language) {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) return;
    const names = ["placeholder", "title", "aria-label", "alt"];
    let originals = attributeOriginals.get(element);
    if (!originals) {
      originals = {};
      attributeOriginals.set(element, originals);
    }
    for (const name of names) {
      if (!element.hasAttribute(name)) continue;
      if (!(name in originals)) originals[name] = element.getAttribute(name) || "";
      const original = originals[name];
      const next = language === "fr" ? original : lookup(original, language);
      if (element.getAttribute(name) !== next) element.setAttribute(name, next);
    }
  }

  function translateSubtree(root, language) {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) {
      translateTextNode(root, language);
      return;
    }
    if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE) return;
    const element = root.nodeType === Node.ELEMENT_NODE ? root : null;
    if (element) translateAttributes(element, language);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (node.nodeType === Node.TEXT_NODE) translateTextNode(node, language);
      else translateAttributes(node, language);
    }
  }

  function switchHistorySection(language) {
    if (!HB_HISTORY) return;
    document.querySelectorAll("[data-history-lang]").forEach((section) => {
      section.hidden = section.dataset.historyLang !== language;
    });
  }

  function updateButtons(language) {
    const labels = HB_LABELS[language] || HB_LABELS.fr;
    document.querySelectorAll(".language-choice").forEach((button) => {
      const code = button.dataset.lang;
      const label = button.querySelector(".language-label");
      if (label) label.textContent = labels[code] || "";
      const active = code === language;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
      button.setAttribute("aria-label", labels[code] || "");
    });
  }

  function buildSwitcher() {
    if (document.querySelector(".language-switcher")) return;
    const nav = document.createElement("nav");
    nav.className = "language-switcher";
    nav.setAttribute("aria-label", "Choix de la langue");
    const languages = HB_HISTORY ? ["fr", "eu", "be"] : ["fr", "eu"];
    const images = {
      fr: "blason-france.svg",
      eu: "blason-navarre.svg",
      be: "blason-bearn.svg"
    };
    for (const language of languages) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "language-choice";
      button.dataset.lang = language;
      const image = document.createElement("img");
      image.src = images[language];
      image.alt = "";
      const label = document.createElement("span");
      label.className = "language-label";
      button.append(image, label);
      button.addEventListener("click", () => setLanguage(language));
      nav.appendChild(button);
    }
    document.body.insertBefore(nav, document.body.firstChild);
  }

  function setLanguage(requestedLanguage, options = {}) {
    let language = VALID_LANGUAGES.has(requestedLanguage) ? requestedLanguage : "fr";
    if (!HB_HISTORY && language === "be") language = "fr";

    if (HB_HISTORY) {
      pageLanguage = language;
      if (language !== "be") {
        try { localStorage.setItem(HB_KEY, language); } catch (_error) {}
      }
    } else {
      try { localStorage.setItem(HB_KEY, language); } catch (_error) {}
    }

    currentLanguage = language;
    applying = true;
    switchHistorySection(language);
    translateSubtree(document.body, language);
    document.documentElement.lang = language === "eu" ? "eu" : language === "be" ? "oc" : "fr";
    updateButtons(language);
    applying = false;

    if (!options.silent) {
      document.dispatchEvent(new CustomEvent("herria-language-change", {
        detail: { lang: language }
      }));
    }
  }

  function startObserver() {
    observer = new MutationObserver((mutations) => {
      if (applying) return;
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) translateSubtree(node, currentLanguage);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function initialise() {
    buildSwitcher();
    const initial = HB_HISTORY ? generalLanguage() : generalLanguage();
    pageLanguage = initial;
    setLanguage(initial, { silent: true });
    startObserver();
  }

  window.HerriaLanguages = {
    setLanguage,
    getLanguage: () => currentLanguage,
    getGeneralLanguage: generalLanguage
  };
  window.hbSetLanguage = setLanguage;
  window.hbCurrentLanguage = () => currentLanguage;

  window.addEventListener("storage", (event) => {
    if (event.key !== HB_KEY || HB_HISTORY) return;
    setLanguage(event.newValue === "eu" ? "eu" : "fr");
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialise, { once: true });
  } else {
    initialise();
  }
})();
