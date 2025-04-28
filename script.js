const screen = document.getElementById('screen');
let expression = '';
let cursorPosition = 0;

function updateScreen() {
    const left = expression.slice(0, cursorPosition);
    const right = expression.slice(cursorPosition);
    screen.innerHTML = left + '<span class="cursor">|</span>' + right;
}

function insertAtCursor(value) {
    expression = expression.slice(0, cursorPosition) + value + expression.slice(cursorPosition);
    cursorPosition += value.length;
    updateScreen();
}

function deleteAtCursor() {
    if (cursorPosition > 0) {
        expression = expression.slice(0, cursorPosition - 1) + expression.slice(cursorPosition);
        cursorPosition--;
        updateScreen();
    }
}

function moveCursor(dir) {
    if (dir === 'left' && cursorPosition > 0) cursorPosition--;
    if (dir === 'right' && cursorPosition < expression.length) cursorPosition++;
    updateScreen();
}

function evaluateExpression() {
    try {
        let expr = expression.replace(/÷/g, '/').replace(/×/g, '*').replace(/π/g, Math.PI).replace(/√/g, 'Math.sqrt');
        expr = expr.replace(/sin\(/g, 'Math.sin(')
                   .replace(/cos\(/g, 'Math.cos(')
                   .replace(/tan\(/g, 'Math.tan(')
                   .replace(/log\(/g, 'Math.log10(')
                   .replace(/ln\(/g, 'Math.log(');

        const result = eval(expr);
        expression = result.toString();
        cursorPosition = expression.length;
        updateScreen();
    } catch (error) {
        screen.innerText = 'ERROR';
        expression = '';
        cursorPosition = 0;
    }
}

document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', () => {
        const value = button.dataset.value;
        const action = button.dataset.action;

        if (value !== undefined) {
            insertAtCursor(value);
        } else if (action) {
            if (action === 'del') deleteAtCursor();
            if (action === 'ac') {
                expression = '';
                cursorPosition = 0;
                updateScreen();
            }
            if (action === 'equal') evaluateExpression();
            if (action === 'left') moveCursor('left');
            if (action === 'right') moveCursor('right');
        }
    });
});

// Cursor parpadeante (opcional)
setInterval(() => {
    const cursor = document.querySelector('.cursor');
    if (cursor) cursor.style.visibility = (cursor.style.visibility === 'hidden' ? 'visible' : 'hidden');
}, 500);

updateScreen();
