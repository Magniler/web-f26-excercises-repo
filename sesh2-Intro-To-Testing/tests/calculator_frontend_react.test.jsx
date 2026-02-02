/**
 * React Calculator Tests - STARTER FILE
 * 
 * These tests use React Testing Library to test React components.
 * This is more advanced and shows how to test:
 * - Component rendering
 * - User interactions
 * - State changes
 * - Custom hooks
 * 
 * Students should learn:
 * - React Testing Library best practices
 * - Testing user interactions
 * - Testing accessibility
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { 
  Display, 
  Button, 
  DigitButton,
  OperatorButton,
  DigitPad,
  OperatorPad,
  HistoryPanel,
  Calculator,
  SafeCalculator,
  useCalculator
} from '../files/calculator_frontend_react.jsx'
import { renderHook, act } from '@testing-library/react'

// Clean up after each test
beforeEach(() => {
  cleanup()
})

// ============================================
// DISPLAY COMPONENT TESTS
// ============================================

describe('Display component', () => {
  it('should render the value', () => {
    render(<Display value="123" error={null} />)
    expect(screen.getByTestId('calculator-display')).toHaveTextContent('123')
  })

  it('should show error message when error is set', () => {
    render(<Display value="0" error="Cannot divide by zero" />)
    expect(screen.getByTestId('calculator-display')).toHaveTextContent('Cannot divide by zero')
  })

  it('should have error class when error is set', () => {
    render(<Display value="0" error="Error!" />)
    expect(screen.getByTestId('calculator-display')).toHaveClass('error')
  })

  it('should have role="status" for accessibility', () => {
    render(<Display value="0" error={null} />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })
})

// ============================================
// BUTTON COMPONENT TESTS
// ============================================

describe('Button component', () => {
  it('should render children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })

  it('should call onClick when clicked', () => {
    let clicked = false
    render(<Button onClick={() => { clicked = true }}>Test</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(clicked).toBe(true)
  })

  it('should apply variant class', () => {
    render(<Button variant="operator">+</Button>)
    expect(screen.getByRole('button')).toHaveClass('calculator-button--operator')
  })

  // TODO: Add more tests
})

describe('DigitButton component', () => {
  it('should call onInput with the digit', () => {
    let inputValue = null
    render(<DigitButton digit="5" onInput={(d) => { inputValue = d }} />)
    fireEvent.click(screen.getByRole('button'))
    expect(inputValue).toBe('5')
  })

  it('should have correct test id', () => {
    render(<DigitButton digit="7" onInput={() => {}} />)
    expect(screen.getByTestId('digit-7')).toBeInTheDocument()
  })

  // TODO: Test decimal button
})

describe('OperatorButton component', () => {
  // TODO: Write tests for OperatorButton
  // - Test that it calls onInput with operator
  // - Test active state styling
  // - Test aria-pressed attribute
})

// ============================================
// PAD COMPONENT TESTS
// ============================================

describe('DigitPad component', () => {
  it('should render all digit buttons', () => {
    render(<DigitPad onDigitInput={() => {}} />)
    const digitPad = screen.getByTestId('digit-pad')
    expect(digitPad).toBeInTheDocument()
    
    // Check that all digits are present
    for (let i = 0; i <= 9; i++) {
      expect(screen.getByTestId(`digit-${i}`)).toBeInTheDocument()
    }
    expect(screen.getByTestId('digit-decimal')).toBeInTheDocument()
  })

  // TODO: Test that clicking buttons calls onDigitInput
})

describe('OperatorPad component', () => {
  // TODO: Write tests for OperatorPad
})

// ============================================
// HISTORY PANEL TESTS
// ============================================

describe('HistoryPanel component', () => {
  it('should show empty message when no history', () => {
    render(<HistoryPanel history={[]} onClear={() => {}} />)
    expect(screen.getByText('No calculations yet')).toBeInTheDocument()
  })

  it('should render history entries', () => {
    const history = [
      { a: 5, operator: '+', b: 3, result: 8 }
    ]
    render(<HistoryPanel history={history} onClear={() => {}} />)
    expect(screen.getByText('5 + 3 = 8')).toBeInTheDocument()
  })

  it('should call onClear when clear button clicked', () => {
    let cleared = false
    const history = [{ a: 1, operator: '+', b: 1, result: 2 }]
    render(<HistoryPanel history={history} onClear={() => { cleared = true }} />)
    fireEvent.click(screen.getByTestId('clear-history'))
    expect(cleared).toBe(true)
  })

  // TODO: Test unary operations (like square root)
})

// ============================================
// CUSTOM HOOK TESTS
// ============================================

describe('useCalculator hook', () => {
  it('should start with display "0"', () => {
    const { result } = renderHook(() => useCalculator())
    expect(result.current.display).toBe('0')
  })

  it('should input digits', () => {
    const { result } = renderHook(() => useCalculator())
    
    act(() => {
      result.current.inputDigit('5')
    })
    expect(result.current.display).toBe('5')
    
    act(() => {
      result.current.inputDigit('3')
    })
    expect(result.current.display).toBe('53')
  })

  it('should perform addition', () => {
    //TODO: This test fails currently because... reasons. Take a look.
    const { result } = renderHook(() => useCalculator())
    
    act(() => {
      result.current.inputDigit('5')
      result.current.inputOperator('+')
      result.current.inputDigit('3')
      result.current.performEquals()
    })
    
    expect(result.current.display).toBe('8')
  })

  it('should clear calculator', () => {
    const { result } = renderHook(() => useCalculator())
    
    act(() => {
      result.current.inputDigit('1')
      result.current.inputDigit('2')
      result.current.inputDigit('3')
      result.current.clear()
    })
    
    expect(result.current.display).toBe('0')
  })

  // TODO: Test all operations
  // TODO: Test error handling (division by zero)
  // TODO: Test history
  // TODO: Test chained operations
})

// ============================================
// FULL CALCULATOR COMPONENT TESTS
// ============================================

describe('Calculator component', () => {
  it('should render without crashing', () => {
    render(<Calculator />)
    expect(screen.getByTestId('calculator')).toBeInTheDocument()
  })

  it('should display initial value of 0', () => {
    render(<Calculator />)
    expect(screen.getByTestId('calculator-display')).toHaveTextContent('0')
  })

  it('should input digits when buttons are clicked', async () => {
    const user = userEvent.setup()
    render(<Calculator />)
    
    await user.click(screen.getByTestId('digit-1'))
    await user.click(screen.getByTestId('digit-2'))
    await user.click(screen.getByTestId('digit-3'))
    
    expect(screen.getByTestId('calculator-display')).toHaveTextContent('123')
  })

  it('should perform addition', async () => {
    const user = userEvent.setup()
    render(<Calculator />)
    
    await user.click(screen.getByTestId('digit-5'))
    await user.click(screen.getByTestId('operator-+'))
    await user.click(screen.getByTestId('digit-3'))
    await user.click(screen.getByTestId('equals'))
    
    expect(screen.getByTestId('calculator-display')).toHaveTextContent('8')
  })

  it('should clear when C is clicked', async () => {
    const user = userEvent.setup()
    render(<Calculator />)
    
    await user.click(screen.getByTestId('digit-5'))
    await user.click(screen.getByTestId('clear'))
    
    expect(screen.getByTestId('calculator-display')).toHaveTextContent('0')
  })

  // TODO: Test all operations
  // TODO: Test scientific functions (square root, percentage)
  // TODO: Test error display
  // TODO: Test history panel
})

describe('SafeCalculator (with Error Boundary)', () => {
  it('should render Calculator normally', () => {
    render(<SafeCalculator />)
    expect(screen.getByTestId('calculator')).toBeInTheDocument()
  })

  // Note: Testing error boundaries is tricky with React Testing Library
  // The error boundary will catch render errors, but we need to trigger one
})

// ============================================
// ACCESSIBILITY TESTS
// ============================================

describe('Accessibility', () => {
  it('should have proper button roles', () => {
    render(<Calculator />)
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('should have aria-live on display', () => {
    render(<Calculator />)
    const display = screen.getByTestId('calculator-display')
    expect(display).toHaveAttribute('aria-live', 'polite')
  })

  // TODO: Test keyboard navigation
  // TODO: Test screen reader text
})

// ============================================
// USER FLOW TESTS
// ============================================

describe('User flows', () => {
  it('should calculate complex expression: 12 + 34 - 6', async () => {
    const user = userEvent.setup()
    render(<Calculator />)
    
    // Enter 12
    await user.click(screen.getByTestId('digit-1'))
    await user.click(screen.getByTestId('digit-2'))
    
    // Add
    await user.click(screen.getByTestId('operator-+'))
    
    // Enter 34
    await user.click(screen.getByTestId('digit-3'))
    await user.click(screen.getByTestId('digit-4'))
    
    // Subtract
    await user.click(screen.getByTestId('operator--'))
    // At this point, 12 + 34 should be calculated
    expect(screen.getByTestId('calculator-display')).toHaveTextContent('46')
    
    // Enter 6
    await user.click(screen.getByTestId('digit-6'))
    
    // Equals
    await user.click(screen.getByTestId('equals'))
    
    expect(screen.getByTestId('calculator-display')).toHaveTextContent('40')
  })

  // TODO: Add more user flow tests
  // - Division by zero
  // - Decimal numbers
  // - Percentage calculations
  // - Using history
})
