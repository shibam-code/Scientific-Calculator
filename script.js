// Calculator State
let calculatorState = {
    display: '0',
    expression: '',
    currentInput: '0',
    previousInput: '',
    operator: '',
    waitingForNewInput: false,
    memory: 0,
    expressionHistory: '',
    hasDecimal: false,
    parentheses: 0,
};

// DOM Elements
const expressionElement = document.getElementById('expression');
const resultElement = document.getElementById('result');

// Initialize calculator
function init() {
    updateDisplay();
    setupKeyboardListeners();
}

// Update display elements
function updateDisplay() {
    resultElement.textContent = calculatorState.display;
    expressionElement.textContent = calculatorState.expression;
}

// Reset calculator state
function resetState() {
    calculatorState = {
        display: '0',
        expression: '',
        currentInput: '0',
        previousInput: '',
        operator: '',
        waitingForNewInput: false,
        memory: 0,
        expressionHistory: '',
        hasDecimal: false,
        parentheses: 0,
    };
}

// Format result for display
function formatResult(result) {
    if (isNaN(result) || !isFinite(result)) {
        return 'Error';
    }
    
    if (Math.abs(result) < 0.000001 && result !== 0) {
        return result.toExponential(6);
    } else if (Math.abs(result) > 999999999) {
        return result.toExponential(6);
    } else {
        return parseFloat(result.toFixed(10)).toString();
    }
}

