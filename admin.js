"use strict";

(function () {

  /*
   * =========================================================
   * CONFIGURATION
   * =========================================================
   */

  const URL_ADMIN =
    "https://herriabihotzean.github.io/herriabihotzean-site/admin.html";

  const CLE_SESSION_ADMIN =
    "herria_admin_session";


  /*
   * =========================================================
   * ÉTAT
   * =========================================================
   */

  let demandeProduitsEnCours = false;

  let produitReapprovisionnement = null;


  /*
   * =========================================================
   * ÉLÉMENTS
   * =========================================================
   */

  const elements = {};


  document.addEventListener(
    "DOMContentLoaded",
    initialiser
  );


  /*
   * =========================================================
   * INITIALISATION
   * =========================================================
   */

  function initialiser() {

    memoriserElements();

    if (elements.retourAdmin) {
      elements.retourAdmin.value =
        URL_ADMIN;
    }

    installerEvenements();

    /*
     * La connexion continue à revenir avec :
     *
     * #jeton=...
     * #erreur=...
     *
     * On conserve aussi la lecture de #admin=...
     * pour compatibilité avec l'ancien système.
     */
    const retourTraite =
      traiterRetourAppsScript();

    if (retourTraite) {
      return;
    }

    if (lireJeton()) {

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

    /*
     * Iframe invisible utilisée pour les opérations
     * d'administration sans quitter admin.html.
     */
    elements.adminIframe =
      document.getElementById(
        "admin-iframe"
      );

    /*
     * Fenêtre de réapprovisionnement.
     */
    elements.fondReapprovisionnement =
      document.getElementById(
        "fond-reapprovisionnement"
      );

    elements.formulaireReapprovisionnement =
      document.getElementById(
        "formulaire-reapprovisionnement"
      );

    elements.nomProduitReapprovisionnement =
      document.getElementById(
        "nom-produit-reapprovisionnement"
      );

    elements.stockProduitReapprovisionnement =
      document.getElementById(
        "stock-produit-reapprovisionnement"
      );

    elements.quantiteReapprovisionnement =
      document.getElementById(
        "quantite-reapprovisionnement"
      );

    elements.coutReapprovisionnement =
      document.getElementById(
        "cout-reapprovisionnement"
      );

    elements.observationReapprovisionnement =
      document.getElementById(
        "observation-reapprovisionnement"
      );

    elements.messageReapprovisionnement =
      document.getElementById(
        "message-reapprovisionnement"
      );

    elements.annulerReapprovisionnement =
      document.getElementById(
        "annuler-reapprovisionnement"
      );

    elements.validerReapprovisionnement =
      document.getElementById(
        "valider-reapprovisionnement"
      );
  }


  /*
   * =========================================================
   * ÉVÉNEMENTS
   * =========================================================
   */

  function installerEvenements() {

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


    if (
      elements.annulerReapprovisionnement
    ) {

      elements.annulerReapprovisionnement.addEventListener(
        "click",
        fermerReapprovisionnement
      );
    }


    if (
      elements.formulaireReapprovisionnement
    ) {

      elements.formulaireReapprovisionnement.addEventListener(
        "submit",
        envoyerReapprovisionnement
      );
    }


    /*
     * Clic sur le fond sombre :
     * ferme la fenêtre.
     */
    if (
      elements.fondReapprovisionnement
    ) {

      elements.fondReapprovisionnement.addEventListener(
        "click",
        function (evenement) {

          if (
            evenement.target ===
            elements.fondReapprovisionnement
          ) {

            fermerReapprovisionnement();
          }
        }
      );
    }


    /*
     * Échap ferme également la fenêtre.
     */
    document.addEventListener(
      "keydown",
      function (evenement) {

        if (
          evenement.key === "Escape" &&
          elements.fondReapprovisionnement &&
          !elements.fondReapprovisionnement.hidden
        ) {

          fermerReapprovisionnement();
        }
      }
    );


    /*
     * Réponses provenant de l'iframe Apps Script.
     */
    window.addEventListener(
      "message",
      traiterMessageAdministration
    );
  }


  /*
   * =========================================================
   * RÉPONSES DE L'IFRAME APPS SCRIPT
   * =========================================================
   */

  function traiterMessageAdministration(
    evenement
  ) {

    /*
     * On n'accepte que les réponses Google.
     */
    const origine =
      String(
        evenement.origin || ""
      );

    const origineGoogle =
      origine ===
        "https://script.google.com" ||
      origine.endsWith(
        ".googleusercontent.com"
      );

    if (!origineGoogle) {
      return;
    }


    const donnees =
      evenement.data;

    if (
      !donnees ||
      typeof donnees !== "object"
    ) {

      return;
    }


    /*
     * ---------------------------------------------------------
     * LISTE DES PRODUITS
     * ---------------------------------------------------------
     */

    if (
      donnees.type ===
      "admin-produits"
    ) {

      demandeProduitsEnCours =
        false;


      if (
        donnees.succes !== true
      ) {

        const message =
          donnees.message
            ? String(
                donnees.message
              )
            : "Impossible de charger les produits.";


        afficherErreurProduits(
          message
        );


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


      afficherProduits(
        donnees.produits || []
      );


      return;
    }


    /*
     * ---------------------------------------------------------
     * RÉAPPROVISIONNEMENT
     * ---------------------------------------------------------
     */

    if (
      donnees.type ===
      "admin-reapprovisionnement"
    ) {

      /*
       * Erreur.
       */
      if (
        donnees.succes !== true
      ) {

        const message =
          donnees.message
            ? String(
                donnees.message
              )
            : "Le réapprovisionnement n’a pas pu être enregistré.";


        afficherMessageReapprovisionnement(
          message,
          true
        );


        if (
          elements.validerReapprovisionnement
        ) {

          elements.validerReapprovisionnement.disabled =
            false;

          elements.validerReapprovisionnement.textContent =
            "Valider le réapprovisionnement";
        }


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
       * Succès.
       */
      const resultat =
        donnees.resultat || {};


      const produit =
        nettoyerTexte(
          resultat.produit
        ) ||
        "Produit";


      const stockAvant =
        convertirNombre(
          resultat.stockAvant,
          0
        );


      const stockApres =
        convertirNombre(
          resultat.stockApres,
          stockAvant
        );


      fermerReapprovisionnement();


      alert(
        "Réapprovisionnement enregistré.\n\n" +
        produit +
        "\nStock : " +
        stockAvant +
        " → " +
        stockApres
      );


      /*
       * On relit immédiatement RESSOURCES
       * pour afficher le nouveau stock.
       */
      demanderProduits();


      return;
    }
  }


  /*
   * =========================================================
   * CONNEXION
   * =========================================================
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


    /*
     * La CONNEXION reste envoyée dans la fenêtre principale.
     * Ne pas remplacer _top par admin-iframe ici.
     */
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


    HTMLFormElement
      .prototype
      .submit
      .call(
        elements.formulaire
      );
  }


  /*
   * =========================================================
   * RETOUR DE CONNEXION
   * =========================================================
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


    /*
     * Conservé seulement pour compatibilité
     * avec les anciennes réponses.
     */
    const donneesAdmin =
      nettoyerTexte(
        parametres.get(
          "admin"
        )
      );


    /*
     * On retire le fragment de la barre
     * d'adresse après l'avoir lu.
     */
    nettoyerAdresse();


    /*
     * ---------------------------------------------------------
     * CONNEXION RÉUSSIE
     * ---------------------------------------------------------
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


      afficherAdministration(
        true
      );


      return true;
    }


    /*
     * ---------------------------------------------------------
     * CONNEXION REFUSÉE
     * ---------------------------------------------------------
     */

    if (erreur) {

      supprimerJeton();


      let message =
        "La connexion administrateur a échoué.";


      if (
        erreur === "identifiants"
      ) {

        message =
          "Identifiant ou mot de passe incorrect.";
      }


      if (
        erreur === "configuration"
      ) {

        message =
          "La connexion administrateur n’est pas configurée.";
      }


      if (
        erreur === "champs"
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
     * ---------------------------------------------------------
     * ANCIEN RETOUR #admin=
     * ---------------------------------------------------------
     *
     * Normalement plus utilisé depuis le passage à l'iframe.
     * On le conserve par sécurité.
     */

    if (donneesAdmin) {

      if (!lireJeton()) {

        afficherConnexion();


        afficherMessage(
          "Votre session administrateur n’est plus active. Veuillez vous reconnecter.",
          true
        );


        return true;
      }


      afficherAdministration(
        false
      );


      traiterRetourProduitsAncien(
        donneesAdmin
      );


      return true;
    }


    return false;
  }


  /*
   * =========================================================
   * AFFICHAGE CONNEXION / ADMINISTRATION
   * =========================================================
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
   * =========================================================
   * DEMANDE DES PRODUITS
   * =========================================================
   */

  function demanderProduits() {

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


    if (
      !elements.adminIframe
    ) {

      afficherErreurProduits(
        "L’iframe d’administration est absente de admin.html."
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


    const formulaire =
      document.createElement(
        "form"
      );


    formulaire.method =
      "POST";

    formulaire.action =
      apiUrl;

    /*
     * Très important :
     * la demande est envoyée dans l'iframe invisible.
     */
    formulaire.target =
      "admin-iframe";

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


    /*
     * Apps Script doit connaître l'origine
     * à laquelle envoyer postMessage.
     */
    ajouterChamp(
      formulaire,
      "origine",
      window.location.origin
    );


    document.body.appendChild(
      formulaire
    );


    HTMLFormElement
      .prototype
      .submit
      .call(
        formulaire
      );


    /*
     * On peut supprimer le formulaire
     * après son envoi.
     */
    window.setTimeout(
      function () {

        formulaire.remove();

      },
      1000
    );
  }


  /*
   * =========================================================
   * ANCIEN RETOUR DES PRODUITS
   * =========================================================
   *
   * Conservé seulement pour compatibilité.
   */

  function traiterRetourProduitsAncien(
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


  /*
   * =========================================================
   * ORDRE DES PRODUITS
   * =========================================================
   */

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
     * Ni A ni B ne sont des drapeaux :
     * livres par ordre alphabétique.
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
     * Livre avant drapeau.
     */
    if (
      indexA === -1
    ) {

      return -1;
    }


    if (
      indexB === -1
    ) {

      return 1;
    }


    /*
     * Deux drapeaux :
     * ordre imposé.
     */
    return indexA - indexB;
  }


  function trouverDrapeau(
    titre,
    ordre
  ) {

    const texte =
      normaliserTexte(
        titre
      );


    for (
      let i = 0;
      i < ordre.length;
      i++
    ) {

      const recherche =
        normaliserTexte(
          ordre[i]
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
   * =========================================================
   * AFFICHAGE DES PRODUITS
   * =========================================================
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
         * IDENTIFIANT
         */
        ajouterLigneProduit(
          bloc,
          "Identifiant",
          nettoyerTexte(
            produit.id
          ) || "—"
        );


        /*
         * -----------------------------------------------------
         * ACTIONS
         * -----------------------------------------------------
         */

        const actions =
          document.createElement(
            "div"
          );


        actions.className =
          "actions-produit";


        /*
         * MODIFIER
         * Sera activé ultérieurement.
         */
        const boutonModifier =
          creerBoutonAction(
            "Modifier"
          );


        boutonModifier.disabled =
          true;


        /*
         * RÉAPPROVISIONNER
         * Actif dès maintenant.
         */
        const boutonReapprovisionner =
          creerBoutonAction(
            "Réapprovisionner"
          );


        boutonReapprovisionner.addEventListener(
          "click",
          function () {

            ouvrirReapprovisionnement(
              produit
            );
          }
        );


        /*
         * SORTIE MANUELLE
         * Sera activée ultérieurement.
         */
        const boutonSortie =
          creerBoutonAction(
            "Sortie manuelle"
          );


        boutonSortie.disabled =
          true;


        actions.append(
          boutonModifier,
          boutonReapprovisionner,
          boutonSortie
        );


        bloc.appendChild(
          actions
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


  function creerBoutonAction(
    texte
  ) {

    const bouton =
      document.createElement(
        "button"
      );


    bouton.type =
      "button";


    bouton.className =
      "bouton-action";


    bouton.textContent =
      texte;


    return bouton;
  }


  /*
   * =========================================================
   * OUVERTURE DU RÉAPPROVISIONNEMENT
   * =========================================================
   */

  function ouvrirReapprovisionnement(
    produit
  ) {

    if (
      !elements.fondReapprovisionnement
    ) {

      alert(
        "La fenêtre de réapprovisionnement est absente de admin.html."
      );

      return;
    }


    produitReapprovisionnement =
      produit;


    elements.nomProduitReapprovisionnement.textContent =
      nettoyerTexte(
        produit.titre
      ) ||
      nettoyerTexte(
        produit.id
      ) ||
      "Produit";


    elements.stockProduitReapprovisionnement.textContent =
      "Stock actuel : " +
      convertirNombre(
        produit.stockActuel,
        0
      );


    elements.quantiteReapprovisionnement.value =
      "";


    elements.coutReapprovisionnement.value =
      "0";


    elements.observationReapprovisionnement.value =
      "";


    afficherMessageReapprovisionnement(
      "",
      false
    );


    elements.validerReapprovisionnement.disabled =
      false;


    elements.validerReapprovisionnement.textContent =
      "Valider le réapprovisionnement";


    elements.fondReapprovisionnement.hidden =
      false;


    elements.quantiteReapprovisionnement.focus();
  }


  /*
   * =========================================================
   * FERMETURE DU RÉAPPROVISIONNEMENT
   * =========================================================
   */

  function fermerReapprovisionnement() {

    produitReapprovisionnement =
      null;


    if (
      elements.fondReapprovisionnement
    ) {

      elements.fondReapprovisionnement.hidden =
        true;
    }


    afficherMessageReapprovisionnement(
      "",
      false
    );


    if (
      elements.validerReapprovisionnement
    ) {

      elements.validerReapprovisionnement.disabled =
        false;


      elements.validerReapprovisionnement.textContent =
        "Valider le réapprovisionnement";
    }
  }


  /*
   * =========================================================
   * ENVOI DU RÉAPPROVISIONNEMENT
   * =========================================================
   */

  function envoyerReapprovisionnement(
    evenement
  ) {

    evenement.preventDefault();


    if (
      !produitReapprovisionnement
    ) {

      return;
    }


    if (
      !elements.formulaireReapprovisionnement ||
      !elements.formulaireReapprovisionnement.checkValidity()
    ) {

      if (
        elements.formulaireReapprovisionnement
      ) {

        elements.formulaireReapprovisionnement.reportValidity();
      }


      return;
    }


    /*
     * Quantité.
     */
    const quantite =
      convertirNombre(
        elements.quantiteReapprovisionnement.value,
        0
      );


    /*
     * Coût total.
     */
    const cout =
      convertirNombre(
        elements.coutReapprovisionnement.value,
        0
      );


    if (
      !Number.isInteger(
        quantite
      ) ||
      quantite <= 0
    ) {

      afficherMessageReapprovisionnement(
        "La quantité reçue doit être un nombre entier supérieur à zéro.",
        true
      );


      return;
    }


    if (
      !Number.isFinite(
        cout
      ) ||
      cout < 0
    ) {

      afficherMessageReapprovisionnement(
        "Le coût total ne peut pas être négatif.",
        true
      );


      return;
    }


    const jeton =
      lireJeton();


    if (!jeton) {

      fermerReapprovisionnement();


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

      afficherMessageReapprovisionnement(
        "L’adresse de l’API Apps Script est absente de config.js.",
        true
      );


      return;
    }


    if (
      !elements.adminIframe
    ) {

      afficherMessageReapprovisionnement(
        "L’iframe d’administration est absente de admin.html.",
        true
      );


      return;
    }


    /*
     * Formulaire temporaire envoyé vers
     * Apps Script DANS L'IFRAME INVISIBLE.
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
      "admin-iframe";


    formulaire.style.display =
      "none";


    /*
     * Type d'action.
     */
    ajouterChamp(
      formulaire,
      "type",
      "admin-reapprovisionnement"
    );


    /*
     * Jeton administrateur.
     */
    ajouterChamp(
      formulaire,
      "jeton",
      jeton
    );


    /*
     * Produit.
     */
    ajouterChamp(
      formulaire,
      "produitId",
      produitReapprovisionnement.id
    );


    /*
     * Quantité reçue.
     */
    ajouterChamp(
      formulaire,
      "quantite",
      quantite
    );


    /*
     * Coût total.
     */
    ajouterChamp(
      formulaire,
      "cout",
      cout
    );


    /*
     * Observation facultative.
     */
    ajouterChamp(
      formulaire,
      "observation",
      elements.observationReapprovisionnement.value
    );


    /*
     * Conservé pour compatibilité.
     */
    ajouterChamp(
      formulaire,
      "retourAdmin",
      URL_ADMIN
    );


    /*
     * Indispensable pour postMessage.
     */
    ajouterChamp(
      formulaire,
      "origine",
      window.location.origin
    );


    /*
     * On bloque le bouton pendant
     * le traitement.
     */
    elements.validerReapprovisionnement.disabled =
      true;


    elements.validerReapprovisionnement.textContent =
      "Enregistrement…";


    afficherMessageReapprovisionnement(
      "Enregistrement du réapprovisionnement…",
      false
    );


    document.body.appendChild(
      formulaire
    );


    HTMLFormElement
      .prototype
      .submit
      .call(
        formulaire
      );


    window.setTimeout(
      function () {

        formulaire.remove();

      },
      1000
    );
  }


  /*
   * =========================================================
   * MESSAGE RÉAPPROVISIONNEMENT
   * =========================================================
   */

  function afficherMessageReapprovisionnement(
    message,
    erreur
  ) {

    if (
      !elements.messageReapprovisionnement
    ) {

      return;
    }


    elements.messageReapprovisionnement.textContent =
      message || "";


    if (!message) {

      elements.messageReapprovisionnement.className =
        "message";


      return;
    }


    elements.messageReapprovisionnement.className =
      erreur
        ? "message message-erreur"
        : "message message-succes";
  }


  /*
   * =========================================================
   * ERREURS DE CHARGEMENT DES PRODUITS
   * =========================================================
   */

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
   * =========================================================
   * CHAMP DE FORMULAIRE INVISIBLE
   * =========================================================
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
   * =========================================================
   * SESSION
   * =========================================================
   */

  function enregistrerJeton(
    jeton
  ) {

    try {

      sessionStorage.setItem(
        CLE_SESSION_ADMIN,
        jeton
      );

    } catch (_) {

      /*
       * Rien.
       */
    }
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

    } catch (_) {

      /*
       * Rien.
       */
    }
  }


  /*
   * =========================================================
   * DÉCONNEXION
   * =========================================================
   */

  function deconnecter() {

    supprimerJeton();


    demandeProduitsEnCours =
      false;


    produitReapprovisionnement =
      null;


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


    if (
      elements.fondReapprovisionnement
    ) {

      elements.fondReapprovisionnement.hidden =
        true;
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
   * =========================================================
   * MESSAGES DE CONNEXION
   * =========================================================
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
   * =========================================================
   * OUTILS
   * =========================================================
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


  function normaliserTexte(
    valeur
  ) {

    return nettoyerTexte(
      valeur
    )
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
  }

})();
