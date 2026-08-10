const counterEl = document.getElementById('counter');
const amountInput = document.getElementById('amountInput');
const btnMinus = document.getElementById('btnMinus');
const btnPlus = document.getElementById('btnPlus');

let counter = 0;

function get6AMAnchor(date) {
  const d = new Date(date);
  const sixAM = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 6, 0, 0, 0);
  if (d < sixAM) {
    sixAM.setDate(sixAM.getDate() - 1);
  }
  return sixAM;
}

function processDailyBonuses() {
  const now = new Date();
  const currentAnchor = get6AMAnchor(now);
  const lastAnchorTime = localStorage.getItem('lastAnchorTime');

  if (lastAnchorTime) {
    const lastAnchor = new Date(parseInt(lastAnchorTime, 10));
    const diffMs = currentAnchor - lastAnchor;
    const daysPassed = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (daysPassed > 0) {
      counter += daysPassed * 50;
      localStorage.setItem('counterValue', counter);
      localStorage.setItem('lastAnchorTime', currentAnchor.getTime());
    }
  } else {
    localStorage.setItem('lastAnchorTime', currentAnchor.getTime());
  }
}

function loadState() {
  const savedCounter = localStorage.getItem('counterValue');
  if (savedCounter !== null) {
    counter = parseInt(savedCounter, 10) || 0;
  }
  processDailyBonuses();
  updateDisplay();
}

function saveState() {
  localStorage.setItem('counterValue', counter);
}

function updateDisplay() {
  counterEl.textContent = counter;
}

function getInputValue() {
  const val = parseInt(amountInput.value, 10);
  return isNaN(val) ? 0 : Math.abs(val);
}

btnPlus.addEventListener('click', () => {
  const val = getInputValue();
  counter += val;
  saveState();
  updateDisplay();
});

btnMinus.addEventListener('click', () => {
  const val = getInputValue();
  counter -= val;
  saveState();
  updateDisplay();
});

function scheduleNextCheck() {
  const now = new Date();
  const next6AM = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 0, 0, 0);
  if (now >= next6AM) {
    next6AM.setDate(next6AM.getDate() + 1);
  }
  const timeUntil6AM = next6AM - now;

  setTimeout(() => {
    processDailyBonuses();
    updateDisplay();
    scheduleNextCheck();
  }, timeUntil6AM);
}

loadState();
scheduleNextCheck();