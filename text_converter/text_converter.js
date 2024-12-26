const textInput = document.getElementById('input-text');
const textOutput = document.getElementById('output-text');

textInput.addEventListener('input', () => {
    let text = textInput.value;
    textOutput.value = text.toLowerCase().replace(/\s/g, '-').replaceAll("'", '');
});

textOutput.addEventListener('click', () => {
    textOutput.select();
    navigator.clipboard.writeText(textOutput.value);
});