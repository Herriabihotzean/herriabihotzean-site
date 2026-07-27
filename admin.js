"use strict";

(function () {

  /*
   * ========================================
   * CONFIGURATION
   * ========================================
   */

  const CLE_LANGUE =
    "herria_langue";

  /*
   * Le jeton n'est volontairement PAS
   * stocké dans localStorage.
   *
   * sessionStorage disparaît lorsque
   * l'onglet / la session du navigateur
   * est fermé.
   */

  const CLE_SESSION_ADMIN =
    "herria_admin_session";

  const traductions = {

    fr: {
      titreDocument:
        "Administration — Herria Bihotzean",

      titrePage:
        "Administration",

      introduction:
        "Identifiez-vous pour accéder à l’administration de la boutique.",

      identifiant:
        "Identifiant",

      motDePasse:
        "Mot de passe",

      connexion:
        "Se connecter",

      connexionEnCours:
        "Connexion en cours…",

      connexionReussie:
        "Connexion réussie.",

      titreConnecte:
        "Administration ouverte",

      texteConnecte:
        "La connexion administrateur a réussi.",

      texteSession:
        "Votre session administrateur est active. Nous allons maintenant pouvoir ajouter les outils de gestion de la boutique.",

      deconnexion:
        "Se déconnecter",

      retour:
        "← Retour à l'accueil",

      champsObligatoires:
        "Veuillez renseigner votre identifiant et votre mot de passe.",

      apiAbsente:
        "L’adresse de l’API Apps Script est absente de config.js.",

      erreurConnexion:
        "La connexion administrateur a échoué.",

      delaiDepasse:
        "Apps Script n’a pas répondu. Veuillez réessayer."

      produits:
        "Produits et stocks",

      chargementProduits:
        "Chargement des produits…",

      aucunProduit:
        "Aucun produit n’a été trouvé.",

      stock:
        "Stock",

      statut:
        "Statut",

      prix:
        "Prix",

      poids:
        "Poids"
          },

    eu: {
      titreDocument:
        "Kudeaketa — Herria Bihotzean",

      titrePage:
        "Kudeaketa",

      introduction:
        "Identifika zaitez saltokiaren kudeaketan sartzeko.",

      identifiant:
        "Identifikatzailea",

      motDePasse:
        "Pasahitza",

      connexion:
        "Konektatu",

      connexionEnCours:
        "Konektatzen…",

      connexionReussie:
        "Konexioa egina da.",

      titreConnecte:
        "Kudeaketa irekia",

      texteConnecte:
        "Kudeatzailearen konexioa ongi egin da.",

      texteSession:
        "Zure kudeatzaile saioa aktibo da. Orain saltokia kudeatzeko tresnak gehitzen ahalko ditugu.",

      deconnexion:
        "Deskonektatu",

      retour:
        "← Harrerat itzuli",

      champsObligatoires:
        "Bete identifikatzailea eta pasahitza.",

      apiAbsente:
        "Apps Script APIaren helbidea ez da config.js fitxategian adierazia.",

      erreurConnexion:
        "Kudeatzailearen konexioak huts egin du.",

      delaiDepasse:
        "Apps Script-ek ez du erantzun. Saia zaitez berriz."

      produits:
        "Salgaiak eta stockak",

      chargementProduits:
        "Salgaiak kargatzen…",

      aucunProduit:
        "Ez da salgairik aurkitu.",

      stock:
        "Stocka",

      statut:
        "Egoera",

      prix:
        "Prezioa",

      poids:
        "Pisua"
    }
  };

  /*
   * ========================================
   * ÉTAT
   * ========================================
   */

  let langue =
    determinerLangueInitiale();

  let minuterieConnexion =
    null;

  let requeteConnexionEnCours =
    false;

  /*
   * ========================================
   * ÉLÉMENTS
   * ========================================
   */

  const elements = {};

  document.addEventListener(
    "DOMContentLoaded",
    initialiser
  );

  function initialiser() {

    memoriserElements();
    const champRetour =
  document.getElementById(
    "retour-admin"
  );

if (champRetour) {
  champRetour.value =
    window.location.origin +
    window.location.pathname +
    "?lang=" +
    encodeURIComponent(
      langue
    );
}

traiterRetourConnexion();
    const champOrigine =
      document.getElementById(
        "origine-admin"
      );

if (champOrigine) {
  champOrigine.value =
    window.location.origin;
}

    try {
      localStorage.setItem(
        CLE_LANGUE,
        langue
      );
    } catch (_) {}

    /*
     * Synchronisation avec le moteur
     * de langues du site.
     */

    if (
      typeof window.hbSetLanguage ===
      "function"
    ) {
      window.hbSetLanguage(
        langue,
        {
          silent: true
        }
      );
    }

    installerEvenements();

    appliquerLangue();

    /*
     * S'il existe déjà un jeton dans
     * sessionStorage, on affiche directement
     * le bloc administration.
     *
     * Nous le vérifierons réellement côté
     * serveur lors de la première action
     * d'administration.
     */

    elements.titreProduits.textContent =
      t.produits;

    if (
      elements.chargementProduits &&
      !elements.chargementProduits.hidden
    ) {
      elements.chargementProduits.textContent =
        t.chargementProduits;
    }
    
    const jeton =
      lireJeton();

    if (jeton) {
      afficherAdministration();
    } else {
      afficherConnexion();
    }
  }

  function memoriserElements() {

    elements.titrePage =
      document.getElementById(
        "titre-page"
      );

    elements.blocConnexion =
      document.getElementById(
        "bloc-connexion"
      );

    elements.formulaire =
      document.getElementById(
        "formulaire-connexion"
      );

    elements.introduction =
      document.getElementById(
        "introduction"
      );

    elements.labelIdentifiant =
      document.getElementById(
        "label-identifiant"
      );

    elements.identifiant =
      document.getElementById(
        "identifiant"
      );

    elements.labelMotDePasse =
      document.getElementById(
        "label-mot-de-passe"
      );

    elements.motDePasse =
      document.getElementById(
        "mot-de-passe"
      );

    elements.boutonConnexion =
      document.getElementById(
        "bouton-connexion"
      );

    elements.messageConnexion =
      document.getElementById(
        "message-connexion"
      );

    elements.blocAdministration =
      document.getElementById(
        "bloc-administration"
      );

    elements.titreConnecte =
      document.getElementById(
        "titre-connecte"
      );

    elements.texteConnecte =
      document.getElementById(
        "texte-connecte"
      );

    elements.texteSession =
      document.getElementById(
        "texte-session"
      );

    elements.boutonDeconnexion =
      document.getElementById(
        "bouton-deconnexion"
      );

    elements.lienRetour =
      document.getElementById(
        "lien-retour"
      );

    elements.tableauBord =
  document.getElementById(
    "tableau-bord"
  );

elements.titreProduits =
  document.getElementById(
    "titre-produits"
  );

elements.chargementProduits =
  document.getElementById(
    "chargement-produits"
  );

elements.listeProduits =
  document.getElementById(
    "liste-produits"
  );
  }

  /*
   * ========================================
   * LANGUE
   * ========================================
   */

  function determinerLangueInitiale() {

    const parametres =
      new URLSearchParams(
        window.location.search
      );

    const langueUrl =
      parametres.get(
        "lang"
      );

    if (
      langueUrl === "fr" ||
      langueUrl === "eu"
    ) {
      return langueUrl;
    }

    try {

      const memoire =
        localStorage.getItem(
          CLE_LANGUE
        );

      if (
        memoire === "eu"
      ) {
        return "eu";
      }

    } catch (_) {}

    return "fr";
  }

  function appliquerLangue() {

    const t =
      traductions[langue] ||
      traductions.fr;

    document.documentElement.lang =
      langue === "eu"
        ? "eu"
        : "fr";

    document.title =
      t.titreDocument;

    elements.titrePage.textContent =
      t.titrePage;

    elements.introduction.textContent =
      t.introduction;

    elements.labelIdentifiant.textContent =
      t.identifiant;

    elements.labelMotDePasse.textContent =
      t.motDePasse;

    if (
      !requeteConnexionEnCours
    ) {
      elements.boutonConnexion.textContent =
        t.connexion;
    }

    elements.titreConnecte.textContent =
      t.titreConnecte;

    elements.texteConnecte.textContent =
      t.texteConnecte;

    elements.texteSession.textContent =
      t.texteSession;

    elements.boutonDeconnexion.textContent =
      t.deconnexion;

    elements.lienRetour.textContent =
      t.retour;

    elements.lienRetour.href =
      "index.html?lang=" +
      encodeURIComponent(
        langue
      );
  }

  /*
   * ========================================
   * ÉVÉNEMENTS
   * ========================================
   */

  function installerEvenements() {

    document.addEventListener(
      "herria-language-change",
      function (evenement) {

        langue =
          evenement.detail &&
          evenement.detail.lang ===
            "eu"
            ? "eu"
            : "fr";

        try {
          localStorage.setItem(
            CLE_LANGUE,
            langue
          );
        } catch (_) {}

        mettreAJourAdresseLangue();

        appliquerLangue();
      }
    );

    elements.formulaire.addEventListener(
      "submit",
      traiterConnexion
    );

    elements.boutonDeconnexion.addEventListener(
      "click",
      deconnecter
    );

    /*
     * Réponse envoyée par Apps Script
     * depuis l'iframe invisible.
     */

    }

  function mettreAJourAdresseLangue() {

    const url =
      new URL(
        window.location.href
      );

    url.searchParams.set(
      "lang",
      langue
    );

    window.history.replaceState(
      {},
      "",
      url
    );
  }

  /*
   * ========================================
   * CONNEXION
   * ========================================
   */

  function traiterConnexion(
    evenement
  ) {

    evenement.preventDefault();

    if (
      requeteConnexionEnCours
    ) {
      return;
    }

    if (
      !elements.formulaire.checkValidity()
    ) {

      elements.formulaire.reportValidity();

      afficherMessage(
        traductions[
          langue
        ].champsObligatoires,
        true
      );

      return;
    }

    const apiUrl =
      window.HB_CONFIG &&
      window.HB_CONFIG.API_URL
        ? nettoyerTexte(
            window.HB_CONFIG.API_URL
          )
        : "";

    if (!apiUrl) {

      afficherMessage(
        traductions[
          langue
        ].apiAbsente,
        true
      );

      return;
    }

    /*
     * Le mot de passe n'est PAS mis
     * dans l'URL.
     *
     * Le formulaire est envoyé par POST
     * dans l'iframe invisible.
     */

    elements.formulaire.action =
      apiUrl;

    elements.formulaire.method =
      "POST";

    requeteConnexionEnCours =
      true;

    elements.boutonConnexion.disabled =
      true;

    elements.boutonConnexion.textContent =
      traductions[
        langue
      ].connexionEnCours;

    afficherMessage(
      traductions[
        langue
      ].connexionEnCours,
      false
    );

    /*
     * Sécurité d'interface :
     * si aucune réponse n'arrive après
     * 20 secondes, on réactive le formulaire.
     */

    window.clearTimeout(
      minuterieConnexion
    );

     /*
     * submit() natif :
     * évite de redéclencher l'événement
     * submit actuel.
     */

    HTMLFormElement
      .prototype
      .submit
      .call(
        elements.formulaire
      );
  }

  /*
   * ========================================
   * RÉPONSE APPS SCRIPT
   * ========================================
   */


  /*
   * ========================================
   * AFFICHAGE
   * ========================================
   */

  function afficherConnexion() {

    elements.blocConnexion.hidden =
      false;

    elements.blocAdministration.hidden =
      true;

    afficherMessage(
      "",
      false
    );
  }

  function afficherAdministration() {

    elements.blocConnexion.hidden =
      true;

    elements.blocAdministration.hidden =
      false;
  }

    if (
      !elements.listeProduits.dataset.charge
    ) {
      demanderProduits();
    }

function demanderProduits() {

  const jeton =
    lireJeton();

  if (!jeton) {
    afficherConnexion();
    return;
  }

  const apiUrl =
    window.HB_CONFIG &&
    window.HB_CONFIG.API_URL
      ? nettoyerTexte(
          window.HB_CONFIG.API_URL
        )
      : "";

  if (!apiUrl) {
    elements.chargementProduits.textContent =
      traductions[
        langue
      ].apiAbsente;

    return;
  }

  elements.chargementProduits.hidden =
    false;

  elements.chargementProduits.textContent =
    traductions[
      langue
    ].chargementProduits;

  /*
   * Création d'un formulaire POST temporaire.
   */

  const formulaire =
    document.createElement(
      "form"
    );

  formulaire.method =
    "POST";

  formulaire.action =
    apiUrl;

  formulaire.style.display =
    "none";

  ajouterChamp(
    formulaire,
    "type",
    "admin-produits"
  );

  ajouterChamp(
    formulaire,
    "jeton",
    jeton
  );

  ajouterChamp(
    formulaire,
    "retourAdmin",
    window.location.origin +
      window.location.pathname +
      "?lang=" +
      encodeURIComponent(
        langue
      )
  );

  document.body.appendChild(
    formulaire
  );

  formulaire.submit();
}

function ajouterChamp(
  formulaire,
  nom,
  valeur
) {

  const champ =
    document.createElement(
      "input"
    );

  champ.type =
    "hidden";

  champ.name =
    nom;

  champ.value =
    valeur;

  formulaire.appendChild(
    champ
  );
}



  function afficherMessage(
    message,
    erreur
  ) {

    elements.messageConnexion.textContent =
      message || "";

    if (!message) {

      elements.messageConnexion.className =
        "message";

      return;
    }

    elements.messageConnexion.className =
      erreur
        ? "message message-erreur"
        : "message message-succes";
  }

function traiterRetourConnexion() {

  const fragment =
    window.location.hash
      .replace(/^#/, "");

  if (!fragment) {
    return;
  }

  const parametresAdmin =
  new URLSearchParams(
    fragment
  );

const donneesAdmin =
  parametresAdmin.get(
    "admin"
  );

if (donneesAdmin) {

  window.history.replaceState(
    {},
    "",
    window.location.pathname +
    window.location.search
  );

  traiterRetourAdministration(
    donneesAdmin
  );

  return;
}

function traiterRetourAdministration(
  texte
) {

  try {

    const json =
      decoderBase64WebSafe(
        texte
      );

    const donnees =
      JSON.parse(
        json
      );

    if (
      donnees.succes !== true
    ) {

      elements.chargementProduits.hidden =
        false;

      elements.chargementProduits.textContent =
        donnees.message ||
        "Erreur.";

      return;
    }

    if (
      donnees.type ===
      "admin-produits"
    ) {
      afficherProduits(
        donnees.produits || []
      );
    }

  } catch (erreur) {

    elements.chargementProduits.hidden =
      false;

    elements.chargementProduits.textContent =
      "Impossible de lire les données d’administration.";
  }
}

function decoderBase64WebSafe(
  texte
) {

  let base64 =
    String(
      texte || ""
    )
      .replace(/-/g, "+")
      .replace(/_/g, "/");

  while (
    base64.length % 4
  ) {
    base64 += "=";
  }

  const binaire =
    atob(
      base64
    );

  const octets =
    Uint8Array.from(
      binaire,
      function (caractere) {
        return caractere.charCodeAt(0);
      }
    );

  return new TextDecoder()
    .decode(
      octets
    );
}

function afficherProduits(
  produits
) {

  elements.chargementProduits.hidden =
    true;

  elements.listeProduits.innerHTML =
    "";

  elements.listeProduits.dataset.charge =
    "1";

  if (
    !Array.isArray(
      produits
    ) ||
    produits.length === 0
  ) {

    elements.listeProduits.textContent =
      traductions[
        langue
      ].aucunProduit;

    return;
  }

  produits.forEach(
    function (produit) {

      const bloc =
        document.createElement(
          "article"
        );

      bloc.className =
        "produit-admin";

      const titre =
        document.createElement(
          "h3"
        );

      titre.textContent =
        produit.titre ||
        produit.id ||
        "Produit";

      bloc.appendChild(
        titre
      );

      const stock =
        Number(
          produit.stockActuel || 0
        );

      const lignes = [
        traductions[langue].stock +
          " : " +
          stock,

        traductions[langue].statut +
          " : " +
          (
            produit.statut ||
            "—"
          ),

        traductions[langue].prix +
          " : " +
          Number(
            produit.prix || 0
          ).toLocaleString(
            "fr-FR",
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }
          ) +
          " €",

        traductions[langue].poids +
          " : " +
          Number(
            produit.poids || 0
          ) +
          " g"
      ];

      lignes.forEach(
        function (texte) {

          const p =
            document.createElement(
              "p"
            );

          p.textContent =
            texte;

          bloc.appendChild(
            p
          );
        }
      );

      elements.listeProduits.appendChild(
        bloc
      );
    }
  );
}

  const parametres =
    new URLSearchParams(
      fragment
    );

  const jeton =
    nettoyerTexte(
      parametres.get(
        "jeton"
      )
    );

  const erreur =
    nettoyerTexte(
      parametres.get(
        "erreur"
      )
    );

  /*
   * On retire immédiatement le jeton
   * ou l'erreur de la barre d'adresse.
   */

  window.history.replaceState(
    {},
    "",
    window.location.pathname +
    window.location.search
  );

  if (jeton) {

    enregistrerJeton(
      jeton
    );

    afficherAdministration();

    return;
  }

  if (erreur) {

    supprimerJeton();

    let message =
      traductions[
        langue
      ].erreurConnexion;

    if (
      erreur ===
      "identifiants"
    ) {
      message =
        langue === "eu"
          ? "Identifikatzailea edo pasahitza ez da zuzena."
          : "Identifiant ou mot de passe incorrect.";
    }

    if (
      erreur ===
      "configuration"
    ) {
      message =
        langue === "eu"
          ? "Kudeatzailearen konexioa ez da konfiguratua."
          : "La connexion administrateur n’est pas configurée.";
    }

    if (
      erreur ===
      "champs"
    ) {
      message =
        traductions[
          langue
        ].champsObligatoires;
    }

    afficherConnexion();

    afficherMessage(
      message,
      true
    );
  }
}
  
  /*
   * ========================================
   * SESSION
   * ========================================
   */

  function enregistrerJeton(
    jeton
  ) {

    try {

      sessionStorage.setItem(
        CLE_SESSION_ADMIN,
        jeton
      );

    } catch (_) {}
  }

  function lireJeton() {

    try {

      return nettoyerTexte(
        sessionStorage.getItem(
          CLE_SESSION_ADMIN
        )
      );

    } catch (_) {

      return "";
    }
  }

  function supprimerJeton() {

    try {

      sessionStorage.removeItem(
        CLE_SESSION_ADMIN
      );

    } catch (_) {}
  }

  function deconnecter() {

    supprimerJeton();

    elements.identifiant.value =
      "";

    elements.motDePasse.value =
      "";

    afficherConnexion();

    elements.identifiant.focus();
  }

  /*
   * ========================================
   * OUTILS
   * ========================================
   */

  function nettoyerTexte(
    valeur
  ) {

    return String(
      valeur == null
        ? ""
        : valeur
    ).trim();
  }

})();
