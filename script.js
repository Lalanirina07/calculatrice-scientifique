const display = document.getElementById('display');
const historyList = document.getElementById('history-list');
const clearHistoryBtn = document.getElementById('clear-history');

let expression = '';
loadHistory();

document.querySelectorAll('button').forEach(button => {
  button.addEventListener('click', () => {
    const value = button.dataset.value;
    const action = button.dataset.action;

    if (value) {
      expression += value;
      updateDisplay(expression);
    } else if (action) {
      handleAction(action);
    }
  });
});

function updateDisplay(value) {
  display.value = value;
}

function handleAction(action) {
  switch (action) {
    case 'clear':
      expression = '';
      updateDisplay('');
      break;

    case 'back':
      expression = expression.slice(0, -1);
      updateDisplay(expression);
      break;

    case '=':
      try {
        const result = calculateExpression(expression);
        saveToHistory(expression, result);
        expression = result.toString();
        updateDisplay(expression);
      } catch (e) {
        updateDisplay('Erreur');
        expression = '';
      }
      break;

    case 'sqrt':
      expression = Math.sqrt(parseFloat(expression)).toString();
      updateDisplay(expression);
      break;

    case '^':
      expression = Math.pow(parseFloat(expression), 2).toString();
      updateDisplay(expression);
      break;

    case 'inv':
      expression = (1 / parseFloat(expression)).toString();
      updateDisplay(expression);
      break;

    case 'pi':
      expression += Math.PI.toFixed(8);
      updateDisplay(expression);
      break;

    case '%':
      expression = (parseFloat(expression) / 100).toString();
      updateDisplay(expression);
      break;

    default:
      expression += action;
      updateDisplay(expression);
  }


}

function calculateExpression(expr) {
  const tokens = expr.match(/(\d+(\.\d+)?|[+\-*/])/g);

  if (!tokens) throw new Error("Invalid expression");

  let result = parseFloat(tokens[0]);
  for (let i = 1; i < tokens.length; i += 2) {
    const operator = tokens[i];
    const number = parseFloat(tokens[i + 1]);

    switch (operator) {
      case '+': result += number; break;
      case '-': result -= number; break;
      case '*': result *= number; break;
      case '/': result /= number; break;
      default: throw new Error("Unknown operator");
    }
  }

  return result;
}

// ✅ Enregistre un calcul dans localStorage
function saveToHistory(expr, result) {
  const history = JSON.parse(localStorage.getItem('calc-history')) || [];
  const entry = `${expr} = ${result}`;
  history.unshift(entry);
  localStorage.setItem('calc-history', JSON.stringify(history));
  displayHistory();
}

// ✅ Affiche l’historique dans l’interface
function displayHistory() {
  const history = JSON.parse(localStorage.getItem('calc-history')) || [];
  historyList.innerHTML = '';
  history.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    historyList.appendChild(li);
  });
}

// ✅ Charge l’historique au chargement de la page
function loadHistory() {
  displayHistory();
}

// ✅ Bouton pour effacer l’historique
clearHistoryBtn.addEventListener('click', () => {
  localStorage.removeItem('calc-history');
  displayHistory();
});

const toggleBtn = document.getElementById('toggle-theme');

// Charger le thème depuis localStorage
const savedTheme = localStorage.getItem('theme') || 'light';
document.body.classList.toggle('dark', savedTheme === 'dark');
toggleBtn.textContent = savedTheme === 'dark' ? '☀️ Mode clair' : '🌙 Mode sombre';

toggleBtn.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  toggleBtn.textContent = isDark ? '☀️ Mode clair' : '🌙 Mode sombre';
});
