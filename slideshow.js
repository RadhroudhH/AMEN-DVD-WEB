/*
  slideshow.js — fading picture + caption on the home page

  - Crossfades to the next picture every 24 seconds.
  - Each reload starts on the next picture in the list (set order, loops back to the start).
  - Add/remove pictures in the SLIDES list below.
*/
(function () {
    const SLIDES = [
        { src: "Slideshow/Poster1.JPG", alt: "One eye guy pictured in a window pane", caption: "One eye guy pictured in a window pane" },
        { src: "Slideshow/Poster2.JPG", alt: "One eye Guy with Austin's installation", caption: "One eye guy with Austin's installation" },
        { src: "Slideshow/Poster3.jpg", alt: "Auto-portrait", caption: "Auto-portrait" },
        { src: "Slideshow/Poster4.jpg", alt: "AMEN DVD Postcard", caption: "AMEN DVD Postcard" },
        { src: "Slideshow/Poster5.png", alt: 'Frame from "nhb ama njmt(ch) nbki" (2026)', caption: 'Frame from "nhb ama njmt(ch) nbki" (2026)' },
        { src: "Slideshow/Poster6.png", alt: 'Frame from "Reflection" (2026)', caption: 'Frame from "Reflection" (2026)' },
        { src: "Slideshow/Poster7.png", alt: 'Frame from "ME + YOU"', caption: 'Frame from "ME + YOU"' },
        { src: "Slideshow/Poster8.JPG", alt: "Auto-portrait", caption: "Auto-portrait" },
    ];

    const INTERVAL = 24000; // 24 seconds between pictures
    const FADE = 1500; // fade duration in ms (keep in sync with the CSS transition)

    const box = document.querySelector(".slideshow");
    if (!box || SLIDES.length === 0) return;

    let imgA = box.querySelectorAll(".slide")[0];
    let imgB = box.querySelectorAll(".slide")[1];
    const caption = box.querySelector(".side-caption");

    // --- Pick the starting picture: the one after the last picture seen ---
    let index = 0;
    try {
        const last = parseInt(localStorage.getItem("slideIndex"), 10);
        if (!isNaN(last)) index = (last + 1) % SLIDES.length;
    } catch (e) {}

    function remember(i) {
        try {
            localStorage.setItem("slideIndex", i);
        } catch (e) {}
    }

    // --- Show the first picture right away ---
    imgA.src = SLIDES[index].src;
    imgA.alt = SLIDES[index].alt;
    caption.textContent = SLIDES[index].caption;
    imgA.classList.add("active");
    remember(index);

    if (SLIDES.length < 2) return;

    // Preload the next picture so the fade is smooth
    function preload(i) {
        new Image().src = SLIDES[i].src;
    }
    preload((index + 1) % SLIDES.length);

    // --- Crossfade to the next picture ---
    function next() {
        index = (index + 1) % SLIDES.length;
        const slide = SLIDES[index];

        imgB.onload = function () {
            imgB.classList.add("active"); // fade new one in
            imgA.classList.remove("active"); // fade old one out

            // Caption: fade out, swap text, fade back in
            caption.classList.add("hidden");
            setTimeout(function () {
                caption.textContent = slide.caption;
                caption.classList.remove("hidden");
            }, FADE / 2);

            // Swap roles for next time
            const tmp = imgA;
            imgA = imgB;
            imgB = tmp;

            remember(index);
            preload((index + 1) % SLIDES.length);
        };
        imgB.src = slide.src;
        imgB.alt = slide.alt;
    }

    setInterval(next, INTERVAL);
})();
