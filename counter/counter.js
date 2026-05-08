const STORAGE_KEY = 'simple_counter_val';
const TIME_KEY = 'simple_counter_time';

let count = parseInt(localStorage.getItem(STORAGE_KEY)) || 0;
let lastUpdate = parseInt(localStorage.getItem(TIME_KEY)) || Date.now();

const display = document.getElementById('counter-display');
const input = document.getElementById('custom-amount');

function updateUI() {
    display.textContent = count;
    localStorage.setItem(STORAGE_KEY, count);
}

function handleUpdate(type) {
    const val = parseInt(input.value);
    if (isNaN(val)) return;

    if (type === 'plus') {
        count += val;
    } else {
        count -= val;
    }

    updateUI();
    input.value = '';
}

function checkAutoIncrement() {
    const now = Date.now();
    const dayMs = 86400000;
    const diff = now - lastUpdate;

    if (diff >= dayMs) {
        const intervals = Math.floor(diff / dayMs);
        count += intervals * 50;
        lastUpdate += intervals * dayMs;
        
        localStorage.setItem(TIME_KEY, lastUpdate);
        updateUI();
    }
}

// Старт
checkAutoIncrement();
updateUI();

// Проверка раз в час
setInterval(checkAutoIncrement, 3600000);