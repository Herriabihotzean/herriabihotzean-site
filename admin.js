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

  let produitSortieManuelle = null;

  let produitEdition = null;

let modeEditionProduit = "";


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

    elements.adminIframe =
      document.getElementById(
        "admin-iframe"
      );

/*
 * =========================================================
 * LISTES D'ATTENTE
 * =========================================================
 */

elements.boutonListesAttente =
  document.getElementById(
    "bouton-listes-attente"
  );

elements.fondListesAttente =
  document.getElementById(
    "fond-listes-attente"
  );

elements.chargementListesAttente =
  document.getElementById(
    "chargement-listes-attente"
  );

elements.resumeListesAttente =
  document.getElementById(
    "resume-listes-attente"
  );

elements.detailListesAttente =
  document.getElementById(
    "detail-listes-attente"
  );

elements.messageListesAttente =
  document.getElementById(
    "message-listes-attente"
  );

elements.retourListesAttente =
  document.getElementById(
    "retour-listes-attente"
  );

elements.fermerListesAttente =
  document.getElementById(
    "fermer-listes-attente"
  );


    /*
     * =========================================================
     * RÉAPPROVISIONNEMENT
     * =========================================================
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


    /*
     * =========================================================
     * SORTIE MANUELLE
     * =========================================================
     */

    elements.fondSortieManuelle =
      document.getElementById(
        "fond-sortie-manuelle"
      );

    elements.formulaireSortieManuelle =
      document.getElementById(
        "formulaire-sortie-manuelle"
      );

    elements.nomProduitSortieManuelle =
      document.getElementById(
        "nom-produit-sortie-manuelle"
      );

    elements.stockProduitSortieManuelle =
      document.getElementById(
        "stock-produit-sortie-manuelle"
      );

    elements.quantiteSortieManuelle =
      document.getElementById(
        "quantite-sortie-manuelle"
      );

    elements.typeSortieManuelle =
      document.getElementById(
        "type-sortie-manuelle"
      );

    elements.montantSortieManuelle =
      document.getElementById(
        "montant-sortie-manuelle"
      );

    elements.observationSortieManuelle =
      document.getElementById(
        "observation-sortie-manuelle"
      );

    elements.messageSortieManuelle =
      document.getElementById(
        "message-sortie-manuelle"
      );

    elements.annulerSortieManuelle =
      document.getElementById(
        "annuler-sortie-manuelle"
      );

    elements.validerSortieManuelle =
      document.getElementById(
        "valider-sortie-manuelle"
      );

    /*
     * =========================================================
     * CRÉER / MODIFIER UN PRODUIT
     * =========================================================
     */

    elements.boutonNouveauProduit =
      document.getElementById(
        "bouton-nouveau-produit"
      );

    elements.fondProduit =
      document.getElementById(
        "fond-produit"
      );

    elements.formulaireProduit =
      document.getElementById(
        "formulaire-produit"
      );

    elements.titreModalProduit =
      document.getElementById(
        "titre-modal-produit"
      );

    elements.produitId =
      document.getElementById(
        "produit-id"
      );

    elements.categorieProduit =
      document.getElementById(
        "categorie-produit"
      );

    elements.categorieBasqueProduit =
      document.getElementById(
        "categorie-basque-produit"
      );

    elements.sousCategorieProduit =
      document.getElementById(
        "sous-categorie-produit"
      );

    elements.sousCategorieBasqueProduit =
      document.getElementById(
        "sous-categorie-basque-produit"
      );

    elements.ordreAffichageProduit =
      document.getElementById(
        "ordre-affichage-produit"
      );

    elements.visibleBoutiqueProduit =
      document.getElementById(
        "visible-boutique-produit"
      );

    elements.titreProduit =
      document.getElementById(
        "titre-produit"
      );

    elements.titreBasqueProduit =
      document.getElementById(
        "titre-basque-produit"
      );

    elements.sousTitreProduit =
      document.getElementById(
        "sous-titre-produit"
      );

    elements.sousTitreBasqueProduit =
      document.getElementById(
        "sous-titre-basque-produit"
      );

    elements.descriptionFrancaiseProduit =
      document.getElementById(
        "description-francaise-produit"
      );

    elements.descriptionBasqueProduit =
      document.getElementById(
        "description-basque-produit"
      );

    elements.prixProduit =
      document.getElementById(
        "prix-produit"
      );

    elements.beneficiairePayPalProduit =
      document.getElementById(
        "beneficiaire-paypal-produit"
      );

    elements.poidsProduit =
      document.getElementById(
        "poids-produit"
      );

    elements.statutProduit =
      document.getElementById(
        "statut-produit"
      );

    elements.modeExpeditionProduit =
      document.getElementById(
        "mode-expedition-produit"
      );

    elements.fraisLivraisonProduit =
      document.getElementById(
        "frais-livraison-produit"
      );

    elements.blocStockActuelProduit =
      document.getElementById(
        "bloc-stock-actuel-produit"
      );

    elements.stockActuelProduit =
      document.getElementById(
        "stock-actuel-produit"
      );

    elements.blocStockInitialProduit =
      document.getElementById(
        "bloc-stock-initial-produit"
      );

    elements.stockInitialProduit =
      document.getElementById(
        "stock-initial-produit"
      );

    elements.prixRevientUnitaireProduit =
      document.getElementById(
        "prix-revient-unitaire-produit"
      );

    elements.seuilAlerteProduit =
      document.getElementById(
        "seuil-alerte-produit"
      );

    elements.stockCritiqueProduit =
      document.getElementById(
        "stock-critique-produit"
      );

    elements.cout10Produit =
      document.getElementById(
        "cout10-produit"
      );

    elements.cout20Produit =
      document.getElementById(
        "cout20-produit"
      );

    elements.cout50Produit =
      document.getElementById(
        "cout50-produit"
      );

    elements.cout100Produit =
      document.getElementById(
        "cout100-produit"
      );

    elements.photoPrincipaleProduit =
      document.getElementById(
        "photo-principale-produit"
      );

    elements.photo2Produit =
      document.getElementById(
        "photo2-produit"
      );

    elements.photo3Produit =
      document.getElementById(
        "photo3-produit"
      );

    elements.photo4Produit =
      document.getElementById(
        "photo4-produit"
      );

    elements.photo5Produit =
      document.getElementById(
        "photo5-produit"
      );

    elements.urlPageDetailleeProduit =
      document.getElementById(
        "url-page-detaillee-produit"
      );

    elements.messageProduit =
      document.getElementById(
        "message-produit"
      );

    elements.annulerProduit =
      document.getElementById(
        "annuler-produit"
      );

    elements.validerProduit =
      document.getElementById(
        "valider-produit"
      );
    
  }


  /*
   * =========================================================
   * ÉVÉNEMENTS
   * =========================================================
   */

  function installerEvenements() {

  /*
   * CONNEXION
   */

  if (elements.formulaire) {

    elements.formulaire.addEventListener(
      "submit",
      traiterConnexion
    );
  }


  /*
   * DÉCONNEXION
   */

  if (elements.boutonDeconnexion) {

    elements.boutonDeconnexion.addEventListener(
      "click",
      deconnecter
    );
  }


  /*
 * ========================================
 * LISTES D'ATTENTE
 * ========================================
 */

if (
  elements.boutonListesAttente
) {

  elements.boutonListesAttente.addEventListener(
    "click",
    ouvrirListesAttente
  );
}


if (
  elements.fermerListesAttente
) {

  elements.fermerListesAttente.addEventListener(
    "click",
    fermerListesAttente
  );
}


if (
  elements.fondListesAttente
) {

  elements.fondListesAttente.addEventListener(
    "click",
    function (evenement) {

      if (
        evenement.target ===
        elements.fondListesAttente
      ) {

        fermerListesAttente();
      }
    }
  );
}


  /*
   * ========================================
   * RÉAPPROVISIONNEMENT
   * ========================================
   */

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
   * ========================================
   * SORTIE MANUELLE
   * ========================================
   */

  if (
    elements.annulerSortieManuelle
  ) {

    elements.annulerSortieManuelle.addEventListener(
      "click",
      fermerSortieManuelle
    );
  }


  if (
    elements.formulaireSortieManuelle
  ) {

    elements.formulaireSortieManuelle.addEventListener(
      "submit",
      envoyerSortieManuelle
    );
  }


  if (
    elements.fondSortieManuelle
  ) {

    elements.fondSortieManuelle.addEventListener(
      "click",
      function (evenement) {

        if (
          evenement.target ===
          elements.fondSortieManuelle
        ) {

          fermerSortieManuelle();
        }
      }
    );
  }


  /*
   * ========================================
   * CRÉER / MODIFIER PRODUIT
   * ========================================
   */

  if (
    elements.boutonNouveauProduit
  ) {

    elements.boutonNouveauProduit.addEventListener(
      "click",
      ouvrirNouveauProduit
    );
  }


  if (
    elements.annulerProduit
  ) {

    elements.annulerProduit.addEventListener(
      "click",
      fermerProduit
    );
  }


  /*
   * C'est CE branchement qui déclenche
   * réellement envoyerProduit().
   */

  if (
    elements.formulaireProduit
  ) {

    elements.formulaireProduit.addEventListener(
      "submit",
      envoyerProduit
    );
  }


  if (
    elements.fondProduit
  ) {

    elements.fondProduit.addEventListener(
      "click",
      function (evenement) {

        if (
          evenement.target ===
          elements.fondProduit
        ) {

          fermerProduit();
        }
      }
    );
  }


  /*
   * ========================================
   * TOUCHE ÉCHAP
   * ========================================
   */

  document.addEventListener(
    "keydown",
    function (evenement) {

      if (
        evenement.key !== "Escape"
      ) {

        return;
      }

    /*
     * LISTES D'ATTENTE
     */
      
      if (
  elements.fondListesAttente &&
  !elements.fondListesAttente.hidden
) {

  fermerListesAttente();
  return;
}


      if (
        elements.fondProduit &&
        !elements.fondProduit.hidden
      ) {

        fermerProduit();
        return;
      }


      if (
        elements.fondReapprovisionnement &&
        !elements.fondReapprovisionnement.hidden
      ) {

        fermerReapprovisionnement();
        return;
      }


      if (
        elements.fondSortieManuelle &&
        !elements.fondSortieManuelle.hidden
      ) {

        fermerSortieManuelle();
      }
    }
  );


  /*
   * ========================================
   * RÉPONSES APPS SCRIPT
   * ========================================
   */

  window.addEventListener(
    "message",
    traiterMessageAdministration
  );
}

