/**
 * Calculator Frontend (Vanilla JavaScript)
 * 
 * This is a simple DOM-based calculator frontend.
 * Students should write integration tests for this module.
 * 
 * The module handles:
 * - DOM manipulation
 * - User input parsing
 * - Displaying results
 * - Error handling in the UI
 */

import { 
  add, 
  subtract, 
  multiply, 
  divide, 
  isValidNumber,
  parseNumber,
  roundTo
} from './calculator_backend.js'

// ============================================
// DISPLAY MANAGEMENT
// ============================================

/**
 * Updates the display element with a value
 * @param {HTMLElement} displayElement - The display element
 * @param {string|number} value - The value to display
 */
export function updateDisplay(displayElement, value) {
  if (!displayElement) {
    throw new Error('Display element not found')
  }
  displayElement.textContent = String(value)
}

/**
 * Gets the current value from the display
 * @param {HTMLElement} displayElement - The display element
 * @returns {number|null} The numeric value or null if invalid
 */
export function getDisplayValue(displayElement) {
  if (!displayElement) {
    throw new Error('Display element not found')
  }
  return parseNumber(displayElement.textContent)
}

/**
 * Clears the display (sets to '0')
 * @param {HTMLElement} displayElement - The display element
 */
export function clearDisplay(displayElement) {
  updateDisplay(displayElement, '0')
}

/**
 * Shows an error message on the display
 * @param {HTMLElement} displayElement - The display element
 * @param {string} message - Error message to show
 */
export function showError(displayElement, message = 'Error') {
  updateDisplay(displayElement, message)
  displayElement.classList.add('error')
}

/**
 * Clears error state from display
 * @param {HTMLElement} displayElement - The display element
 */
export function clearError(displayElement) {
  displayElement.classList.remove('error')
}

// ============================================
// INPUT HANDLING
// ============================================

/**
 * Appends a digit to the display
 * @param {HTMLElement} displayElement - The display element
 * @param {string} digit - The digit to append ('0'-'9' or '.')
 */
export function appendDigit(displayElement, digit) {
  const validDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.']
  
  if (!validDigits.includes(digit)) {
    throw new Error(`Invalid digit: ${digit}`)
  }
  
  const currentDisplay = displayElement.textContent
  
  // Handle decimal point
  if (digit === '.' && currentDisplay.includes('.')) {
    return // Already has decimal point
  }
  
  // Replace initial '0' unless adding decimal
  if (currentDisplay === '0' && digit !== '.') {
    updateDisplay(displayElement, digit)
  } else {
    updateDisplay(displayElement, currentDisplay + digit)
  }
}

/**
 * Handles backspace - removes last character
 * @param {HTMLElement} displayElement - The display element
 */
export function backspace(displayElement) {
  const currentDisplay = displayElement.textContent
  
  if (currentDisplay.length <= 1 || currentDisplay === '0') {
    updateDisplay(displayElement, '0')
  } else {
    updateDisplay(displayElement, currentDisplay.slice(0, -1))
  }
}

/**
 * Toggles the sign of the displayed number (positive/negative)
 * @param {HTMLElement} displayElement - The display element
 */
export function toggleSign(displayElement) {
  const value = getDisplayValue(displayElement)
  
  if (value !== null) {
    updateDisplay(displayElement, -value)
  }
}

// ============================================
// CALCULATION OPERATIONS
// ============================================

/**
 * Performs a calculation with two input values
 * @param {HTMLElement} displayElement - The display element
 * @param {number} firstValue - First operand
 * @param {string} operator - The operator (+, -, *, /)
 * @param {number} secondValue - Second operand
 * @returns {number|null} The result, or null if error
 */
export function performCalculation(displayElement, firstValue, operator, secondValue) {
  clearError(displayElement)
  
  if (!isValidNumber(firstValue) || !isValidNumber(secondValue)) {
    showError(displayElement, 'Invalid input')
    return null
  }
  
  let result
  
  try {
    switch (operator) {
      case '+':
        result = add(firstValue, secondValue)
        break
      case '-':
        result = subtract(firstValue, secondValue)
        break
      case '*':
      case '×':
        result = multiply(firstValue, secondValue)
        break
      case '/':
      case '÷':
        result = divide(firstValue, secondValue)
        break
      default:
        showError(displayElement, 'Unknown operator')
        return null
    }
    
    // Round to avoid floating point issues
    result = roundTo(result, 10)
    updateDisplay(displayElement, result)
    return result
    
  } catch (error) {
    showError(displayElement, error.message)
    return null
  }
}

