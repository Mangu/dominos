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
      <div class="cell">${r.them}</div>
      <div class="cell">${r.us}</div>
      <button class="cell delete" onclick="removeRound(${i})">✕</button>
    `;
    roundsDiv.appendChild(row);
  });
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

function removeRound(index) {
  const confirmDelete = confirm(`Are you sure you want to delete Round ${index + 1}?`);
  if (!confirmDelete) return;

  rounds.splice(index, 1);
  localStorage.setItem("rounds", JSON.stringify(rounds));
  updateDisplay();
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
  const minutes = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const seconds = String(elapsed % 60).padStart(2, '0');
  document.getElementById("timer").textContent = `${minutes}:${seconds}`;
}

setInterval(updateTimer, 1000);

updateDisplay();
