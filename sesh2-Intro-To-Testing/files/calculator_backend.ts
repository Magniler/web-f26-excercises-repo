/**
 * Calculator Backend Module - TypeScript Version
 */

// ============================================
// BASIC ARITHMETIC OPERATIONS
// ============================================

/**
 * Adds two numbers together
 */
export function add(a: number, b: number): number {
  return a + b
}

/**
 * Subtracts the second number from the first
 */
export function subtract(a: number, b: number): number {
  return a - b
}

/**
 * Multiplies two numbers
 */
export function multiply(a: number, b: number): number {
  return a * b
}

/**
 * Divides the first number by the second
 * @throws {Error} When dividing by zero
 */
export function divide(a: number, b: number): number {
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
 * @throws {Error} When dividing by zero
 */
export function modulo(a: number, b: number): number {
  if (b === 0) {
    throw new Error('Cannot calculate modulo with zero')
  }
  return a % b
}

/**
 * Raises a number to a power, i.e. 2^3 = 8
 */
export function power(base: number, exponent: number): number {
  return Math.pow(base, exponent)
}

/**
 * Calculates the square root of a number
 * @throws {Error} When the number is negative
 */
export function squareRoot(n: number): number {
  if (n < 0) {
    throw new Error('Cannot calculate square root of negative number')
  }
  return Math.sqrt(n)
}

/**
 * Calculates the absolute value of a number
 */
export function absolute(n: number): number {
  return Math.abs(n)
}

// ============================================
// PERCENTAGE AND FINANCIAL OPERATIONS
// ============================================

/**
 * Calculates a percentage of a number
 */
export function calculatePercentage(value: number, percentage: number): number {
  return (value * percentage) / 100
}

/**
 * Calculates what percentage one number is of another
 * @throws {Error} When total is zero
 */
export function getPercentageOf(part: number, total: number): number {
  if (total === 0) {
    throw new Error('Cannot calculate percentage of zero')
  }
  return (part / total) * 100
}

/**
 * Calculates discounted price
 * @throws {Error} When discount is negative or greater than 100
 */
export function applyDiscount(originalPrice: number, discountPercent: number): number {
  if (discountPercent < 0 || discountPercent > 100) {
    throw new Error('Discount must be between 0 and 100')
  }
  const discount = calculatePercentage(originalPrice, discountPercent)
  return originalPrice - discount
}

// ============================================
// TYPES AND INTERFACES
// ============================================

/**
 * Represents a single operation in the calculator history
 */
export interface HistoryEntry {
  operation: 'add' | 'subtract' | 'multiply' | 'divide' | 'set' | 'clear'
  value: number
  result: number
  timestamp: string
}

// ============================================
// CALCULATOR CLASS WITH STATE
// ============================================

/**
 * Calculator class with memory functionality
 * This is more complex and requires testing of stateful operations
 */
export class Calculator {
  private currentValue: number
  private memory: number
  private history: HistoryEntry[]

  constructor() {
    this.currentValue = 0
    this.memory = 0
    this.history = []
  }

  /**
   * Gets the current value
   */
  getValue(): number {
    return this.currentValue
  }

  /**
   * Sets a new value
   */
  setValue(value: number): void {
    this.currentValue = value
    this._addToHistory('set', value)
  }

  /**
   * Clears the current value (resets to 0)
   */
  clear(): void {
    this.currentValue = 0
    this._addToHistory('clear', 0)
  }

  /**
   * Adds a value to the current value
   */
  add(value: number): number {
    this.currentValue = add(this.currentValue, value)
    this._addToHistory('add', value)
    return this.currentValue
  }

  /**
   * Subtracts a value from the current value
   */
  subtract(value: number): number {
    this.currentValue = subtract(this.currentValue, value)
    this._addToHistory('subtract', value)
    return this.currentValue
  }

  /**
   * Multiplies the current value by a value
   */
  multiply(value: number): number {
    this.currentValue = multiply(this.currentValue, value)
    this._addToHistory('multiply', value)
    return this.currentValue
  }

  /**
   * Divides the current value by a value
   * @throws {Error} When dividing by zero
   */
  divide(value: number): number {
    this.currentValue = divide(this.currentValue, value)
    this._addToHistory('divide', value)
    return this.currentValue
  }

  // ---- Memory Operations ----

  /**
   * Stores current value in memory
   */
  memoryStore(): void {
    this.memory = this.currentValue
  }

  /**
   * Recalls value from memory
   */
  memoryRecall(): number {
    return this.memory
  }

  /**
   * Adds current value to memory
   */
  memoryAdd(): void {
    this.memory += this.currentValue
  }

  /**
   * Subtracts current value from memory
   */
  memorySubtract(): void {
    this.memory -= this.currentValue
  }

  /**
   * Clears the memory
   */
  memoryClear(): void {
    this.memory = 0
  }

  // ---- History Operations ----

  /**
   * Gets the operation history
   */
  getHistory(): HistoryEntry[] {
    return [...this.history]
  }

  /**
   * Clears the history
   */
  clearHistory(): void {
    this.history = []
  }

  /**
   * Undoes the last operation (simple implementation)
   * @returns True if undo was successful
   */
  undo(): boolean {
    if (this.history.length === 0) {
      return false
    }

    // Remove last operation
    const lastOp = this.history.pop()
    if (!lastOp) return false

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
   */
  private _addToHistory(
    operation: HistoryEntry['operation'],
    value: number
  ): void {
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
 */
export function roundTo(value: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals)
  return Math.round(value * factor) / factor
}

/**
 * Checks if a value is a valid number for calculations
 */
export function isValidNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value) && isFinite(value)
}

/**
 * Parses a string to a number, with validation
 */
export function parseNumber(str: string): number | null {
  const num = parseFloat(str)
  return isValidNumber(num) ? num : null
}
