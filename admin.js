"use strict";

(function () {

  /*
   * ========================================
   * CONFIGURATION
   * ========================================
   */

  const URL_ADMIN =
    "https://herriabihotzean.github.io/herriabihotzean-site/admin.html";


  const CLE_SESSION_ADMIN =
    "herria_admin_session";


  /*
   * ========================================
   * ÉTAT
   * ========================================
   */

  let demandeProduitsEnCours =
    false;


  /*
   * ========================================
   * ÉLÉMENTS
   * ========================================
   */

  const elements =
    {};


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


    /*
     * Adresse de retour fixe.
     */
    if (
      elements.retourAdmin
    ) {

      elements.retourAdmin.value =
        URL_ADMIN;
    }


    installerEvenements();


    /*
     * On traite d'abord un éventuel retour
     * d'Apps Script :
     *
     * #jeton=...
     * #erreur=...
     * #admin=...
     *
     * Si un retour est traité,
     * on NE poursuit PAS l'initialisation.
     */
    const retourTraite =
      traiterRetourAppsScript();


    if (
      retourTraite
    ) {

      return;
    }


    /*
     * Si la page est ouverte normalement
     * et qu'un jeton existe déjà,
     * on ouvre l'administration et
     * recharge les produits.
     */
    if (
      lireJeton()
    ) {

      afficherAdministration(
        true
      );

    } else {

      afficherConnexion();
    }
  }


  function memoriserElements() {

    elements.blocConnexion =
      document.getElementById(
        "bloc-connexion"
      );


    elements.formulaire =
      document.getElementById(
        "formulaire-connexion"
      );


    elements.retourAdmin =
      document.getElementById(
        "retour-admin"
      );


    elements.identifiant =
      document.getElementById(
        "identifiant"
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


    elements.boutonDeconnexion =
      document.getElementById(
        "bouton-deconnexion"
      );


    elements.chargementProduits =
      document.getElementById(
        "chargement-produits"
      );


    elements.listeProduits =
      document.getElementById(
        "liste-produits"
      );

    elements.adminIframe =
      document.getElementById(
        "admin-iframe"
      );
  }


  /*
   * ========================================
   * ÉVÉNEMENTS
   * ========================================
   */

  function installerEvenements() {

    if (
      elements.formulaire
    ) {

      elements.formulaire.addEventListener(
        "submit",
        traiterConnexion
      );
    }


    if (
      elements.boutonDeconnexion
    ) {

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
      !elements.formulaire ||
      !elements.formulaire.checkValidity()
    ) {

      if (
        elements.formulaire
      ) {

        elements.formulaire.reportValidity();
      }


      afficherMessage(
        "Veuillez renseigner votre identifiant et votre mot de passe.",
        true
      );


      return;
    }


    const apiUrl =
      obtenirApiUrl();


    if (!apiUrl) {

      afficherMessage(
        "L’adresse de l’API Apps Script est absente de config.js.",
        true
      );


      return;
    }


    elements.retourAdmin.value =
      URL_ADMIN;


    elements.formulaire.action =
      apiUrl;


    elements.formulaire.method =
      "POST";


    elements.formulaire.target =
      "_top";


    if (
      elements.boutonConnexion
    ) {

      elements.boutonConnexion.disabled =
        true;


      elements.boutonConnexion.textContent =
        "Connexion en cours…";
    }


    afficherMessage(
      "Connexion en cours…",
      false
    );


    /*
     * Envoi POST vers Apps Script.
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
   * RETOUR D'APPS SCRIPT
   * ========================================
   */

  function traiterRetourAppsScript() {

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


    const donneesAdmin =
      nettoyerTexte(
        parametres.get(
          "admin"
        )
      );


    /*
     * On retire immédiatement les données
     * de la barre d'adresse.
     *
     * IMPORTANT :
     * cela est fait APRÈS avoir lu
     * jeton / erreur / admin.
     */
    nettoyerAdresse();


    /*
     * ========================================
     * RETOUR DE CONNEXION RÉUSSIE
     * ========================================
     */

    if (
      jeton
    ) {

      enregistrerJeton(
        jeton
      );


      if (
        elements.motDePasse
      ) {

        elements.motDePasse.value =
          "";
      }


      /*
       * Connexion réussie :
       * on ouvre l'administration
       * ET on demande les produits.
       */
      afficherAdministration(
        true
      );


      return true;
    }


    /*
     * ========================================
     * RETOUR DE CONNEXION REFUSÉE
     * ========================================
     */

    if (
      erreur
    ) {

      supprimerJeton();


      let message =
        "La connexion administrateur a échoué.";


      if (
        erreur ===
        "identifiants"
      ) {

        message =
          "Identifiant ou mot de passe incorrect.";
      }


      if (
        erreur ===
        "configuration"
      ) {

        message =
          "La connexion administrateur n’est pas configurée.";
      }


      if (
        erreur ===
        "champs"
      ) {

        message =
          "Veuillez renseigner votre identifiant et votre mot de passe.";
      }


      afficherConnexion();


      afficherMessage(
        message,
        true
      );


      if (
        elements.motDePasse
      ) {

        elements.motDePasse.value =
          "";


        elements.motDePasse.focus();
      }


      return true;
    }


    /*
     * ========================================
     * RETOUR DES PRODUITS
     * ========================================
     */

    if (
      donneesAdmin
    ) {

      /*
       * On doit toujours posséder
       * le jeton enregistré lors
       * de la connexion.
       */
      if (
        !lireJeton()
      ) {

        afficherConnexion();


        afficherMessage(
          "Votre session administrateur n’est plus active. Veuillez vous reconnecter.",
          true
        );


        return true;
      }


      /*
       * IMPORTANT :
       *
       * false signifie :
       * NE PAS demander les produits,
       * puisqu'ils viennent justement
       * d'arriver.
       *
       * C'est ce qui empêche la boucle.
       */
      afficherAdministration(
        false
      );


      traiterRetourProduits(
        donneesAdmin
      );


      return true;
    }


    return false;
  }


  /*
   * ========================================
   * AFFICHAGE
   * ========================================
   */

  function afficherConnexion() {

    demandeProduitsEnCours =
      false;


    if (
      elements.blocConnexion
    ) {

      elements.blocConnexion.hidden =
        false;
    }


    if (
      elements.blocAdministration
    ) {

      elements.blocAdministration.hidden =
        true;
    }


    if (
      elements.boutonConnexion
    ) {

      elements.boutonConnexion.disabled =
        false;


      elements.boutonConnexion.textContent =
        "Se connecter";
    }
  }


  /*
   * chargerProduits :
   *
   * true :
   * on affiche puis on interroge Apps Script.
   *
   * false :
   * on affiche seulement l'administration.
   *
   * Au retour #admin=..., il faut IMPÉRATIVEMENT
   * utiliser false.
   */
  function afficherAdministration(
    chargerProduits
  ) {

    if (
      elements.blocConnexion
    ) {

      elements.blocConnexion.hidden =
        true;
    }


    if (
      elements.blocAdministration
    ) {

      elements.blocAdministration.hidden =
        false;
    }


    afficherMessage(
      "",
      false
    );


    if (
      chargerProduits === true
    ) {

      demanderProduits();
    }
  }


  /*
   * ========================================
   * DEMANDE DES PRODUITS
   * ========================================
   */

  function demanderProduits() {

    /*
     * Empêche deux demandes simultanées.
     */
    if (
      demandeProduitsEnCours
    ) {

      return;
    }


    const jeton =
      lireJeton();


    if (!jeton) {

      afficherConnexion();


      afficherMessage(
        "Votre session administrateur n’est plus active. Veuillez vous reconnecter.",
        true
      );


      return;
    }


    const apiUrl =
      obtenirApiUrl();


    if (!apiUrl) {

      afficherErreurProduits(
        "L’adresse de l’API Apps Script est absente de config.js."
      );


      return;
    }


    demandeProduitsEnCours =
      true;


    if (
      elements.chargementProduits
    ) {

      elements.chargementProduits.hidden =
        false;


      elements.chargementProduits.textContent =
        "Chargement des produits…";
    }


    if (
      elements.listeProduits
    ) {

      elements.listeProduits.innerHTML =
        "";
    }


    /*
     * Formulaire temporaire.
     */
    const formulaire =
      document.createElement(
        "form"
      );


    formulaire.method =
      "POST";


    formulaire.action =
      apiUrl;


    formulaire.target =
      "_top";


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
      URL_ADMIN
    );


    document.body.appendChild(
      formulaire
    );


    /*
     * Envoi natif.
     */
    HTMLFormElement
      .prototype
      .submit
      .call(
        formulaire
      );
  }


  /*
   * ========================================
   * RETOUR DES PRODUITS
   * ========================================
   */

  function traiterRetourProduits(
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


      /*
       * Apps Script a refusé la requête.
       */
      if (
        !donnees ||
        donnees.succes !== true
      ) {

        const message =
          donnees &&
          donnees.message
            ? String(
                donnees.message
              )
            : "Impossible de charger les produits.";


        afficherErreurProduits(
          message
        );


        /*
         * Si la session serveur a expiré,
         * le jeton local n'est plus valable.
         */
        if (
          message
            .toLowerCase()
            .includes(
              "session"
            )
        ) {

          supprimerJeton();
        }


        return;
      }


      /*
       * Nous attendons uniquement
       * admin-produits.
       */
      if (
        donnees.type !==
        "admin-produits"
      ) {

        afficherErreurProduits(
          "La réponse reçue n’est pas une liste de produits."
        );


        return;
      }


      afficherProduits(
        donnees.produits || []
      );


    } catch (erreur) {

      console.error(
        erreur
      );


      afficherErreurProduits(
        "Impossible de lire les données reçues d’Apps Script."
      );
    }
  }


  function comparerProduitsAdmin(
  a,
  b
) {

  const titreA =
    nettoyerTexte(
      a.titre
    );

  const titreB =
    nettoyerTexte(
      b.titre
    );

  const ordreDrapeaux = [
    "navarre 150",
    "navarre 100",
    "labourd 130",
    "labourd 100",
    "soule 130",
    "soule 100",
    "béarn 150",
    "béarn 100"
  ];


  const indexA =
    trouverDrapeau(
      titreA,
      ordreDrapeaux
    );

  const indexB =
    trouverDrapeau(
      titreB,
      ordreDrapeaux
    );


  /*
   * Aucun des deux n'est un drapeau :
   * ce sont les livres.
   * Classement alphabétique.
   */
  if (
    indexA === -1 &&
    indexB === -1
  ) {

    return titreA.localeCompare(
      titreB,
      "fr",
      {
        sensitivity: "base"
      }
    );
  }


  /*
   * A est un livre et B un drapeau :
   * A passe avant.
   */
  if (
    indexA === -1
  ) {
    return -1;
  }


  /*
   * B est un livre et A un drapeau :
   * B passe avant.
   */
  if (
    indexB === -1
  ) {
    return 1;
  }


  /*
   * Les deux sont des drapeaux :
   * ordre imposé ci-dessus.
   */
  return indexA - indexB;
}


function trouverDrapeau(
  titre,
  ordre
) {

  const texte =
    titre
      .toLocaleLowerCase(
        "fr"
      )
      .normalize(
        "NFD"
      )
      .replace(
        /[\u0300-\u036f]/g,
        ""
      );


  for (
    let i = 0;
    i < ordre.length;
    i++
  ) {

    const recherche =
      ordre[i]
        .normalize(
          "NFD"
        )
        .replace(
          /[\u0300-\u036f]/g,
          ""
        );


    if (
      texte.includes(
        recherche
      )
    ) {
      return i;
    }
  }


  return -1;
}
  

  /*
   * ========================================
   * AFFICHAGE DES PRODUITS
   * ========================================
   */

  function afficherProduits(
    produits
  ) {

    demandeProduitsEnCours =
      false;


    if (
      elements.chargementProduits
    ) {

      elements.chargementProduits.hidden =
        true;
    }


    if (
      !elements.listeProduits
    ) {

      return;
    }


    elements.listeProduits.innerHTML =
      "";


    if (
      !Array.isArray(
        produits
      ) ||
      produits.length === 0
    ) {

      elements.listeProduits.textContent =
        "Aucun produit n’a été trouvé.";


      return;
    }

    
const produitsTries =
  [...produits].sort(
    comparerProduitsAdmin
  );


produitsTries.forEach(
      function (produit) {

        const bloc =
          document.createElement(
            "article"
          );


        bloc.className =
          "produit-admin";


        /*
         * TITRE
         */
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
          "Produit";


        bloc.appendChild(
          titre
        );


        /*
         * STOCK
         */
        const stock =
          convertirNombre(
            produit.stockActuel,
            0
          );


        const ligneStock =
          document.createElement(
            "p"
          );


        ligneStock.textContent =
          "Stock : " +
          stock;


        if (
          stock <= 0
        ) {

          ligneStock.classList.add(
            "stock-nul"
          );

        } else if (
          stock <= 5
        ) {

          ligneStock.classList.add(
            "stock-faible"
          );
        }


        bloc.appendChild(
          ligneStock
        );


        /*
         * STATUT
         */
        ajouterLigneProduit(
          bloc,
          "Statut",
          nettoyerTexte(
            produit.statut
          ) || "—"
        );


        /*
         * PRIX
         */
        ajouterLigneProduit(
          bloc,
          "Prix",
          formaterPrix(
            convertirNombre(
              produit.prix,
              0
            )
          )
        );


        /*
         * POIDS
         */
        const poids =
          convertirNombre(
            produit.poids,
            0
          );


        ajouterLigneProduit(
          bloc,
          "Poids",
          poids > 0
            ? poids + " g"
            : "—"
        );


        /*
         * ID
         */
        ajouterLigneProduit(
          bloc,
          "Identifiant",
          nettoyerTexte(
            produit.id
          ) || "—"
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
    valeur
  ) {

    const ligne =
      document.createElement(
        "p"
      );


    ligne.textContent =
      etiquette +
      " : " +
      valeur;


    bloc.appendChild(
      ligne
    );
  }


  function afficherErreurProduits(
    message
  ) {

    demandeProduitsEnCours =
      false;


    if (
      elements.chargementProduits
    ) {

      elements.chargementProduits.hidden =
        false;


      elements.chargementProduits.textContent =
        message;
    }
  }


  /*
   * ========================================
   * FORMULAIRE TEMPORAIRE
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


  /*
   * ========================================
   * DÉCONNEXION
   * ========================================
   */

  function deconnecter() {

    supprimerJeton();


    demandeProduitsEnCours =
      false;


    if (
      elements.identifiant
    ) {

      elements.identifiant.value =
        "";
    }


    if (
      elements.motDePasse
    ) {

      elements.motDePasse.value =
        "";
    }


    if (
      elements.listeProduits
    ) {

      elements.listeProduits.innerHTML =
        "";
    }


    if (
      elements.chargementProduits
    ) {

      elements.chargementProduits.hidden =
        false;


      elements.chargementProduits.textContent =
        "Chargement des produits…";
    }


    afficherConnexion();


    afficherMessage(
      "",
      false
    );


    if (
      elements.identifiant
    ) {

      elements.identifiant.focus();
    }
  }


  /*
   * ========================================
   * MESSAGES DE CONNEXION
   * ========================================
   */

  function afficherMessage(
    message,
    erreur
  ) {

    if (
      !elements.messageConnexion
    ) {

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

    if (
      !window.HB_CONFIG ||
      !window.HB_CONFIG.API_URL
    ) {

      return "";
    }


    return nettoyerTexte(
      window.HB_CONFIG.API_URL
    );
  }


  function nettoyerAdresse() {

    window.history.replaceState(
      {},
      "",
      URL_ADMIN
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

          return caractere.charCodeAt(
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

    return new Intl.NumberFormat(
      "fr-FR",
      {
        style:
          "currency",

        currency:
          "EUR"
      }
    ).format(
      valeur
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
