let inputField = document.querySelector('#out');
let firstNum = '';
let secondNum = '';
let operator = '';
let log = '';

const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.'];
const operators = ['/', '*', '%', '-', '+'];

document.querySelector('.keys').onclick = (event) => {
    if (event.target.className !== 'num') {
        return;
    }

    let hasFirstNum = firstNum !== '';
    let hasOperator = operator !== '';
    let hasSecondNum = secondNum !== '';

    if (event.target.id === 'del') {
        TryDeleteChar(event.target);
        return;
    }

    if (event.target.id === 'clear') {
        ClearInputField(event.target);
        return;
    }

    if (inputField.textContent === '0' && event.target.textContent !== '.') {
        inputField.textContent = '';
        firstNum = '';
    }

    if ((numbers.includes(event.target.textContent) || event.target.textContent === '-') && !hasSecondNum && !hasOperator) {
        if (firstNum === '0' && event.target.textContent === '0') {
            return;
        }
        if (firstNum.includes('.') && event.target.textContent === '.') {
            return;
        }
        if (!(event.target.textContent === '-' && firstNum !== '')) {

            inputField.textContent += event.target.textContent;
            firstNum += event.target.textContent;
            LogResult(firstNum, operator, secondNum);
        }
    }

    if (firstNum === '.') {
        inputField.textContent = '0.';
        firstNum = '0.';
    }

    if (firstNum === '-' && !numbers.includes(event.target.textContent)) {
        return
    }

    if (operators.includes(event.target.textContent) && hasFirstNum && !hasSecondNum && firstNum !== '0.' && firstNum !== '-') {
        inputField.textContent = firstNum + ' ' + event.target.textContent + ' ';
        operator = event.target.textContent;
        LogResult(firstNum, operator, secondNum);
    }

    if (numbers.includes(event.target.textContent) && hasFirstNum && hasOperator) {
        if (secondNum === '0' && event.target.textContent === '0') {
            return;
        }
        if (secondNum === '0' && event.target.textContent !== '0') {
            inputField = firstNum + operator + secondNum;
            secondNum = '';
        }
        if (secondNum.includes('.') && event.target.textContent === '.') {
            return;
        }
        if (secondNum === '' && event.target.textContent === '.') {
            secondNum = '0.';
            inputField.textContent += secondNum;
            return;
        }
        inputField.textContent += event.target.textContent;
        secondNum += event.target.textContent;
        LogResult(firstNum, operator, secondNum);
    }

    if (event.target.id === 'equal' && operator === '%') {
        result = GetResult();
        inputField.textContent = result;
    }

    if (event.target.id === 'equal' && hasFirstNum && hasOperator && hasSecondNum) {
        let result = GetResult();
        inputField.textContent = result;
        log = (firstNum + ' ' + operator + ' ' + secondNum + ' ' + '=' + ' ' + result);
        document.getElementById('log').innerHTML += log + '<br>';
        firstNum = result;
        secondNum = '';
        operator = '';
    }
}

const TryDeleteChar = () => {
    let hasOperator = operator !== '';
    let hasSecondNum = secondNum !== '';

    if (!hasOperator && !hasSecondNum) {
        inputField.textContent = inputField.textContent.substring(0, inputField.textContent.length - 1);
        firstNum = inputField.textContent;
    }

    if (hasOperator && !hasSecondNum) {
        inputField.textContent = inputField.textContent.substring(0, inputField.textContent.length - 3);
        operator = '';
    }

    if (hasOperator && hasSecondNum) {
        let x = inputField.textContent.lastIndexOf(' ');
        secondNum = inputField.textContent.substring(x + 1, inputField.textContent.length - 1);
        inputField.textContent = inputField.textContent.substring(0, inputField.textContent.length - 1);
    }
}

const ClearInputField = () => {
    firstNum = '';
    secondNum = '';
    operator = '';
    inputField.textContent = '';
}

const GetResult = () => {
    if (operator === '') {
        return;
    }

    let result = '';

    switch (operator) {
        case '/':
            result = Number(firstNum) / Number(secondNum);
            break;
        case '*':
            result = Number(firstNum) * Number(secondNum);
            break;
        case '%':
            result = Number(firstNum) / 100 * Number(secondNum);
            break;
        case '-':
            result = Number(firstNum) - Number(secondNum);
            break;
        case '+':
            result = Number(firstNum) + Number(secondNum);
            break;
        default:
            result = '0';
            console.log('Invalid operator');
            break;
    }

    return result;
}

document.querySelector('#btn-clearlog').onclick = (cll) => {
    if (cll.target.id === 'btn-clearlog') {
        document.getElementById('log').innerHTML = '';
    }
}

const LogResult = () => {
    console.log('fnum: ' + firstNum);
    console.log('oper: ' + operator);
    console.log('snum: ' + secondNum);
}
