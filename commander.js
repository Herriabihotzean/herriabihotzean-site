"use strict";

(function () {
  const CLE_LANGUE =
    "herria_langue";

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

      mondialRelayTitre:
        "Livraison Mondial Relay",

      mondialRelayExplication:
        "Choisissez le Point Relais® ou Locker dans lequel vous souhaitez recevoir votre colis. Ouvrez la carte Mondial Relay, recherchez le point qui vous convient, puis recopiez ci-dessous ses coordonnées.",

      mondialRelayBouton:
        "Consulter la carte Mondial Relay",

      pointRelaisNom:
        "Nom du Point Relais / Locker *",

      pointRelaisAdresse:
        "Adresse du Point Relais / Locker *",

      pointRelaisCodePostal:
        "Code postal *",

      pointRelaisVille:
        "Ville *",

      pointRelaisNumero:
        "Numéro du Point Relais / Locker",

      pointRelaisNumeroNote:
        "Facultatif : renseignez-le s'il apparaît sur la fiche Mondial Relay.",

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
        "Eskatzea — Herria Bihotzean",

      titrePage:
        "Eskatzea",

      panierVide:
        "Zure saskia hutsik da.",

      retourBoutique:
        "Saltokiarat itzuli",

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
        "Datu hauek zure eskatzearen bidalketa prestatzeko erabiliko dira.",

      adresse:
        "Helbidea *",

      codePostal:
        "Posta kodea *",

      ville:
        "Hiria edo herria *",

      pays:
        "Herrialdea *",

      mondialRelayTitre:
        "Mondial Relay bidalketa",

      mondialRelayExplication:
        "Hauta ezazu zure paketea hartu nahi duzun Point Relais® edo Locker-a. Ireki Mondial Relay-ren mapa, bila ezazu egoki zaizun puntua, eta kopia itzazu hemen haren xehetasunak.",

      mondialRelayBouton:
        "Mondial Relay mapa ikusi",

      pointRelaisNom:
        "Point Relais / Locker-aren izena *",

      pointRelaisAdresse:
        "Point Relais / Locker-aren helbidea *",

      pointRelaisCodePostal:
        "Posta kodea *",

      pointRelaisVille:
        "Hiria edo herria *",

      pointRelaisNumero:
        "Point Relais / Locker-aren zenbakia",

      pointRelaisNumeroNote:
        "Hautazkoa: adieraz ezazu Mondial Relay-ren fitxan agertzen bada.",

      observationTitre:
        "Xehetasun osagarriak",

      observation:
        "Oharra",

      recapitulatif:
        "Zure eskatzea",

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
        "Bidalketa gastuen behin betiko zenbatekoa eskatzearen pisu osoaren arabera kalkulatuko da.",

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

  let langue =
    "fr";

  const elements =
    {};

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

      "titre-mondial-relay",
      "explication-mondial-relay",
      "bouton-carte-mondial-relay",
      "indication-recherche-mondial",
      "label-point-relais-nom",
      "label-point-relais-adresse",
      "label-point-relais-code-postal",
      "label-point-relais-ville",
      "label-point-relais-numero",
      "note-point-relais-numero",
      
      "titre-observation",
      "label-observation",

      "bouton-valider",
      "message",

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

      "lien-retour"
    ];

    ids.forEach(
      function (id) {
        elements[id] =
          document.getElementById(
            id
          );
      }
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
      langueUrl === "fr" ||
      langueUrl === "eu"
    ) {
      return langueUrl;
    }

    try {
      const langueMemorisee =
        localStorage.getItem(
          CLE_LANGUE
        );

      if (
        langueMemorisee === "eu"
      ) {
        return "eu";
      }

      if (
        langueMemorisee === "fr"
      ) {
        return "fr";
      }
    } catch (_) {}

    if (
      typeof window.hbCurrentLanguage ===
      "function"
    ) {
      return (
        window.hbCurrentLanguage() ===
        "eu"
          ? "eu"
          : "fr"
      );
    }

    return "fr";
  }

  function installerEvenements() {
    document.addEventListener(
      "herria-language-change",
      function (evenement) {
        langue =
          evenement.detail &&
          evenement.detail.lang ===
            "eu"
            ? "eu"
            : "fr";

        try {
          localStorage.setItem(
            CLE_LANGUE,
            langue
          );
        } catch (_) {}

        mettreAJourAdresseLangue();

        appliquerLangue();

        afficherCommande();
      }
    );

    if (
      elements[
        "formulaire-commande"
      ]
    ) {
      elements[
        "formulaire-commande"
      ].addEventListener(
        "submit",
        traiterValidation
      );
      const boutonCarte =
  elements[
    "bouton-carte-mondial-relay"
  ];

if (boutonCarte) {
  boutonCarte.addEventListener(
    "click",
    function (evenement) {
      const champCodePostal =
        document.getElementById(
          "code-postal"
        );

      const champVille =
        document.getElementById(
          "ville"
        );

      const codePostal =
        nettoyerTexte(
          champCodePostal
            ? champCodePostal.value
            : ""
        );

      const ville =
        nettoyerTexte(
          champVille
            ? champVille.value
            : ""
        );

      if (!codePostal) {
        evenement.preventDefault();

        alert(
          langue === "eu"
            ? "Lehenik, bete posta kodea."
            : "Veuillez d’abord renseigner le code postal."
        );

        if (champCodePostal) {
          champCodePostal.focus();
        }

        return;
      }

      const recherche =
        ville
          ? codePostal +
            " " +
            ville.toUpperCase()
          : codePostal;

      const indication =
        elements[
          "indication-recherche-mondial"
        ];

      if (indication) {
        indication.textContent =
          langue === "eu"
            ? "Bilatu Mondial Relay-ren orrian : " +
              recherche
            : "Recherchez sur la page Mondial Relay : " +
              recherche;

        indication.hidden =
          false;
      }
    }
  );
}
    }
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

    /*
     * MONDIAL RELAY
     */

    texte(
      "titre-mondial-relay",
      t.mondialRelayTitre
    );

    texte(
      "explication-mondial-relay",
      t.mondialRelayExplication
    );

    texte(
      "bouton-carte-mondial-relay",
      t.mondialRelayBouton
    );

    texte(
      "label-point-relais-nom",
      t.pointRelaisNom
    );

    texte(
      "label-point-relais-adresse",
      t.pointRelaisAdresse
    );

    texte(
      "label-point-relais-code-postal",
      t.pointRelaisCodePostal
    );

    texte(
      "label-point-relais-ville",
      t.pointRelaisVille
    );

    texte(
      "label-point-relais-numero",
      t.pointRelaisNumero
    );

    texte(
      "note-point-relais-numero",
      t.pointRelaisNumeroNote
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

    if (
      elements[
        "retour-boutique-vide"
      ]
    ) {
      elements[
        "retour-boutique-vide"
      ].href =
        "boutique.html?lang=" +
        encodeURIComponent(
          langue
        );
    }

    if (
      elements[
        "lien-retour"
      ]
    ) {
      elements[
        "lien-retour"
      ].href =
        "panier.html?lang=" +
        encodeURIComponent(
          langue
        );
    }
  }

  function texte(
    id,
    valeur
  ) {
    if (
      elements[id]
    ) {
      elements[
        id
      ].textContent =
        valeur;
    }
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

  function afficherCommande() {
    const panier =
      lirePanier();

    if (
      panier.length === 0
    ) {
      afficherPanierVide();
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

    afficherProduits(
      panier
    );

    afficherTotaux(
      panier
    );
  }

  function afficherPanierVide() {
    elements[
      "panier-vide"
    ].hidden =
      false;

    elements[
      "contenu-commande"
    ].hidden =
      true;
  }

  function afficherProduits(
    panier
  ) {
    const conteneur =
      elements[
        "liste-produits"
      ];

    conteneur.innerHTML =
      "";

    panier.forEach(
      function (article) {
        const ligne =
          document.createElement(
            "div"
          );

        ligne.className =
          "produit";

        const photo =
          document.createElement(
            "img"
          );

        photo.className =
          "photo";

        photo.src =
          nettoyerTexte(
            article.photoPrincipale
          );

        photo.alt =
          obtenirTitreArticle(
            article
          );

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
          obtenirTitreArticle(
            article
          );

        const quantite =
          document.createElement(
            "p"
          );

        quantite.className =
          "quantite-produit";

        quantite.textContent =
          traductions[
            langue
          ].quantite +
          " : " +
          obtenirQuantite(
            article
          );

        informations.appendChild(
          titre
        );

        informations.appendChild(
          quantite
        );

        const prix =
          document.createElement(
            "div"
          );

        prix.className =
          "prix-ligne";

        prix.textContent =
          formaterPrix(
            obtenirPrix(
              article
            ) *
            obtenirQuantite(
              article
            )
          );

        ligne.appendChild(
          photo
        );

        ligne.appendChild(
          informations
        );

        ligne.appendChild(
          prix
        );

        conteneur.appendChild(
          ligne
        );
      }
    );
  }

  function afficherTotaux(
    panier
  ) {
    const sousTotal =
      panier.reduce(
        function (
          somme,
          article
        ) {
          return (
            somme +
            obtenirPrix(
              article
            ) *
            obtenirQuantite(
              article
            )
          );
        },
        0
      );

    const poidsTotal =
      panier.reduce(
        function (
          somme,
          article
        ) {
          return (
            somme +
            obtenirPoids(
              article
            ) *
            obtenirQuantite(
              article
            )
          );
        },
        0
      );

    elements[
      "sous-total"
    ].textContent =
      formaterPrix(
        sousTotal
      );

    elements[
      "poids-total"
    ].textContent =
      poidsTotal > 0
        ? Math.round(
            poidsTotal
          ) +
          " g"
        : "—";

    elements[
      "frais-livraison"
    ].textContent =
      traductions[
        langue
      ].calculer;

    elements[
      "total"
    ].textContent =
      formaterPrix(
        sousTotal
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

  function obtenirQuantite(
    article
  ) {
    const quantite =
      parseInt(
        article.quantite,
        10
      );

    return (
      Number.isFinite(
        quantite
      ) &&
      quantite > 0
        ? quantite
        : 1
    );
  }

  function obtenirPrix(
    article
  ) {
    const prix =
      Number(
        article.prix
      );

    return Number.isFinite(
      prix
    )
      ? prix
      : 0;
  }

  function obtenirPoids(
    article
  ) {
    const poids =
      Number(
        article.poids
      );

    return Number.isFinite(
      poids
    )
      ? poids
      : 0;
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
        traductions[
          langue
        ].erreurFormulaire,
        true
      );

      return;
    }

    const panier =
      lirePanier();

    if (
      !Array.isArray(
        panier
      ) ||
      panier.length === 0
    ) {
      afficherMessage(
        traductions[
          langue
        ].panierVide,
        true
      );

      return;
    }

    /*
     * Nous envoyons uniquement
     * produitId + quantité.
     *
     * Apps Script relit les prix,
     * poids, stocks et bénéficiaires
     * dans Google Sheets.
     */

    const panierAEnvoyer =
      panier.map(
        function (
          article
        ) {
          return {
            produitId:
              nettoyerTexte(
                article.produitId
              ),

            quantite:
              obtenirQuantite(
                article
              )
          };
        }
      );

    const apiUrl =
      window.HB_CONFIG &&
      window.HB_CONFIG.API_URL
        ? nettoyerTexte(
            window.HB_CONFIG.API_URL
          )
        : "";

    if (!apiUrl) {
      afficherMessage(
        "L’adresse de l’API Apps Script est absente de config.js.",
        true
      );

      return;
    }

    /*
     * Ajout du panier JSON au formulaire.
     */

    let champPanier =
      formulaire.querySelector(
        'input[name="panier"]'
      );

    if (!champPanier) {
      champPanier =
        document.createElement(
          "input"
        );

      champPanier.type =
        "hidden";

      champPanier.name =
        "panier";

      formulaire.appendChild(
        champPanier
      );
    }

    champPanier.value =
      JSON.stringify(
        panierAEnvoyer
      );

    /*
     * On conserve également la langue
     * de la commande.
     */

    let champLangue =
      formulaire.querySelector(
        'input[name="langue"]'
      );

    if (!champLangue) {
      champLangue =
        document.createElement(
          "input"
        );

      champLangue.type =
        "hidden";

      champLangue.name =
        "langue";

      formulaire.appendChild(
        champLangue
      );
    }

    champLangue.value =
      langue;

    /*
     * Envoi réel à Apps Script.
     *
     * Les champs Mondial Relay présents
     * dans commander.html font partie du
     * formulaire et sont donc envoyés
     * automatiquement :
     *
     * pointRelaisNom
     * pointRelaisAdresse
     * pointRelaisCodePostal
     * pointRelaisVille
     * pointRelaisNumero
     */

    formulaire.action =
      apiUrl;

    formulaire.method =
      "POST";

    elements[
      "bouton-valider"
    ].disabled =
      true;

    elements[
      "bouton-valider"
    ].textContent =
      langue === "eu"
        ? "Igortzen…"
        : "Envoi…";

    HTMLFormElement
      .prototype
      .submit
      .call(
        formulaire
      );
  }

  function afficherMessage(
    message,
    erreur
  ) {
    const element =
      elements[
        "message"
      ];

    if (!element) {
      return;
    }

    element.textContent =
      message;

    element.hidden =
      false;

    element.className =
      erreur
        ? "message message-erreur"
        : "message";
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
        style:
          "currency",

        currency:
          "EUR"
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
