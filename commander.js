"use strict";

(function () {
  const CLE_PANIER =
    "herria-bihotzean-panier";

  const traductions = {
    fr: {
      titreDocument:
        "Commander — Herria Bihotzean",

      titrePage:
        "Commander",

      panierVide:
        "Votre panier est vide.",

      retourBoutique:
        "Retour à la boutique",

      coordonnees:
        "Vos coordonnées",

      prenom:
        "Prénom *",

      nom:
        "Nom *",

      email:
        "Adresse électronique *",

      telephone:
        "Téléphone *",

      adresseTitre:
        "Adresse",

      adresseExplication:
        "Ces informations permettront de préparer l'expédition de votre commande.",

      adresse:
        "Adresse *",

      codePostal:
        "Code postal *",

      ville:
        "Ville *",

      pays:
        "Pays *",

      observationTitre:
        "Informations complémentaires",

      observation:
        "Observation",

      recapitulatif:
        "Votre commande",

      quantite:
        "Quantité",

      sousTotal:
        "Sous-total",

      poids:
        "Poids total",

      livraison:
        "Livraison Mondial Relay",

      calculer:
        "À calculer",

      total:
        "Total",

      noteCalcul:
        "Le montant définitif des frais de livraison sera calculé à partir du poids total de la commande.",

      continuer:
        "Continuer",

      retourPanier:
        "← Retour au panier",

      erreurFormulaire:
        "Veuillez remplir tous les champs obligatoires.",

      prochaineEtape:
        "Le formulaire est prêt. Le calcul définitif et le paiement seront raccordés à Apps Script à l'étape suivante."
    },

    eu: {
      titreDocument:
        "Eskaera — Herria Bihotzean",

      titrePage:
        "Eskaera",

      panierVide:
        "Zure saskia hutsik da.",

      retourBoutique:
        "Saltokia itzuli",

      coordonnees:
        "Zure xehetasunak",

      prenom:
        "Izena *",

      nom:
        "Deitura *",

      email:
        "Helbide elektronikoa *",

      telephone:
        "Telefonoa *",

      adresseTitre:
        "Helbidea",

      adresseExplication:
        "Datu hauek zure eskaeraren bidalketa prestatzeko erabiliko dira.",

      adresse:
        "Helbidea *",

      codePostal:
        "Posta kodea *",

      ville:
        "Hiria edo herria *",

      pays:
        "Herrialdea *",

      observationTitre:
        "Xehetasun osagarriak",

      observation:
        "Oharra",

      recapitulatif:
        "Zure eskaera",

      quantite:
        "Kopurua",

      sousTotal:
        "Azpitotala",

      poids:
        "Pisu osoa",

      livraison:
        "Mondial Relay bidalketa",

      calculer:
        "Kalkulatzeko",

      total:
        "Guztira",

      noteCalcul:
        "Bidalketa gastuen behin betiko zenbatekoa eskaeraren pisu osoaren arabera kalkulatuko da.",

      continuer:
        "Segitu",

      retourPanier:
        "← Saskirat itzuli",

      erreurFormulaire:
        "Bete beharrezko eremu guziak.",

      prochaineEtape:
        "Formularioa prest da. Behin betiko kalkulua eta ordainketa Apps Script-ekin lotuko dira hurrengo urratsean."
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
    afficherCommande();
  }

  function memoriserElements() {
    const ids = [
      "titre-page",
      "panier-vide",
      "texte-panier-vide",
      "retour-boutique-vide",
      "contenu-commande",
      "formulaire-commande",
      "titre-coordonnees",
      "label-prenom",
      "label-nom",
      "label-email",
      "label-telephone",
      "titre-adresse",
      "explication-adresse",
      "label-adresse",
      "label-code-postal",
      "label-ville",
      "label-pays",
      "titre-observation",
      "label-observation",
      "titre-recapitulatif",
      "liste-produits",
      "label-sous-total",
      "sous-total",
      "label-poids",
      "poids-total",
      "label-livraison",
      "frais-livraison",
      "label-total",
      "total",
      "note-calcul",
      "bouton-valider",
      "message",
      "lien-retour"
    ];

    ids.forEach(
      function (id) {
        elements[id] =
          document.getElementById(id);
      }
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
        afficherCommande();
      }
    );

    elements[
      "formulaire-commande"
    ].addEventListener(
      "submit",
      traiterValidation
    );

    window.addEventListener(
      "storage",
      function (evenement) {
        if (
          evenement.key ===
          CLE_PANIER
        ) {
          afficherCommande();
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

    texte(
      "titre-page",
      t.titrePage
    );

    texte(
      "texte-panier-vide",
      t.panierVide
    );

    texte(
      "retour-boutique-vide",
      t.retourBoutique
    );

    texte(
      "titre-coordonnees",
      t.coordonnees
    );

    texte(
      "label-prenom",
      t.prenom
    );

    texte(
      "label-nom",
      t.nom
    );

    texte(
      "label-email",
      t.email
    );

    texte(
      "label-telephone",
      t.telephone
    );

    texte(
      "titre-adresse",
      t.adresseTitre
    );

    texte(
      "explication-adresse",
      t.adresseExplication
    );

    texte(
      "label-adresse",
      t.adresse
    );

    texte(
      "label-code-postal",
      t.codePostal
    );

    texte(
      "label-ville",
      t.ville
    );

    texte(
      "label-pays",
      t.pays
    );

    texte(
      "titre-observation",
      t.observationTitre
    );

    texte(
      "label-observation",
      t.observation
    );

    texte(
      "titre-recapitulatif",
      t.recapitulatif
    );

    texte(
      "label-sous-total",
      t.sousTotal
    );

    texte(
      "label-poids",
      t.poids
    );

    texte(
      "label-livraison",
      t.livraison
    );

    texte(
      "frais-livraison",
      t.calculer
    );

    texte(
      "label-total",
      t.total
    );

    texte(
      "note-calcul",
      t.noteCalcul
    );

    texte(
      "bouton-valider",
      t.continuer
    );

    texte(
      "lien-retour",
      t.retourPanier
    );
  }

  function afficherCommande() {
    const panier =
      lirePanier();

    elements[
      "liste-produits"
    ].innerHTML =
      "";

    if (
      panier.length === 0
    ) {
      elements[
        "panier-vide"
      ].hidden =
        false;

      elements[
        "contenu-commande"
      ].hidden =
        true;

      return;
    }

    elements[
      "panier-vide"
    ].hidden =
      true;

    elements[
      "contenu-commande"
    ].hidden =
      false;

    let sousTotal = 0;
    let poidsTotal = 0;

    panier.forEach(
      function (article) {
        const quantite =
          entier(
            article.quantite,
            1
          );

        const prix =
          Number(
            article.prix
          );

        const poids =
          Number(
            article.poids
          );

        if (
          Number.isFinite(prix)
        ) {
          sousTotal +=
            prix * quantite;
        }

        /*
         * Les anciens articles du panier
         * peuvent ne pas encore contenir
         * le poids.
         */
        if (
          Number.isFinite(poids) &&
          poids > 0
        ) {
          poidsTotal +=
            poids * quantite;
        }

        elements[
          "liste-produits"
        ].appendChild(
          creerLigneProduit(
            article
          )
        );
      }
    );

    texte(
      "sous-total",
      formaterPrix(
        sousTotal
      )
    );

    texte(
      "poids-total",
      poidsTotal > 0
        ? formaterPoids(
            poidsTotal
          )
        : "—"
    );

    /*
     * Tant qu'Apps Script ne nous a pas
     * donné le tarif réel, nous n'affichons
     * aucun total définitif.
     */
    texte(
      "frais-livraison",
      traductions[langue]
        .calculer
    );

    texte(
      "total",
      "—"
    );
  }

  function creerLigneProduit(
    article
  ) {
    const ligne =
      document.createElement(
        "div"
      );

    ligne.className =
      "produit";

    const photo =
      document.createElement(
        "div"
      );

    if (
      nettoyerTexte(
        article.photoPrincipale
      )
    ) {
      const image =
        document.createElement(
          "img"
        );

      image.className =
        "photo";

      image.src =
        article.photoPrincipale;

      image.alt =
        obtenirTitre(
          article
        );

      photo.appendChild(
        image
      );
    }

    const informations =
      document.createElement(
        "div"
      );

    const titre =
      document.createElement(
        "p"
      );

    titre.className =
      "titre-produit";

    titre.textContent =
      obtenirTitre(
        article
      );

    const quantite =
      document.createElement(
        "p"
      );

    quantite.className =
      "quantite-produit";

    quantite.textContent =
      traductions[langue]
        .quantite +
      " : " +
      entier(
        article.quantite,
        1
      );

    informations.appendChild(
      titre
    );

    informations.appendChild(
      quantite
    );

    const totalLigne =
      document.createElement(
        "div"
      );

    totalLigne.className =
      "prix-ligne";

    totalLigne.textContent =
      formaterPrix(
        Number(article.prix) *
        entier(
          article.quantite,
          1
        )
      );

    ligne.appendChild(
      photo
    );

    ligne.appendChild(
      informations
    );

    ligne.appendChild(
      totalLigne
    );

    return ligne;
  }

  function obtenirTitre(
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

  function traiterValidation(
    evenement
  ) {
    evenement.preventDefault();

    const formulaire =
      elements[
        "formulaire-commande"
      ];

    if (
      !formulaire.checkValidity()
    ) {
      formulaire.reportValidity();

      afficherMessage(
        traductions[langue]
          .erreurFormulaire,
        true
      );

      return;
    }

    /*
     * À l'étape suivante, ce bouton
     * enverra seulement :
     *
     * - coordonnées du client
     * - produitId
     * - quantité
     *
     * Apps Script relira prix,
     * poids, stock et bénéficiaire
     * directement dans Google Sheets.
     */

    afficherMessage(
      traductions[langue]
        .prochaineEtape,
      false
    );
  }

  function afficherMessage(
    message,
    erreur
  ) {
    elements[
      "message"
    ].textContent =
      message;

    elements[
      "message"
    ].className =
      erreur
        ? "message message-erreur"
        : "message";

    elements[
      "message"
    ].hidden =
      false;
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

  function formaterPoids(
    grammes
  ) {
    if (
      grammes >= 1000
    ) {
      return (
        new Intl.NumberFormat(
          "fr-FR",
          {
            maximumFractionDigits: 2
          }
        ).format(
          grammes / 1000
        ) +
        " kg"
      );
    }

    return (
      Math.round(
        grammes
      ) +
      " g"
    );
  }

  function entier(
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

  function texte(
    id,
    valeur
  ) {
    if (elements[id]) {
      elements[id].textContent =
        valeur;
    }
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