function ouvrirListesAttente() {

  if (
    !elements.fondListesAttente
  ) {
    return;
  }


  if (
    elements.resumeListesAttente
  ) {

    elements.resumeListesAttente.innerHTML =
      "";
  }


  if (
    elements.detailListesAttente
  ) {

    elements.detailListesAttente.innerHTML =
      "";

    elements.detailListesAttente.hidden =
      true;
  }


  if (
    elements.messageListesAttente
  ) {

    elements.messageListesAttente.textContent =
      "";
  }


  if (
    elements.chargementListesAttente
  ) {

    elements.chargementListesAttente.hidden =
      false;

    elements.chargementListesAttente.textContent =
      "Chargement des listes d’attente…";
  }


  if (
    elements.retourListesAttente
  ) {

    elements.retourListesAttente.hidden =
      true;
  }


  elements.fondListesAttente.hidden =
    false;
}


function fermerListesAttente() {

  if (
    !elements.fondListesAttente
  ) {
    return;
  }


  elements.fondListesAttente.hidden =
    true;
}

  
  /*
   * =========================================================
   * RÉPONSES DE L'IFRAME APPS SCRIPT
   * =========================================================
   */

  function traiterMessageAdministration(
    evenement
  ) {

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
     * =========================================================
     * LISTE DES PRODUITS
     * =========================================================
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
     * =========================================================
     * RÉAPPROVISIONNEMENT
     * =========================================================
     */

    if (
      donnees.type ===
      "admin-reapprovisionnement"
    ) {

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


      demanderProduits();


      return;
    }


    /*
     * =========================================================
     * SORTIE MANUELLE
     * =========================================================
     */

    if (
      donnees.type ===
      "admin-sortie-manuelle"
    ) {

      if (
        donnees.succes !== true
      ) {

        const message =
          donnees.message
            ? String(
                donnees.message
              )
            : "La sortie manuelle n’a pas pu être enregistrée.";


        afficherMessageSortieManuelle(
          message,
          true
        );


        if (
          elements.validerSortieManuelle
        ) {

          elements.validerSortieManuelle.disabled =
            false;


          elements.validerSortieManuelle.textContent =
            "Valider la sortie";
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


      fermerSortieManuelle();


      alert(
        "Sortie manuelle enregistrée.\n\n" +
        produit +
        "\nStock : " +
        stockAvant +
        " → " +
        stockApres
      );


      demanderProduits();


      return;
    }

        /*
     * =========================================================
     * MODIFIER PRODUIT
     * =========================================================
     */

    if (
      donnees.type ===
      "admin-modifier-produit"
    ) {

      if (
        donnees.succes !== true
      ) {

        const message =
          donnees.message
            ? String(
                donnees.message
              )
            : "Le produit n’a pas pu être modifié.";


        afficherMessageProduit(
          message,
          true
        );


        reactiverBoutonProduit();


        return;
      }


      const resultat =
        donnees.resultat || {};


      fermerProduit();


      alert(
        "Produit modifié.\n\n" +
        (
          nettoyerTexte(
            resultat.titre
          ) ||
          nettoyerTexte(
            resultat.produitId
          ) ||
          "Produit"
        )
      );


      demanderProduits();


      return;
    }


    /*
     * =========================================================
     * CRÉER PRODUIT
     * =========================================================
     */

    if (
      donnees.type ===
      "admin-creer-produit"
    ) {

      if (
        donnees.succes !== true
      ) {

        const message =
          donnees.message
            ? String(
                donnees.message
              )
            : "Le produit n’a pas pu être créé.";


        afficherMessageProduit(
          message,
          true
        );


        reactiverBoutonProduit();


        return;
      }


      const resultat =
        donnees.resultat || {};


      fermerProduit();


      alert(
        "Nouveau produit créé.\n\n" +
        (
          nettoyerTexte(
            resultat.titre
          ) ||
          nettoyerTexte(
            resultat.produitId
          ) ||
          "Produit"
        )
      );


      demanderProduits();


      return;
    }

    /*
 * =========================================================
 * ARCHIVER PRODUIT
 * =========================================================
 */

if (
  donnees.type ===
  "admin-archiver-produit"
) {

  if (
    donnees.succes !== true
  ) {

    alert(
      donnees.message ||
      "Le produit n’a pas pu être archivé."
    );

    return;
  }


  const resultat =
    donnees.resultat || {};


  alert(
    "Produit archivé.\n\n" +
    (
      nettoyerTexte(
        resultat.produit
      ) ||
      nettoyerTexte(
        resultat.produitId
      ) ||
      "Produit"
    )
  );


  demanderProduits();

  return;
}


/*
 * =========================================================
 * RÉACTIVER PRODUIT
 * =========================================================
 */

if (
  donnees.type ===
  "admin-reactiver-produit"
) {

  if (
    donnees.succes !== true
  ) {

    alert(
      donnees.message ||
      "Le produit n’a pas pu être réactivé."
    );

    return;
  }


  const resultat =
    donnees.resultat || {};


  alert(
    "Produit réactivé.\n\n" +
    (
      nettoyerTexte(
        resultat.produit
      ) ||
      nettoyerTexte(
        resultat.produitId
      ) ||
      "Produit"
    ) +
    "\nStatut : " +
    (
      nettoyerTexte(
        resultat.statut
      ) ||
      "—"
    )
  );


  demanderProduits();

  return;
}


/*
 * =========================================================
 * SUPPRIMER PRODUIT
 * =========================================================
 */

if (
  donnees.type ===
  "admin-supprimer-produit"
) {

  if (
    donnees.succes !== true
  ) {

    alert(
      donnees.message ||
      "Le produit n’a pas pu être supprimé."
    );

    return;
  }


  const resultat =
    donnees.resultat || {};


  alert(
    "Produit supprimé définitivement.\n\n" +
    (
      nettoyerTexte(
        resultat.produit
      ) ||
      nettoyerTexte(
        resultat.produitId
      ) ||
      "Produit"
    )
  );


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


    elements.formulaire.action =
      apiUrl;


    elements.formulaire.method =
      "POST";


    /*
     * La connexion reste envoyée
     * dans la fenêtre principale.
     */
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
     * Conservé pour compatibilité
     * avec l'ancien retour #admin=...
     */
    const donneesAdmin =
      nettoyerTexte(
        parametres.get(
          "admin"
        )
      );


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
     * ---------------------------------------------------------
     * ANCIEN RETOUR #admin=
     * ---------------------------------------------------------
     */

    if (donneesAdmin) {

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
         * ACTIONS
         */

        const actions =
          document.createElement(
            "div"
          );


        actions.className =
          "actions-produit";


        /*
 * =========================================================
 * ACTIONS DU PRODUIT
 * =========================================================
 */

const statutProduit =
  nettoyerTexte(
    produit.statut
  ).toUpperCase();


const estArchive =
  statutProduit === "ARCHIVÉ";


/*
 * MODIFIER
 */

const boutonModifier =
  creerBoutonAction(
    "Modifier"
  );


boutonModifier.addEventListener(
  "click",
  function () {

    ouvrirModificationProduit(
      produit
    );
  }
);


/*
 * PRODUIT NON ARCHIVÉ
 */

if (!estArchive) {

  /*
   * RÉAPPROVISIONNER
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
   */

  const boutonSortie =
    creerBoutonAction(
      "Sortie manuelle"
    );


  boutonSortie.addEventListener(
    "click",
    function () {

      ouvrirSortieManuelle(
        produit
      );
    }
  );


  if (
    stock <= 0
  ) {

    boutonSortie.disabled =
      true;
  }


  /*
   * ARCHIVER
   */

  const boutonArchiver =
    creerBoutonAction(
      "Archiver"
    );


  boutonArchiver.addEventListener(
    "click",
    function () {

      archiverProduit(
        produit
      );
    }
  );


  actions.append(
    boutonModifier,
    boutonReapprovisionner,
    boutonSortie,
    boutonArchiver
  );

}


/*
 * PRODUIT ARCHIVÉ
 */

else {

  /*
   * RÉACTIVER
   */

  const boutonReactiver =
    creerBoutonAction(
      "Réactiver"
    );


  boutonReactiver.addEventListener(
    "click",
    function () {

      reactiverProduit(
        produit
      );
    }
  );


  /*
   * SUPPRIMER DÉFINITIVEMENT
   */

  const boutonSupprimer =
    creerBoutonAction(
      "Supprimer définitivement"
    );


  boutonSupprimer.addEventListener(
    "click",
    function () {

      supprimerProduit(
        produit
      );
    }
  );


  actions.append(
    boutonModifier,
    boutonReactiver,
    boutonSupprimer
  );
}


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


    const quantite =
      convertirNombre(
        elements.quantiteReapprovisionnement.value,
        0
      );


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


    ajouterChamp(
      formulaire,
      "type",
      "admin-reapprovisionnement"
    );


    ajouterChamp(
      formulaire,
      "jeton",
      jeton
    );


    ajouterChamp(
      formulaire,
      "produitId",
      produitReapprovisionnement.id
    );


    ajouterChamp(
      formulaire,
      "quantite",
      quantite
    );


    ajouterChamp(
      formulaire,
      "cout",
      cout
    );


    ajouterChamp(
      formulaire,
      "observation",
      elements.observationReapprovisionnement.value
    );


    ajouterChamp(
      formulaire,
      "retourAdmin",
      URL_ADMIN
    );


    ajouterChamp(
      formulaire,
      "origine",
      window.location.origin
    );


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
   * OUVERTURE DE LA SORTIE MANUELLE
   * =========================================================
   */

  function ouvrirSortieManuelle(
    produit
  ) {

    if (
      !elements.fondSortieManuelle
    ) {

      alert(
        "La fenêtre de sortie manuelle est absente de admin.html."
      );

      return;
    }


    const stock =
      convertirNombre(
        produit.stockActuel,
        0
      );


    if (
      stock <= 0
    ) {

      alert(
        "Le stock de ce produit est déjà nul."
      );

      return;
    }


    produitSortieManuelle =
      produit;


    elements.nomProduitSortieManuelle.textContent =
      nettoyerTexte(
        produit.titre
      ) ||
      nettoyerTexte(
        produit.id
      ) ||
      "Produit";


    elements.stockProduitSortieManuelle.textContent =
      "Stock actuel : " +
      stock;


    elements.quantiteSortieManuelle.value =
      "";


    elements.quantiteSortieManuelle.max =
      String(
        stock
      );


    elements.typeSortieManuelle.value =
      "";


    elements.montantSortieManuelle.value =
      "0";


    elements.observationSortieManuelle.value =
      "";


    afficherMessageSortieManuelle(
      "",
      false
    );


    elements.validerSortieManuelle.disabled =
      false;


    elements.validerSortieManuelle.textContent =
      "Valider la sortie";


    elements.fondSortieManuelle.hidden =
      false;


    elements.quantiteSortieManuelle.focus();
  }


  /*
   * =========================================================
   * FERMETURE DE LA SORTIE MANUELLE
   * =========================================================
   */

  function fermerSortieManuelle() {

    produitSortieManuelle =
      null;


    if (
      elements.fondSortieManuelle
    ) {

      elements.fondSortieManuelle.hidden =
        true;
    }


    afficherMessageSortieManuelle(
      "",
      false
    );


    if (
      elements.validerSortieManuelle
    ) {

      elements.validerSortieManuelle.disabled =
        false;


      elements.validerSortieManuelle.textContent =
        "Valider la sortie";
    }
  }


  /*
   * =========================================================
   * ENVOI DE LA SORTIE MANUELLE
   * =========================================================
   */

  function envoyerSortieManuelle(
    evenement
  ) {

    evenement.preventDefault();


    if (
      !produitSortieManuelle
    ) {

      return;
    }


    if (
      !elements.formulaireSortieManuelle ||
      !elements.formulaireSortieManuelle.checkValidity()
    ) {

      if (
        elements.formulaireSortieManuelle
      ) {

        elements.formulaireSortieManuelle.reportValidity();
      }


      return;
    }


    const quantite =
      convertirNombre(
        elements.quantiteSortieManuelle.value,
        0
      );


    const stockActuel =
      convertirNombre(
        produitSortieManuelle.stockActuel,
        0
      );


    const typeSortie =
      nettoyerTexte(
        elements.typeSortieManuelle.value
      );


    const montant =
      convertirNombre(
        elements.montantSortieManuelle.value,
        0
      );


    if (
      !Number.isInteger(
        quantite
      ) ||
      quantite <= 0
    ) {

      afficherMessageSortieManuelle(
        "La quantité sortie doit être un nombre entier supérieur à zéro.",
        true
      );


      return;
    }


    if (
      quantite >
      stockActuel
    ) {

      afficherMessageSortieManuelle(
        "La quantité sortie ne peut pas dépasser le stock disponible (" +
        stockActuel +
        ").",
        true
      );


      return;
    }


    if (!typeSortie) {

      afficherMessageSortieManuelle(
        "Veuillez choisir un type de sortie.",
        true
      );


      return;
    }


    if (
      !Number.isFinite(
        montant
      ) ||
      montant < 0
    ) {

      afficherMessageSortieManuelle(
        "Le montant encaissé ne peut pas être négatif.",
        true
      );


      return;
    }


    const jeton =
      lireJeton();


    if (!jeton) {

      fermerSortieManuelle();


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

      afficherMessageSortieManuelle(
        "L’adresse de l’API Apps Script est absente de config.js.",
        true
      );


      return;
    }


    if (
      !elements.adminIframe
    ) {

      afficherMessageSortieManuelle(
        "L’iframe d’administration est absente de admin.html.",
        true
      );


      return;
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
      "admin-iframe";


    formulaire.style.display =
      "none";


    ajouterChamp(
      formulaire,
      "type",
      "admin-sortie-manuelle"
    );


    ajouterChamp(
      formulaire,
      "jeton",
      jeton
    );


    ajouterChamp(
      formulaire,
      "produitId",
      produitSortieManuelle.id
    );


    ajouterChamp(
      formulaire,
      "quantite",
      quantite
    );


    ajouterChamp(
      formulaire,
      "typeSortie",
      typeSortie
    );


    ajouterChamp(
      formulaire,
      "montant",
      montant
    );


    ajouterChamp(
      formulaire,
      "observation",
      elements.observationSortieManuelle.value
    );


    ajouterChamp(
      formulaire,
      "retourAdmin",
      URL_ADMIN
    );


    ajouterChamp(
      formulaire,
      "origine",
      window.location.origin
    );


    elements.validerSortieManuelle.disabled =
      true;


    elements.validerSortieManuelle.textContent =
      "Enregistrement…";


    afficherMessageSortieManuelle(
      "Enregistrement de la sortie…",
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
   * MESSAGE SORTIE MANUELLE
   * =========================================================
   */

  function afficherMessageSortieManuelle(
    message,
    erreur
  ) {

    if (
      !elements.messageSortieManuelle
    ) {

      return;
    }


    elements.messageSortieManuelle.textContent =
      message || "";


    if (!message) {

      elements.messageSortieManuelle.className =
        "message";


      return;
    }


    elements.messageSortieManuelle.className =
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


    produitSortieManuelle =
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


    if (
      elements.fondSortieManuelle
    ) {

      elements.fondSortieManuelle.hidden =
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
   * NOUVEAU PRODUIT
   * =========================================================
   */

function ouvrirNouveauProduit() {

  modeEditionProduit =
    "creation";


  produitEdition =
    null;


  if (
    elements.formulaireProduit
  ) {

    elements.formulaireProduit.reset();
  }


  elements.titreModalProduit.textContent =
    "Nouveau produit";


  elements.produitId.readOnly =
    false;

  elements.produitId.value =
    "";


  elements.blocStockActuelProduit.hidden =
    true;


  elements.blocStockInitialProduit.hidden =
    false;


  elements.stockInitialProduit.required =
    true;

  elements.stockInitialProduit.value =
    "0";


  elements.visibleBoutiqueProduit.value =
    "OUI";


  elements.statutProduit.value =
    "EN VENTE";


  elements.ordreAffichageProduit.value =
    "0";


  elements.fraisLivraisonProduit.value =
    "0";


  elements.prixRevientUnitaireProduit.value =
    "0";


  elements.seuilAlerteProduit.value =
    "0";


  elements.stockCritiqueProduit.value =
    "0";


  elements.cout10Produit.value =
    "0";


  elements.cout20Produit.value =
    "0";


  elements.cout50Produit.value =
    "0";


  elements.cout100Produit.value =
    "0";


  elements.validerProduit.disabled =
    false;


  elements.validerProduit.textContent =
    "Créer le produit";


  afficherMessageProduit(
    "",
    false
  );


  elements.fondProduit.hidden =
    false;


  elements.produitId.focus();
}


  /*
   * =========================================================
   * MODIFIER PRODUIT
   * =========================================================
   */

  function ouvrirModificationProduit(
    produit
  ) {

    modeEditionProduit =
      "modification";


    produitEdition =
      produit;


    remplirFormulaireProduit(
      produit
    );


    elements.titreModalProduit.textContent =
      "Modifier le produit";


    /*
     * L'identifiant est la clé du produit.
     */

    elements.produitId.readOnly =
      true;


    elements.blocStockActuelProduit.hidden =
      false;


    elements.blocStockInitialProduit.hidden =
      true;


    elements.stockInitialProduit.required =
      false;


    elements.validerProduit.textContent =
      "Enregistrer les modifications";


    afficherMessageProduit(
      "",
      false
    );


    elements.fondProduit.hidden =
      false;


    elements.titreProduit.focus();
  }

    function remplirFormulaireProduit(
    produit
  ) {

    elements.produitId.value =
      nettoyerTexte(
        produit.id
      );


    elements.categorieProduit.value =
      nettoyerTexte(
        produit.categorie
      );


    elements.categorieBasqueProduit.value =
      nettoyerTexte(
        produit.categorieBasque
      );


    elements.sousCategorieProduit.value =
      nettoyerTexte(
        produit.sousCategorie
      );


    elements.sousCategorieBasqueProduit.value =
      nettoyerTexte(
        produit.sousCategorieBasque
      );


    elements.titreProduit.value =
      nettoyerTexte(
        produit.titre
      );


    elements.titreBasqueProduit.value =
      nettoyerTexte(
        produit.titreBasque
      );


    elements.sousTitreProduit.value =
      nettoyerTexte(
        produit.sousTitre
      );


    elements.sousTitreBasqueProduit.value =
      nettoyerTexte(
        produit.sousTitreBasque
      );


    elements.prixProduit.value =
      convertirNombre(
        produit.prix,
        0
      );


    elements.modeExpeditionProduit.value =
      nettoyerTexte(
        produit.modeExpedition
      );


    elements.fraisLivraisonProduit.value =
      convertirNombre(
        produit.fraisLivraison,
        0
      );


    elements.prixRevientUnitaireProduit.value =
      convertirNombre(
        produit.prixRevientUnitaire,
        0
      );


    elements.beneficiairePayPalProduit.value =
      nettoyerTexte(
        produit.beneficiairePayPal
      ).toUpperCase();


    elements.poidsProduit.value =
      convertirNombre(
        produit.poids,
        0
      );


    elements.stockActuelProduit.value =
      convertirNombre(
        produit.stockActuel,
        0
      );


    elements.seuilAlerteProduit.value =
      convertirNombre(
        produit.seuilAlerte,
        0
      );


    elements.stockCritiqueProduit.value =
      convertirNombre(
        produit.stockCritique,
        0
      );


    elements.cout10Produit.value =
      convertirNombre(
        produit.cout10,
        0
      );


    elements.cout20Produit.value =
      convertirNombre(
        produit.cout20,
        0
      );


    elements.cout50Produit.value =
      convertirNombre(
        produit.cout50,
        0
      );


    elements.cout100Produit.value =
      convertirNombre(
        produit.cout100,
        0
      );


    elements.statutProduit.value =
      nettoyerTexte(
        produit.statut
      ) ||
      "RÉAPPROVISIONNEMENT";


    elements.descriptionFrancaiseProduit.value =
      nettoyerTexte(
        produit.descriptionFrancaise
      );


    elements.descriptionBasqueProduit.value =
      nettoyerTexte(
        produit.descriptionBasque
      );


    elements.photoPrincipaleProduit.value =
      nettoyerTexte(
        produit.photoPrincipale
      );


    elements.photo2Produit.value =
      nettoyerTexte(
        produit.photo2
      );


    elements.photo3Produit.value =
      nettoyerTexte(
        produit.photo3
      );


    elements.photo4Produit.value =
      nettoyerTexte(
        produit.photo4
      );


    elements.photo5Produit.value =
      nettoyerTexte(
        produit.photo5
      );


    elements.urlPageDetailleeProduit.value =
      nettoyerTexte(
        produit.urlPageDetaillee
      );


    elements.visibleBoutiqueProduit.value =
      produit.visibleBoutique === true
        ? "OUI"
        : "NON";


    elements.ordreAffichageProduit.value =
      convertirNombre(
        produit.ordreAffichage,
        0
      );
  }

    function viderFormulaireProduit() {

    if (
      elements.formulaireProduit
    ) {

      elements.formulaireProduit.reset();
    }


    elements.produitId.value =
      "";


    elements.stockActuelProduit.value =
      "";
  }

      function fermerProduit() {

  if (
    elements.fondProduit
  ) {

    elements.fondProduit.hidden =
      true;
  }


  if (
    elements.messageProduit
  ) {

    elements.messageProduit.textContent =
      "";

    elements.messageProduit.className =
      "message";
  }


  if (
    elements.validerProduit
  ) {

    elements.validerProduit.disabled =
      false;

    elements.validerProduit.textContent =
      "Enregistrer les modifications";
  }


  produitEdition =
    null;


  modeEditionProduit =
    "";
}

    function envoyerProduit(
    evenement
  ) {

    evenement.preventDefault();


    if (
      !elements.formulaireProduit ||
      !elements.formulaireProduit.checkValidity()
    ) {

      if (
        elements.formulaireProduit
      ) {

        elements.formulaireProduit.reportValidity();
      }


      return;
    }


    if (
      modeEditionProduit !== "creation" &&
      modeEditionProduit !== "modification"
    ) {

      return;
    }


    const jeton =
      lireJeton();


    if (!jeton) {

      fermerProduit();

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

      afficherMessageProduit(
        "L’adresse de l’API Apps Script est absente de config.js.",
        true
      );

      return;
    }


    const produitId =
      nettoyerTexte(
        elements.produitId.value
      );


    const titre =
      nettoyerTexte(
        elements.titreProduit.value
      );


    const poids =
      convertirNombre(
        elements.poidsProduit.value,
        0
      );


    if (!produitId) {

      afficherMessageProduit(
        "L’identifiant du produit est obligatoire.",
        true
      );

      return;
    }


    if (!titre) {

      afficherMessageProduit(
        "Le titre français est obligatoire.",
        true
      );

      return;
    }


    if (
      !Number.isInteger(
        poids
      ) ||
      poids <= 0
    ) {

      afficherMessageProduit(
        "Le poids doit être un nombre entier supérieur à zéro.",
        true
      );

      return;
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
      "admin-iframe";


    formulaire.style.display =
      "none";


    ajouterChamp(
      formulaire,
      "type",
      modeEditionProduit === "creation"
        ? "admin-creer-produit"
        : "admin-modifier-produit"
    );


    ajouterChamp(
      formulaire,
      "jeton",
      jeton
    );


    ajouterChamp(
      formulaire,
      "produitId",
      produitId
    );


    ajouterChamp(
      formulaire,
      "categorie",
      elements.categorieProduit.value
    );


    ajouterChamp(
      formulaire,
      "categorieBasque",
      elements.categorieBasqueProduit.value
    );


    ajouterChamp(
      formulaire,
      "sousCategorie",
      elements.sousCategorieProduit.value
    );


    ajouterChamp(
      formulaire,
      "sousCategorieBasque",
      elements.sousCategorieBasqueProduit.value
    );


    ajouterChamp(
      formulaire,
      "titre",
      elements.titreProduit.value
    );


    ajouterChamp(
      formulaire,
      "titreBasque",
      elements.titreBasqueProduit.value
    );


    ajouterChamp(
      formulaire,
      "sousTitre",
      elements.sousTitreProduit.value
    );


    ajouterChamp(
      formulaire,
      "sousTitreBasque",
      elements.sousTitreBasqueProduit.value
    );


    ajouterChamp(
      formulaire,
      "prix",
      elements.prixProduit.value
    );


    ajouterChamp(
      formulaire,
      "modeExpedition",
      elements.modeExpeditionProduit.value
    );


    ajouterChamp(
      formulaire,
      "fraisLivraison",
      elements.fraisLivraisonProduit.value
    );


    ajouterChamp(
      formulaire,
      "prixRevientUnitaire",
      elements.prixRevientUnitaireProduit.value
    );


    ajouterChamp(
      formulaire,
      "beneficiairePayPal",
      elements.beneficiairePayPalProduit.value
    );


    ajouterChamp(
      formulaire,
      "poids",
      elements.poidsProduit.value
    );


    if (
      modeEditionProduit === "creation"
    ) {

      ajouterChamp(
        formulaire,
        "stockInitial",
        elements.stockInitialProduit.value
      );
    }


    ajouterChamp(
      formulaire,
      "seuilAlerte",
      elements.seuilAlerteProduit.value
    );


    ajouterChamp(
      formulaire,
      "stockCritique",
      elements.stockCritiqueProduit.value
    );


    ajouterChamp(
      formulaire,
      "cout10",
      elements.cout10Produit.value
    );


    ajouterChamp(
      formulaire,
      "cout20",
      elements.cout20Produit.value
    );


    ajouterChamp(
      formulaire,
      "cout50",
      elements.cout50Produit.value
    );


    ajouterChamp(
      formulaire,
      "cout100",
      elements.cout100Produit.value
    );


    ajouterChamp(
      formulaire,
      "statut",
      elements.statutProduit.value
    );


    ajouterChamp(
      formulaire,
      "descriptionFrancaise",
      elements.descriptionFrancaiseProduit.value
    );


    ajouterChamp(
      formulaire,
      "descriptionBasque",
      elements.descriptionBasqueProduit.value
    );


    ajouterChamp(
      formulaire,
      "photoPrincipale",
      elements.photoPrincipaleProduit.value
    );


    ajouterChamp(
      formulaire,
      "photo2",
      elements.photo2Produit.value
    );


    ajouterChamp(
      formulaire,
      "photo3",
      elements.photo3Produit.value
    );


    ajouterChamp(
      formulaire,
      "photo4",
      elements.photo4Produit.value
    );


    ajouterChamp(
      formulaire,
      "photo5",
      elements.photo5Produit.value
    );


    ajouterChamp(
      formulaire,
      "urlPageDetaillee",
      elements.urlPageDetailleeProduit.value
    );


    ajouterChamp(
      formulaire,
      "visibleBoutique",
      elements.visibleBoutiqueProduit.value
    );


    ajouterChamp(
      formulaire,
      "ordreAffichage",
      elements.ordreAffichageProduit.value
    );


    ajouterChamp(
      formulaire,
      "retourAdmin",
      URL_ADMIN
    );


    ajouterChamp(
      formulaire,
      "origine",
      window.location.origin
    );


    elements.validerProduit.disabled =
      true;


    elements.validerProduit.textContent =
      modeEditionProduit === "creation"
        ? "Création…"
        : "Enregistrement…";


    afficherMessageProduit(
      modeEditionProduit === "creation"
        ? "Création du produit…"
        : "Enregistrement des modifications…",
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

    function afficherMessageProduit(
    message,
    erreur
  ) {

    if (
      !elements.messageProduit
    ) {

      return;
    }


    elements.messageProduit.textContent =
      message || "";


    if (!message) {

      elements.messageProduit.className =
        "message";

      return;
    }


    elements.messageProduit.className =
      erreur
        ? "message message-erreur"
        : "message message-succes";
  }


  function reactiverBoutonProduit() {

    if (
      !elements.validerProduit
    ) {

      return;
    }


    elements.validerProduit.disabled =
      false;


    elements.validerProduit.textContent =
      modeEditionProduit === "creation"
        ? "Créer le produit"
        : "Enregistrer les modifications";
  }

function envoyerActionProduit(
  typeAction,
  produit
) {

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

    alert(
      "L’adresse de l’API Apps Script est absente de config.js."
    );

    return;
  }


  if (
    !elements.adminIframe
  ) {

    alert(
      "L’iframe d’administration est absente de admin.html."
    );

    return;
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
    "admin-iframe";


  formulaire.style.display =
    "none";


  ajouterChamp(
    formulaire,
    "type",
    typeAction
  );


  ajouterChamp(
    formulaire,
    "jeton",
    jeton
  );


  ajouterChamp(
    formulaire,
    "produitId",
    produit.id
  );


  ajouterChamp(
    formulaire,
    "retourAdmin",
    URL_ADMIN
  );


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


  window.setTimeout(
    function () {

      formulaire.remove();

    },
    1000
  );
}

function archiverProduit(
  produit
) {

  const titre =
    nettoyerTexte(
      produit.titre
    ) ||
    nettoyerTexte(
      produit.id
    ) ||
    "ce produit";


  const confirmation =
    window.confirm(
      "Archiver « " +
      titre +
      " » ?\n\n" +
      "Le produit sera retiré de la boutique, mais ses données, son stock et son historique seront conservés."
    );


  if (!confirmation) {

    return;
  }


  envoyerActionProduit(
    "admin-archiver-produit",
    produit
  );
}

function reactiverProduit(
  produit
) {

  const titre =
    nettoyerTexte(
      produit.titre
    ) ||
    nettoyerTexte(
      produit.id
    ) ||
    "ce produit";


  const confirmation =
    window.confirm(
      "Réactiver « " +
      titre +
      " » ?\n\n" +
      "Le produit redeviendra visible dans la boutique."
    );


  if (!confirmation) {

    return;
  }


  envoyerActionProduit(
    "admin-reactiver-produit",
    produit
  );
}

function supprimerProduit(
  produit
) {

  const titre =
    nettoyerTexte(
      produit.titre
    ) ||
    nettoyerTexte(
      produit.id
    ) ||
    "ce produit";


  const confirmation1 =
    window.confirm(
      "SUPPRESSION DÉFINITIVE\n\n" +
      "Voulez-vous vraiment supprimer « " +
      titre +
      " » ?\n\n" +
      "Cette action n’est autorisée que si le produit n’a aucun historique."
    );


  if (!confirmation1) {

    return;
  }


  const confirmation2 =
    window.confirm(
      "Dernière confirmation.\n\n" +
      "Supprimer définitivement « " +
      titre +
      " » de RESSOURCES ?"
    );


  if (!confirmation2) {

    return;
  }


  envoyerActionProduit(
    "admin-supprimer-produit",
    produit
  );
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
        style: "currency",
        currency: "EUR"
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
