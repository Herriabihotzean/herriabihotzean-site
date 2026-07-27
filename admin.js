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

    elements.iframe =
      document.getElementById(
        "reponse-admin"
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

    window.addEventListener(
      "message",
      traiterReponseAppsScript
    );
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

    elements.formulaire.target =
      "reponse-admin";

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

    minuterieConnexion =
      window.setTimeout(
        function () {

          if (
            !requeteConnexionEnCours
          ) {
            return;
          }

          requeteConnexionEnCours =
            false;

          elements.boutonConnexion.disabled =
            false;

          elements.boutonConnexion.textContent =
            traductions[
              langue
            ].connexion;

          afficherMessage(
            traductions[
              langue
            ].delaiDepasse,
            true
          );

        },
        20000
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

  function traiterReponseAppsScript(
    evenement
  ) {

    /*
     * Nous acceptons uniquement le message
     * provenant de NOTRE iframe.
     *
     * C'est plus robuste que de dépendre
     * du domaine Google exact utilisé
     * par HtmlService.
     */

    if (
      !elements.iframe ||
      evenement.source !==
        elements.iframe.contentWindow
    ) {
      return;
    }

    const donnees =
      evenement.data;

    if (
      !donnees ||
      typeof donnees !==
        "object" ||
      donnees.type !==
        "admin-login"
    ) {
      return;
    }

    requeteConnexionEnCours =
      false;

    window.clearTimeout(
      minuterieConnexion
    );

    elements.boutonConnexion.disabled =
      false;

    elements.boutonConnexion.textContent =
      traductions[
        langue
      ].connexion;

    /*
     * ÉCHEC
     */

    if (
      donnees.succes !== true
    ) {

      supprimerJeton();

      afficherMessage(
        nettoyerTexte(
          donnees.message
        ) ||
        traductions[
          langue
        ].erreurConnexion,
        true
      );

      /*
       * On efface uniquement le mot de passe.
       */

      elements.motDePasse.value =
        "";

      elements.motDePasse.focus();

      return;
    }

    /*
     * SUCCÈS
     */

    const jeton =
      nettoyerTexte(
        donnees.jeton
      );

    if (!jeton) {

      afficherMessage(
        traductions[
          langue
        ].erreurConnexion,
        true
      );

      return;
    }

    enregistrerJeton(
      jeton
    );

    /*
     * Le mot de passe disparaît immédiatement
     * du formulaire.
     */

    elements.motDePasse.value =
      "";

    afficherAdministration();
  }

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
