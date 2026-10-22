var TANGGAL = "2027-03-13T09:00:00+07:00";
var WA = "6281234567890";
var NAMA = "Heathcliff & Catherine";

var hero = document.getElementById("hero");
var COLS = 5, ROWS = 6, THRESH = 0.8, covered = {}, nCovered = 0, opened = false;
var hint = document.getElementById("hint"), bar = document.getElementById("bar");

function cover(px, py) {
  var b = hero.getBoundingClientRect(), R = Math.max(220, Math.min(b.width, b.height) * 0.55);
  for (var r = 0; r < ROWS; r++) for (var c = 0; c < COLS; c++) {
    var cx = (c + .5) / COLS * b.width, cy = (r + .5) / ROWS * b.height;
    if (!covered[r * COLS + c] && Math.hypot(cx - px, cy - py) <= R) { covered[r * COLS + c] = 1; nCovered++; }
  }
  var p = Math.min(1, nCovered / (COLS * ROWS * THRESH));
  bar.style.width = (p * 100) + "%";
  hint.textContent = p < 1 ? "Retak " + Math.round(p * 100) + "%. Teruskan." : "Pecah.";
  if (p >= 1) openInvitation();
}

var bgm = document.getElementById("bgm"), muteBtn = document.getElementById("mute"), musicOn = false, fade;
bgm.volume = 0;
function startMusic() {
  if (musicOn) return;
  musicOn = true;
  muteBtn.hidden = false;
  var pr = bgm.play();
  if (pr && pr.catch) pr.catch(function () { musicOn = false; });
  clearInterval(fade);
  fade = setInterval(function () {
    bgm.volume = Math.min(.6, bgm.volume + .03);
    if (bgm.volume >= .6) clearInterval(fade);
  }, 120);
}
muteBtn.addEventListener("click", function () {
  var off = !bgm.muted;
  bgm.muted = off;
  muteBtn.setAttribute("aria-pressed", off);
  muteBtn.setAttribute("aria-label", off ? "Nyalakan musik" : "Matikan musik");
});
document.addEventListener("visibilitychange", function () {
  if (!musicOn) return;
  document.hidden ? bgm.pause() : bgm.play().catch(function () {});
});

function crackAt(px, py) {
  startMusic();
  if (opened) return;
  var b = hero.getBoundingClientRect();
  shatter(px / b.width * 100, py / b.height * 100, Math.floor(Math.random() * 999), 0);
  cover(px, py);
}

function openInvitation() {
  opened = true;
  hero.classList.add("open");
  document.querySelector(".flash").style.animation = "none";
  setTimeout(function () {
    document.body.classList.remove("locked");
    document.getElementById("cerita").scrollIntoView({ behavior: "smooth" });
  }, 600);
}

shatter(70, 30, 9);
(function () { var b = hero.getBoundingClientRect(); cover(b.width * .7, b.height * .3); })();

hero.addEventListener("click", function (e) {
  var b = hero.getBoundingClientRect();
  crackAt(e.clientX - b.left, e.clientY - b.top);
});
hero.addEventListener("keydown", function (e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  e.preventDefault();
  var b = hero.getBoundingClientRect();
  crackAt(Math.random() * b.width, Math.random() * b.height);
});

(function () {
  var r = mk(5);
  var frag = document.createDocumentFragment();
  for (var i = 0; i < 10; i++) {
    var p = document.createElement("span");
    p.className = "petal";
    p.style.cssText = "left:" + (r() * 100) + "%;animation-duration:" + (9 + r() * 9) + "s;animation-delay:-" + (r() * 14) + "s;transform:scale(" + (.6 + r() * .9) + ")";
    frag.appendChild(p);
  }
  hero.appendChild(frag);
})();

var target = new Date(TANGGAL).getTime();
var cd = ["d", "h", "m", "s"].map(function (id) { return document.getElementById(id); });
function tick() {
  var t = Math.max(0, target - Date.now()), f = Math.floor;
  var v = [f(t / 864e5), f(t % 864e5 / 36e5), f(t % 36e5 / 6e4), f(t % 6e4 / 1e3)];
  cd.forEach(function (el, i) { el.textContent = v[i]; });
}
tick();
setInterval(tick, 1000);

var currentTheme = document.body.dataset.theme;
var io = new IntersectionObserver(function (es) {
  es.forEach(function (e) {
    if (e.isIntersecting) {
      var nextTheme = e.target.dataset.theme;
      if (currentTheme !== nextTheme) {
        currentTheme = nextTheme;
        document.body.dataset.theme = nextTheme;
      }
    }
  });
}, { rootMargin: "-30% 0px -30% 0px" });
document.querySelectorAll("section").forEach(function (s) { io.observe(s); });

document.getElementById("rsvpForm").addEventListener("submit", function (e) {
  e.preventDefault();
  var f = e.target;
  var teks = "Halo, saya " + f.nama.value + ". Saya " + f.hadir.value.toLowerCase() +
    " (" + f.jml.value + " orang) di pernikahan " + NAMA + "." +
    (f.ucap.value ? " Ucapan: " + f.ucap.value : "");
  window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(teks), "_blank");
});