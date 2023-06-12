const btn = document.getElementById('btn');
const rgb = document.querySelector('.rgb');
const hex = document.querySelector('.hex');
const content = document.querySelector('.content');
const copiedrgb = document.querySelector('.copied-rgb');
const copiedhex = document.querySelector('.copied-hex');

btn.addEventListener('click', function () {
    getRandomColor();
    document.body.style.backgroundColor = randomRGB;
    rgb.textContent = randomRGBname;
    hex.textContent = randomHEXname;
    copiedrgb.style.opacity = '0';
    copiedhex.style.opacity = '0';
});

function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    randomRGB = 'rgb(' + r.toString() + ', ' + g.toString() + ', ' + b.toString() + ')';
    randomHEXname = '#' + r.toString(16) + g.toString(16) + b.toString(16);
    randomRGBname = r.toString() + ', ' + g.toString() + ', ' + b.toString();
}

const copyTextOnClick = (event) => {
    const textToCopy = event.target.innerText;
    navigator.clipboard.writeText(textToCopy);
};

content.addEventListener('click', (event) => {
    if (event.target.tagName === 'SPAN') {
        copyTextOnClick(event);
    }
});

rgb.addEventListener('click', () => {
    copiedrgb.style.opacity = '1';
});

hex.addEventListener('click', () => {
    copiedhex.style.opacity = '1';
});