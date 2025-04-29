const screen = document.getElementById('screen');
const expressionSpan = document.getElementById('expression');
let expression = '';
let cursorPosition = 0;

function updateScreen() {
    const left = expression.slice(0, cursorPosition);
    const right = expression.slice(cursorPosition);
    expressionSpan.innerHTML = left + '<span class="cursor">|</span>' + right;
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

function autoCloseParentheses(expr) {
  const open = (expr.match(/\(/g) || []).length;
  const close = (expr.match(/\)/g) || []).length;
  return expr + ')'.repeat(open - close);
}

function evaluateExpression() {
  try {
    let expr = expression
      .replace(/÷/g, '/')
      .replace(/×/g, '*')
      .replace(/π/g, 'pi')
      .replace(/√\(/g, 'sqrt(')
      .replace(/−/g, '-')
      .replace(/log10\(/g, 'log10(');

    expr = autoCloseParentheses(expr);

    const result = math.evaluate(expr);
    expression = result.toString();
    cursorPosition = expression.length;
    updateScreen();
  } catch (error) {
    expressionSpan.innerText = 'ERROR';
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
      if (action === 'ac') {
        expression = '';
        cursorPosition = 0;
        updateScreen();
      } else if (action === 'del') {
        deleteAtCursor();
      } else if (action === 'equal') {
        evaluateExpression();
      }
    }
  });
});

setInterval(() => {
  const cursor = document.querySelector('.cursor');
  if (cursor) cursor.style.visibility = (cursor.style.visibility === 'hidden' ? 'visible' : 'hidden');
}, 500);

updateScreen();

// --- Modo Oscuro ---
const themeToggle = document.getElementById('theme-toggle');

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  themeToggle.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
});