// Calculate factorial
function factorial(n) {
    if (n < 0 || !Number.isInteger(n)) return NaN;
    if (n === 0 || n === 1) return 1;
    if (n > 170) return Infinity; // Prevent overflow
    
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

// Input number function
function inputNumber(num) {
    if (calculatorState.waitingForNewInput) {
        calculatorState.currentInput = num;
        calculatorState.display = num;
        calculatorState.waitingForNewInput = false;
        calculatorState.hasDecimal = false;
    } else {
        const newInput = calculatorState.currentInput === '0' ? num : calculatorState.currentInput + num;
        calculatorState.currentInput = newInput;
        calculatorState.display = newInput;
    }
    updateDisplay();
}

// Apply scientific function
function applyScientificFunction(func, symbol) {
    try {
        const value = parseFloat(calculatorState.currentInput);
        let result;
        
        if (symbol === 'x!') {
            result = factorial(value);
        } else {
            result = func(value);
        }
        
        if (isNaN(result) || !isFinite(result)) {
            throw new Error('Invalid operation');
        }
        
        const formattedResult = formatResult(result);
        const newExpression = `${symbol}(${value})`;
        
        calculatorState.currentInput = formattedResult;
        calculatorState.display = formattedResult;
        calculatorState.expressionHistory = newExpression;
        calculatorState.expression = newExpression;
        calculatorState.waitingForNewInput = true;
        calculatorState.hasDecimal = formattedResult.includes('.');
        
    } catch (error) {
        calculatorState.currentInput = 'Error';
        calculatorState.display = 'Error';
        calculatorState.expressionHistory = 'Error';
        calculatorState.expression = 'Error';
    }
    updateDisplay();
}

// Input constant
function inputConstant(value, symbol) {
    const formattedValue = formatResult(value);
    calculatorState.currentInput = formattedValue;
    calculatorState.display = formattedValue;
    calculatorState.expressionHistory = symbol;
    calculatorState.expression = symbol;
    calculatorState.waitingForNewInput = true;
    calculatorState.hasDecimal = formattedValue.includes('.');
    updateDisplay();
}

// Handle basic operations
function handleBasicOperation(operation) {
    const symbols = {
        'add': '+',
        'subtract': '−',
        'multiply': '×',
        'divide': '÷',
        'power': '^',
    };

    if (calculatorState.operator && !calculatorState.waitingForNewInput) {
        // Calculate intermediate result
        const prevValue = parseFloat(calculatorState.previousInput);
        const currentValue = parseFloat(calculatorState.currentInput);
        let result;

        try {
            switch(calculatorState.operator) {
                case 'add':
                    result = prevValue + currentValue;
                    break;
                case 'subtract':
                    result = prevValue - currentValue;
                    break;
                case 'multiply':
                    result = prevValue * currentValue;
                    break;
                case 'divide':
                    if (currentValue === 0) {
                        throw new Error('Division by zero');
                    }
                    result = prevValue / currentValue;
                    break;
                case 'power':
                    result = Math.pow(prevValue, currentValue);
                    break;
                default:
                    result = currentValue;
            }

            const formattedResult = formatResult(result);
            calculatorState.currentInput = formattedResult;
            calculatorState.display = formattedResult;
        } catch (error) {
            calculatorState.currentInput = 'Error';
            calculatorState.display = 'Error';
        }
    }

    calculatorState.previousInput = calculatorState.currentInput;
    calculatorState.operator = operation;
    calculatorState.expressionHistory = `${calculatorState.currentInput} ${symbols[operation]}`;
    calculatorState.expression = `${calculatorState.currentInput} ${symbols[operation]}`;
    calculatorState.waitingForNewInput = true;
    calculatorState.hasDecimal = false;
    updateDisplay();
}

// Calculate final result
function calculateResult() {
    if (!calculatorState.operator || !calculatorState.previousInput) return;

    const prevValue = parseFloat(calculatorState.previousInput);
    const currentValue = parseFloat(calculatorState.currentInput);
    let result;

    try {
        switch(calculatorState.operator) {
            case 'add':
                result = prevValue + currentValue;
                break;
            case 'subtract':
                result = prevValue - currentValue;
                break;
            case 'multiply':
                result = prevValue * currentValue;
                break;
            case 'divide':
                if (currentValue === 0) {
                    throw new Error('Division by zero');
                }
                result = prevValue / currentValue;
                break;
            case 'power':
                result = Math.pow(prevValue, currentValue);
                break;
            default:
                return;
        }

        const formattedResult = formatResult(result);
        const operatorSymbols = {
            'add': '+',
            'subtract': '−',
            'multiply': '×',
            'divide': '÷',
            'power': '^',
        };
        
        calculatorState.currentInput = formattedResult;
        calculatorState.display = formattedResult;
        calculatorState.expressionHistory = `${calculatorState.previousInput} ${operatorSymbols[calculatorState.operator]} ${currentValue} =`;
        calculatorState.expression = `${calculatorState.previousInput} ${operatorSymbols[calculatorState.operator]} ${currentValue} =`;
        calculatorState.operator = '';
        calculatorState.previousInput = '';
        calculatorState.waitingForNewInput = true;
        calculatorState.hasDecimal = formattedResult.includes('.');
        
    } catch (error) {
        calculatorState.currentInput = 'Error';
        calculatorState.display = 'Error';
        calculatorState.expressionHistory = 'Error';
        calculatorState.expression = 'Error';
    }
    updateDisplay();
}

// Main action handler
function performAction(action) {
    // Add button press animation
    const button = event.target;
    button.classList.add('pressed');
    setTimeout(() => button.classList.remove('pressed'), 100);

    switch(action) {
        case 'decimal':
            if (!calculatorState.hasDecimal && !calculatorState.waitingForNewInput) {
                calculatorState.currentInput += '.';
                calculatorState.display += '.';
                calculatorState.hasDecimal = true;
                updateDisplay();
            }
            break;
            
        case 'clear':
            calculatorState.currentInput = '0';
            calculatorState.display = '0';
            calculatorState.hasDecimal = false;
            updateDisplay();
            break;
            
        case 'all-clear':
            resetState();
            updateDisplay();
            break;

        case 'negate':
            if (calculatorState.currentInput !== '0' && calculatorState.currentInput !== 'Error') {
                const newInput = calculatorState.currentInput.startsWith('-') 
                    ? calculatorState.currentInput.slice(1) 
                    : '-' + calculatorState.currentInput;
                calculatorState.currentInput = newInput;
                calculatorState.display = newInput;
                updateDisplay();
            }
            break;

        case 'add':
        case 'subtract':
        case 'multiply':
        case 'divide':
        case 'power':
            handleBasicOperation(action);
            break;

        case 'equals':
            calculateResult();
            break;

        // Scientific functions
        case 'sin':
            applyScientificFunction((x) => Math.sin(x), 'sin');
            break;
        case 'cos':
            applyScientificFunction((x) => Math.cos(x), 'cos');
            break;
        case 'tan':
            applyScientificFunction((x) => Math.tan(x), 'tan');
            break;
        case 'asin':
            applyScientificFunction((x) => Math.asin(x), 'sin⁻¹');
            break;
        case 'acos':
            applyScientificFunction((x) => Math.acos(x), 'cos⁻¹');
            break;
        case 'atan':
            applyScientificFunction((x) => Math.atan(x), 'tan⁻¹');
            break;
        case 'log':
            applyScientificFunction((x) => Math.log10(x), 'log');
            break;
        case 'ln':
            applyScientificFunction((x) => Math.log(x), 'ln');
            break;
        case 'sqrt':
            applyScientificFunction((x) => Math.sqrt(x), '√');
            break;
        case 'exp':
            applyScientificFunction((x) => Math.exp(x), 'e^');
            break;
        case 'factorial':
            applyScientificFunction((x) => factorial(x), 'x!');
            break;

        // Constants
        case 'pi':
            inputConstant(Math.PI, 'π');
            break;
        case 'e':
            inputConstant(Math.E, 'e');
            break;

        // Memory functions
        case 'memory-clear':
            calculatorState.memory = 0;
            break;
        case 'memory-recall':
            calculatorState.currentInput = calculatorState.memory.toString();
            calculatorState.display = calculatorState.memory.toString();
            calculatorState.hasDecimal = calculatorState.memory.toString().includes('.');
            updateDisplay();
            break;
        case 'memory-add':
            calculatorState.memory += (parseFloat(calculatorState.currentInput) || 0);
            break;
        case 'memory-subtract':
            calculatorState.memory -= (parseFloat(calculatorState.currentInput) || 0);
            break;

        // Parentheses (basic implementation)
        case 'open-paren':
            calculatorState.currentInput = calculatorState.currentInput === '0' ? '(' : calculatorState.currentInput + '(';
            calculatorState.display = calculatorState.currentInput;
            calculatorState.parentheses += 1;
            updateDisplay();
            break;
            
        case 'close-paren':
            if (calculatorState.parentheses > 0) {
                calculatorState.currentInput += ')';
                calculatorState.display += ')';
                calculatorState.parentheses -= 1;
                updateDisplay();
            }
            break;

        default:
            console.log(`Action ${action} not implemented`);
    }
}

// Keyboard event handler
function handleKeyPress(e) {
    const key = e.key;
    e.preventDefault();
    
    if ('0123456789'.includes(key)) {
        inputNumber(key);
    } else if (key === '.') {
        performAction('decimal');
    } else if (key === '+') {
        performAction('add');
    } else if (key === '-') {
        performAction('subtract');
    } else if (key === '*') {
        performAction('multiply');
    } else if (key === '/') {
        performAction('divide');
    } else if (key === 'Enter' || key === '=') {
        performAction('equals');
    } else if (key === 'Escape') {
        performAction('all-clear');
    } else if (key === 'Backspace') {
        performAction('clear');
    } else if (key === '(') {
        performAction('open-paren');
    } else if (key === ')') {
        performAction('close-paren');
    }
}

// Setup keyboard listeners
function setupKeyboardListeners() {
    document.addEventListener('keydown', handleKeyPress);
}

// Initialize calculator when page loads
document.addEventListener('DOMContentLoaded', init);