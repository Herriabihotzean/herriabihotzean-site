"use strict";

(function () {
    function getLanguage() {
        const params = new URLSearchParams(window.location.search);
        const incoming = params.get("lang") || params.get("ui");

        if (incoming === "eu" || incoming === "fr") {
            return incoming;
        }

        try {
            return localStorage.getItem("herria_langue") === "eu" ? "eu" : "fr";
        } catch (_e) {
            return "fr";
        }
    }

    function addHomeLogo() {
        if (document.querySelector(".hb-home")) return;

        const lang = getLanguage();

        const link = document.createElement("a");
        link.className = "hb-home";
        link.href = "https://herriabihotzean.fr/?lang=" + lang;
        link.setAttribute("aria-label", "Herria Bihotzean — Accueil");

        const name = document.createElement("span");
        name.className = "hb-home-name";

        const herria = document.createElement("span");
        herria.className = "hb-home-herria";
        herria.textContent = "HERRIA";

        const bihotzean = document.createElement("span");
        bihotzean.className = "hb-home-bihotzean";
        bihotzean.textContent = "BIHOTZEAN";

        const lauburu = document.createElement("img");
        lauburu.className = "hb-home-lauburu";
        lauburu.src = "https://herriabihotzean.fr/lauburu-blanc.svg";
        lauburu.alt = "";

        name.appendChild(herria);
        name.appendChild(bihotzean);
        name.appendChild(lauburu);
        link.appendChild(name);

        document.body.insertBefore(link, document.body.firstChild);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", addHomeLogo);
    } else {
        addHomeLogo();
    }
})();
