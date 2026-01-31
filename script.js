// ====== Personalize these ======
const GIRL_NAME = "Nay Chi";
const FROM_NAME = "Kaung";
// Secret code: set it to something she will guess (e.g. her nickname)
const SECRET_CODE = "Ar Bwrr";

// Reasons list (edit these to match her)
const REASONS = [
  "you make me feel calm even when life is messy.",
  "you’re cute without even trying.",
  "you make ordinary moments feel special.",
  "you’re strong in a way that inspires me.",
  "your laugh is genuinely my favorite sound.",
  "you’re you… and that’s more than enough."
];

// Typewriter lines (edit if you want)
const TYPE_LINES = [
  "I made this little website because you deserve something thoughtful.",
  "Today is special — it’s Valentine’s Day, and it’s your birthday too.",
  "So… here’s a reminder: you are loved. A lot. 💗"
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
    alert("No music.mp3 found. (Optional) Put a music.mp3 file in the same folder 😊");
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
