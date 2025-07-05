let rounds = JSON.parse(localStorage.getItem("rounds")) || [];

function updateDisplay() {
  const roundsDiv = document.getElementById("rounds");
  const themTotal = rounds.reduce((sum, r) => sum + r.them, 0);
  const usTotal = rounds.reduce((sum, r) => sum + r.us, 0);
  document.getElementById("themTotal").textContent = themTotal;
  document.getElementById("usTotal").textContent = usTotal;

  roundsDiv.innerHTML = "";
  rounds.forEach((r, i) => {
    const row = document.createElement("div");
    row.className = "row";
    row.innerHTML = `
      <div class="cell label">${i + 1}</div>
      <div class="cell">${r.us}</div>
      <div class="cell">${r.them}</div>
      <button class="cell delete" onclick="removeRound(${i})">✕</button>
    `;
    roundsDiv.appendChild(row);
  });

  // ✅ Auto-scroll to the latest round
  roundsDiv.scrollTop = roundsDiv.scrollHeight;
}


function addRound() {
  const themInput = document.getElementById("themInput");
  const usInput = document.getElementById("usInput");
  const themVal = parseInt(themInput.value) || 0;
  const usVal = parseInt(usInput.value) || 0;

  rounds.push({ them: themVal, us: usVal });
  localStorage.setItem("rounds", JSON.stringify(rounds));
  updateDisplay();

  themInput.value = "";
  usInput.value = "";
}

function toggleMenu() {
  document.getElementById('menu').classList.toggle('hidden');
}

function removeRound(index) {
  const confirmDelete = confirm(`Are you sure you want to delete Round ${index + 1}?`);
  if (!confirmDelete) return;

  rounds.splice(index, 1);
  localStorage.setItem("rounds", JSON.stringify(rounds));
  updateDisplay();
}

function showAbout() {
  document.getElementById('modal-body').innerHTML = `
    <h3>About No Chivas</h3>
    <p>This app helps you keep track of rounds and score — built as a PWA.</p>
    <p>Version: 1.0.1.3</p>
    <p>Developed by: Dani Diaz</p>
    <p>Source code: <a href="https://github.com/mangu/dominos">GitHub</a></p>
  `;
  document.getElementById('modal').classList.remove('hidden');
}

function showSettings() {
  document.getElementById('modal-body').innerHTML = `
    <h3>Settings</h3>
    <p>Settings panel coming soon.</p>
  `;
  document.getElementById('modal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
}


function resetGame() {
  if (confirm("Are you sure you want to reset all scores?")) {
    rounds = [];
    localStorage.removeItem("rounds");
    startTime = Date.now();
    updateDisplay();
  }
}

// Timer logic
let startTime = Date.now();

function updateTimer() {
  const now = Date.now();
  const elapsed = Math.floor((now - startTime) / 1000);
  const minutes = String(Math.floor(elapsed / 60)).padStart(1, '0');
  const seconds = String(elapsed % 60).padStart(2, '0');
  document.getElementById("timer").textContent = `${minutes}:${seconds}`;
}

setInterval(updateTimer, 1000);

updateDisplay();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .then(reg => console.log('Service Worker registered!', reg))
      .catch(err => console.error('Service Worker failed:', err));
  });
}


let wakeLock = null;
let fallbackInterval = null;

async function requestWakeLock() {
  if ('wakeLock' in navigator) {
    try {
      wakeLock = await navigator.wakeLock.request('screen');
      console.log('Wake Lock is active');

      wakeLock.addEventListener('release', () => {
        console.log('Wake Lock was released');
      });
    } catch (err) {
      console.error(`Wake Lock failed: ${err.name}, ${err.message}`);
    }
  } else {
    console.log('Wake Lock not supported, using fallback');
    enableFallbackWakeLock();
  }
}

function enableFallbackWakeLock() {
  // Prevent sleep by playing a silent audio loop (some iOS support)
  const audio = new Audio();
  audio.loop = true;
  audio.src = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YQAAAAA="; // silent
  audio.play().catch(() => {
    // fallback failed silently
  });

  // OR use a periodic scroll trick (some cases)
  fallbackInterval = setInterval(() => {
    window.scrollBy(0, 1);
    window.scrollBy(0, -1);
  }, 30000); // every 30s
}

// Re-request Wake Lock if tab becomes active again
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    requestWakeLock();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  //applyNames();
  requestWakeLock(); // 👈 Add here
});