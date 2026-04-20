const textInput = document.getElementById('input-text');
const textOutput = document.getElementById('output-text');

textInput.addEventListener('input', () => { 
    let text = textInput.value;

    textOutput.value = text
        .toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .replaceAll("'", '');
});

textOutput.addEventListener('click', () => {
    textOutput.select();
    navigator.clipboard.writeText(textOutput.value);
});
