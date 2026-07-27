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
     *
     * Plus aucun paramètre de langue.
     */
    if (
      elements.retourAdmin
    ) {
      elements.retourAdmin.value =
        URL_ADMIN;
    }

    installerEvenements();


    /*
     * Apps Script peut nous renvoyer :
     *
     * #jeton=...
     *
     * ou
     *
     * #erreur=...
     */
    const retourTraite =
      traiterRetourConnexion();

    if (retourTraite) {
      return;
    }


    /*
     * Si la session existe déjà dans
     * cet onglet, on ouvre directement
     * l'administration.
     */
    if (
      lireJeton()
    ) {

      afficherAdministration();

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

    elements.listeProduits =
      document.getElementById(
        "liste-produits"
      );
    elements.chargementProduits =
  document.getElementById(
    "chargement-produits"
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


    /*
     * Toujours la même adresse de retour.
     */
    elements.retourAdmin.value =
      URL_ADMIN;


    /*
     * POST vers Apps Script.
     */
    elements.formulaire.action =
      apiUrl;

    elements.formulaire.method =
      "POST";

    elements.formulaire.target =
      "_top";


    elements.boutonConnexion.disabled =
      true;

    elements.boutonConnexion.textContent =
      "Connexion en cours…";


    afficherMessage(
      "Connexion en cours…",
      false
    );


    /*
     * Envoi natif.
     *
     * Le navigateur quitte admin.html
     * pour Apps Script.
     *
     * Après identification, Apps Script
     * affiche la page :
     *
     * « Connexion réussie »
     *
     * avec le bouton :
     *
     * « Accéder à l’administration »
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
   * RETOUR DE CONNEXION
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
     * On retire immédiatement le fragment
     * de la barre d'adresse.
     */
    window.history.replaceState(
      {},
      "",
      URL_ADMIN
    );


    /*
     * ========================================
     * SUCCÈS
     * ========================================
     */

    if (jeton) {

      enregistrerJeton(
        jeton
      );


      if (
        elements.motDePasse
      ) {

        elements.motDePasse.value =
          "";
      }


      afficherAdministration();

      return true;
    }


    /*
     * ========================================
     * ÉCHEC
     * ========================================
     */

    if (erreur) {

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

    if (donneesAdmin) {

  afficherAdministration();

  traiterRetourAdministration(
    donneesAdmin
  );

  return true;
}

    return false;
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

      if (
        elements.chargementProduits
      ) {
        elements.chargementProduits.textContent =
          donnees.message ||
          "Impossible de charger les produits.";
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

  } catch (_) {

    if (
      elements.chargementProduits
    ) {
      elements.chargementProduits.textContent =
        "Impossible de lire les données d’administration.";
    }
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

  return new TextDecoder(
    "utf-8"
  ).decode(
    octets
  );
}


function afficherProduits(
  produits
) {

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
      "Aucun produit trouvé.";

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

      const lignes = [
        "Stock : " +
          Number(
            produit.stockActuel || 0
          ),

        "Statut : " +
          (
            produit.statut ||
            "—"
          ),

        "Prix : " +
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

        "Poids : " +
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
  
  /*
   * ========================================
   * AFFICHAGE
   * ========================================
   */

  function afficherConnexion() {

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


  function afficherAdministration() {

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

  demanderProduits();
}


  /*
   * ========================================
   * DÉCONNEXION
   * ========================================
   */

  function deconnecter() {

    supprimerJeton();


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

  function demanderProduits() {

  const jeton =
    lireJeton();

  if (!jeton) {
    afficherConnexion();
    return;
  }

  const apiUrl =
    obtenirApiUrl();

  if (!apiUrl) {

    if (
      elements.chargementProduits
    ) {
      elements.chargementProduits.textContent =
        "L’adresse de l’API Apps Script est absente.";
    }

    return;
  }

  if (
    elements.chargementProduits
  ) {
    elements.chargementProduits.hidden =
      false;

    elements.chargementProduits.textContent =
      "Chargement des produits…";
  }

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
   * MESSAGES
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
