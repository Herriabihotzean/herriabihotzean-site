"use strict";

(function () {
  const CLE_PANIER =
    "herria-bihotzean-panier";

  const traductions = {
    fr: {
      titreDocument:
        "Boutique — Herria Bihotzean",

      titrePage:
        "Boutique",

      introduction:
        "Découvrez les livres, enregistrements et autres ressources proposés par Herria Bihotzean.",

      chargement:
        "Chargement des produits…",

      erreurTitre:
        "Impossible de charger la boutique",

      erreurGenerale:
        "Une erreur s’est produite lors du chargement des produits.",

      apiAbsente:
        "L’adresse de l’API n’est pas renseignée dans le fichier config.js.",

      boutiqueVide:
        "Aucun produit n’est actuellement proposé.",

      panier:
        "Panier",

      retour:
        "← Retour à l’accueil",

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
      titreDocument:
        "Denda — Herria Bihotzean",

      titrePage:
        "Denda",

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

      panier:
        "Saskia",

      retour:
        "← Harrera orrira itzuli",

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

  let langue = "fr";
  let produits = [];

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
    mettreAJourNombrePanier();
    chargerProduits();
  }

  function memoriserElements() {
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
      }
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

    if (elements.titrePage) {
      elements.titrePage.textContent =
        t.titrePage;
    }

    if (elements.texteIntroduction) {
      elements.texteIntroduction.textContent =
        t.introduction;
    }

    if (elements.texteChargement) {
      elements.texteChargement.textContent =
        t.chargement;
    }

    if (elements.titreErreur) {
      elements.titreErreur.textContent =
        t.erreurTitre;
    }

    if (elements.texteBoutiqueVide) {
      elements.texteBoutiqueVide.textContent =
        t.boutiqueVide;
    }

    if (elements.textePanier) {
      elements.textePanier.textContent =
        t.panier;
    }

    if (elements.lienRetour) {
      elements.lienRetour.textContent =
        t.retour;

      /*
       * Le retour doit toujours pointer vers
       * la page d’accueil du dépôt principal.
       */
      elements.lienRetour.href =
        "index.html";
    }

    if (produits.length > 0) {
      afficherCatalogue(
        produits
      );
    }
  }

  function chargerProduits() {
    masquerErreur();

    if (elements.chargement) {
      elements.chargement.hidden =
        false;
    }

    if (elements.boutiqueVide) {
      elements.boutiqueVide.hidden =
        true;
    }

    if (elements.catalogue) {
      elements.catalogue.innerHTML =
        "";
    }

    const apiUrl =
      window.HB_CONFIG &&
      window.HB_CONFIG.API_URL
        ? String(
            window.HB_CONFIG.API_URL
          ).trim()
        : "";

    if (!apiUrl) {
      afficherErreur(
        traductions[langue]
          .apiAbsente
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
      document.createElement(
        "script"
      );

    let reponseRecue = false;

    const minuterie =
      window.setTimeout(
        function () {
          if (reponseRecue) {
            return;
          }

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
        reponseRecue = true;

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
        if (reponseRecue) {
          return;
        }

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
    if (elements.chargement) {
      elements.chargement.hidden =
        true;
    }

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
      if (elements.boutiqueVide) {
        elements.boutiqueVide.hidden =
          false;
      }

      return;
    }

    afficherCatalogue(
      produits
    );
  }

  function afficherCatalogue(
    listeProduits
  ) {
    if (!elements.catalogue) {
      return;
    }

    elements.catalogue.innerHTML =
      "";

    if (elements.boutiqueVide) {
      elements.boutiqueVide.hidden =
        listeProduits.length > 0;
    }

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
          function (
            sousCategorie
          ) {
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

            sousCategorie.produits
              .forEach(
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

        const cle =
          normaliserCle(nom);

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

        const cle =
          normaliserCle(nom);

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

      image.src =
        photo;

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

    const ancienneAbsence =
      zonePhoto.querySelector(
        ".photo-absente"
      );

    if (ancienneAbsence) {
      ancienneAbsence.textContent =
        traductions[langue]
          .photoAbsente;

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
    const titreBasque =
      nettoyerTexte(
        produit.titreBasque
      );

    if (
      langue === "eu" &&
      titreBasque
    ) {
      return titreBasque;
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
    const sousTitreBasque =
      nettoyerTexte(
        produit.sousTitreBasque
      );

    if (
      langue === "eu" &&
      sousTitreBasque
    ) {
      return sousTitreBasque;
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
    if (!elements.nombrePanier) {
      return;
    }

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
    if (elements.chargement) {
      elements.chargement.hidden =
        true;
    }

    if (elements.boutiqueVide) {
      elements.boutiqueVide.hidden =
        true;
    }

    if (elements.catalogue) {
      elements.catalogue.innerHTML =
        "";
    }

    if (elements.messageErreur) {
      elements.messageErreur.textContent =
        message ||
        traductions[langue]
          .erreurGenerale;
    }

    if (elements.erreur) {
      elements.erreur.hidden =
        false;
    }
  }

  function masquerErreur() {
    if (elements.erreur) {
      elements.erreur.hidden =
        true;
    }

    if (elements.messageErreur) {
      elements.messageErreur.textContent =
        "";
    }
  }

  function normaliserCle(
    valeur
  ) {
    return nettoyerTexte(
      valeur
    )
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        ""
      )
      .toLocaleLowerCase(
        "fr"
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
