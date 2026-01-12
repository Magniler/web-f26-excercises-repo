/**
 * Frontend Calculator Tests (Vanilla JS) - STARTER FILE
 * 
 * These tests use DOM testing to verify the frontend behavior.
 * We use happy-dom as our DOM environment (configured in vite.config.js)
 * 
 * Students should learn:
 * - How to test DOM manipulation
 * - How to simulate user interactions
 * - Integration testing concepts
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { 
  updateDisplay,
  getDisplayValue,
  clearDisplay,
  showError,
  clearError,
  appendDigit,
  backspace,
  toggleSign,
  performCalculation,
  createCalculatorController
} from '../files/calculator_frontend.js'

// ============================================
// TEST SETUP - Creates a mock display element
// ============================================

function createMockDisplay() {
  const display = document.createElement('div')
  display.textContent = '0'
  display.classList.add('calculator-display')
  return display
}

// ============================================
// DISPLAY FUNCTIONS TESTS
// ============================================

describe('updateDisplay', () => {
  it('should update the display with a value', () => {
    const display = createMockDisplay()
    updateDisplay(display, '123')
    expect(display.textContent).toBe('123')
  })

  it('should throw error if display element is null', () => {
    expect(() => updateDisplay(null, '123')).toThrow('Display element not found')
  })

  // TODO: Add more tests
})

describe('getDisplayValue', () => {
  it('should return the numeric value from display', () => {
    const display = createMockDisplay()
    display.textContent = '42'
    expect(getDisplayValue(display)).toBe(42)
  })

  it('should return null for invalid number', () => {
    const display = createMockDisplay()
    display.textContent = 'Error'
    expect(getDisplayValue(display)).toBe(null)
  })

  // TODO: Add more tests for decimal numbers
})

describe('clearDisplay', () => {
  it('should reset display to 0', () => {
    const display = createMockDisplay()
    display.textContent = '12345'
    clearDisplay(display)
    expect(display.textContent).toBe('0')
  })
})

describe('showError and clearError', () => {
  it('should add error class and show message', () => {
    const display = createMockDisplay()
    showError(display, 'Division by zero')
    expect(display.textContent).toBe('Division by zero')
    expect(display.classList.contains('error')).toBe(true)
  })

  it('should remove error class', () => {
    const display = createMockDisplay()
    display.classList.add('error')
    clearError(display)
    expect(display.classList.contains('error')).toBe(false)
  })
})

// ============================================
// INPUT HANDLING TESTS
// ============================================

describe('appendDigit', () => {
  let display

  beforeEach(() => {
    display = createMockDisplay()
  })

  it('should append a digit to display', () => {
    appendDigit(display, '5')
    expect(display.textContent).toBe('5')
  })

  it('should replace initial 0 with digit', () => {
    display.textContent = '0'
    appendDigit(display, '7')
    expect(display.textContent).toBe('7')
  })

  it('should append to existing number', () => {
    display.textContent = '12'
    appendDigit(display, '3')
    expect(display.textContent).toBe('123')
  })

  it('should handle decimal point', () => {
    display.textContent = '3'
    appendDigit(display, '.')
    expect(display.textContent).toBe('3.')
  })

  it('should not allow multiple decimal points', () => {
    display.textContent = '3.14'
    appendDigit(display, '.')
    expect(display.textContent).toBe('3.14')
  })

  it('should throw error for invalid digit', () => {
    expect(() => appendDigit(display, 'x')).toThrow('Invalid digit')
  })

  // TODO: Add more edge case tests
})

describe('backspace', () => {
  // TODO: Write tests for backspace function
  // - Remove last character
  // - Handle single digit (should become '0')
  // - Handle '0' (should stay '0')
  it.todo('should remove last character')
  it.todo('should become 0 when only one digit')
  it.todo('should stay 0 when already 0')
})

describe('toggleSign', () => {
  // TODO: Write tests for toggleSign function
  // - Positive becomes negative
  // - Negative becomes positive
  // - Zero stays zero
  it.todo('should make positive number negative')
  it.todo('should make negative number positive')
  it.todo('should keep zero as zero')
})

// ============================================
// CALCULATION TESTS
// ============================================

describe('performCalculation', () => {
  let display

  beforeEach(() => {
    display = createMockDisplay()
  })

  it('should add two numbers', () => {
    const result = performCalculation(display, 5, '+', 3)
    expect(result).toBe(8)
    expect(display.textContent).toBe('8')
  })

  it('should handle division by zero', () => {
    const result = performCalculation(display, 10, '/', 0)
    expect(result).toBe(null)
    expect(display.classList.contains('error')).toBe(true)
  })

  // TODO: Test all operators (+, -, *, /)
  // TODO: Test with invalid inputs
  // TODO: Test with decimal numbers
})

// ============================================
// CALCULATOR CONTROLLER TESTS
// ============================================

describe('createCalculatorController', () => {
  let display
  let controller

  beforeEach(() => {
    display = createMockDisplay()
    controller = createCalculatorController(display)
  })

  describe('inputDigit', () => {
    it('should input digits correctly', () => {
      controller.inputDigit('1')
      controller.inputDigit('2')
      controller.inputDigit('3')
      expect(display.textContent).toBe('123')
    })
  })

  describe('inputOperator and calculate', () => {
    it('should perform addition', () => {
      controller.inputDigit('5')
      controller.inputOperator('+')
      controller.inputDigit('3')
      controller.calculate()
      expect(display.textContent).toBe('8')
    })

    // TODO: Test subtraction, multiplication, division
  })

  describe('clear', () => {
    it('should reset everything', () => {
      controller.inputDigit('5')
      controller.inputOperator('+')
      controller.inputDigit('3')
      controller.clear()
      expect(display.textContent).toBe('0')
    })
  })

  describe('chained operations', () => {
    // TODO: Test: 5 + 3 + 2 = 10
    // TODO: Test: 10 - 3 * 2 (should be 14, not 4)
    it.todo('should handle chained addition')
    it.todo('should calculate in sequence (not PEMDAS)')
  })

  describe('getState', () => {
    // TODO: Test that getState returns correct state
    it.todo('should return current state')
  })
})

// ============================================
// INTEGRATION TESTS
// ============================================

describe('Calculator Integration', () => {
  // TODO: Write integration tests that simulate real user scenarios
  // Example: Type "12 + 34 = " and verify result is 46
  
  // Hint: You can create a full calculator setup and simulate clicks
  it.todo('should calculate 12 + 34 = 46')
  it.todo('should handle division by zero gracefully')
})
