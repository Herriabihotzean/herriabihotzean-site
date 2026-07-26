"use strict";

(function () {
  const CLE_LANGUE =
    "herria_langue";

  const CLE_PANIER =
    "herria-bihotzean-panier";

  const traductions = {
    fr: {
      titreDocument:
        "Produit — Herria Bihotzean",

      titrePage:
        "Produit",

      chargement:
        "Chargement du produit…",

      titreErreur:
        "Produit introuvable",

      erreurGenerale:
        "Une erreur s’est produite pendant le chargement du produit.",

      identifiantAbsent:
        "Aucun identifiant de produit n’a été indiqué dans l’adresse.",

      apiAbsente:
        "L’adresse de l’API n’est pas renseignée dans le fichier config.js.",

      retourBoutique:
        "← Retour à la boutique",

      panier:
        "Panier",

      disponible:
        "Disponible",

      indisponible:
        "Indisponible",

      ajouter:
        "Ajouter au panier",

      ajouterIndisponible:
        "Produit indisponible",

      quantite:
        "Quantité",

      expedition:
        "Expédition",

      fraisLivraison:
        "Frais de livraison",

      poids:
        "Poids",

      gratuit:
        "Gratuit",

      nonRenseigne:
        "Non renseigné",

      photoAbsente:
        "Photographie non disponible",

      confirmation:
        "Le produit a été ajouté au panier.",

      diminutionQuantite:
        "Diminuer la quantité",

      augmentationQuantite:
        "Augmenter la quantité",

      presentation:
        "Présentation"
    },

    eu: {
      titreDocument:
        "Salgaia — Herria Bihotzean",

      titrePage:
        "Salgaia",

      chargement:
        "Salgaia kargatzen…",

      titreErreur:
        "Salgaia ez da aurkitu",

      erreurGenerale:
        "Huts bat gertatu da salgaiaren kargatzean.",

      identifiantAbsent:
        "Ez da salgaiaren identifikatzailerik adierazi helbidean.",

      apiAbsente:
        "APIaren helbidea ez da config.js fitxategian adierazia.",

      retourBoutique:
        "← Saltokiarat itzuli",

      panier:
        "Saskia",

      disponible:
        "Eskuragarri",

      indisponible:
        "Ez dago eskuragarri",

      ajouter:
        "Saskirat gehitu",

      ajouterIndisponible:
        "Salgaia ez dago eskuragarri",

      quantite:
        "Kopurua",

      expedition:
        "Bidalketa",

      fraisLivraison:
        "Bidalketa gastuak",

      poids:
        "Pisua",

      gratuit:
        "Doan",

      nonRenseigne:
        "Ez da adierazi",

      photoAbsente:
        "Argazkirik ez dago",

      confirmation:
        "Salgaia saskira gehitu da.",

      diminutionQuantite:
        "Kopurua gutitu",

      augmentationQuantite:
        "Kopurua handitu",

      presentation:
        "Aurkezpena"
    }
  };

  let langue = "fr";
  let produit = null;

  const elements = {};

  document.addEventListener(
    "DOMContentLoaded",
    initialiser
  );

  function initialiser() {
    memoriserElements();

    langue =
      determinerLangueInitiale();

    try {
      localStorage.setItem(
        CLE_LANGUE,
        langue
      );
    } catch (_) {}

    /*
     * On laisse langues.js gérer les boutons.
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
    mettreAJourNombrePanier();
    chargerProduit();
  }

  function memoriserElements() {
    elements.titrePage =
      document.getElementById(
        "titre-page"
      );

    elements.chargement =
      document.getElementById(
        "chargement"
      );

    elements.texteChargement =
      document.getElementById(
        "texte-chargement"
      );

    elements.erreur =
      document.getElementById(
        "erreur"
      );

    elements.titreErreur =
      document.getElementById(
        "titre-erreur"
      );

    elements.messageErreur =
      document.getElementById(
        "message-erreur"
      );

    elements.ficheProduit =
      document.getElementById(
        "fiche-produit"
      );

    elements.imagePrincipale =
      document.getElementById(
        "image-principale"
      );

    elements.imageAbsente =
      document.getElementById(
        "image-absente"
      );

    elements.miniatures =
      document.getElementById(
        "miniatures"
      );

    elements.categorie =
      document.getElementById(
        "categorie-produit"
      );

    elements.titre =
      document.getElementById(
        "titre-produit"
      );

    elements.sousTitre =
      document.getElementById(
        "sous-titre-produit"
      );

    elements.prix =
      document.getElementById(
        "prix-produit"
      );

    elements.badge =
      document.getElementById(
        "badge-disponibilite"
      );

    elements.blocPresentation =
      document.getElementById(
        "bloc-presentation"
      );

    elements.titrePresentation =
      document.getElementById(
        "titre-presentation"
      );

    elements.description =
      document.getElementById(
        "description-produit"
      );

    elements.etiquetteExpedition =
      document.getElementById(
        "etiquette-expedition"
      );

    elements.modeExpedition =
      document.getElementById(
        "mode-expedition"
      );

    elements.etiquetteFrais =
      document.getElementById(
        "etiquette-frais"
      );

    elements.fraisLivraison =
      document.getElementById(
        "frais-livraison"
      );

    elements.lignePoids =
      document.getElementById(
        "ligne-poids"
      );

    elements.etiquettePoids =
      document.getElementById(
        "etiquette-poids"
      );

    elements.poids =
      document.getElementById(
        "poids-produit"
      );

    elements.etiquetteQuantite =
      document.getElementById(
        "etiquette-quantite"
      );

    elements.quantite =
      document.getElementById(
        "quantite"
      );

    elements.diminuer =
      document.getElementById(
        "diminuer-quantite"
      );

    elements.augmenter =
      document.getElementById(
        "augmenter-quantite"
      );

    elements.boutonAjouter =
      document.getElementById(
        "bouton-ajouter"
      );

    elements.confirmation =
      document.getElementById(
        "confirmation-ajout"
      );

    elements.textePanier =
      document.getElementById(
        "texte-panier"
      );

    elements.nombrePanier =
      document.getElementById(
        "nombre-panier"
      );

    elements.lienRetour =
      document.getElementById(
        "lien-retour"
      );
  }

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
      langueUrl === "eu" ||
      langueUrl === "fr"
    ) {
      return langueUrl;
    }

    try {
      if (
        localStorage.getItem(
          CLE_LANGUE
        ) === "eu"
      ) {
        return "eu";
      }
    } catch (_) {}

    if (
      typeof window.hbCurrentLanguage ===
        "function" &&
      window.hbCurrentLanguage() === "eu"
    ) {
      return "eu";
    }

    return "fr";
  }

  function installerEvenements() {
    /*
     * Langues.js émet cet événement lorsqu'on
     * clique sur l'un de ses deux boutons.
     */
    document.addEventListener(
      "herria-language-change",
      function (evenement) {
        const nouvelleLangue =
          evenement.detail &&
          evenement.detail.lang === "eu"
            ? "eu"
            : "fr";

        langue =
          nouvelleLangue;

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

    elements.diminuer.addEventListener(
      "click",
      function () {
        modifierQuantite(-1);
      }
    );

    elements.augmenter.addEventListener(
      "click",
      function () {
        modifierQuantite(1);
      }
    );

    elements.quantite.addEventListener(
      "change",
      normaliserQuantite
    );

    elements.boutonAjouter.addEventListener(
      "click",
      ajouterAuPanier
    );

    window.addEventListener(
      "storage",
      function (evenement) {
        if (
          evenement.key ===
          CLE_PANIER
        ) {
          mettreAJourNombrePanier();
        }
      }
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

  function appliquerLangue() {
    const t =
      traductions[langue] ||
      traductions.fr;

    document.documentElement.lang =
      langue === "eu"
        ? "eu"
        : "fr";

    elements.titrePage.textContent =
      t.titrePage;

    elements.texteChargement.textContent =
      t.chargement;

    elements.titreErreur.textContent =
      t.titreErreur;

    elements.titrePresentation.textContent =
      t.presentation;

    elements.etiquetteExpedition.textContent =
      t.expedition;

    elements.etiquetteFrais.textContent =
      t.fraisLivraison;

    elements.etiquettePoids.textContent =
      t.poids;

    elements.etiquetteQuantite.textContent =
      t.quantite;

    elements.imageAbsente.textContent =
      t.photoAbsente;

    elements.confirmation.textContent =
      t.confirmation;

    elements.textePanier.textContent =
      t.panier;

    elements.lienRetour.textContent =
      t.retourBoutique;

    elements.lienRetour.href =
      "boutique.html";

    elements.diminuer.setAttribute(
      "aria-label",
      t.diminutionQuantite
    );

    elements.augmenter.setAttribute(
      "aria-label",
      t.augmentationQuantite
    );

    if (produit) {
      afficherProduit();
    } else {
      document.title =
        t.titreDocument;
    }
  }

  function chargerProduit() {
    const parametres =
      new URLSearchParams(
        window.location.search
      );

    const produitId =
      nettoyerTexte(
        parametres.get("id") ||
        parametres.get("produitId")
      );

    if (!produitId) {
      afficherErreur(
        traductions[langue]
          .identifiantAbsent
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
      afficherErreur(
        traductions[langue]
          .apiAbsente
      );
      return;
    }

    const nomCallback =
      "recevoirProduit_" +
      Date.now() +
      "_" +
      Math.random()
        .toString(36)
        .slice(2);

    const script =
      document.createElement(
        "script"
      );

    let termine =
      false;

    const minuterie =
      window.setTimeout(
        function () {
          if (termine) {
            return;
          }

          termine = true;

          nettoyerJSONP(
            script,
            nomCallback
          );

          afficherErreur(
            traductions[langue]
              .erreurGenerale
          );
        },
        15000
      );

    window[nomCallback] =
      function (reponse) {
        if (termine) {
          return;
        }

        termine = true;

        window.clearTimeout(
          minuterie
        );

        nettoyerJSONP(
          script,
          nomCallback
        );

        if (
          !reponse ||
          reponse.succes !== true ||
          !reponse.produit
        ) {
          afficherErreur(
            reponse &&
            reponse.message
              ? reponse.message
              : traductions[langue]
                  .erreurGenerale
          );

          return;
        }

        produit =
          reponse.produit;

        afficherProduit();
      };

    const separateur =
      apiUrl.includes("?")
        ? "&"
        : "?";

    /*
     * IMPORTANT :
     * Apps Script attend bien produitId.
     */
    script.src =
      apiUrl +
      separateur +
      "action=produit" +
      "&produitId=" +
      encodeURIComponent(
        produitId
      ) +
      "&callback=" +
      encodeURIComponent(
        nomCallback
      ) +
      "&_=" +
      Date.now();

    script.async = true;

    script.onerror =
      function () {
        if (termine) {
          return;
        }

        termine = true;

        window.clearTimeout(
          minuterie
        );

        nettoyerJSONP(
          script,
          nomCallback
        );

        afficherErreur(
          traductions[langue]
            .erreurGenerale
        );
      };

    document.body.appendChild(
      script
    );
  }

  function nettoyerJSONP(
    script,
    nomCallback
  ) {
    if (
      script &&
      script.parentNode
    ) {
      script.parentNode.removeChild(
        script
      );
    }

    try {
      delete window[nomCallback];
    } catch (_) {
      window[nomCallback] =
        undefined;
    }
  }

  function afficherProduit() {
    const t =
      traductions[langue] ||
      traductions.fr;

    elements.titrePresentation.textContent =
      t.presentation;

    elements.chargement.hidden =
      true;

    elements.erreur.hidden =
      true;

    elements.ficheProduit.hidden =
      false;

    const titre =
      obtenirTitreProduit();

    const sousTitre =
      obtenirSousTitreProduit();

    const description =
      obtenirDescriptionProduit();

    document.title =
      titre +
      " — Herria Bihotzean";

    elements.categorie.textContent =
      obtenirCategorieProduit();

    elements.categorie.hidden =
      !elements.categorie.textContent;

    elements.titre.textContent =
      titre;

    elements.sousTitre.textContent =
      sousTitre;

    elements.sousTitre.hidden =
      !sousTitre;

    elements.prix.textContent =
      formaterPrix(
        produit.prix
      );

    /*
     * TEXTE DE PRÉSENTATION
     */
    if (description) {
      elements.description.textContent =
        description;

      elements.blocPresentation.hidden =
        false;

    } else {
      elements.description.textContent =
        "";

      elements.blocPresentation.hidden =
        true;
    }

    const disponible =
      produit.disponible === true;

    elements.badge.textContent =
      disponible
        ? t.disponible
        : t.indisponible;

    elements.badge.className =
      disponible
        ? "badge badge-disponible"
        : "badge badge-indisponible";

    elements.modeExpedition.textContent =
      nettoyerTexte(
        produit.modeExpedition
      ) ||
      t.nonRenseigne;

    const frais =
      Number(
        produit.fraisLivraison
      );

    elements.fraisLivraison.textContent =
      Number.isFinite(frais) &&
      frais > 0
        ? formaterPrix(frais)
        : t.gratuit;

    const poids =
      Number(
        produit.poids
      );

    if (
      Number.isFinite(poids) &&
      poids > 0
    ) {
      elements.poids.textContent =
        Math.round(poids) +
        " g";

      elements.lignePoids.hidden =
        false;
    } else {
      elements.lignePoids.hidden =
        true;
    }

    elements.boutonAjouter.disabled =
      !disponible;

    elements.quantite.disabled =
      !disponible;

    elements.diminuer.disabled =
      !disponible;

    elements.augmenter.disabled =
      !disponible;

    elements.boutonAjouter.textContent =
      disponible
        ? t.ajouter
        : t.ajouterIndisponible;

    definirMaximumQuantite();
    afficherGalerie();
  }

  function obtenirCategorieProduit() {
    const categorie =
      langue === "eu" &&
      nettoyerTexte(
        produit.categorieBasque
      )
        ? nettoyerTexte(
            produit.categorieBasque
          )
        : nettoyerTexte(
            produit.categorie
          );

    const sousCategorie =
      langue === "eu" &&
      nettoyerTexte(
        produit.sousCategorieBasque
      )
        ? nettoyerTexte(
            produit.sousCategorieBasque
          )
        : nettoyerTexte(
            produit.sousCategorie
          );

    return [
      categorie,
      sousCategorie
    ]
      .filter(Boolean)
      .join(" — ");
  }

  function obtenirTitreProduit() {
    if (
      langue === "eu" &&
      nettoyerTexte(
        produit.titreBasque
      )
    ) {
      return nettoyerTexte(
        produit.titreBasque
      );
    }

    return (
      nettoyerTexte(
        produit.titre
      ) ||
      nettoyerTexte(
        produit.produitId
      )
    );
  }

  function obtenirSousTitreProduit() {
    if (
      langue === "eu" &&
      nettoyerTexte(
        produit.sousTitreBasque
      )
    ) {
      return nettoyerTexte(
        produit.sousTitreBasque
      );
    }

    return nettoyerTexte(
      produit.sousTitre
    );
  }

  function obtenirDescriptionProduit() {
    if (
      langue === "eu" &&
      nettoyerTexte(
        produit.descriptionBasque
      )
    ) {
      return nettoyerTexte(
        produit.descriptionBasque
      );
    }

    /*
     * C'est bien le nom renvoyé actuellement
     * par Apps Script.
     */
    return nettoyerTexte(
      produit.descriptionFrancaise
    );
  }

  /*
   * GALERIE :
   * le tableau "photos" contient uniquement
   * les cellules non vides de RESSOURCES.
   */
  function afficherGalerie() {
    const photos =
      Array.isArray(
        produit.photos
      )
        ? produit.photos
            .map(nettoyerTexte)
            .filter(Boolean)
        : [];

    elements.miniatures.innerHTML =
      "";

    if (
      photos.length === 0
    ) {
      elements.imagePrincipale.hidden =
        true;

      elements.imageAbsente.hidden =
        false;

      elements.miniatures.hidden =
        true;

      return;
    }

    afficherImagePrincipale(
      photos[0]
    );

    /*
     * Une seule photo :
     * pas besoin de miniatures.
     */
    if (
      photos.length === 1
    ) {
      elements.miniatures.hidden =
        true;

      return;
    }

    elements.miniatures.hidden =
      false;

    photos.forEach(
      function (url, index) {
        const bouton =
          document.createElement(
            "button"
          );

        bouton.type =
          "button";

        bouton.className =
          index === 0
            ? "miniature active"
            : "miniature";

        const image =
          document.createElement(
            "img"
          );

        image.src = url;

        image.alt =
          obtenirTitreProduit() +
          " — " +
          (index + 1);

        image.loading =
          "lazy";

        bouton.appendChild(
          image
        );

        bouton.addEventListener(
          "click",
          function () {
            afficherImagePrincipale(
              url
            );

            selectionnerMiniature(
              bouton
            );
          }
        );

        elements.miniatures.appendChild(
          bouton
        );
      }
    );
  }

  function afficherImagePrincipale(
    url
  ) {
    elements.imagePrincipale.src =
      url;

    elements.imagePrincipale.alt =
      obtenirTitreProduit();

    elements.imagePrincipale.hidden =
      false;

    elements.imageAbsente.hidden =
      true;

    elements.imagePrincipale.onerror =
      function () {
        elements.imagePrincipale.hidden =
          true;

        elements.imageAbsente.hidden =
          false;
      };
  }

  function selectionnerMiniature(
    boutonActif
  ) {
    elements.miniatures
      .querySelectorAll(
        ".miniature"
      )
      .forEach(
        function (bouton) {
          bouton.classList.remove(
            "active"
          );
        }
      );

    boutonActif.classList.add(
      "active"
    );
  }

  function definirMaximumQuantite() {
    const stock =
      parseInt(
        produit.stockActuel,
        10
      );

    const maximum =
      Number.isFinite(stock) &&
      stock > 0
        ? Math.min(
            stock,
            20
          )
        : 1;

    elements.quantite.max =
      String(maximum);

    normaliserQuantite();
  }

  function modifierQuantite(
    ecart
  ) {
    const actuelle =
      parseInt(
        elements.quantite.value,
        10
      );

    elements.quantite.value =
      String(
        (
          Number.isFinite(
            actuelle
          )
            ? actuelle
            : 1
        ) +
        ecart
      );

    normaliserQuantite();
  }

  function normaliserQuantite() {
    let valeur =
      parseInt(
        elements.quantite.value,
        10
      );

    const maximum =
      parseInt(
        elements.quantite.max ||
        "20",
        10
      );

    if (
      !Number.isFinite(valeur)
    ) {
      valeur = 1;
    }

    valeur =
      Math.max(
        1,
        valeur
      );

    valeur =
      Math.min(
        maximum,
        valeur
      );

    elements.quantite.value =
      String(valeur);
  }

  function ajouterAuPanier() {
    if (
      !produit ||
      produit.disponible !== true
    ) {
      return;
    }

    normaliserQuantite();

    const quantite =
      parseInt(
        elements.quantite.value,
        10
      );

    const panier =
      lirePanier();

    const articleExistant =
      panier.find(
        function (article) {
          return (
            nettoyerTexte(
              article.produitId
            ) ===
            nettoyerTexte(
              produit.produitId
            )
          );
        }
      );

    const stock =
      parseInt(
        produit.stockActuel,
        10
      );

    const maximum =
      Number.isFinite(stock) &&
      stock > 0
        ? Math.min(
            stock,
            20
          )
        : 20;

    if (articleExistant) {
      const ancienneQuantite =
        parseInt(
          articleExistant.quantite,
          10
        );

      articleExistant.quantite =
        Math.min(
          maximum,
          (
            Number.isFinite(
              ancienneQuantite
            )
              ? ancienneQuantite
              : 0
          ) +
          quantite
        );

      mettreAJourArticle(
        articleExistant
      );

    } else {
      panier.push({
        produitId:
          nettoyerTexte(
            produit.produitId
          ),

        categorie:
          nettoyerTexte(
            produit.categorie
          ),

        categorieBasque:
          nettoyerTexte(
            produit.categorieBasque
          ),

        sousCategorie:
          nettoyerTexte(
            produit.sousCategorie
          ),

        sousCategorieBasque:
          nettoyerTexte(
            produit.sousCategorieBasque
          ),

        titre:
          nettoyerTexte(
            produit.titre
          ),

        titreBasque:
          nettoyerTexte(
            produit.titreBasque
          ),

        sousTitre:
          nettoyerTexte(
            produit.sousTitre
          ),

        sousTitreBasque:
          nettoyerTexte(
            produit.sousTitreBasque
          ),

        prix:
          Number(
            produit.prix
          ),

        fraisLivraison:
          Number(
            produit.fraisLivraison
          ),

        modeExpedition:
          nettoyerTexte(
            produit.modeExpedition
          ),

        photoPrincipale:
          nettoyerTexte(
            produit.photoPrincipale
          ),

        stockActuel:
          Number(
            produit.stockActuel
          ),

        poids:
          Number(
            produit.poids
          ),

        quantite:
          quantite
      });
    }

    localStorage.setItem(
      CLE_PANIER,
      JSON.stringify(
        panier
      )
    );

    mettreAJourNombrePanier();

    elements.confirmation.hidden =
      false;

    window.setTimeout(
      function () {
        elements.confirmation.hidden =
          true;
      },
      3500
    );
  }

  function mettreAJourArticle(
    article
  ) {
    article.titre =
      nettoyerTexte(
        produit.titre
      );

    article.titreBasque =
      nettoyerTexte(
        produit.titreBasque
      );

    article.sousTitre =
      nettoyerTexte(
        produit.sousTitre
      );

    article.sousTitreBasque =
      nettoyerTexte(
        produit.sousTitreBasque
      );

    article.prix =
      Number(
        produit.prix
      );

    article.fraisLivraison =
      Number(
        produit.fraisLivraison
      );

    article.photoPrincipale =
      nettoyerTexte(
        produit.photoPrincipale
      );

    article.stockActuel =
      Number(
        produit.stockActuel
      );

    article.poids =
      Number(
        produit.poids
      );
  }

  function lirePanier() {
    try {
      const contenu =
        localStorage.getItem(
          CLE_PANIER
        );

      if (!contenu) {
        return [];
      }

      const panier =
        JSON.parse(
          contenu
        );

      return Array.isArray(
        panier
      )
        ? panier
        : [];

    } catch (_) {
      return [];
    }
  }

  function mettreAJourNombrePanier() {
    const panier =
      lirePanier();

    const total =
      panier.reduce(
        function (
          somme,
          article
        ) {
          const quantite =
            parseInt(
              article.quantite,
              10
            );

          return (
            somme +
            (
              Number.isFinite(
                quantite
              )
                ? Math.max(
                    0,
                    quantite
                  )
                : 0
            )
          );
        },
        0
      );

    elements.nombrePanier.textContent =
      String(total);
  }

  function afficherErreur(
    message
  ) {
    elements.chargement.hidden =
      true;

    elements.ficheProduit.hidden =
      true;

    elements.erreur.hidden =
      false;

    elements.messageErreur.textContent =
      message ||
      traductions[langue]
        .erreurGenerale;
  }

  function formaterPrix(
    valeur
  ) {
    const nombre =
      Number(valeur);

    if (
      !Number.isFinite(nombre)
    ) {
      return "—";
    }

    return new Intl.NumberFormat(
      "fr-FR",
      {
        style: "currency",
        currency: "EUR"
      }
    ).format(nombre);
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
