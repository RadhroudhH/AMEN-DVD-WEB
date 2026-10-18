/*
  photos.js — photo album

  Desktop: hover a photo in the grid -> it shows big on the right with its title/description.
           If nobody is hovering the grid, it moves to the next photo every 10 seconds.
  Mobile:  just the album. Tap a photo -> pop-up with the photo and its text.

  Add/remove photos in the PHOTOS list. "desc" can be left empty: desc: ""
*/
(function () {
    const PHOTOS = [
        { src: "Photos/1.webp", title: "", desc: "" },
        { src: "Photos/2.webp", title: "", desc: "" },
        { src: "Photos/3.webp", title: "", desc: "" },
        { src: "Photos/4.webp", title: "", desc: "" },
        { src: "Photos/5.webp", title: "", desc: "" },
        { src: "Photos/6.webp", title: "", desc: "" },
        { src: "Photos/7.webp", title: "", desc: "" },
        { src: "Photos/8.webp", title: "", desc: "" },
        { src: "Photos/9.webp", title: "", desc: "" },
        { src: "Photos/10.webp", title: "", desc: "" },
        { src: "Photos/11.JPG", title: "", desc: "" },
        { src: "Photos/12.JPG", title: "", desc: "" },
        { src: "Photos/13.JPG", title: "", desc: "" },
        { src: "Photos/14.JPG", title: "", desc: "" },
        { src: "Photos/15.JPG", title: "", desc: "" },
        { src: "Photos/16.JPG", title: "", desc: "" },
        { src: "Photos/17.JPG", title: "", desc: "" },
        { src: "Photos/18.webp", title: "", desc: "" },
        { src: "Photos/19.JPG", title: "", desc: "" },
        { src: "Photos/20.JPG", title: "", desc: "" },
        { src: "Photos/21.JPG", title: "", desc: "" },
        { src: "Photos/22.JPG", title: "", desc: "" },
        { src: "Photos/23.webp", title: "", desc: "" },
        { src: "Photos/24.JPG", title: "", desc: "" },
        { src: "Photos/25.JPG", title: "", desc: "" },
        { src: "Photos/26.JPG", title: "", desc: "" },
        { src: "Photos/27.JPG", title: "", desc: "" },
    ];

    const AUTO_NEXT = 10000; // 10 seconds
    const MOBILE = "(max-width: 800px)"; // keep in sync with photos.css

    const grid = document.querySelector(".ph-grid");
    const viewer = document.querySelector(".ph-viewer");
    if (!grid || !viewer || PHOTOS.length === 0) return;

    const bigImg = viewer.querySelector("img");
    const bigTitle = viewer.querySelector(".ph-title");
    const bigDesc = viewer.querySelector(".ph-desc");

    function isMobile() {
        return window.matchMedia(MOBILE).matches;
    }

    function fillText(titleEl, descEl, photo) {
        titleEl.textContent = photo.title || "";
        descEl.textContent = photo.desc || "";
        descEl.style.display = photo.desc ? "" : "none";
    }

    // --- Build the grid ---
    const thumbs = PHOTOS.map(function (photo, i) {
        const img = document.createElement("img");
        img.src = photo.src;
        img.alt = photo.title || "";
        img.loading = "lazy";
        img.className = "no-zoom"; // the grid has its own behavior, not the lightbox

        img.addEventListener("mouseenter", function () {
            if (!isMobile() && i !== current) show(i);
        });
        img.addEventListener("click", function () {
            if (isMobile()) openPopup(i);
            else show(i);
        });

        grid.appendChild(img);
        return img;
    });

    // --- Big viewer (desktop) ---
    let current = -1;
    let hovering = false;
    let timer = null;

    function show(i) {
        current = i;
        thumbs.forEach(function (t, n) {
            t.classList.toggle("active", n === i);
        });

        viewer.classList.add("fading");
        setTimeout(function () {
            bigImg.src = PHOTOS[i].src;
            bigImg.alt = PHOTOS[i].title || "";
            fillText(bigTitle, bigDesc, PHOTOS[i]);
            viewer.classList.remove("fading");
        }, 200);

        schedule();
    }

    function schedule() {
        clearTimeout(timer);
        timer = setTimeout(function () {
            if (!hovering && !isMobile()) show((current + 1) % PHOTOS.length);
            else schedule();
        }, AUTO_NEXT);
    }

    grid.addEventListener("mouseenter", function () {
        hovering = true;
    });
    grid.addEventListener("mouseleave", function () {
        hovering = false;
        schedule(); // 10 s from when the mouse leaves
    });

    show(0);

    // --- Pop-up (mobile) ---
    const popup = document.createElement("div");
    popup.className = "ph-popup";
    const popImg = document.createElement("img");
    popImg.className = "no-zoom";
    const popTitle = document.createElement("p");
    popTitle.className = "ph-title";
    const popDesc = document.createElement("p");
    popDesc.className = "ph-desc";
    popup.append(popImg, popTitle, popDesc);
    document.body.appendChild(popup);

    function openPopup(i) {
        popImg.src = PHOTOS[i].src;
        popImg.alt = PHOTOS[i].title || "";
        fillText(popTitle, popDesc, PHOTOS[i]);
        popup.classList.add("open");
        document.body.style.overflow = "hidden";
    }

    function closePopup() {
        popup.classList.remove("open");
        document.body.style.overflow = "";
    }

    popup.addEventListener("click", closePopup); // tap anywhere to close
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closePopup();
    });
})();
