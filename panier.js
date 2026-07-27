"use strict";

(function () {
  const CLE_PANIER =
    "herria-bihotzean-panier";

  const traductions = {
    fr: {
      titreDocument:
        "Panier — Herria Bihotzean",

      titrePage:
        "Panier",

      panierVide:
        "Votre panier est vide.",

      decouvrir:
        "Découvrir la boutique",

      prixUnitaire:
        "Prix unitaire",

      diminuer:
        "Diminuer la quantité",

      augmenter:
        "Augmenter la quantité",

      supprimer:
        "Supprimer",

      photoAbsente:
        "Photographie non disponible",

      sousTotal:
        "Sous-total",

      expedition:
        "Expédition",

      expeditionValeur:
        "Calculée lors de la commande",

      texteLivraison:
        "Les éventuels frais de livraison seront calculés lors de la commande selon les articles choisis.",

      continuer:
        "Continuer mes achats",

      commander:
        "Commander",

      vider:
        "Vider le panier",

      retour:
        "← Retour à la boutique",

      confirmationVider:
        "Voulez-vous vraiment vider le panier ?"
    },

    eu: {
      titreDocument:
        "Saskia — Herria Bihotzean",

      titrePage:
        "Saskia",

      panierVide:
        "Zure saskia hutsik da.",

      decouvrir:
        "Saltokia ikusi",

      prixUnitaire:
        "Bateko prezioa",

      diminuer:
        "Kopurua gutitu",

      augmenter:
        "Kopurua handitu",

      supprimer:
        "Kendu",

      photoAbsente:
        "Argazkirik ez dago",

      sousTotal:
        "Azpitotala",

      expedition:
        "Bidalketa",

      expeditionValeur:
        "Eskaintza egiterakoan kalkulatua",

      texteLivraison:
        "Bidalketa gastuak, behar badira, eskaintza egiterakoan kalkulatuko dira hautatutako produktuen arabera.",

      continuer:
        "Erosketekin segitu",

      commander:
        "Eskaintza egin",

      vider:
        "Saskia hustu",

      retour:
        "← Saltokiarat itzuli",

      confirmationVider:
        "Saskia osoki hustu nahi duzu ?"
    }
  };

  let langue = "fr";

  const elements = {};

  document.addEventListener(
    "DOMContentLoaded",
    initialiser
  );

  function initialiser() {
    memoriserElements();
    installerEvenements();

    langue =
      obtenirLangueCourante();

    appliquerLangue();
    afficherPanier();
  }

  function memoriserElements() {
    elements.titrePage =
      document.getElementById(
        "titre-page"
      );

    elements.panierVide =
      document.getElementById(
        "panier-vide"
      );

    elements.textePanierVide =
      document.getElementById(
        "texte-panier-vide"
      );

    elements.lienDecouvrir =
      document.getElementById(
        "lien-decouvrir"
      );

    elements.contenuPanier =
      document.getElementById(
        "contenu-panier"
      );

    elements.listePanier =
      document.getElementById(
        "liste-panier"
      );

    elements.etiquetteSousTotal =
      document.getElementById(
        "etiquette-sous-total"
      );

    elements.sousTotal =
      document.getElementById(
        "sous-total"
      );

    elements.etiquetteExpedition =
      document.getElementById(
        "etiquette-expedition"
      );

    elements.valeurExpedition =
      document.getElementById(
        "valeur-expedition"
      );

    elements.texteLivraison =
      document.getElementById(
        "texte-livraison"
      );

    elements.lienContinuer =
      document.getElementById(
        "lien-continuer"
      );

    elements.lienCommander =
      document.getElementById(
        "lien-commander"
      );

    elements.viderPanier =
      document.getElementById(
        "vider-panier"
      );

    elements.lienRetour =
      document.getElementById(
        "lien-retour"
      );
  }

  function installerEvenements() {
    document.addEventListener(
      "herria-language-change",
      function (evenement) {
        langue =
          evenement.detail &&
          evenement.detail.lang === "eu"
            ? "eu"
            : "fr";

        appliquerLangue();
        afficherPanier();
      }
    );

    elements.viderPanier.addEventListener(
      "click",
      viderPanier
    );

    window.addEventListener(
      "storage",
      function (evenement) {
        if (
          evenement.key ===
          CLE_PANIER
        ) {
          afficherPanier();
        }
      }
    );
  }

  function obtenirLangueCourante() {
    if (
      typeof window.hbCurrentLanguage ===
      "function"
    ) {
      return (
        window.hbCurrentLanguage() === "eu"
          ? "eu"
          : "fr"
      );
    }

    return (
      document.documentElement.lang === "eu"
        ? "eu"
        : "fr"
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

    document.title =
      t.titreDocument;

    elements.titrePage.textContent =
      t.titrePage;

    elements.textePanierVide.textContent =
      t.panierVide;

    elements.lienDecouvrir.textContent =
      t.decouvrir;

    elements.etiquetteSousTotal.textContent =
      t.sousTotal;

    elements.etiquetteExpedition.textContent =
      t.expedition;

    elements.valeurExpedition.textContent =
      t.expeditionValeur;

    elements.texteLivraison.textContent =
      t.texteLivraison;

    elements.lienContinuer.textContent =
      t.continuer;

    elements.lienCommander.textContent =
      t.commander;

    elements.viderPanier.textContent =
      t.vider;

    elements.lienRetour.textContent =
      t.retour;

    elements.lienRetour.href =
      "boutique.html";
  }

  function afficherPanier() {
    const panier =
      lirePanier();

    elements.listePanier.innerHTML =
      "";

    if (
      panier.length === 0
    ) {
      elements.panierVide.hidden =
        false;

      elements.contenuPanier.hidden =
        true;

      return;
    }

    elements.panierVide.hidden =
      true;

    elements.contenuPanier.hidden =
      false;

    panier.forEach(
      function (article) {
        elements.listePanier.appendChild(
          creerArticlePanier(
            article
          )
        );
      }
    );

    calculerSousTotal(
      panier
    );
  }

  function creerArticlePanier(
    article
  ) {
    const t =
      traductions[langue] ||
      traductions.fr;

    const bloc =
      document.createElement(
        "article"
      );

    bloc.className =
      "article-panier";

    /*
     * PHOTO
     */
    const zonePhoto =
      document.createElement(
        "div"
      );

    zonePhoto.className =
      "zone-photo";

    const photo =
      nettoyerTexte(
        article.photoPrincipale
      );

    if (photo) {
      const image =
        document.createElement(
          "img"
        );

      image.className =
        "photo-produit";

      image.src =
        photo;

      image.alt =
        obtenirTitreArticle(
          article
        );

      image.addEventListener(
        "error",
        function () {
          zonePhoto.innerHTML =
            "";

          ajouterPhotoAbsente(
            zonePhoto
          );
        }
      );

      zonePhoto.appendChild(
        image
      );
    } else {
      ajouterPhotoAbsente(
        zonePhoto
      );
    }

    /*
     * INFORMATIONS
     */
    const informations =
      document.createElement(
        "div"
      );

    informations.className =
      "informations-article";

    const titre =
      document.createElement(
        "h2"
      );

    titre.className =
      "titre-article";

    titre.textContent =
      obtenirTitreArticle(
        article
      );

    const sousTitre =
      document.createElement(
        "p"
      );

    sousTitre.className =
      "sous-titre-article";

    sousTitre.textContent =
      obtenirSousTitreArticle(
        article
      );

    if (
      !sousTitre.textContent
    ) {
      sousTitre.hidden =
        true;
    }

    const prixUnitaire =
      document.createElement(
        "p"
      );

    prixUnitaire.className =
      "prix-unitaire";

    prixUnitaire.textContent =
      t.prixUnitaire +
      " : " +
      formaterPrix(
        article.prix
      );

    /*
     * CONTRÔLES
     */
    const controle =
      document.createElement(
        "div"
      );

    controle.className =
      "controle-article";

    const blocQuantite =
      document.createElement(
        "div"
      );

    blocQuantite.className =
      "bloc-quantite";

    const diminuer =
      document.createElement(
        "button"
      );

    diminuer.type =
      "button";

    diminuer.className =
      "bouton-quantite";

    diminuer.textContent =
      "−";

    diminuer.setAttribute(
      "aria-label",
      t.diminuer
    );

    const champ =
      document.createElement(
        "input"
      );

    champ.type =
      "number";

    champ.className =
      "champ-quantite";

    champ.min =
      "1";

    champ.value =
      String(
        normaliserNombreEntier(
          article.quantite,
          1
        )
      );

    const stock =
      normaliserNombreEntier(
        article.stockActuel,
        0
      );

    const maximum =
      stock > 0
        ? Math.min(
            stock,
            20
          )
        : 20;

    champ.max =
      String(maximum);

    champ.inputMode =
      "numeric";

    const augmenter =
      document.createElement(
        "button"
      );

    augmenter.type =
      "button";

    augmenter.className =
      "bouton-quantite";

    augmenter.textContent =
      "+";

    augmenter.setAttribute(
      "aria-label",
      t.augmenter
    );

    diminuer.addEventListener(
      "click",
      function () {
        modifierQuantite(
          article.produitId,
          -1
        );
      }
    );

    augmenter.addEventListener(
      "click",
      function () {
        modifierQuantite(
          article.produitId,
          1
        );
      }
    );

    champ.addEventListener(
      "change",
      function () {
        definirQuantite(
          article.produitId,
          champ.value
        );
      }
    );

    blocQuantite.appendChild(
      diminuer
    );

    blocQuantite.appendChild(
      champ
    );

    blocQuantite.appendChild(
      augmenter
    );

    const supprimer =
      document.createElement(
        "button"
      );

    supprimer.type =
      "button";

    supprimer.className =
      "bouton-supprimer";

    supprimer.textContent =
      t.supprimer;

    supprimer.addEventListener(
      "click",
      function () {
        supprimerArticle(
          article.produitId
        );
      }
    );

    controle.appendChild(
      blocQuantite
    );

    controle.appendChild(
      supprimer
    );

    informations.appendChild(
      titre
    );

    informations.appendChild(
      sousTitre
    );

    informations.appendChild(
      prixUnitaire
    );

    informations.appendChild(
      controle
    );

    /*
     * TOTAL DE LA LIGNE
     */
    const total =
      document.createElement(
        "div"
      );

    total.className =
      "total-article";

    total.textContent =
      formaterPrix(
        Number(article.prix) *
        normaliserNombreEntier(
          article.quantite,
          1
        )
      );

    bloc.appendChild(
      zonePhoto
    );

    bloc.appendChild(
      informations
    );

    bloc.appendChild(
      total
    );

    return bloc;
  }

  function ajouterPhotoAbsente(
    conteneur
  ) {
    const absence =
      document.createElement(
        "div"
      );

    absence.className =
      "photo-absente";

    absence.textContent =
      traductions[langue]
        .photoAbsente;

    conteneur.appendChild(
      absence
    );
  }

  function obtenirTitreArticle(
    article
  ) {
    if (
      langue === "eu" &&
      nettoyerTexte(
        article.titreBasque
      )
    ) {
      return nettoyerTexte(
        article.titreBasque
      );
    }

    return (
      nettoyerTexte(
        article.titre
      ) ||
      nettoyerTexte(
        article.produitId
      )
    );
  }

  function obtenirSousTitreArticle(
    article
  ) {
    if (
      langue === "eu" &&
      nettoyerTexte(
        article.sousTitreBasque
      )
    ) {
      return nettoyerTexte(
        article.sousTitreBasque
      );
    }

    return nettoyerTexte(
      article.sousTitre
    );
  }

  function modifierQuantite(
    produitId,
    ecart
  ) {
    const panier =
      lirePanier();

    const article =
      panier.find(
        function (item) {
          return (
            nettoyerTexte(
              item.produitId
            ) ===
            nettoyerTexte(
              produitId
            )
          );
        }
      );

    if (!article) {
      return;
    }

    const stock =
      normaliserNombreEntier(
        article.stockActuel,
        0
      );

    const maximum =
      stock > 0
        ? Math.min(
            stock,
            20
          )
        : 20;

    let quantite =
      normaliserNombreEntier(
        article.quantite,
        1
      );

    quantite +=
      ecart;

    quantite =
      Math.max(
        1,
        quantite
      );

    quantite =
      Math.min(
        maximum,
        quantite
      );

    article.quantite =
      quantite;

    enregistrerPanier(
      panier
    );

    afficherPanier();
  }

  function definirQuantite(
    produitId,
    nouvelleQuantite
  ) {
    const panier =
      lirePanier();

    const article =
      panier.find(
        function (item) {
          return (
            nettoyerTexte(
              item.produitId
            ) ===
            nettoyerTexte(
              produitId
            )
          );
        }
      );

    if (!article) {
      return;
    }

    const stock =
      normaliserNombreEntier(
        article.stockActuel,
        0
      );

    const maximum =
      stock > 0
        ? Math.min(
            stock,
            20
          )
        : 20;

    let quantite =
      normaliserNombreEntier(
        nouvelleQuantite,
        1
      );

    quantite =
      Math.max(
        1,
        quantite
      );

    quantite =
      Math.min(
        maximum,
        quantite
      );

    article.quantite =
      quantite;

    enregistrerPanier(
      panier
    );

    afficherPanier();
  }

  function supprimerArticle(
    produitId
  ) {
    const panier =
      lirePanier()
        .filter(
          function (article) {
            return (
              nettoyerTexte(
                article.produitId
              ) !==
              nettoyerTexte(
                produitId
              )
            );
          }
        );

    enregistrerPanier(
      panier
    );

    afficherPanier();
  }

  function viderPanier() {
    const t =
      traductions[langue] ||
      traductions.fr;

    if (
      !window.confirm(
        t.confirmationVider
      )
    ) {
      return;
    }

    localStorage.removeItem(
      CLE_PANIER
    );

    afficherPanier();
  }

  function calculerSousTotal(
    panier
  ) {
    const total =
      panier.reduce(
        function (
          somme,
          article
        ) {
          const prix =
            Number(
              article.prix
            );

          const quantite =
            normaliserNombreEntier(
              article.quantite,
              1
            );

          if (
            !Number.isFinite(
              prix
            )
          ) {
            return somme;
          }

          return (
            somme +
            prix *
            quantite
          );
        },
        0
      );

    elements.sousTotal.textContent =
      formaterPrix(
        total
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

  function enregistrerPanier(
    panier
  ) {
    localStorage.setItem(
      CLE_PANIER,
      JSON.stringify(
        panier
      )
    );
  }

  function normaliserNombreEntier(
    valeur,
    defaut
  ) {
    const nombre =
      parseInt(
        valeur,
        10
      );

    return Number.isFinite(
      nombre
    )
      ? nombre
      : defaut;
  }

  function formaterPrix(
    valeur
  ) {
    const nombre =
      Number(
        valeur
      );

    if (
      !Number.isFinite(
        nombre
      )
    ) {
      return "—";
    }

    return new Intl.NumberFormat(
      "fr-FR",
      {
        style: "currency",
        currency: "EUR"
      }
    ).format(
      nombre
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
