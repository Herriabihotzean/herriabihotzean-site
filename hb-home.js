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


    function createHomeLogo() {
        const lang = getLanguage();

        const link = document.createElement("a");
        link.className = "hb-home";
        link.href = "https://herriabihotzean.fr/?lang=" + lang;
        link.setAttribute(
            "aria-label",
            "Herria Bihotzean — Accueil"
        );

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
        lauburu.src =
            "https://herriabihotzean.fr/lauburu-blanc.svg";
        lauburu.alt = "";

        name.appendChild(herria);
        name.appendChild(bihotzean);
        name.appendChild(lauburu);

        link.appendChild(name);

        return link;
    }


    function placeHomeLogo(link) {

        const bar =
            document.querySelector(".sticky-language-audio");

        if (bar) {

            link.classList.add("hb-home-in-bar");

            if (link.parentNode !== bar) {
                bar.insertBefore(link, bar.firstChild);
            }

            return true;
        }

        link.classList.remove("hb-home-in-bar");

        if (link.parentNode !== document.body) {
            document.body.insertBefore(
                link,
                document.body.firstChild
            );
        }

        return false;
    }


    function initialiseHomeLogo() {

        if (document.querySelector(".hb-home")) return;

        const link = createHomeLogo();

        document.body.insertBefore(
            link,
            document.body.firstChild
        );

        if (placeHomeLogo(link)) return;

        /*
         * Certaines pages, notamment Histoire des Basques,
         * créent leur bandeau vert après le chargement du HTML.
         * On attend donc son apparition pour y déplacer le logo.
         */
        const observer = new MutationObserver(() => {

            if (placeHomeLogo(link)) {
                observer.disconnect();
            }

        });

        observer.observe(
            document.body,
            {
                childList: true,
                subtree: true
            }
        );

        /*
         * On arrête l'observation après quelques secondes
         * sur les pages qui n'ont pas de bandeau.
         */
        setTimeout(() => {
            observer.disconnect();
        }, 3000);
    }


    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            initialiseHomeLogo
        );

    } else {

        initialiseHomeLogo();

    }

})();
