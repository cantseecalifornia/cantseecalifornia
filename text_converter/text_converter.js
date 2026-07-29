const textInput = document.getElementById('input-text');
const textOutput = document.getElementById('output-text');
const keepLines = document.getElementById('keep-lines');
const inputCount = document.getElementById('input-count');
const outputCount = document.getElementById('output-count');

function updateCounters() {
    inputCount.textContent = `chars: ${textInput.value.length}`;
    outputCount.textContent = `chars: ${textOutput.value.length}`;
}

function convertText() {
    let text = textInput.value;

    text = text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/['‘’`´ʼʻʹ′]/g, '');

    if (keepLines.checked) {
        text = text
            .split(/\r?\n/)
            .map(line =>
                line
                    .trim()
                    .replace(/\s+/g, '-')
                    .replace(/[^a-z0-9а-яё-]/gi, '')
            )
            .join('\n');
    } else {
        text = text
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9а-яё-]/gi, '');
    }

    textOutput.value = text;
    updateCounters();
}

textInput.addEventListener('input', convertText);
keepLines.addEventListener('change', convertText);

textOutput.addEventListener('click', () => {
    textOutput.select();
    navigator.clipboard.writeText(textOutput.value);
});
