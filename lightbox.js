/*
  lightbox.js — click-to-zoom for images

  Rules:
  - An image NOT inside a link  -> zoom cursor, click opens it in the lightbox.
  - An image INSIDE a link (<a>) -> normal link cursor, click follows the link.
  - To exclude an image from zooming without a link, add class="no-zoom".

  In the lightbox:
  - Click the image       -> zoom in; move the mouse (or drag a finger) to look around.
  - Click the image again -> zoom back out.
  - Click the background  -> close. Escape also closes.

  Usage: put this line just before </body> on every page:
    <script src="lightbox.js"></script>
*/
(function () {
    // --- Styles (injected so you don't have to touch your CSS files) ---
    const style = document.createElement("style");
    style.textContent = `
        img.zoomable { cursor: zoom-in; }
        a img { cursor: pointer; }

        .lightbox {
            position: fixed;
            inset: 0;
            background: rgba(255, 255, 255, 0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            overflow: hidden;
            cursor: default;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.35s ease;
            z-index: 1000;
        }
        .lightbox.open {
            opacity: 1;
            pointer-events: auto;
        }
        .lightbox img {
            max-width: 100%;
            max-height: 100%;
            width: auto;
            margin: 0;
            object-fit: contain;
            cursor: zoom-in;
            transition: transform 0.3s ease;
            touch-action: none;
        }
        .lightbox.zoomed img {
            cursor: zoom-out;
        }
    `;
    document.head.appendChild(style);

    // --- The overlay (one for the whole page) ---
    const overlay = document.createElement("div");
    overlay.className = "lightbox";
    const bigImg = document.createElement("img");
    overlay.appendChild(bigImg);
    document.body.appendChild(overlay);

    let zoomed = false;

    function open(src, alt) {
        bigImg.src = src;
        bigImg.alt = alt || "";
        overlay.classList.add("open");
        document.body.style.overflow = "hidden"; // stop page scrolling behind
    }

    function close() {
        zoomOut();
        overlay.classList.remove("open");
        document.body.style.overflow = "";
    }

    // Zoom amount: show the image at its real resolution,
    // but never less than 2x or more than 4x.
    function zoomFactor() {
        const ratio = bigImg.naturalWidth / bigImg.clientWidth;
        return Math.min(Math.max(ratio, 2), 4);
    }

    // Move around: the pointer's position on screen decides which part is shown.
    function pan(clientX, clientY) {
        const x = Math.min(Math.max(clientX / window.innerWidth, 0), 1) * 100;
        const y = Math.min(Math.max(clientY / window.innerHeight, 0), 1) * 100;
        bigImg.style.transformOrigin = x + "% " + y + "%";
    }

    function zoomIn(clientX, clientY) {
        zoomed = true;
        overlay.classList.add("zoomed");
        pan(clientX, clientY);
        bigImg.style.transform = "scale(" + zoomFactor() + ")";
    }

    function zoomOut() {
        zoomed = false;
        overlay.classList.remove("zoomed");
        bigImg.style.transform = "";
    }

    // Click on the image: toggle zoom
    bigImg.addEventListener("click", function (e) {
        e.stopPropagation(); // don't let it reach the background
        if (zoomed) zoomOut();
        else zoomIn(e.clientX, e.clientY);
    });

    // Click on the background: close
    overlay.addEventListener("click", function (e) {
        if (e.target === overlay) close();
    });

    // Look around while zoomed (mouse)
    overlay.addEventListener("mousemove", function (e) {
        if (zoomed) pan(e.clientX, e.clientY);
    });

    // Look around while zoomed (touch)
    overlay.addEventListener(
        "touchmove",
        function (e) {
            if (!zoomed) return;
            e.preventDefault();
            pan(e.touches[0].clientX, e.touches[0].clientY);
        },
        { passive: false },
    );

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") close();
    });

    // --- Mark every image that isn't a link as zoomable ---
    document.querySelectorAll("img").forEach(function (img) {
        if (img.closest("a") || img.classList.contains("no-zoom")) return;
        img.classList.add("zoomable");
        img.addEventListener("click", function () {
            // Optional: data-full="big-version.jpg" to show a higher-res file when zoomed
            open(img.dataset.full || img.currentSrc || img.src, img.alt);
        });
    });
})();
