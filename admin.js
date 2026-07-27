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


  const CLE_MESSAGE_ADMIN =
    "herria_admin_message";


  /*
   * ========================================
   * ÉTAT
   * ========================================
   */

  let demandeProduitsEnCours =
    false;


  let produitReapprovisionnement =
    null;


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


    if (
      elements.retourAdmin
    ) {

      elements.retourAdmin.value =
        URL_ADMIN;
    }


    installerEvenements();


    /*
     * On traite en priorité le retour
     * d'Apps Script.
     *
     * #jeton=
     * #erreur=
     * #admin=
     */

    const retourTraite =
      traiterRetourAppsScript();


    if (
      retourTraite
    ) {

      return;
    }


    /*
     * Ouverture normale de la page.
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


  /*
   * ========================================
   * ÉLÉMENTS
   * ========================================
   */

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


    elements.messageAdministration =
      document.getElementById(
        "message-administration"
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
     * Réapprovisionnement.
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


    if (
      elements.annulerReapprovisionnement
    ) {

      elements.annulerReapprovisionnement
        .addEventListener(
          "click",
          fermerReapprovisionnement
        );
    }


    if (
      elements.formulaireReapprovisionnement
    ) {

      elements.formulaireReapprovisionnement
        .addEventListener(
          "submit",
          envoyerReapprovisionnement
        );
    }


    if (
      elements.fondReapprovisionnement
    ) {

      elements.fondReapprovisionnement
        .addEventListener(
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


    document.addEventListener(
      "keydown",
      function (evenement) {

        if (
          evenement.key ===
            "Escape" &&
          elements.fondReapprovisionnement &&
          !elements.fondReapprovisionnement.hidden
        ) {

          fermerReapprovisionnement();
        }
      }
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
      !elements.formulaire ||
      !elements.formulaire.checkValidity()
    ) {

      if (
        elements.formulaire
      ) {

        elements.formulaire.reportValidity();
      }


      afficherMessageConnexion(
        "Veuillez renseigner votre identifiant et votre mot de passe.",
        true
      );


      return;
    }


    const apiUrl =
      obtenirApiUrl();


    if (!apiUrl) {

      afficherMessageConnexion(
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


    afficherMessageConnexion(
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
   * ========================================
   * RETOUR APPS SCRIPT
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
     * On nettoie immédiatement
     * la barre d'adresse.
     */

    nettoyerAdresse();


    /*
     * ========================================
     * CONNEXION RÉUSSIE
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


      afficherAdministration(
        true
      );


      return true;
    }


    /*
     * ========================================
     * CONNEXION REFUSÉE
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


      afficherMessageConnexion(
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
     * RETOUR ADMIN
     * ========================================
     */

    if (
      donneesAdmin
    ) {

      if (
        !lireJeton()
      ) {

        afficherConnexion();


        afficherMessageConnexion(
          "Votre session administrateur n’est plus active. Veuillez vous reconnecter.",
          true
        );


        return true;
      }


      /*
       * On ne recharge surtout pas
       * les produits ici.
       *
       * La réponse reçue peut déjà être
       * la réponse admin-produits.
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
   * TRAITEMENT DES RÉPONSES ADMIN
   * ========================================
   */

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


      /*
       * ========================================
       * ERREUR SERVEUR
       * ========================================
       */

      if (
        !donnees ||
        donnees.succes !== true
      ) {

        demandeProduitsEnCours =
          false;


        const message =
          donnees &&
          donnees.message
            ? String(
                donnees.message
              )
            : "L’opération d’administration a échoué.";


        if (
          message
            .toLowerCase()
            .includes(
              "session"
            )
        ) {

          supprimerJeton();


          afficherConnexion();


          afficherMessageConnexion(
            message,
            true
          );


          return;
        }


        afficherMessageAdministration(
          message,
          true
        );


        return;
      }


      /*
       * ========================================
       * PRODUITS
       * ========================================
       */

      if (
        donnees.type ===
        "admin-produits"
      ) {

        demandeProduitsEnCours =
          false;


        afficherProduits(
          donnees.produits || []
        );


        afficherMessageMemorise();


        return;
      }


      /*
       * ========================================
       * RÉAPPROVISIONNEMENT
       * ========================================
       */

      if (
        donnees.type ===
        "admin-reapprovisionnement"
      ) {

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


        const quantite =
          convertirNombre(
            resultat.quantiteRecue,
            stockApres -
              stockAvant
          );


        let message =
          "Réapprovisionnement enregistré : " +
          produit +
          " — +" +
          quantite +
          " exemplaire";


        if (
          Math.abs(
            quantite
          ) !== 1
        ) {

          message +=
            "s";
        }


        message +=
          " — stock " +
          stockAvant +
          " → " +
          stockApres +
          ".";


        /*
         * Le message doit survivre
         * à la seconde navigation
         * nécessaire pour recharger
         * la liste des produits.
         */

        memoriserMessageAdministration(
          message,
          false
        );


        fermerReapprovisionnement();


        /*
         * On redemande maintenant
         * les produits pour afficher
         * le nouveau stock.
         */

        demanderProduits();


        return;
      }


      afficherMessageAdministration(
        "La réponse reçue d’Apps Script n’est pas reconnue.",
        true
      );


    } catch (erreur) {

      console.error(
        erreur
      );


      demandeProduitsEnCours =
        false;


      afficherMessageAdministration(
        "Impossible de lire les données reçues d’Apps Script.",
        true
      );
    }
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


    afficherMessageConnexion(
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

    if (
      demandeProduitsEnCours
    ) {

      return;
    }


    const jeton =
      lireJeton();


    if (!jeton) {

      afficherConnexion();


      afficherMessageConnexion(
        "Votre session administrateur n’est plus active. Veuillez vous reconnecter.",
        true
      );


      return;
    }


    const formulaire =
      creerFormulaireAdministration(
        "admin-produits"
      );


    if (!formulaire) {

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


    document.body.appendChild(
      formulaire
    );


    HTMLFormElement
      .prototype
      .submit
      .call(
        formulaire
      );
  }


  /*
   * ========================================
   * TRI DES PRODUITS
   * ========================================
   */

  function comparerProduitsAdmin(
    a,
    b
  ) {

    const categorieA =
      nettoyerTexte(
        a.categorie
      ).toLowerCase();


    const categorieB =
      nettoyerTexte(
        b.categorie
      ).toLowerCase();


    const titreA =
      nettoyerTexte(
        a.titre
      );


    const titreB =
      nettoyerTexte(
        b.titre
      );


    /*
     * ========================================
     * LIVRES EN PREMIER
     * ========================================
     */

    const estLivreA =
      categorieA.includes(
        "livre"
      );


    const estLivreB =
      categorieB.includes(
        "livre"
      );


    if (
      estLivreA &&
      !estLivreB
    ) {

      return -1;
    }


    if (
      !estLivreA &&
      estLivreB
    ) {

      return 1;
    }


    if (
      estLivreA &&
      estLivreB
    ) {

      return titreA.localeCompare(
        titreB,
        "fr",
        {
          sensitivity:
            "base"
        }
      );
    }


    /*
     * ========================================
     * DRAPEAUX
     * ========================================
     */

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
      indexA !== -1 &&
      indexB !== -1
    ) {

      return indexA -
        indexB;
    }


    if (
      indexA !== -1
    ) {

      return -1;
    }


    if (
      indexB !== -1
    ) {

      return 1;
    }


    /*
     * Autres produits éventuels.
     */

    return titreA.localeCompare(
      titreB,
      "fr",
      {
        sensitivity:
          "base"
      }
    );
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
          ajouterLigneProduit(
            bloc,
            "Stock",
            stock
          );


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
            ? poids +
              " g"
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
         * ========================================
         * ACTIONS
         * ========================================
         */

        const actions =
          document.createElement(
            "div"
          );


        actions.className =
          "actions-produit";


        /*
         * MODIFIER
         *
         * Activé à l'étape suivante.
         */

        const boutonModifier =
          creerBoutonAction(
            "Modifier"
          );


        boutonModifier.disabled =
          true;


        /*
         * RÉAPPROVISIONNER
         */

        const boutonReapprovisionner =
          creerBoutonAction(
            "Réapprovisionner"
          );


        boutonReapprovisionner
          .addEventListener(
            "click",
            function () {

              ouvrirReapprovisionnement(
                produit
              );
            }
          );


        /*
         * SORTIE MANUELLE
         *
         * Activée à l'étape suivante.
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


        elements.listeProduits
          .appendChild(
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


    return ligne;
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
   * ========================================
   * RÉAPPROVISIONNEMENT
   * ========================================
   */

  function ouvrirReapprovisionnement(
    produit
  ) {

    produitReapprovisionnement =
      produit;


    elements.nomProduitReapprovisionnement
      .textContent =
        nettoyerTexte(
          produit.titre
        ) ||
        nettoyerTexte(
          produit.id
        ) ||
        "Produit";


    elements.stockProduitReapprovisionnement
      .textContent =
        "Stock actuel : " +
        convertirNombre(
          produit.stockActuel,
          0
        );


    elements.quantiteReapprovisionnement
      .value =
        "";


    elements.coutReapprovisionnement
      .value =
        "0";


    elements.observationReapprovisionnement
      .value =
        "";


    afficherMessageReapprovisionnement(
      "",
      false
    );


    elements.validerReapprovisionnement
      .disabled =
        false;


    elements.validerReapprovisionnement
      .textContent =
        "Valider le réapprovisionnement";


    elements.fondReapprovisionnement
      .hidden =
        false;


    elements.quantiteReapprovisionnement
      .focus();
  }


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
  }


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
      !elements.formulaireReapprovisionnement
        .checkValidity()
    ) {

      elements.formulaireReapprovisionnement
        .reportValidity();


      return;
    }


    const quantite =
      convertirNombre(
        elements.quantiteReapprovisionnement
          .value,
        0
      );


    const cout =
      convertirNombre(
        elements.coutReapprovisionnement
          .value,
        0
      );


    /*
     * La quantité doit être entière.
     */

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


    const formulaire =
      creerFormulaireAdministration(
        "admin-reapprovisionnement"
      );


    if (!formulaire) {

      return;
    }


    /*
     * DONNÉES MÉTIER
     */

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
      elements.observationReapprovisionnement
        .value
    );


    elements.validerReapprovisionnement
      .disabled =
        true;


    elements.validerReapprovisionnement
      .textContent =
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
  }


  /*
   * ========================================
   * FORMULAIRES ADMINISTRATION
   * ========================================
   */

  function creerFormulaireAdministration(
    type
  ) {

    const jeton =
      lireJeton();


    if (!jeton) {

      afficherConnexion();


      afficherMessageConnexion(
        "Votre session administrateur n’est plus active. Veuillez vous reconnecter.",
        true
      );


      return null;
    }


    const apiUrl =
      obtenirApiUrl();


    if (!apiUrl) {

      afficherMessageAdministration(
        "L’adresse de l’API Apps Script est absente de config.js.",
        true
      );


      return null;
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
      type
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


    return formulaire;
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
   * DÉCONNEXION
   * ========================================
   */

  function deconnecter() {

    supprimerJeton();


    supprimerMessageMemorise();


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


    fermerReapprovisionnement();


    afficherConnexion();


    afficherMessageConnexion(
      "",
      false
    );


    masquerMessageAdministration();


    if (
      elements.identifiant
    ) {

      elements.identifiant.focus();
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


  /*
   * ========================================
   * MESSAGE APRÈS NAVIGATION
   * ========================================
   */

  function memoriserMessageAdministration(
    message,
    erreur
  ) {

    try {

      sessionStorage.setItem(
        CLE_MESSAGE_ADMIN,
        JSON.stringify({
          message:
            message || "",

          erreur:
            Boolean(
              erreur
            )
        })
      );

    } catch (_) {}
  }


  function afficherMessageMemorise() {

    let texte =
      "";


    try {

      texte =
        sessionStorage.getItem(
          CLE_MESSAGE_ADMIN
        ) || "";


      sessionStorage.removeItem(
        CLE_MESSAGE_ADMIN
      );

    } catch (_) {}


    if (!texte) {

      return;
    }


    try {

      const donnees =
        JSON.parse(
          texte
        );


      afficherMessageAdministration(
        donnees.message || "",
        Boolean(
          donnees.erreur
        )
      );


    } catch (_) {}
  }


  function supprimerMessageMemorise() {

    try {

      sessionStorage.removeItem(
        CLE_MESSAGE_ADMIN
      );

    } catch (_) {}
  }


  /*
   * ========================================
   * MESSAGES
   * ========================================
   */

  function afficherMessageConnexion(
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


  function afficherMessageAdministration(
    message,
    erreur
  ) {

    if (
      !elements.messageAdministration
    ) {

      return;
    }


    if (!message) {

      masquerMessageAdministration();


      return;
    }


    elements.messageAdministration.hidden =
      false;


    elements.messageAdministration.textContent =
      message;


    elements.messageAdministration.className =
      erreur
        ? "message message-erreur"
        : "message message-succes";
  }


  function masquerMessageAdministration() {

    if (
      !elements.messageAdministration
    ) {

      return;
    }


    elements.messageAdministration.hidden =
      true;


    elements.messageAdministration.textContent =
      "";


    elements.messageAdministration.className =
      "message";
  }


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
   * ========================================
   * ERREUR PRODUITS
   * ========================================
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
