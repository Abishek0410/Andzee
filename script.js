/*
=====================================
ANDZEE EXPERIENCE SCRIPT
Brand: blue #00B4FF / purple #7B2FFF / amber #FF9B00
=====================================
*/


/* =====================================
    CONSTELLATION CANVAS
    Nodes drift slowly; connections glow
    in brand blue, brighter near the cursor.
===================================== */

function initConstellation(canvasId) {

    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;

    const ctx    = canvas.getContext("2d");
    const isMob  = window.innerWidth < 600;
    const COUNT  = isMob ? 38 : 65;
    const DIST   = isMob ? 110 : 140;

    let W, H, nodes;
    let mouse = { x: -9999, y: -9999 };
    let raf;

    function resize() {
        W = canvas.width  = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
    }

    function makeNode() {
        return {
            x:  Math.random() * W,
            y:  Math.random() * H,
            vx: (Math.random() - 0.5) * 0.28,
            vy: (Math.random() - 0.5) * 0.28,
        };
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);

        nodes.forEach(n => {
            n.x += n.vx;  n.y += n.vy;
            if (n.x < 0 || n.x > W) n.vx *= -1;
            if (n.y < 0 || n.y > H) n.vy *= -1;
        });

        /* Lines */
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const d  = Math.sqrt(dx * dx + dy * dy);
                if (d < DIST) {
                    const a = (1 - d / DIST) * 0.22;
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.strokeStyle = `rgba(0,180,255,${a})`;
                    ctx.lineWidth = 0.7;
                    ctx.stroke();
                }
            }
        }

        /* Dots */
        nodes.forEach(n => {
            const dm = Math.hypot(n.x - mouse.x, n.y - mouse.y);
            const a  = dm < 120 ? 0.85 : 0.40;
            const r  = dm < 120 ? 2.2  : 1.4;
            ctx.beginPath();
            ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0,180,255,${a})`;
            ctx.fill();
        });

        raf = requestAnimationFrame(draw);
    }

    function init() {
        resize();
        nodes = Array.from({ length: COUNT }, makeNode);
        draw();
    }

    /* Mouse tracking — relative to canvas */
    const parent = canvas.parentElement;
    parent.addEventListener("mousemove", e => {
        const r  = canvas.getBoundingClientRect();
        mouse.x  = e.clientX - r.left;
        mouse.y  = e.clientY - r.top;
    });
    parent.addEventListener("mouseleave", () => {
        mouse.x = mouse.y = -9999;
    });

    window.addEventListener("resize", resize);

    init();
    return () => cancelAnimationFrame(raf);
}


/* =====================================
    ELEMENT REFERENCES
===================================== */

const startScreen     = document.getElementById("startScreen");
const startExperience = document.getElementById("startExperience");

const loader          = document.getElementById("loader");
const loaderVideo     = document.getElementById("loaderVideo");
const skipIntro       = document.getElementById("skipIntro");

const mainPage        = document.getElementById("mainPage");

const gameIdInput     = document.getElementById("gameId");
const joinBtn         = document.getElementById("joinBtn");
const hostBtn         = document.getElementById("hostBtn");

let introCompleted = false;


/* =====================================
    CONSTELLATION ON START SCREEN
===================================== */

initConstellation("startCanvas");


/* =====================================
    START EXPERIENCE
===================================== */

startExperience.addEventListener("click", async () => {

    startExperience.disabled = true;

    const btnText = startExperience.querySelector(".btn-text");
    btnText.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> Starting…';

    startScreen.classList.add("hide");

    setTimeout(async () => {

        loader.classList.remove("hidden-loader");

        try {
            await loaderVideo.play();
        } catch (err) {
            console.warn("Video playback blocked:", err);
            showMainPage();
        }

    }, 750);

});


/* =====================================
    SHOW MAIN PAGE
===================================== */

function showMainPage() {

    if (introCompleted) return;
    introCompleted = true;

    loader.classList.add("hide");
    mainPage.classList.remove("hidden");

    setTimeout(() => {

        mainPage.classList.add("show");

        /* Logo reveal */
        const wrap = document.querySelector(".main-logo-wrap");
        if (wrap) {
            setTimeout(() => wrap.classList.add("revealed"), 80);
        }

        /* Start constellation on main page */
        initConstellation("mainCanvas");

    }, 120);
}


/* =====================================
    VIDEO EVENTS
===================================== */

loaderVideo.addEventListener("ended", showMainPage);

skipIntro.addEventListener("click", () => {
    loaderVideo.pause();
    loaderVideo.currentTime = 0;
    showMainPage();
});


/* =====================================
    FALLBACK — if video never plays
===================================== */

setTimeout(showMainPage, 12000);


/* =====================================
    STUDENT JOIN
===================================== */

joinBtn.addEventListener("click", () => {

    const gameId = gameIdInput.value.trim();

    if (!gameId) {
        animateInputError();
        return;
    }

    joinBtn.disabled = true;
    joinBtn.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> <span>Joining…</span>';

    setTimeout(() => {

        /*
        FUTURE:
        window.location.href = `student.html?game=${gameId}`;
        */

        alert(`Joining Game: ${gameId}`);

        joinBtn.disabled = false;
        joinBtn.innerHTML =
            '<span>Join</span><i class="fa-solid fa-arrow-right"></i>';

    }, 1200);

});


/* =====================================
    ENTER KEY
===================================== */

gameIdInput.addEventListener("keypress", e => {
    if (e.key === "Enter") joinBtn.click();
});


/* =====================================
    INPUT ERROR
===================================== */

function animateInputError() {
    gameIdInput.focus();
    gameIdInput.classList.remove("shake");
    void gameIdInput.offsetWidth;          // force reflow
    gameIdInput.classList.add("shake");
    setTimeout(() => gameIdInput.classList.remove("shake"), 450);
}


/* =====================================
    TEACHER DASHBOARD
===================================== */

hostBtn.addEventListener("click", () => {

    /*
    FUTURE:
    window.location.href = "teacher-dashboard.html";
    */

    alert("Opening Teacher Dashboard…");

});


/* =====================================
    PARALLAX FLOATING ICONS
===================================== */

document.addEventListener("mousemove", e => {

    const icons = document.querySelectorAll(".icon");
    const cx    = window.innerWidth  / 2;
    const cy    = window.innerHeight / 2;
    const dx    = (cx - e.clientX) / 95;
    const dy    = (cy - e.clientY) / 95;

    icons.forEach((icon, i) => {
        const m = (i + 1) * 0.42;
        icon.style.transform = `translate(${dx * m}px, ${dy * m}px)`;
    });

});


/* =====================================
    MOBILE — resume video on touch
===================================== */

document.addEventListener("touchstart", () => {

    if (loader.classList.contains("hidden-loader") || introCompleted) return;
    if (loaderVideo.paused) loaderVideo.play().catch(() => {});

}, { once: true });


/* =====================================
    PRELOAD ASSETS
===================================== */

window.addEventListener("load", () => {
    const img = new Image();
    img.src = "assets/Andzee.png";
});


/* =====================================
    FUTURE ROUTES
===================================== */

/*
Student:
  window.location.href = `student.html?game=${gameId}`;

Teacher:
  window.location.href = "teacher-dashboard.html";
*/