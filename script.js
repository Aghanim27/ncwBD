// ====== Personalize these ======
const GIRL_NAME = "Nay Chi";
const FROM_NAME = "Kaung";
// Secret code: set it to something she will guess
const SECRET_CODE = "Ar Bwrr";

// Reasons list
const REASONS = [
  "you make me feel calm even when life is messy.",
  "you’re cute without even trying.",
  "you’re strong in a way that inspires me.",
  "your laugh is genuinely my favorite sound.",
  "that corner of your lip, hmm...",
  "you’re you… and that’s more than enough."
];

// Typewriter lines (edit if you want)
const TYPE_LINES = [
  "I made this little thing because you deserve something thoughtful.",
  "Today is special — it’s Valentine’s Day, and it’s your birthday too.",
  "So… here’s a reminder: I love you. A lot. 💗"
];

// ====== Helpers ======
const $ = (id) => document.getElementById(id);

function typeWriter(lines, el, speed = 26, pause = 650) {
  let line = 0, char = 0;
  el.textContent = "";

  function tick() {
    const current = lines[line];
    el.textContent = current.slice(0, char);

    if (char < current.length) {
      char++;
      setTimeout(tick, speed);
    } else {
      // line done
      setTimeout(() => {
        line++;
        if (line >= lines.length) return;
        char = 0;
        el.textContent += "\n";
        tick();
      }, pause);
    }
  }

  tick();
}

function setCountdown(targetDate) {
  const dEl = $("d"), hEl = $("h"), mEl = $("m"), sEl = $("s");

  function update() {
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
      dEl.textContent = "0";
      hEl.textContent = "0";
      mEl.textContent = "0";
      sEl.textContent = "0";
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    dEl.textContent = String(days);
    hEl.textContent = String(hours).padStart(2, "0");
    mEl.textContent = String(mins).padStart(2, "0");
    sEl.textContent = String(secs).padStart(2, "0");
  }

  update();
  setInterval(update, 1000);
}

// ====== Init ======
$("name").textContent = GIRL_NAME;
$("fromName").textContent = FROM_NAME;

// Typewriter
const typeEl = $("typewriter");
typeEl.style.whiteSpace = "pre-line";
typeWriter(TYPE_LINES, typeEl);

// Countdown to Feb 14 (local time)
const year = new Date().getFullYear();
const target = new Date(year, 1, 14, 0, 0, 0); // month is 0-based: 1=Feb
// If already passed this year, use next year
if (new Date() > target) target.setFullYear(year + 1);
setCountdown(target);

// Scroll button
$("scrollBtn").addEventListener("click", () => {
  $("memories").scrollIntoView({ behavior: "smooth", block: "start" });
});

// Reasons generator
$("reasonBtn").addEventListener("click", () => {
  const pick = REASONS[Math.floor(Math.random() * REASONS.length)];
  $("reasonBox").textContent = "Because " + pick;
});

// Quiz
document.querySelectorAll("[data-choice]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const val = btn.getAttribute("data-choice");
    $("quizResult").textContent =
      val === "right"
        ? "Correct 😌 (you’re literally my favorite)"
        : "Hmm… wrong 😤 try again";
  });
});

// Secret message unlock
$("unlockBtn").addEventListener("click", () => {
  const input = $("codeInput").value.trim().toLowerCase();
  if (!input) return;

  if (input === SECRET_CODE.toLowerCase()) {
    $("secretBox").hidden = false;
    $("codeInput").value = "";
  } else {
    $("secretBox").hidden = true;
    alert("Nope 😭 ");
  }
});

// Music toggle
const music = $("bgMusic");
const playBtn = $("playBtn");

playBtn.addEventListener("click", async () => {
  if (!music.src) {
    alert("No music.mp3 found.");
    return;
  }

  if (music.paused) {
    try {
      await music.play();
      playBtn.textContent = "Pause Music ⏸";
    } catch {
      alert("Your browser blocked autoplay. Tap again or allow audio.");
    }
  } else {
    music.pause();
    playBtn.textContent = "Play Music ♪";
  }
});

