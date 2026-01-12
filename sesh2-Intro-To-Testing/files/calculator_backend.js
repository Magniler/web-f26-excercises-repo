/**
 * Calculator Backend Module
 */

/**
 * Adds two numbers together
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} The sum of a and b
 */
export function add(a, b) {
  return a + b
}

/**
 * Subtracts the second number from the first
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} The difference (a - b)
 */
export function subtract(a, b) {
  return a - b
}

/**
 * Multiplies two numbers
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} The product of a and b
 */
export function multiply(a, b) {
  return a * b
}

/**
 * Divides the first number by the second
 * @param {number} a - Dividend
 * @param {number} b - Divisor
 * @returns {number} The quotient (a / b)
 * @throws {Error} When dividing by zero
 */
export function divide(a, b) {
  if (b === 0) {
    throw new Error('Cannot divide by zero')
  }
  return a / b
}

// ============================================
// ADVANCED OPERATIONS
// ============================================

/**
 * Calculates the remainder of division (modulo)
 * @param {number} a - Dividend
 * @param {number} b - Divisor
 * @returns {number} The remainder
 * @throws {Error} When dividing by zero
 */
export function modulo(a, b) {
  if (b === 0) {
    throw new Error('Cannot calculate modulo with zero')
  }
  return a % b
}

/**
 * Raises a number to a power i.e 2^3 = 8
 * @param {number} base - The base number
 * @param {number} exponent - The exponent
 * @returns {number} base raised to the power of exponent
 */
export function power(base, exponent) {
  return Math.pow(base, exponent)
}

/**
 * Calculates the square root of a number
 * @param {number} n - The number to find the square root of
 * @returns {number} The square root
 * @throws {Error} When the number is negative
 */
export function squareRoot(n) {
  if (n < 0) {
    throw new Error('Cannot calculate square root of negative number')
  }
  return Math.sqrt(n)
}

/**
 * Calculates the absolute value of a number
 * @param {number} n - The number
 * @returns {number} The absolute value
 */
export function absolute(n) {
  return Math.abs(n)
}

// ============================================
// PERCENTAGE AND FINANCIAL OPERATIONS
// ============================================

/**
 * Calculates a percentage of a number
 * @param {number} value - The base value
 * @param {number} percentage - The percentage to calculate
 * @returns {number} The percentage of the value
 */
export function calculatePercentage(value, percentage) {
  return (value * percentage) / 100
}

/**
 * Calculates what percentage one number is of another
 * @param {number} part - The part value
 * @param {number} total - The total value
 * @returns {number} The percentage
 * @throws {Error} When total is zero
 */
export function getPercentageOf(part, total) {
  if (total === 0) {
    throw new Error('Cannot calculate percentage of zero')
  }
  return (part / total) * 100
}

/**
 * Calculates discount price
 * @param {number} originalPrice - The original price
 * @param {number} discountPercent - The discount percentage
 * @returns {number} The discounted price
 * @throws {Error} When discount is negative or greater than 100
 */
export function applyDiscount(originalPrice, discountPercent) {
  if (discountPercent < 0 || discountPercent > 100) {
    throw new Error('Discount must be between 0 and 100')
  }
  const discount = calculatePercentage(originalPrice, discountPercent)
  return originalPrice - discount
}

// ============================================
// MEMORY / STATE OPERATIONS
// ============================================

/**
 * Calculator class with memory functionality
 * This is more complex and requires testing of stateful operations
 */
export class Calculator {
  constructor() {
    this.currentValue = 0
    this.memory = 0
    this.history = []
  }

  /**
   * Gets the current value
   * @returns {number}
   */
  getValue() {
    return this.currentValue
  }

  /**
   * Sets a new value
   * @param {number} value
   */
  setValue(value) {
    this.currentValue = value
    this._addToHistory('set', value)
  }

  /**
   * Clears the current value (resets to 0)
   */
  clear() {
    this.currentValue = 0
    this._addToHistory('clear', 0)
  }

  /**
   * Adds a value to the current value
   * @param {number} value
   * @returns {number} The new current value
   */
  add(value) {
    this.currentValue = add(this.currentValue, value)
    this._addToHistory('add', value)
    return this.currentValue
  }

  /**
   * Subtracts a value from the current value
   * @param {number} value
   * @returns {number} The new current value
   */
  subtract(value) {
    this.currentValue = subtract(this.currentValue, value)
    this._addToHistory('subtract', value)
    return this.currentValue
  }

  /**
   * Multiplies the current value by a value
   * @param {number} value
   * @returns {number} The new current value
   */
  multiply(value) {
    this.currentValue = multiply(this.currentValue, value)
    this._addToHistory('multiply', value)
    return this.currentValue
  }

  /**
   * Divides the current value by a value
   * @param {number} value
   * @returns {number} The new current value
   * @throws {Error} When dividing by zero
   */
  divide(value) {
    this.currentValue = divide(this.currentValue, value)
    this._addToHistory('divide', value)
    return this.currentValue
  }

  // ---- Memory Operations ----

  /**
   * Stores current value in memory
   */
  memoryStore() {
    this.memory = this.currentValue
  }

  /**
   * Recalls value from memory
   * @returns {number} The stored memory value
   */
  memoryRecall() {
    return this.memory
  }

  /**
   * Adds current value to memory
   */
  memoryAdd() {
    this.memory += this.currentValue
  }

  /**
   * Subtracts current value from memory
   */
  memorySubtract() {
    this.memory -= this.currentValue
  }

  /**
   * Clears the memory
   */
  memoryClear() {
    this.memory = 0
  }

  // ---- History Operations ----

  /**
   * Gets the operation history
   * @returns {Array} Array of operation objects
   */
  getHistory() {
    return [...this.history]
  }

  /**
   * Clears the history
   */
  clearHistory() {
    this.history = []
  }

  /**
   * Undoes the last operation (simple implementation)
   * @returns {boolean} True if undo was successful
   */
  undo() {
    if (this.history.length === 0) {
      return false
    }
    
    // Remove last operation
    const lastOp = this.history.pop()
    
    // Reverse the operation
    switch (lastOp.operation) {
      case 'add':
        this.currentValue -= lastOp.value
        break
      case 'subtract':
        this.currentValue += lastOp.value
        break
      case 'multiply':
        if (lastOp.value !== 0) {
          this.currentValue /= lastOp.value
        }
        break
      case 'divide':
        this.currentValue *= lastOp.value
        break
      case 'set':
        // Can't really undo a set without knowing previous value
        this.currentValue = 0
        break
      case 'clear':
        // Can't restore after clear
        break
    }
    
    return true
  }

  /**
   * Private method to add operation to history
   * @private
   */
  _addToHistory(operation, value) {
    this.history.push({
      operation,
      value,
      result: this.currentValue,
      timestamp: new Date().toISOString()
    })
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Rounds a number to a specified number of decimal places
 * @param {number} value - The value to round
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {number} The rounded value
 */
export function roundTo(value, decimals = 2) {
  const factor = Math.pow(10, decimals)
  return Math.round(value * factor) / factor
}

/**
 * Checks if a value is a valid number for calculations
 * @param {*} value - The value to check
 * @returns {boolean} True if value is a valid number
 */
export function isValidNumber(value) {
  return typeof value === 'number' && !isNaN(value) && isFinite(value)
}

/**
 * Parses a string to a number, with validation
 * @param {string} str - The string to parse
 * @returns {number|null} The parsed number, or null if invalid
 */
export function parseNumber(str) {
  const num = parseFloat(str)
  return isValidNumber(num) ? num : null
}
