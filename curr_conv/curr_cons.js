const bynInput = document.querySelector('.byn-input');
const usdInput = document.querySelector('.usd-input');
const eurInput = document.querySelector('.eur-input');
const rubInput = document.querySelector('.rub-input');
const curUSD = document.querySelector('.cur-usd');
const curEUR = document.querySelector('.cur-eur');
const curRUB = document.querySelector('.cur-rub');

axios.get("https://api.nbrb.by/exrates/rates?periodicity=0")
    .then((res) => {
        indexUSD = res.data.findIndex(el => el.Cur_Abbreviation === "USD");
        indexEUR = res.data.findIndex(el => el.Cur_Abbreviation === "EUR");
        indexRUB = res.data.findIndex(el => el.Cur_Abbreviation === "RUB");
        rateUSD = res.data[indexUSD].Cur_OfficialRate;
        rateEUR = res.data[indexEUR].Cur_OfficialRate;
        rateRUB = res.data[indexRUB].Cur_OfficialRate;
        curUSD.textContent = rateUSD;
        curEUR.textContent = rateEUR;
        curRUB.textContent = rateRUB / 100;
    })

bynInput.addEventListener('input', () => {
    if (bynInput.value === '') {
        usdInput.value = '';
        eurInput.value = '';
        rubInput.value = '';
    } else {
        usdInput.value = (bynInput.value / rateUSD).toFixed(2);
        eurInput.value = (bynInput.value / rateEUR).toFixed(2);
        rubInput.value = (bynInput.value / rateRUB * 100).toFixed(2);
    }
});

usdInput.addEventListener('input', () => {
    if (usdInput.value === '') {
        bynInput.value = '';
        eurInput.value = '';
        rubInput.value = '';
    } else {
        bynInput.value = (usdInput.value * rateUSD).toFixed(2);
        eurInput.value = (bynInput.value / rateEUR).toFixed(2);
        rubInput.value = (bynInput.value / rateRUB * 100).toFixed(2);
    }
});

eurInput.addEventListener('input', () => {
    if (eurInput.value === '') {
        bynInput.value = '';
        usdInput.value = '';
        rubInput.value = '';
    } else {
        bynInput.value = (eurInput.value * rateEUR).toFixed(2);
        usdInput.value = (bynInput.value / rateUSD).toFixed(2);
        rubInput.value = (bynInput.value / rateRUB * 100).toFixed(2);
    }
});

rubInput.addEventListener('input', () => {
    if (rubInput.value === '') {
        bynInput.value = '';
        usdInput.value = '';
        eurInput.value = '';
    } else {
        bynInput.value = (rubInput.value * rateRUB / 100).toFixed(2);
        usdInput.value = (bynInput.value / rateUSD).toFixed(2);
        eurInput.value = (bynInput.value / rateEUR).toFixed(2);
    }
});