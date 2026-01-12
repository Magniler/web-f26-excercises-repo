/**
 * Backend Calculator Tests - STARTER FILE
 * 
 * Students should add more tests to this file!
 * 
 * Testing tips:
 * - Test normal cases (happy path)
 * - Test edge cases (zero, negative numbers, decimals)
 * - Test error cases (division by zero, invalid input)
 * - Use describe blocks to group related tests
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { 
  add, 
  subtract, 
  multiply, 
  divide,
  modulo,
  power,
  squareRoot,
  absolute,
  calculatePercentage,
  getPercentageOf,
  applyDiscount,
  Calculator,
  roundTo,
  isValidNumber,
  parseNumber
} from '../files/calculator_backend.js'

// Exemple på tests i add funktionen

describe('add', () => {
  it('should add two positive numbers', () => {
    expect(add(2, 3)).toBe(5)
  })

  it('should add negative numbers', () => {
    expect(add(-2, -3)).toBe(-5)
  })
})

// Tilføj flere test...

// ===========================================
// *Test på Calculator klassen*
// Herunder er test på Calculator klassen, som illustrere hvordan man tester objekter og deres metoder.
// ===========================================

describe('Calculator class', () => {
  let calc

  beforeEach(() => {
    // Vi laver en ny instans af Calculator før hver test
    calc = new Calculator()
  })

  describe('basic operations', () => {
    it('should start with value 0', () => {
      expect(calc.getValue()).toBe(0)
    })

    it('should set value correctly', () => {
      calc.setValue(42)
      expect(calc.getValue()).toBe(42)
    })

    // TODO: Tiføj unit-test til alle andre metoder i Calculator klassen
  })

  describe('memory operations', () => {
    // Følgende test er beskrevet men ikke implementeret
    // TODO: Test memory store, recall, add, subtract, clear
    it.todo('should store value in memory')
    it.todo('should recall value from memory')
    it.todo('should add to memory')
    it.todo('should subtract from memory')
    it.todo('should clear memory')
  })

  describe('history operations', () => {
    // TODO: Test funktionalitet for historik
    it.todo('should record operations in history')
    it.todo('should return history as array')
    it.todo('should clear history')
  })

  describe('undo operation', () => {
    // TODO: Test undo funktionalitet
    it.todo('should undo last add operation')
    it.todo('should return false when history is empty')
  })
})

// ============================================
// UTILITY FUNCTIONS TESTS
// ============================================

describe('roundTo', () => {
  it('should round to 2 decimal places by default', () => {
    expect(roundTo(3.14159)).toBe(3.14)
  })

  // TODO: Tilføj negative test og edge cases
})

describe('isValidNumber', () => {
  // TODO: Test forskellige cases
  it.todo('should return true for valid numbers')
  it.todo('should return false for NaN')
  it.todo('should return false for Infinity')
  it.todo('should return false for non-numbers')
})

describe('parseNumber', () => {
  // TODO: Test både med positive og negative inputs
  it.todo('should parse valid number strings')
  it.todo('should return null for invalid strings')
})
