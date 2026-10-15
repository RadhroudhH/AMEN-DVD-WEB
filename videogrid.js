/*
  videogrid.js — grid of videos a to y

  Expected files (in the "Grid" folder):
    Grid/a.mp4 ... Grid/y.mp4                  the videos
    Grid/frames/a-1.jpg ... a-4.jpg            4 frames per video (made by make-frames.ps1)

  Hover a tile  -> the 4 frames animate like a GIF.
  Click a tile  -> video opens full screen with controls.
  Click outside the video or press Escape -> closes.
*/
(function () {
    const FOLDER = "Grid/";
    const LETTERS = "abcdefghijklmnopqrstuvwxy".split(""); // no z
    const FRAME_COUNT = 4;
    const FRAME_SPEED = 350; // milliseconds per frame on hover

    const grid = document.querySelector(".vg-grid");
    if (!grid) return;

    // --- Player overlay ---
    const player = document.createElement("div");
    player.className = "vg-player";
    const video = document.createElement("video");
    video.controls = true;
    video.loop = true; // restart when it ends
    video.playsInline = true;
    player.appendChild(video);
    document.body.appendChild(player);

    function openVideo(src) {
        video.src = src;
        video.volume = 0.25; // default volume: 25%
        player.classList.add("open");
        document.body.style.overflow = "hidden";
        video.play().catch(function () {}); // ignore if the browser blocks autoplay
    }

    function closeVideo() {
        video.pause();
        video.removeAttribute("src");
        video.load();
        player.classList.remove("open");
        document.body.style.overflow = "";
    }

    player.addEventListener("click", function (e) {
        if (e.target === player) closeVideo(); // clicks on the video itself don't close
    });
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closeVideo();
    });

    // --- Build the tiles ---
    LETTERS.forEach(function (letter) {
        const frames = [];
        for (let i = 1; i <= FRAME_COUNT; i++) {
            frames.push(FOLDER + "frames/" + letter + "-" + i + ".jpg");
        }

        const tile = document.createElement("div");
        tile.className = "vg-tile";

        const img = document.createElement("img");
        img.className = "no-zoom"; // keep lightbox.js away from these
        img.src = frames[0];
        img.alt = "Video " + letter;
        img.loading = "lazy";

        const label = document.createElement("span");
        label.className = "vg-label";
        label.textContent = letter;

        tile.appendChild(img);
        tile.appendChild(label);
        grid.appendChild(tile);

        // Preload the other frames so the hover animation doesn't flicker
        frames.slice(1).forEach(function (src) {
            new Image().src = src;
        });

        // Hover animation
        let timer = null;
        let current = 0;
        tile.addEventListener("mouseenter", function () {
            timer = setInterval(function () {
                current = (current + 1) % frames.length;
                img.src = frames[current];
            }, FRAME_SPEED);
        });
        tile.addEventListener("mouseleave", function () {
            clearInterval(timer);
            current = 0;
            img.src = frames[0];
        });

        // Click: open the video
        tile.addEventListener("click", function () {
            clearInterval(timer);
            openVideo(FOLDER + letter + ".mp4");
        });
    });
})();