// ============================================
// CALCULATOR STATE MANAGEMENT
// ============================================

/**
 * Creates a calculator controller that manages state
 * This is a factory function that returns an object with methods
 * 
 * @param {HTMLElement} displayElement - The display element
 * @returns {Object} Calculator controller object
 */
export function createCalculatorController(displayElement) {
  let firstOperand = null
  let currentOperator = null
  let waitingForSecondOperand = false
  
  return {
    /**
     * Gets the current state (useful for testing)
     */
    getState() {
      return {
        firstOperand,
        currentOperator,
        waitingForSecondOperand,
        display: displayElement.textContent
      }
    },
    
    /**
     * Inputs a digit
     * @param {string} digit
     */
    inputDigit(digit) {
      if (waitingForSecondOperand) {
        clearDisplay(displayElement)
        waitingForSecondOperand = false
      }
      appendDigit(displayElement, digit)
    },
    
    /**
     * Inputs an operator
     * @param {string} operator
     */
    inputOperator(operator) {
      const displayValue = getDisplayValue(displayElement)
      
      if (firstOperand === null) {
        firstOperand = displayValue
      } else if (currentOperator && !waitingForSecondOperand) {
        // Calculate pending operation first
        const result = performCalculation(
          displayElement,
          firstOperand,
          currentOperator,
          displayValue
        )
        if (result !== null) {
          firstOperand = result
        }
      }
      
      currentOperator = operator
      waitingForSecondOperand = true
    },
    
    /**
     * Calculates the result (equals button)
     */
    calculate() {
      if (currentOperator === null || waitingForSecondOperand) {
        return
      }
      
      const displayValue = getDisplayValue(displayElement)
      const result = performCalculation(
        displayElement,
        firstOperand,
        currentOperator,
        displayValue
      )
      
      if (result !== null) {
        firstOperand = result
        currentOperator = null
        waitingForSecondOperand = true
      }
    },
    
    /**
     * Clears everything (C button)
     */
    clear() {
      firstOperand = null
      currentOperator = null
      waitingForSecondOperand = false
      clearDisplay(displayElement)
      clearError(displayElement)
    },
    
    /**
     * Clears just the display (CE button)
     */
    clearEntry() {
      clearDisplay(displayElement)
      clearError(displayElement)
    },
    
    /**
     * Backspace
     */
    backspace() {
      if (!waitingForSecondOperand) {
        backspace(displayElement)
      }
    },
    
    /**
     * Toggle sign
     */
    toggleSign() {
      toggleSign(displayElement)
    }
  }
}

// ============================================
// DOM INITIALIZATION
// ============================================

/**
 * Initializes the calculator by setting up event listeners
 * Call this when the DOM is ready
 * 
 * @param {Object} options - Configuration options
 * @param {string} options.displaySelector - CSS selector for display element
 * @param {string} options.digitButtonsSelector - CSS selector for digit buttons
 * @param {string} options.operatorButtonsSelector - CSS selector for operator buttons
 * @param {string} options.equalsButtonSelector - CSS selector for equals button
 * @param {string} options.clearButtonSelector - CSS selector for clear button
 * @returns {Object} The calculator controller
 */
export function initCalculator(options) {
  const display = document.querySelector(options.displaySelector)
  
  if (!display) {
    throw new Error('Display element not found')
  }
  
  const controller = createCalculatorController(display)
  
  // Set up digit buttons
  if (options.digitButtonsSelector) {
    const digitButtons = document.querySelectorAll(options.digitButtonsSelector)
    digitButtons.forEach(button => {
      button.addEventListener('click', () => {
        controller.inputDigit(button.dataset.digit || button.textContent)
      })
    })
  }
  
  // Set up operator buttons
  if (options.operatorButtonsSelector) {
    const operatorButtons = document.querySelectorAll(options.operatorButtonsSelector)
    operatorButtons.forEach(button => {
      button.addEventListener('click', () => {
        controller.inputOperator(button.dataset.operator || button.textContent)
      })
    })
  }
  
  // Set up equals button
  if (options.equalsButtonSelector) {
    const equalsButton = document.querySelector(options.equalsButtonSelector)
    if (equalsButton) {
      equalsButton.addEventListener('click', () => controller.calculate())
    }
  }
  
  // Set up clear button
  if (options.clearButtonSelector) {
    const clearButton = document.querySelector(options.clearButtonSelector)
    if (clearButton) {
      clearButton.addEventListener('click', () => controller.clear())
    }
  }
  
  return controller
}
