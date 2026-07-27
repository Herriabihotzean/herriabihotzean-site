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
   * Le jeton de connexion reste uniquement
   * dans l'onglet actuel du navigateur.
   */
  const CLE_SESSION_ADMIN =
    "herria_admin_session";


  /*
   * ========================================
   * TRADUCTIONS
   * ========================================
   */

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
        "Votre session administrateur est active.",

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

      produits:
        "Produits et stocks",

      chargementProduits:
        "Chargement des produits…",

      aucunProduit:
        "Aucun produit n’a été trouvé.",

      erreurProduits:
        "Impossible de charger les produits.",

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
        "Zure kudeatzaile saioa aktibo da.",

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

      produits:
        "Salgaiak eta stockak",

      chargementProduits:
        "Salgaiak kargatzen…",

      aucunProduit:
        "Ez da salgairik aurkitu.",

      erreurProduits:
        "Ezin izan dira salgaiak kargatu.",

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

  let requeteConnexionEnCours =
    false;

  let demandeProduitsEnCours =
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


  /*
   * ========================================
   * INITIALISATION
   * ========================================
   */

  function initialiser() {

    memoriserElements();

    mettreAJourChampsTechniques();

    try {
      localStorage.setItem(
        CLE_LANGUE,
        langue
      );
    } catch (_) {}

    /*
     * Synchronisation avec langues.js.
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
     * Le retour d'Apps Script est prioritaire :
     *
     * #jeton=...
     * #erreur=...
     * #admin=...
     */
    const retourTraite =
      traiterRetourConnexion();

    if (retourTraite) {
      return;
    }

    /*
     * Pas de retour particulier :
     * on regarde si une session existe déjà.
     */
    const jeton =
      lireJeton();

    if (jeton) {

      afficherAdministration(
        true
      );

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

    elements.champRetour =
      document.getElementById(
        "retour-admin"
      );

    elements.champOrigine =
      document.getElementById(
        "origine-admin"
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

      const memorisee =
        localStorage.getItem(
          CLE_LANGUE
        );

      if (
        memorisee === "eu"
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

    if (elements.titrePage) {
      elements.titrePage.textContent =
        t.titrePage;
    }

    if (elements.introduction) {
      elements.introduction.textContent =
        t.introduction;
    }

    if (elements.labelIdentifiant) {
      elements.labelIdentifiant.textContent =
        t.identifiant;
    }

    if (elements.labelMotDePasse) {
      elements.labelMotDePasse.textContent =
        t.motDePasse;
    }

    if (
      elements.boutonConnexion &&
      !requeteConnexionEnCours
    ) {
      elements.boutonConnexion.textContent =
        t.connexion;
    }

    if (elements.titreConnecte) {
      elements.titreConnecte.textContent =
        t.titreConnecte;
    }

    if (elements.texteConnecte) {
      elements.texteConnecte.textContent =
        t.texteConnecte;
    }

    if (elements.texteSession) {
      elements.texteSession.textContent =
        t.texteSession;
    }

    if (elements.boutonDeconnexion) {
      elements.boutonDeconnexion.textContent =
        t.deconnexion;
    }

    if (elements.titreProduits) {
      elements.titreProduits.textContent =
        t.produits;
    }

    if (
      elements.chargementProduits &&
      !elements.chargementProduits.hidden &&
      demandeProduitsEnCours
    ) {
      elements.chargementProduits.textContent =
        t.chargementProduits;
    }

    if (elements.lienRetour) {

      elements.lienRetour.textContent =
        t.retour;

      elements.lienRetour.href =
        "index.html?lang=" +
        encodeURIComponent(
          langue
        );
    }

    mettreAJourChampsTechniques();
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

    /*
     * Le fragment éventuel n'est pas conservé.
     */
    url.hash =
      "";

    window.history.replaceState(
      {},
      "",
      url
    );

    mettreAJourChampsTechniques();
  }


  function mettreAJourChampsTechniques() {

    const retour =
      window.location.origin +
      window.location.pathname +
      "?lang=" +
      encodeURIComponent(
        langue
      );

    if (elements.champRetour) {
      elements.champRetour.value =
        retour;
    }

    /*
     * Ce champ est conservé car il existe
     * déjà dans admin.html.
     *
     * Le nouveau système de redirection
     * n'en dépend toutefois plus.
     */
    if (elements.champOrigine) {
      elements.champOrigine.value =
        window.location.origin;
    }
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
          evenement.detail.lang === "eu"
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

        /*
         * Si les produits sont déjà affichés,
         * on les redemande afin de reconstruire
         * leurs libellés dans la nouvelle langue.
         */
        if (
          elements.blocAdministration &&
          !elements.blocAdministration.hidden &&
          elements.listeProduits &&
          elements.listeProduits.dataset.charge ===
            "1"
        ) {

          elements.listeProduits.dataset.charge =
            "";

          demanderProduits();
        }
      }
    );


    if (elements.formulaire) {

      elements.formulaire.addEventListener(
        "submit",
        traiterConnexion
      );
    }


    if (elements.boutonDeconnexion) {

      elements.boutonDeconnexion.addEventListener(
        "click",
        deconnecter
      );
    }
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
      !elements.formulaire ||
      !elements.formulaire.checkValidity()
    ) {

      if (elements.formulaire) {
        elements.formulaire.reportValidity();
      }

      afficherMessage(
        traductions[
          langue
        ].champsObligatoires,
        true
      );

      return;
    }


    const apiUrl =
      obtenirApiUrl();

    if (!apiUrl) {

      afficherMessage(
        traductions[
          langue
        ].apiAbsente,
        true
      );

      return;
    }


    mettreAJourChampsTechniques();


    elements.formulaire.action =
      apiUrl;

    elements.formulaire.method =
      "POST";


    requeteConnexionEnCours =
      true;


    if (elements.boutonConnexion) {

      elements.boutonConnexion.disabled =
        true;

      elements.boutonConnexion.textContent =
        traductions[
          langue
        ].connexionEnCours;
    }


    afficherMessage(
      traductions[
        langue
      ].connexionEnCours,
      false
    );


    /*
     * Envoi POST normal :
     * le navigateur va sur Apps Script,
     * puis Apps Script le renvoie sur admin.html.
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
   * RETOURS APPS SCRIPT
   * ========================================
   */

  function traiterRetourConnexion() {

    const fragment =
      window.location.hash
        .replace(
          /^#/,
          ""
        );

    if (!fragment) {
      return false;
    }


    const parametres =
      new URLSearchParams(
        fragment
      );


    /*
     * ========================================
     * RETOUR DE CONNEXION
     * ========================================
     */

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
     * ========================================
     * RETOUR DES DONNÉES ADMIN
     * ========================================
     */

    const donneesAdmin =
      nettoyerTexte(
        parametres.get(
          "admin"
        )
      );


    /*
     * On nettoie immédiatement la barre
     * d'adresse.
     */
    window.history.replaceState(
      {},
      "",
      window.location.pathname +
      window.location.search
    );


    /*
     * Connexion réussie.
     */
    if (jeton) {

      enregistrerJeton(
        jeton
      );

      requeteConnexionEnCours =
        false;

      if (elements.motDePasse) {
        elements.motDePasse.value =
          "";
      }

      /*
       * true = il faut charger les produits.
       */
      afficherAdministration(
        true
      );

      return true;
    }


    /*
     * Connexion refusée.
     */
    if (erreur) {

      requeteConnexionEnCours =
        false;

      supprimerJeton();

      if (elements.boutonConnexion) {

        elements.boutonConnexion.disabled =
          false;

        elements.boutonConnexion.textContent =
          traductions[
            langue
          ].connexion;
      }

      if (elements.motDePasse) {
        elements.motDePasse.value =
          "";
      }


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

      if (elements.motDePasse) {
        elements.motDePasse.focus();
      }

      return true;
    }


    /*
     * Retour de admin-produits.
     */
    if (donneesAdmin) {

      /*
       * Le jeton doit toujours être présent
       * dans sessionStorage.
       */
      if (!lireJeton()) {

        afficherConnexion();

        afficherMessage(
          traductions[
            langue
          ].erreurConnexion,
          true
        );

        return true;
      }


      /*
       * On ouvre l'administration SANS
       * redemander immédiatement les produits.
       *
       * Sinon on créerait une boucle :
       * admin → Apps Script → admin → Apps Script…
       */
      afficherAdministration(
        false
      );

      traiterRetourAdministration(
        donneesAdmin
      );

      return true;
    }


    return false;
  }


  /*
   * ========================================
   * AFFICHAGE PRINCIPAL
   * ========================================
   */

  function afficherConnexion() {

    demandeProduitsEnCours =
      false;

    if (elements.blocConnexion) {
      elements.blocConnexion.hidden =
        false;
    }

    if (elements.blocAdministration) {
      elements.blocAdministration.hidden =
        true;
    }

    if (elements.boutonConnexion) {

      elements.boutonConnexion.disabled =
        false;

      elements.boutonConnexion.textContent =
        traductions[
          langue
        ].connexion;
    }
  }


  /*
   * chargerProduits :
   *
   * true  -> demande les produits au serveur
   * false -> affiche uniquement le tableau de bord
   */
  function afficherAdministration(
    chargerProduits
  ) {

    requeteConnexionEnCours =
      false;

    if (elements.blocConnexion) {
      elements.blocConnexion.hidden =
        true;
    }

    if (elements.blocAdministration) {
      elements.blocAdministration.hidden =
        false;
    }


    if (
      chargerProduits &&
      elements.listeProduits &&
      elements.listeProduits.dataset.charge !==
        "1" &&
      !demandeProduitsEnCours
    ) {

      demanderProduits();
    }
  }


  /*
   * ========================================
   * PRODUITS
   * ========================================
   */

  function demanderProduits() {

    if (demandeProduitsEnCours) {
      return;
    }


    const jeton =
      lireJeton();

    if (!jeton) {

      afficherConnexion();

      afficherMessage(
        traductions[
          langue
        ].erreurConnexion,
        true
      );

      return;
    }


    const apiUrl =
      obtenirApiUrl();

    if (!apiUrl) {

      if (elements.chargementProduits) {

        elements.chargementProduits.hidden =
          false;

        elements.chargementProduits.textContent =
          traductions[
            langue
          ].apiAbsente;
      }

      return;
    }


    demandeProduitsEnCours =
      true;


    if (elements.chargementProduits) {

      elements.chargementProduits.hidden =
        false;

      elements.chargementProduits.textContent =
        traductions[
          langue
        ].chargementProduits;
    }


    if (elements.listeProduits) {
      elements.listeProduits.innerHTML =
        "";
    }


    /*
     * Formulaire POST temporaire.
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
      obtenirAdresseRetourAdmin()
    );


    document.body.appendChild(
      formulaire
    );


    /*
     * Navigation normale vers Apps Script.
     * Celui-ci doit ensuite renvoyer vers
     * admin.html#admin=...
     */
    HTMLFormElement
      .prototype
      .submit
      .call(
        formulaire
      );
  }


  function traiterRetourAdministration(
    texte
  ) {

    demandeProduitsEnCours =
      false;


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
        !donnees ||
        donnees.succes !== true
      ) {

        if (elements.chargementProduits) {

          elements.chargementProduits.hidden =
            false;

          elements.chargementProduits.textContent =
            donnees &&
            donnees.message
              ? donnees.message
              : traductions[
                  langue
                ].erreurProduits;
        }

        /*
         * Si Apps Script indique que la
         * session a expiré, on supprime
         * le jeton local.
         */
        const message =
          donnees &&
          donnees.message
            ? String(
                donnees.message
              ).toLowerCase()
            : "";

        if (
          message.includes(
            "session"
          ) &&
          message.includes(
            "expir"
          )
        ) {

          supprimerJeton();

          window.setTimeout(
            function () {

              afficherConnexion();

              afficherMessage(
                donnees.message,
                true
              );

            },
            1000
          );
        }

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

      console.error(
        erreur
      );

      if (elements.chargementProduits) {

        elements.chargementProduits.hidden =
          false;

        elements.chargementProduits.textContent =
          traductions[
            langue
          ].erreurProduits;
      }
    }
  }


  function afficherProduits(
    produits
  ) {

    demandeProduitsEnCours =
      false;


    if (elements.chargementProduits) {
      elements.chargementProduits.hidden =
        true;
    }


    if (!elements.listeProduits) {
      return;
    }


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
          nettoyerTexte(
            produit.titre
          ) ||
          nettoyerTexte(
            produit.id
          ) ||
          (
            langue === "eu"
              ? "Salgaia"
              : "Produit"
          );


        bloc.appendChild(
          titre
        );


        const stock =
          convertirNombre(
            produit.stockActuel,
            0
          );


        const prix =
          convertirNombre(
            produit.prix,
            0
          );


        const poids =
          convertirNombre(
            produit.poids,
            0
          );


        ajouterLigneProduit(
          bloc,
          traductions[
            langue
          ].stock,
          String(
            stock
          ),
          stock
        );


        ajouterLigneProduit(
          bloc,
          traductions[
            langue
          ].statut,
          nettoyerTexte(
            produit.statut
          ) || "—"
        );


        ajouterLigneProduit(
          bloc,
          traductions[
            langue
          ].prix,
          formaterPrix(
            prix
          )
        );


        ajouterLigneProduit(
          bloc,
          traductions[
            langue
          ].poids,
          poids > 0
            ? poids + " g"
            : "—"
        );


        elements.listeProduits.appendChild(
          bloc
        );
      }
    );
  }


  function ajouterLigneProduit(
    bloc,
    etiquette,
    valeur,
    stock
  ) {

    const p =
      document.createElement(
        "p"
      );


    p.textContent =
      etiquette +
      " : " +
      valeur;


    if (
      typeof stock ===
        "number"
    ) {

      if (stock <= 0) {

        p.classList.add(
          "stock-nul"
        );

      } else if (
        stock <= 5
      ) {

        p.classList.add(
          "stock-faible"
        );
      }
    }


    bloc.appendChild(
      p
    );
  }


  /*
   * ========================================
   * CHAMPS DE FORMULAIRE TEMPORAIRES
   * ========================================
   */

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
      String(
        valeur == null
          ? ""
          : valeur
      );

    formulaire.appendChild(
      champ
    );
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

    requeteConnexionEnCours =
      false;

    demandeProduitsEnCours =
      false;


    if (elements.identifiant) {
      elements.identifiant.value =
        "";
    }


    if (elements.motDePasse) {
      elements.motDePasse.value =
        "";
    }


    if (elements.listeProduits) {

      elements.listeProduits.innerHTML =
        "";

      elements.listeProduits.dataset.charge =
        "";
    }


    if (elements.chargementProduits) {

      elements.chargementProduits.hidden =
        false;

      elements.chargementProduits.textContent =
        traductions[
          langue
        ].chargementProduits;
    }


    afficherConnexion();

    afficherMessage(
      "",
      false
    );


    if (elements.identifiant) {
      elements.identifiant.focus();
    }
  }


  /*
   * ========================================
   * MESSAGES
   * ========================================
   */

  function afficherMessage(
    message,
    erreur
  ) {

    if (!elements.messageConnexion) {
      return;
    }


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
   * OUTILS
   * ========================================
   */

  function obtenirApiUrl() {

    return (
      window.HB_CONFIG &&
      window.HB_CONFIG.API_URL
    )
      ? nettoyerTexte(
          window.HB_CONFIG.API_URL
        )
      : "";
  }


  function obtenirAdresseRetourAdmin() {

    return (
      window.location.origin +
      window.location.pathname +
      "?lang=" +
      encodeURIComponent(
        langue
      )
    );
  }


  function decoderBase64WebSafe(
    texte
  ) {

    let base64 =
      String(
        texte || ""
      )
        .replace(
          /-/g,
          "+"
        )
        .replace(
          /_/g,
          "/"
        );


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

          return caractere
            .charCodeAt(
              0
            );
        }
      );


    return new TextDecoder(
      "utf-8"
    ).decode(
      octets
    );
  }


  function formaterPrix(
    valeur
  ) {

    const nombre =
      convertirNombre(
        valeur,
        0
      );


    return new Intl.NumberFormat(
      "fr-FR",
      {
        style:
          "currency",

        currency:
          "EUR"
      }
    ).format(
      nombre
    );
  }


  function convertirNombre(
    valeur,
    valeurParDefaut
  ) {

    const nombre =
      Number(
        valeur
      );


    return Number.isFinite(
      nombre
    )
      ? nombre
      : valeurParDefaut;
  }


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
