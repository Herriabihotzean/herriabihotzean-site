"use strict";

(function () {
  const CLE_LANGUE = "herria-bihotzean-langue";
  const CLE_PANIER = "herria-bihotzean-panier";

  const traductions = {
    fr: {
      titrePage: "Boutique",

      introduction:
        "Découvrez les livres, enregistrements et autres ressources proposés par Herria Bihotzean.",

      chargement:
        "Chargement des produits…",

      erreurTitre:
        "Impossible de charger la boutique",

      erreurGenerale:
        "Une erreur s’est produite lors du chargement des produits.",

      apiAbsente:
        "L’adresse de l’API n’est pas renseignée dans config.js.",

      boutiqueVide:
        "Aucun produit n’est actuellement proposé.",

      retour:
        "Retour au site",

      panier:
        "Panier",

      voirProduit:
        "Voir le produit",

      disponible:
        "Disponible",

      indisponible:
        "Indisponible",

      photoAbsente:
        "Photographie non disponible",

      sansCategorie:
        "Autres produits"
    },

    eu: {
      titrePage: "Denda",

      introduction:
        "Herria Bihotzeanek eskaintzen dituen liburuak, grabaketak eta beste baliabideak ezagutu.",

      chargement:
        "Produktuak kargatzen…",

      erreurTitre:
        "Ezin izan da denda kargatu",

      erreurGenerale:
        "Errore bat gertatu da produktuak kargatzean.",

      apiAbsente:
        "APIaren helbidea ez da config.js fitxategian adierazia.",

      boutiqueVide:
        "Ez da produkturik eskaintzen oraingoz.",

      retour:
        "Gunera itzuli",

      panier:
        "Saskia",

      voirProduit:
        "Produktua ikusi",

      disponible:
        "Eskuragarri",

      indisponible:
        "Ez dago eskuragarri",

      photoAbsente:
        "Argazkirik ez dago",

      sansCategorie:
        "Beste produktuak"
    }
  };

  let langue =
    localStorage.getItem(CLE_LANGUE) === "eu"
      ? "eu"
      : "fr";

  let produits = [];

  const elements = {};

  document.addEventListener(
    "DOMContentLoaded",
    initialiser
  );

  function initialiser() {
    memoriserElements();
    installerEvenements();
    appliquerLangue();
    mettreAJourNombrePanier();
    chargerProduits();
  }

  function memoriserElements() {
    elements.boutonFrancais =
      document.getElementById(
        "bouton-francais"
      );

    elements.boutonBasque =
      document.getElementById(
        "bouton-basque"
      );

    elements.titrePage =
      document.getElementById(
        "titre-page"
      );

    elements.texteIntroduction =
      document.getElementById(
        "texte-introduction"
      );

    elements.texteChargement =
      document.getElementById(
        "texte-chargement"
      );

    elements.chargement =
      document.getElementById(
        "chargement"
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

    elements.boutiqueVide =
      document.getElementById(
        "boutique-vide"
      );

    elements.texteBoutiqueVide =
      document.getElementById(
        "texte-boutique-vide"
      );

    elements.catalogue =
      document.getElementById(
        "catalogue"
      );

    elements.lienRetour =
      document.getElementById(
        "lien-retour"
      );

    elements.lienPanier =
      document.getElementById(
        "lien-panier"
      );

    elements.nombrePanier =
      document.getElementById(
        "nombre-panier"
      );
  }

  function installerEvenements() {
    elements.boutonFrancais.addEventListener(
      "click",
      function () {
        changerLangue("fr");
      }
    );

    elements.boutonBasque.addEventListener(
      "click",
      function () {
        changerLangue("eu");
      }
    );

    window.addEventListener(
      "storage",
      function (evenement) {
        if (
          evenement.key === CLE_PANIER
        ) {
          mettreAJourNombrePanier();
        }

        if (
          evenement.key === CLE_LANGUE
        ) {
          langue =
            evenement.newValue === "eu"
              ? "eu"
              : "fr";

          appliquerLangue();
        }
      }
    );
  }

  function changerLangue(nouvelleLangue) {
    langue =
      nouvelleLangue === "eu"
        ? "eu"
        : "fr";

    localStorage.setItem(
      CLE_LANGUE,
      langue
    );

    appliquerLangue();
  }

  function appliquerLangue() {
    const t = traductions[langue];

    document.documentElement.lang =
      langue === "eu"
        ? "eu"
        : "fr";

    document.title =
      t.titrePage +
      " — Herria Bihotzean";

    elements.titrePage.textContent =
      t.titrePage;

    elements.texteIntroduction.textContent =
      t.introduction;

    elements.texteChargement.textContent =
      t.chargement;

    elements.titreErreur.textContent =
      t.erreurTitre;

    elements.texteBoutiqueVide.textContent =
      t.boutiqueVide;

    elements.lienRetour.textContent =
      t.retour;

    elements.lienPanier.childNodes[0].nodeValue =
      t.panier + " ";

    elements.boutonFrancais.classList.toggle(
      "actif",
      langue === "fr"
    );

    elements.boutonBasque.classList.toggle(
      "actif",
      langue === "eu"
    );

    elements.boutonFrancais.setAttribute(
      "aria-pressed",
      String(langue === "fr")
    );

    elements.boutonBasque.setAttribute(
      "aria-pressed",
      String(langue === "eu")
    );

    if (produits.length > 0) {
      afficherCatalogue(produits);
    }
  }

  function chargerProduits() {
    masquerErreur();
    elements.chargement.hidden = false;
    elements.boutiqueVide.hidden = true;
    elements.catalogue.innerHTML = "";

    const apiUrl =
      window.HB_CONFIG &&
      window.HB_CONFIG.API_URL
        ? String(
            window.HB_CONFIG.API_URL
          ).trim()
        : "";

    if (!apiUrl) {
      afficherErreur(
        traductions[langue].apiAbsente
      );
      return;
    }

    const nomCallback =
      "recevoirProduits_" +
      Date.now() +
      "_" +
      Math.random()
        .toString(36)
        .slice(2);

    const script =
      document.createElement("script");

    const minuterie =
      window.setTimeout(
        function () {
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
        window.clearTimeout(
          minuterie
        );

        nettoyerJSONP(
          script,
          nomCallback
        );

        traiterReponseAPI(
          reponse
        );
      };

    const separateur =
      apiUrl.includes("?")
        ? "&"
        : "?";

    script.src =
      apiUrl +
      separateur +
      "action=produits" +
      "&callback=" +
      encodeURIComponent(
        nomCallback
      ) +
      "&_=" +
      Date.now();

    script.async = true;

    script.onerror =
      function () {
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

  function traiterReponseAPI(
    reponse
  ) {
    elements.chargement.hidden = true;

    if (
      !reponse ||
      reponse.succes !== true
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

    produits =
      Array.isArray(
        reponse.produits
      )
        ? reponse.produits
        : [];

    if (
      produits.length === 0
    ) {
      elements.boutiqueVide.hidden =
        false;

      return;
    }

    afficherCatalogue(
      produits
    );
  }

  function afficherCatalogue(
    listeProduits
  ) {
    elements.catalogue.innerHTML = "";
    elements.boutiqueVide.hidden =
      listeProduits.length > 0;

    const categories =
      regrouperParCategorie(
        listeProduits
      );

    categories.forEach(
      function (categorie) {
        const section =
          document.createElement(
            "section"
          );

        section.className =
          "categorie";

        const titre =
          document.createElement(
            "h2"
          );

        titre.className =
          "titre-categorie";

        titre.textContent =
          categorie.nom ||
          traductions[langue]
            .sansCategorie;

        section.appendChild(
          titre
        );

        const sousCategories =
          regrouperParSousCategorie(
            categorie.produits
          );

        sousCategories.forEach(
          function (sousCategorie) {
            const bloc =
              document.createElement(
                "div"
              );

            bloc.className =
              "sous-categorie";

            if (
              sousCategorie.nom
            ) {
              const sousTitre =
                document.createElement(
                  "h3"
                );

              sousTitre.className =
                "titre-sous-categorie";

              sousTitre.textContent =
                sousCategorie.nom;

              bloc.appendChild(
                sousTitre
              );
            }

            const grille =
              document.createElement(
                "div"
              );

            grille.className =
              "grille-produits";

            sousCategorie.produits.forEach(
              function (produit) {
                grille.appendChild(
                  creerCarteProduit(
                    produit
                  )
                );
              }
            );

            bloc.appendChild(
              grille
            );

            section.appendChild(
              bloc
            );
          }
        );

        elements.catalogue.appendChild(
          section
        );
      }
    );
  }

  function regrouperParCategorie(
    listeProduits
  ) {
    const groupes =
      new Map();

    listeProduits.forEach(
      function (produit) {
        const nom =
          nettoyerTexte(
            produit.categorie
          );

        const cle =
          nom.toLocaleLowerCase(
            "fr"
          );

        if (!groupes.has(cle)) {
          groupes.set(
            cle,
            {
              nom: nom,
              produits: []
            }
          );
        }

        groupes
          .get(cle)
          .produits
          .push(produit);
      }
    );

    return Array.from(
      groupes.values()
    );
  }

  function regrouperParSousCategorie(
    listeProduits
  ) {
    const groupes =
      new Map();

    listeProduits.forEach(
      function (produit) {
        const nom =
          nettoyerTexte(
            produit.sousCategorie
          );

        const cle =
          nom.toLocaleLowerCase(
            "fr"
          );

        if (!groupes.has(cle)) {
          groupes.set(
            cle,
            {
              nom: nom,
              produits: []
            }
          );
        }

        groupes
          .get(cle)
          .produits
          .push(produit);
      }
    );

    return Array.from(
      groupes.values()
    );
  }

  function creerCarteProduit(
    produit
  ) {
    const article =
      document.createElement(
        "article"
      );

    article.className =
      "carte-produit";

    const zonePhoto =
      document.createElement(
        "div"
      );

    zonePhoto.className =
      "zone-photo";

    const photo =
      nettoyerTexte(
        produit.photoPrincipale
      );

    if (photo) {
      const image =
        document.createElement(
          "img"
        );

      image.className =
        "photo-produit";

      image.src = photo;

      image.alt =
        obtenirTitreProduit(
          produit
        );

      image.loading =
        "lazy";

      image.addEventListener(
        "error",
        function () {
          afficherPhotoAbsente(
            zonePhoto
          );
        },
        {
          once: true
        }
      );

      zonePhoto.appendChild(
        image
      );
    } else {
      afficherPhotoAbsente(
        zonePhoto
      );
    }

    const disponible =
      produit.disponible === true;

    const badge =
      document.createElement(
        "span"
      );

    badge.className =
      disponible
        ? "badge badge-disponible"
        : "badge badge-indisponible";

    badge.textContent =
      disponible
        ? traductions[langue]
            .disponible
        : traductions[langue]
            .indisponible;

    zonePhoto.appendChild(
      badge
    );

    const contenu =
      document.createElement(
        "div"
      );

    contenu.className =
      "contenu-carte";

    const titre =
      document.createElement(
        "h3"
      );

    titre.className =
      "titre-produit";

    titre.textContent =
      obtenirTitreProduit(
        produit
      );

    const sousTitre =
      document.createElement(
        "p"
      );

    sousTitre.className =
      "sous-titre-produit";

    sousTitre.textContent =
      obtenirSousTitreProduit(
        produit
      );

    const bas =
      document.createElement(
        "div"
      );

    bas.className =
      "bas-carte";

    const prix =
      document.createElement(
        "p"
      );

    prix.className =
      "prix-produit";

    prix.textContent =
      formaterPrix(
        produit.prix
      );

    const lien =
      document.createElement(
        "a"
      );

    lien.className =
      "bouton-produit";

    lien.textContent =
      traductions[langue]
        .voirProduit;

    lien.href =
      "produit.html?id=" +
      encodeURIComponent(
        produit.produitId
      );

    bas.appendChild(
      prix
    );

    bas.appendChild(
      lien
    );

    contenu.appendChild(
      titre
    );

    contenu.appendChild(
      sousTitre
    );

    contenu.appendChild(
      bas
    );

    article.appendChild(
      zonePhoto
    );

    article.appendChild(
      contenu
    );

    return article;
  }

  function afficherPhotoAbsente(
    zonePhoto
  ) {
    const ancienneImage =
      zonePhoto.querySelector(
        ".photo-produit"
      );

    if (ancienneImage) {
      ancienneImage.remove();
    }

    if (
      zonePhoto.querySelector(
        ".photo-absente"
      )
    ) {
      return;
    }

    const absence =
      document.createElement(
        "div"
      );

    absence.className =
      "photo-absente";

    absence.textContent =
      traductions[langue]
        .photoAbsente;

    zonePhoto.insertBefore(
      absence,
      zonePhoto.firstChild
    );
  }

  function obtenirTitreProduit(
    produit
  ) {
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

  function obtenirSousTitreProduit(
    produit
  ) {
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

  function mettreAJourNombrePanier() {
    const panier =
      lirePanier();

    const quantiteTotale =
      panier.reduce(
        function (
          total,
          article
        ) {
          const quantite =
            parseInt(
              article.quantite,
              10
            );

          return (
            total +
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
      String(
        quantiteTotale
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
        JSON.parse(contenu);

      return Array.isArray(
        panier
      )
        ? panier
        : [];
    } catch (_) {
      return [];
    }
  }

  function afficherErreur(
    message
  ) {
    elements.chargement.hidden = true;
    elements.boutiqueVide.hidden = true;
    elements.catalogue.innerHTML = "";

    elements.messageErreur.textContent =
      message ||
      traductions[langue]
        .erreurGenerale;

    elements.erreur.hidden =
      false;
  }

  function masquerErreur() {
    elements.erreur.hidden =
      true;

    elements.messageErreur.textContent =
      "";
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
