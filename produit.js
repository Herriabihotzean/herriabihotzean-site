(function () {
  "use strict";

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
        "Saskira gehitu",

      ajouterIndisponible:
        "Produktua ez dago eskuragarri",

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

  let langue =
    obtenirLangue();

  let produit =
    null;

  let quantite =
    1;

  const elements = {
    titreDocument:
      document.getElementById(
        "titre-document"
      ),

    titrePage:
      document.getElementById(
        "titre-page"
      ),

    chargement:
      document.getElementById(
        "chargement"
      ),

    erreur:
      document.getElementById(
        "erreur"
      ),

    contenu:
      document.getElementById(
        "contenu-produit"
      ),

    retourBoutique:
      document.getElementById(
        "retour-boutique"
      ),

    boutonPanier:
      document.getElementById(
        "bouton-panier"
      ),

    langueFr:
      document.getElementById(
        "langue-fr"
      ),

    langueEu:
      document.getElementById(
        "langue-eu"
      ),

    texteLangueFr:
      document.getElementById(
        "texte-langue-fr"
      ),

    texteLangueEu:
      document.getElementById(
        "texte-langue-eu"
      ),

    photoPrincipale:
      document.getElementById(
        "photo-principale"
      ),

    miniatures:
      document.getElementById(
        "miniatures"
      ),

    titreProduit:
      document.getElementById(
        "titre-produit"
      ),

    sousTitreProduit:
      document.getElementById(
        "sous-titre-produit"
      ),

    prixProduit:
      document.getElementById(
        "prix-produit"
      ),

    disponibilite:
      document.getElementById(
        "disponibilite-produit"
      ),

    blocPresentation:
      document.getElementById(
        "bloc-presentation"
      ),

    titrePresentation:
      document.getElementById(
        "titre-presentation"
      ),

    description:
      document.getElementById(
        "description-produit"
      ),

    libelleExpedition:
      document.getElementById(
        "libelle-expedition"
      ),

    expedition:
      document.getElementById(
        "expedition-produit"
      ),

    libelleFrais:
      document.getElementById(
        "libelle-frais"
      ),

    frais:
      document.getElementById(
        "frais-produit"
      ),

    libellePoids:
      document.getElementById(
        "libelle-poids"
      ),

    poids:
      document.getElementById(
        "poids-produit"
      ),

    moins:
      document.getElementById(
        "moins"
      ),

    plus:
      document.getElementById(
        "plus"
      ),

    quantite:
      document.getElementById(
        "quantite"
      ),

    ajouter:
      document.getElementById(
        "ajouter-panier"
      ),

    confirmation:
      document.getElementById(
        "confirmation"
      )
  };

  function nettoyerTexte(valeur) {
    return String(
      valeur == null
        ? ""
        : valeur
    ).trim();
  }

  function obtenirLangue() {
    const parametres =
      new URLSearchParams(
        window.location.search
      );

    const langueUrl =
      parametres.get("lang");

    if (
      langueUrl === "eu" ||
      langueUrl === "fr"
    ) {
      localStorage.setItem(
        "hb_langue",
        langueUrl
      );

      return langueUrl;
    }

    const langueMemorisee =
      localStorage.getItem(
        "hb_langue"
      );

    return langueMemorisee === "eu"
      ? "eu"
      : "fr";
  }

  function memoriserLangue(
    nouvelleLangue
  ) {
    langue =
      nouvelleLangue === "eu"
        ? "eu"
        : "fr";

    localStorage.setItem(
      "hb_langue",
      langue
    );

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

    afficherInterface();

    if (produit) {
      afficherProduit();
    }
  }

  function lienAvecLangue(
    fichier
  ) {
    return (
      fichier +
      "?lang=" +
      encodeURIComponent(
        langue
      )
    );
  }

  function afficherInterface() {
    const t =
      traductions[langue];

    document.documentElement.lang =
      langue === "eu"
        ? "eu"
        : "fr";

    document.title =
      t.titreDocument;

    if (elements.titreDocument) {
      elements.titreDocument.textContent =
        t.titreDocument;
    }

    elements.titrePage.textContent =
      t.titrePage;

    elements.chargement.textContent =
      t.chargement;

    elements.retourBoutique.textContent =
      t.retourBoutique;

    elements.retourBoutique.href =
      lienAvecLangue(
        "boutique.html"
      );

    elements.boutonPanier.textContent =
      t.panier;

    elements.boutonPanier.href =
      lienAvecLangue(
        "panier.html"
      );

    elements.titrePresentation.textContent =
      t.presentation;

    elements.libelleExpedition.textContent =
      t.expedition;

    elements.libelleFrais.textContent =
      t.fraisLivraison;

    elements.libellePoids.textContent =
      t.poids;

    elements.moins.setAttribute(
      "aria-label",
      t.diminutionQuantite
    );

    elements.plus.setAttribute(
      "aria-label",
      t.augmentationQuantite
    );

    /*
     * Affichage des deux boutons :
     *
     * français sélectionné :
     * Français / Basque
     *
     * basque sélectionné :
     * Frantsesez / Eskuaraz
     */

    if (langue === "fr") {
      elements.texteLangueFr.textContent =
        "Français";

      elements.texteLangueEu.textContent =
        "Basque";

      elements.langueFr.classList.add(
        "actif"
      );

      elements.langueEu.classList.remove(
        "actif"
      );

    } else {
      elements.texteLangueFr.textContent =
        "Frantsesez";

      elements.texteLangueEu.textContent =
        "Eskuaraz";

      elements.langueEu.classList.add(
        "actif"
      );

      elements.langueFr.classList.remove(
        "actif"
      );
    }
  }

  function formaterPrix(
    valeur
  ) {
    const nombre =
      Number(
        String(
          valeur == null
            ? 0
            : valeur
        ).replace(",", ".")
      );

    if (
      !Number.isFinite(nombre)
    ) {
      return "";
    }

    return new Intl.NumberFormat(
      "fr-FR",
      {
        style: "currency",
        currency: "EUR"
      }
    ).format(nombre);
  }

  function produitDisponible() {
    if (!produit) {
      return false;
    }

    const statut =
      nettoyerTexte(
        produit.statut
      ).toUpperCase();

    const stock =
      Number(
        produit.stock
      );

    return (
      statut === "EN VENTE" &&
      Number.isFinite(stock) &&
      stock > 0
    );
  }

  function obtenirPhotos() {
    if (
      !produit ||
      !Array.isArray(
        produit.photos
      )
    ) {
      return [];
    }

    return produit.photos
      .map(nettoyerTexte)
      .filter(Boolean);
  }

  function afficherGalerie() {
    const photos =
      obtenirPhotos();

    elements.photoPrincipale.innerHTML =
      "";

    elements.miniatures.innerHTML =
      "";

    if (photos.length === 0) {
      const absence =
        document.createElement(
          "div"
        );

      absence.className =
        "photo-absente";

      absence.textContent =
        traductions[langue]
          .photoAbsente;

      elements.photoPrincipale.appendChild(
        absence
      );

      return;
    }

    const imagePrincipale =
      document.createElement(
        "img"
      );

    imagePrincipale.src =
      photos[0];

    imagePrincipale.alt =
      langue === "eu"
        ? nettoyerTexte(
            produit.titreBasque
          ) ||
          nettoyerTexte(
            produit.titre
          )
        : nettoyerTexte(
            produit.titre
          );

    elements.photoPrincipale.appendChild(
      imagePrincipale
    );

    /*
     * Une seule photo :
     * pas besoin d'afficher une miniature.
     */
    if (photos.length === 1) {
      return;
    }

    photos.forEach(
      function (
        urlPhoto,
        index
      ) {
        const bouton =
          document.createElement(
            "button"
          );

        bouton.type =
          "button";

        bouton.className =
          "miniature";

        if (index === 0) {
          bouton.classList.add(
            "active"
          );
        }

        const image =
          document.createElement(
            "img"
          );

        image.src =
          urlPhoto;

        image.alt =
          "";

        bouton.appendChild(
          image
        );

        bouton.addEventListener(
          "click",
          function () {
            imagePrincipale.src =
              urlPhoto;

            elements.miniatures
              .querySelectorAll(
                ".miniature"
              )
              .forEach(
                function (element) {
                  element.classList.remove(
                    "active"
                  );
                }
              );

            bouton.classList.add(
              "active"
            );
          }
        );

        elements.miniatures.appendChild(
          bouton
        );
      }
    );
  }

  function afficherProduit() {
    if (!produit) {
      return;
    }

    const t =
      traductions[langue];

    const titre =
      langue === "eu"
        ? (
            nettoyerTexte(
              produit.titreBasque
            ) ||
            nettoyerTexte(
              produit.titre
            )
          )
        : nettoyerTexte(
            produit.titre
          );

    const sousTitre =
      langue === "eu"
        ? (
            nettoyerTexte(
              produit.sousTitreBasque
            ) ||
            nettoyerTexte(
              produit.sousTitre
            )
          )
        : nettoyerTexte(
            produit.sousTitre
          );

    const description =
      langue === "eu"
        ? (
            nettoyerTexte(
              produit.descriptionBasque
            ) ||
            nettoyerTexte(
              produit.description
            )
          )
        : nettoyerTexte(
            produit.description
          );

    elements.titreProduit.textContent =
      titre;

    elements.sousTitreProduit.textContent =
      sousTitre;

    elements.sousTitreProduit.hidden =
      !sousTitre;

    elements.prixProduit.textContent =
      formaterPrix(
        produit.prix
      );

    const disponible =
      produitDisponible();

    elements.disponibilite.textContent =
      disponible
        ? t.disponible
        : t.indisponible;

    /*
     * Présentation :
     * si aucune description n'existe,
     * on masque tout le bloc.
     */

    if (description) {
      elements.description.textContent =
        description;

      elements.blocPresentation.classList.remove(
        "masque"
      );

    } else {
      elements.description.textContent =
        "";

      elements.blocPresentation.classList.add(
        "masque"
      );
    }

    elements.expedition.textContent =
      nettoyerTexte(
        produit.modeExpedition
      ) ||
      t.nonRenseigne;

    const frais =
      Number(
        String(
          produit.fraisLivraison == null
            ? ""
            : produit.fraisLivraison
        ).replace(",", ".")
      );

    if (
      Number.isFinite(frais)
    ) {
      elements.frais.textContent =
        frais === 0
          ? t.gratuit
          : formaterPrix(frais);
    } else {
      elements.frais.textContent =
        t.nonRenseigne;
    }

    const poids =
      Number(
        produit.poids
      );

    elements.poids.textContent =
      Number.isFinite(poids) &&
      poids > 0
        ? poids + " g"
        : t.nonRenseigne;

    elements.ajouter.textContent =
      disponible
        ? t.ajouter
        : t.ajouterIndisponible;

    elements.ajouter.disabled =
      !disponible;

    elements.moins.disabled =
      !disponible;

    elements.plus.disabled =
      !disponible;

    quantite =
      1;

    afficherQuantite();

    afficherGalerie();
  }

  function afficherQuantite() {
    elements.quantite.textContent =
      String(
        quantite
      );
  }

  function modifierQuantite(
    variation
  ) {
    if (
      !produitDisponible()
    ) {
      return;
    }

    const stock =
      Number(
        produit.stock
      );

    let nouvelleQuantite =
      quantite +
      variation;

    if (nouvelleQuantite < 1) {
      nouvelleQuantite =
        1;
    }

    if (
      Number.isFinite(stock) &&
      nouvelleQuantite > stock
    ) {
      nouvelleQuantite =
        stock;
    }

    quantite =
      nouvelleQuantite;

    afficherQuantite();
  }

  function lirePanier() {
    try {
      const valeur =
        localStorage.getItem(
          "hb_panier"
        );

      if (!valeur) {
        return [];
      }

      const panier =
        JSON.parse(
          valeur
        );

      return Array.isArray(
        panier
      )
        ? panier
        : [];

    } catch (erreur) {
      return [];
    }
  }

  function enregistrerPanier(
    panier
  ) {
    localStorage.setItem(
      "hb_panier",
      JSON.stringify(
        panier
      )
    );
  }

  function ajouterAuPanier() {
    if (
      !produit ||
      !produitDisponible()
    ) {
      return;
    }

    const panier =
      lirePanier();

    const produitId =
      nettoyerTexte(
        produit.produitId
      );

    const existant =
      panier.find(
        function (article) {
          return (
            nettoyerTexte(
              article.produitId
            ) ===
            produitId
          );
        }
      );

    if (existant) {
      existant.quantite =
        Number(
          existant.quantite || 0
        ) +
        quantite;

      const stock =
        Number(
          produit.stock
        );

      if (
        Number.isFinite(stock) &&
        existant.quantite > stock
      ) {
        existant.quantite =
          stock;
      }

    } else {
      panier.push({
        produitId:
          produitId,

        quantite:
          quantite
      });
    }

    enregistrerPanier(
      panier
    );

    elements.confirmation.textContent =
      traductions[langue]
        .confirmation;

    window.setTimeout(
      function () {
        elements.confirmation.textContent =
          "";
      },
      3500
    );
  }

  function afficherErreur(
    message
  ) {
    elements.chargement.hidden =
      true;

    elements.contenu.style.display =
      "none";

    elements.erreur.hidden =
      false;

    elements.erreur.innerHTML =
      "";

    const titre =
      document.createElement(
        "strong"
      );

    titre.textContent =
      traductions[langue]
        .titreErreur;

    const paragraphe =
      document.createElement(
        "p"
      );

    paragraphe.textContent =
      message;

    elements.erreur.appendChild(
      titre
    );

    elements.erreur.appendChild(
      paragraphe
    );
  }

  function recevoirProduit(
    donnees
  ) {
    if (
      !donnees ||
      donnees.succes !== true ||
      !donnees.produit
    ) {
      afficherErreur(
        donnees &&
        donnees.message
          ? donnees.message
          : traductions[langue]
              .erreurGenerale
      );

      return;
    }

    produit =
      donnees.produit;

    elements.chargement.hidden =
      true;

    elements.erreur.hidden =
      true;

    elements.contenu.style.display =
      "block";

    afficherProduit();
  }

  function chargerProduit() {
    const parametres =
      new URLSearchParams(
        window.location.search
      );

    const produitId =
      nettoyerTexte(
        parametres.get("id")
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

    const callback =
      "hbProduit_" +
      Date.now() +
      "_" +
      Math.floor(
        Math.random() *
        100000
      );

    window[callback] =
      function (donnees) {
        try {
          recevoirProduit(
            donnees
          );
        } finally {
          delete window[
            callback
          ];

          if (
            script &&
            script.parentNode
          ) {
            script.parentNode.removeChild(
              script
            );
          }
        }
      };

    const script =
      document.createElement(
        "script"
      );

    script.src =
      apiUrl +
      "?action=produit" +
      "&id=" +
      encodeURIComponent(
        produitId
      ) +
      "&callback=" +
      encodeURIComponent(
        callback
      );

    script.onerror =
      function () {
        afficherErreur(
          traductions[langue]
            .erreurGenerale
        );

        delete window[
          callback
        ];
      };

    document.body.appendChild(
      script
    );
  }

  elements.langueFr.addEventListener(
    "click",
    function () {
      memoriserLangue(
        "fr"
      );
    }
  );

  elements.langueEu.addEventListener(
    "click",
    function () {
      memoriserLangue(
        "eu"
      );
    }
  );

  elements.moins.addEventListener(
    "click",
    function () {
      modifierQuantite(
        -1
      );
    }
  );

  elements.plus.addEventListener(
    "click",
    function () {
      modifierQuantite(
        1
      );
    }
  );

  elements.ajouter.addEventListener(
    "click",
    ajouterAuPanier
  );

  afficherInterface();
  chargerProduit();

})();
