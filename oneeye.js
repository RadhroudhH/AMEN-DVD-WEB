/*
  oneeye.js — hidden "One Eye Guy" collectibles

  Hide a guy anywhere with:
    <img class="oeg no-zoom" data-oeg="UNIQUE-NAME" src="oneeye.png" alt="" style="left: 10px; top: 10px;">
  (its parent needs position: relative so left/top are measured from it)

  - Click a guy: he disappears and is counted (remembered in this browser).
  - When all TOTAL are found: an icon appears top-right on the home page.
    Clicking it makes the One Eye Guy slide in from the side, stare for 3 s, and leave.

  Put this line just before </body> on EVERY page, after slideshow.js and before lightbox.js:
    <script src="oneeye.js"></script>
*/
(function () {
    const TOTAL = 3; // how many guys are hidden on the site
    const PNG = "oneeye.png"; // the mascot image
    const STARE = 3000; // how long he looks at you (ms)
    const SLIDE = 800; // slide in/out duration (ms)
    const KEY = "oegFound";

    // --- Styles ---
    const style = document.createElement("style");
    style.textContent = `
        img.oeg {
            position: absolute;
            width: 60px;
            max-width: none;
            margin: 0;
            cursor: pointer;
            z-index: 2;
            transition: transform 0.3s ease, opacity 0.3s ease;
        }
        img.oeg.oeg-behind { z-index: 0; }
        img.oeg.caught {
            transform: scale(1.5);
            opacity: 0;
            pointer-events: none;
        }

        .oeg-toast {
            position: fixed;
            left: 50%;
            bottom: 30px;
            transform: translateX(-50%);
            background: white;
            color: black;
            padding: 0.4em 0.9em;
            font-size: 0.8em;
            opacity: 0;
            transition: opacity 0.4s ease;
            pointer-events: none;
            z-index: 1100;
        }
        .oeg-toast.show { opacity: 1; }

        img.oeg-trophy {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 48px;
            max-width: none;
            margin: 0;
            cursor: pointer;
            z-index: 900;
            transition: transform 0.2s ease;
        }
        img.oeg-trophy:hover { transform: rotate(-10deg) scale(1.1); }

        img.oeg-visitor {
            position: fixed;
            right: 0;
            top: 50%;
            width: 260px;
            max-width: 40vw;
            margin: 0;
            transform: translate(110%, -50%);
            transition: transform ${SLIDE}ms ease;
            pointer-events: none;
            z-index: 1001;
        }
        img.oeg-visitor.in { transform: translate(0, -50%); }
    `;
    document.head.appendChild(style);

    // --- Saved progress ---
    function load() {
        try {
            return JSON.parse(localStorage.getItem(KEY)) || [];
        } catch (e) {
            return [];
        }
    }
    function save(list) {
        try {
            localStorage.setItem(KEY, JSON.stringify(list));
        } catch (e) {}
    }
    let found = load();

    // --- Little message at the bottom ---
    const toast = document.createElement("div");
    toast.className = "oeg-toast";
    document.body.appendChild(toast);
    let toastTimer = null;
    function say(text) {
        toast.textContent = text;
        toast.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () {
            toast.classList.remove("show");
        }, 2500);
    }

    // --- Hidden guys on this page ---
    document.querySelectorAll("img.oeg").forEach(function (guy) {
        const id = guy.dataset.oeg;
        if (found.includes(id)) {
            guy.remove(); // already caught
            return;
        }
        guy.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (!found.includes(id)) {
                found.push(id);
                save(found);
            }
            guy.classList.add("caught");
            setTimeout(function () {
                guy.remove();
            }, 300);

            if (found.length >= TOTAL) say("All One Eye Guys found. Go back home.");
            else say("One Eye Guy found: " + found.length + " / " + TOTAL);
        });
    });

    // --- Reward on the home page ---
    const path = location.pathname;
    const isHome = path.endsWith("/") || path.endsWith("/index.html") || path.endsWith("/index");
    if (!isHome || found.length < TOTAL) return;

    const trophy = document.createElement("img");
    trophy.className = "oeg-trophy no-zoom";
    trophy.src = PNG;
    trophy.alt = "One Eye Guy";
    document.body.appendChild(trophy);

    const visitor = document.createElement("img");
    visitor.className = "oeg-visitor no-zoom";
    visitor.src = PNG;
    visitor.alt = "";
    document.body.appendChild(visitor);

    let busy = false;
    trophy.addEventListener("click", function () {
        if (busy) return;
        busy = true;
        visitor.classList.add("in");
        setTimeout(function () {
            visitor.classList.remove("in");
            setTimeout(function () {
                busy = false;
            }, SLIDE);
        }, SLIDE + STARE);
    });
})();