// ====== FULL SITE LOCK (PIN REVEALS ON FEB 14) ======
const LOCK_PIN = "4321"; // <- change to 4-digit PIN
const lockOverlay = document.getElementById("lockOverlay");
const pinInput = document.getElementById("pinInput");
const unlockSiteBtn = document.getElementById("unlockSiteBtn");
const pinStatus = document.getElementById("pinStatus");
const pinReveal = document.getElementById("pinReveal");
const pinValue = document.getElementById("pinValue");
const pinHint = document.getElementById("pinHint");
const lockCountdownText = document.getElementById("lockCountdownText");

// Set your timezone behavior: uses the viewer's device time (her phone time).
function getFeb14Midnight() {
  const y = new Date().getFullYear();
  // month is 0-based, so 1 = Feb
  let dt = new Date(y, 1, 14, 0, 0, 0);
  if (new Date() > dt) dt = new Date(y + 1, 1, 14, 0, 0, 0);
  return dt;
}

function msToCountdownText(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${d}d ${String(h).padStart(2,"0")}h ${String(m).padStart(2,"0")}m ${String(s).padStart(2,"0")}s`;
}

function showPinIfFeb14OrLater() {
  const now = new Date();
  const feb14 = getFeb14Midnight();

  // During Feb 14 (from midnight) and after, reveal PIN for that year's Feb 14
  if (now >= feb14) {
    pinStatus.textContent = "It’s Feb 14 💗 Here’s your PIN:";
    pinReveal.hidden = false;
    pinValue.textContent = LOCK_PIN;
    pinHint.textContent = "Enter it above to open the surprise ✨";
  } else {
    pinStatus.textContent = "PIN reveal on Feb 14 🎂💌";
    pinReveal.hidden = true;
    pinHint.textContent = "Come back on Feb 14 — don’t peek early 😤💗";
  }
}

function updateLockCountdown() {
  const now = new Date();
  const feb14 = getFeb14Midnight();
  const diff = feb14 - now;

  if (diff <= 0) {
    lockCountdownText.textContent = "It’s time ✨";
  } else {
    lockCountdownText.textContent = `Opens in ${msToCountdownText(diff)}`;
  }
}

function unlockSite() {
  document.body.classList.remove("locked");
  lockOverlay.classList.add("hide");
  lockOverlay.setAttribute("aria-hidden", "true");
  // localStorage.setItem("siteUnlocked", "1");
}

function tryUnlock() {
  const value = (pinInput.value || "").trim();

  // Optional rule: only allow unlock on/after Feb 14.
  // If you want her to be able to unlock anytime IF she guesses the PIN, delete this block.
  // const now = new Date();
  // const feb14 = getFeb14Midnight();
  // if (now < feb14) {
  //   alert("Not yet 😭 Come back on Feb 14 💗");
  //   pinInput.value = "";
  //   return;
  // }

  if (value === LOCK_PIN) {
    unlockSite();
  } else {
    alert("Wrong PIN 😤 try again");
    pinInput.value = "";
    pinInput.focus();
  }
}

// Hook events
unlockSiteBtn.addEventListener("click", tryUnlock);
pinInput.addEventListener("input", () => {
  // keep digits only
  pinInput.value = pinInput.value.replace(/\D/g, "").slice(0, 4);
});
pinInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") tryUnlock();
});

// Init lock
(function initLock() {
  // If you want it to stay unlocked once she opens it once:
  // (If you DON’T want this, comment out the next 4 lines)
  document.body.classList.add("locked");
//   if (localStorage.getItem("siteUnlocked") === "1") {
//     unlockSite();
//     return;
//   }

  pinInput.focus();
  showPinIfFeb14OrLater();
  updateLockCountdown();
  setInterval(() => {
    showPinIfFeb14OrLater();
    updateLockCountdown();
  }, 1000);
})();
