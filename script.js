// ====== Personalize these ======
const GIRL_NAME = "Nay Chi";
const FROM_NAME = "Kaung";
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

// Typewriter lines
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

// ====== Main Page Countdown (only runs if elements exist) ======
(function initCountdownIfExists() {
  const dEl = $("d");
  const hEl = $("h");
  const mEl = $("m");
  const sEl = $("s");

  // If you removed the countdown block, skip safely
  if (!dEl || !hEl || !mEl || !sEl) return;

  const now = new Date();
  const year = now.getFullYear();
  let target = new Date(year, 1, 14, 0, 0, 0); // Feb 14 00:00
  if (now > target) target = new Date(year + 1, 1, 14, 0, 0, 0);

  function update() {
    const diff = target - new Date();

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
})();

// ====== Init basic UI ======
$("name").textContent = GIRL_NAME;
$("fromName").textContent = FROM_NAME;

const typeEl = $("typewriter");
if (typeEl) {
  typeEl.style.whiteSpace = "pre-line";
  typeWriter(TYPE_LINES, typeEl);
}

// Scroll button
const scrollBtn = $("scrollBtn");
if (scrollBtn) {
  scrollBtn.addEventListener("click", () => {
    $("memories")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

// Reasons generator
const reasonBtn = $("reasonBtn");
if (reasonBtn) {
  reasonBtn.addEventListener("click", () => {
    const pick = REASONS[Math.floor(Math.random() * REASONS.length)];
    $("reasonBox").textContent = "Because " + pick;
  });
}

// Quiz
document.querySelectorAll("[data-choice]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const val = btn.getAttribute("data-choice");
    const out = $("quizResult");
    if (!out) return;

    out.textContent =
      val === "right"
        ? "Correct 😌 (you’re literally my favorite)"
        : "Hmm… wrong 😤 try again";
  });
});

// Secret message unlock
const unlockBtn = $("unlockBtn");
if (unlockBtn) {
  unlockBtn.addEventListener("click", () => {
    const input = $("codeInput")?.value?.trim().toLowerCase();
    if (!input) return;

    if (input === SECRET_CODE.toLowerCase()) {
      $("secretBox").hidden = false;
      $("codeInput").value = "";
    } else {
      $("secretBox").hidden = true;
      alert("Nope 😭");
    }
  });
}

// Music toggle (works with <audio src> OR <source src>)
const music = $("bgMusic");
const playBtn = $("playBtn");

if (playBtn && music) {
  playBtn.addEventListener("click", async () => {
    // currentSrc works even when you use <source>
    if (!music.currentSrc) {
      alert("Music file not found. Check your audio src path.");
      return;
    }

    if (music.paused) {
      try {
        await music.play();
        playBtn.textContent = "Pause Music ⏸";
      } catch {
        alert("Your browser blocked audio. Tap again or allow sound.");
      }
    } else {
      music.pause();
      playBtn.textContent = "Play Music ♪";
    }
  });
}

// ====== FULL SITE LOCK (PIN REVEALS ON FEB 14) ======
const LOCK_PIN = "4321"; // <- change to 4-digit PIN

const lockOverlay = $("lockOverlay");
const pinInput = $("pinInput");
const unlockSiteBtn = $("unlockSiteBtn");
const pinStatus = $("pinStatus");
const pinReveal = $("pinReveal");
const pinValue = $("pinValue");
const pinHint = $("pinHint");
const lockCountdownText = $("lockCountdownText");

// If lock UI doesn't exist, stop here safely
if (lockOverlay && pinInput && unlockSiteBtn && pinStatus && pinReveal && pinValue && pinHint && lockCountdownText) {

  function getFeb14Start(year) {
    return new Date(year, 1, 14, 0, 0, 0); // Feb 14 00:00
  }

  function getFeb15Start(year) {
    return new Date(year, 1, 15, 0, 0, 0); // Feb 15 00:00
  }

  // Next "open time" for the countdown text
  function getNextOpenTime() {
    const now = new Date();
    const y = now.getFullYear();
    const feb14 = getFeb14Start(y);
    const feb15 = getFeb15Start(y);

    if (now < feb14) return feb14;     // before Feb 14
    if (now < feb15) return feb14;     // during Feb 14: it's open now
    return getFeb14Start(y + 1);       // after Feb 14: next year
  }

  function msToCountdownText(ms) {
    const total = Math.max(0, Math.floor(ms / 1000));
    const d = Math.floor(total / 86400);
    const h = Math.floor((total % 86400) / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return `${d}d ${String(h).padStart(2,"0")}h ${String(m).padStart(2,"0")}m ${String(s).padStart(2,"0")}s`;
  }

  function isFeb14Today() {
    const now = new Date();
    const y = now.getFullYear();
    const feb14 = getFeb14Start(y);
    const feb15 = getFeb15Start(y);
    return now >= feb14 && now < feb15;
  }

  function showPinIfFeb14() {
    if (isFeb14Today()) {
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
    const openTime = getNextOpenTime();
    const diff = openTime - now;

    // During Feb 14, show "It's time"
    if (isFeb14Today()) {
      lockCountdownText.textContent = "It’s time ✨";
      return;
    }

    lockCountdownText.textContent = `Opens in ${msToCountdownText(diff)}`;
  }

  function unlockSite() {
    document.body.classList.remove("locked");
    lockOverlay.classList.add("hide");
    lockOverlay.setAttribute("aria-hidden", "true");
  }

  function tryUnlock() {
    const value = (pinInput.value || "").trim();

    // If you want to ONLY allow unlock on Feb 14, keep this:
    if (!isFeb14Today()) {
      alert("Not yet 😭 Come back on Feb 14 💗");
      pinInput.value = "";
      return;
    }

    if (value === LOCK_PIN) {
      unlockSite();
    } else {
      alert("Wrong PIN 😤 try again");
      pinInput.value = "";
      pinInput.focus();
    }
  }

  unlockSiteBtn.addEventListener("click", tryUnlock);

  pinInput.addEventListener("input", () => {
    pinInput.value = pinInput.value.replace(/\D/g, "").slice(0, 4);
  });

  pinInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") tryUnlock();
  });

  // Init lock
  (function initLock() {
    document.body.classList.add("locked");
    pinInput.focus();
    showPinIfFeb14();
    updateLockCountdown();
    setInterval(() => {
      showPinIfFeb14();
      updateLockCountdown();
    }, 1000);
  })();
}
