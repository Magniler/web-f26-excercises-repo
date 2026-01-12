/**
 * Calculator Frontend (React)
 * 
 * This is a more complex React-based calculator.
 * Students should write component tests using React Testing Library.
 * 
 * Features:
 * - State management with hooks
 * - Component composition
 * - Event handling
 * - Conditional rendering
 * - Error boundaries
 */

import React, { useState, useCallback, useMemo } from 'react'
import { 
  add, 
  subtract, 
  multiply, 
  divide,
  squareRoot,
  power,
  calculatePercentage,
  isValidNumber,
  roundTo
} from './calculator_backend.js'

// ============================================
// CUSTOM HOOKS
// ============================================

/**
 * Custom hook for calculator logic
 * Encapsulates all state and operations
 */
export function useCalculator() {
  const [display, setDisplay] = useState('0')
  const [firstOperand, setFirstOperand] = useState(null)
  const [operator, setOperator] = useState(null)
  const [waitingForSecond, setWaitingForSecond] = useState(false)
  const [error, setError] = useState(null)
  const [history, setHistory] = useState([])

  const clearError = useCallback(() => setError(null), [])

  const displayValue = useMemo(() => {
    return parseFloat(display) || 0
  }, [display])

  const inputDigit = useCallback((digit) => {
    clearError()
    
    if (waitingForSecond) {
      setDisplay(digit)
      setWaitingForSecond(false)
    } else {
      // Handle decimal point
      if (digit === '.' && display.includes('.')) {
        return
      }
      // Replace initial 0 unless adding decimal
      setDisplay(prev => 
        prev === '0' && digit !== '.' ? digit : prev + digit
      )
    }
  }, [waitingForSecond, display, clearError])

  const inputOperator = useCallback((op) => {
    clearError()
    
    if (firstOperand === null) {
      setFirstOperand(displayValue)
    } else if (operator && !waitingForSecond) {
      // Perform pending calculation
      try {
        const result = calculate(firstOperand, operator, displayValue)
        setDisplay(String(result))
        setFirstOperand(result)
        addToHistory(firstOperand, operator, displayValue, result)
      } catch (err) {
        setError(err.message)
        return
      }
    }
    
    setOperator(op)
    setWaitingForSecond(true)
  }, [firstOperand, operator, waitingForSecond, displayValue, clearError])

  const calculate = (a, op, b) => {
    let result
    switch (op) {
      case '+': result = add(a, b); break
      case '-': result = subtract(a, b); break
      case '*':
      case '×': result = multiply(a, b); break
      case '/':
      case '÷': result = divide(a, b); break
      default: throw new Error('Unknown operator')
    }
    return roundTo(result, 10)
  }

  const addToHistory = (a, op, b, result) => {
    setHistory(prev => [...prev, { a, operator: op, b, result, timestamp: new Date() }])
  }

  const performEquals = useCallback(() => {
    if (operator === null || waitingForSecond) return
    
    try {
      const result = calculate(firstOperand, operator, displayValue)
      addToHistory(firstOperand, operator, displayValue, result)
      setDisplay(String(result))
      setFirstOperand(result)
      setOperator(null)
      setWaitingForSecond(true)
    } catch (err) {
      setError(err.message)
    }
  }, [firstOperand, operator, waitingForSecond, displayValue])

  const clear = useCallback(() => {
    setDisplay('0')
    setFirstOperand(null)
    setOperator(null)
    setWaitingForSecond(false)
    clearError()
  }, [clearError])

  const clearEntry = useCallback(() => {
    setDisplay('0')
    clearError()
  }, [clearError])

  const backspace = useCallback(() => {
    if (waitingForSecond) return
    
    setDisplay(prev => 
      prev.length <= 1 ? '0' : prev.slice(0, -1)
    )
  }, [waitingForSecond])

  const toggleSign = useCallback(() => {
    setDisplay(prev => {
      const num = parseFloat(prev)
      return isNaN(num) ? prev : String(-num)
    })
  }, [])

  const calculateSquareRoot = useCallback(() => {
    try {
      const result = squareRoot(displayValue)
      setDisplay(String(roundTo(result, 10)))
      addToHistory(displayValue, '√', null, result)
    } catch (err) {
      setError(err.message)
    }
  }, [displayValue])

  const calculatePercent = useCallback(() => {
    if (firstOperand !== null) {
      const result = calculatePercentage(firstOperand, displayValue)
      setDisplay(String(roundTo(result, 10)))
    } else {
      const result = displayValue / 100
      setDisplay(String(roundTo(result, 10)))
    }
  }, [firstOperand, displayValue])

  const clearHistory = useCallback(() => {
    setHistory([])
  }, [])

  return {
    display,
    error,
    history,
    operator,
    inputDigit,
    inputOperator,
    performEquals,
    clear,
    clearEntry,
    backspace,
    toggleSign,
    calculateSquareRoot,
    calculatePercent,
    clearHistory
  }
}

// ============================================
// PRESENTATIONAL COMPONENTS
// ============================================

/**
 * Display component - shows the current value
 */
export function Display({ value, error }) {
  return (
    <div 
      className={`calculator-display ${error ? 'error' : ''}`}
      data-testid="calculator-display"
      role="status"
      aria-live="polite"
    >
      {error ? error : value}
    </div>
  )
}

/**
 * Button component - reusable calculator button
 */
export function Button({ 
  children, 
  onClick, 
  variant = 'default',
  'data-testid': testId,
  ...props 
}) {
  const className = `calculator-button calculator-button--${variant}`
  
  return (
    <button 
      className={className}
      onClick={onClick}
      data-testid={testId}
      type="button"
      {...props}
    >
      {children}
    </button>
  )
}

/**
 * Digit Button - for numbers 0-9 and decimal point
 */
export function DigitButton({ digit, onInput }) {
  return (
    <Button 
      onClick={() => onInput(digit)}
      data-testid={`digit-${digit === '.' ? 'decimal' : digit}`}
      variant="digit"
    >
      {digit}
    </Button>
  )
}

/**
 * Operator Button - for +, -, ×, ÷
 */
export function OperatorButton({ operator, symbol, onInput, isActive }) {
  return (
    <Button 
      onClick={() => onInput(operator)}
      data-testid={`operator-${operator}`}
      variant={isActive ? 'operator-active' : 'operator'}
      aria-pressed={isActive}
    >
      {symbol || operator}
    </Button>
  )
}

/**
 * Digit Pad - grid of digit buttons
 */
export function DigitPad({ onDigitInput }) {
  const digits = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.']
  
  return (
    <div className="digit-pad" data-testid="digit-pad">
      {digits.map(digit => (
        <DigitButton 
          key={digit} 
          digit={digit} 
          onInput={onDigitInput}
        />
      ))}
    </div>
  )
}

/**
 * Operator Pad - grid of operator buttons
 */
export function OperatorPad({ onOperatorInput, currentOperator }) {
  const operators = [
    { symbol: '÷', value: '/' },
    { symbol: '×', value: '*' },
    { symbol: '−', value: '-' },
    { symbol: '+', value: '+' }
  ]
  
  return (
    <div className="operator-pad" data-testid="operator-pad">
      {operators.map(op => (
        <OperatorButton
          key={op.value}
          operator={op.value}
          symbol={op.symbol}
          onInput={onOperatorInput}
          isActive={currentOperator === op.value}
        />
      ))}
    </div>
  )
}

/**
 * History Panel - shows calculation history
 */
export function HistoryPanel({ history, onClear }) {
  if (history.length === 0) {
    return (
      <div className="history-panel" data-testid="history-panel">
        <p className="history-empty">No calculations yet</p>
      </div>
    )
  }
  
  return (
    <div className="history-panel" data-testid="history-panel">
      <div className="history-header">
        <span>History</span>
        <Button 
          variant="small" 
          onClick={onClear}
          data-testid="clear-history"
        >
          Clear
        </Button>
      </div>
      <ul className="history-list">
        {history.map((entry, index) => (
          <li key={index} className="history-entry" data-testid="history-entry">
            {entry.b !== null 
              ? `${entry.a} ${entry.operator} ${entry.b} = ${entry.result}`
              : `${entry.operator}${entry.a} = ${entry.result}`
            }
          </li>
        ))}
      </ul>
    </div>
  )
}

// ============================================
// MAIN CALCULATOR COMPONENT
// ============================================

/**
 * Main Calculator Component
 * Combines all sub-components and manages state via custom hook
 */
export function Calculator({ showHistory = true }) {
  const {
    display,
    error,
    history,
    operator,
    inputDigit,
    inputOperator,
    performEquals,
    clear,
    clearEntry,
    backspace,
    toggleSign,
    calculateSquareRoot,
    calculatePercent,
    clearHistory
  } = useCalculator()

  return (
    <div className="calculator" data-testid="calculator">
      <Display value={display} error={error} />
      
      <div className="calculator-controls">
        <div className="function-row">
          <Button 
            variant="function" 
            onClick={clear}
            data-testid="clear"
          >
            C
          </Button>
          <Button 
            variant="function" 
            onClick={clearEntry}
            data-testid="clear-entry"
          >
            CE
          </Button>
          <Button 
            variant="function" 
            onClick={backspace}
            data-testid="backspace"
          >
            ⌫
          </Button>
        </div>
        
        <div className="scientific-row">
          <Button 
            variant="scientific" 
            onClick={calculateSquareRoot}
            data-testid="sqrt"
          >
            √
          </Button>
          <Button 
            variant="scientific" 
            onClick={calculatePercent}
            data-testid="percent"
          >
            %
          </Button>
          <Button 
            variant="scientific" 
            onClick={toggleSign}
            data-testid="toggle-sign"
          >
            ±
          </Button>
        </div>
        
        <div className="main-grid">
          <DigitPad onDigitInput={inputDigit} />
          <OperatorPad 
            onOperatorInput={inputOperator} 
            currentOperator={operator}
          />
        </div>
        
        <Button 
          variant="equals" 
          onClick={performEquals}
          data-testid="equals"
        >
          =
        </Button>
      </div>
      
      {showHistory && (
        <HistoryPanel 
          history={history} 
          onClear={clearHistory}
        />
      )}
    </div>
  )
}

// ============================================
// ERROR BOUNDARY
// ============================================

/**
 * Error Boundary for the Calculator
 * Catches rendering errors and displays fallback UI
 */
export class CalculatorErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Calculator error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="calculator-error" data-testid="calculator-error">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message || 'Unknown error'}</p>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try Again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Wrapped Calculator with Error Boundary
 */
export function SafeCalculator(props) {
  return (
    <CalculatorErrorBoundary>
      <Calculator {...props} />
    </CalculatorErrorBoundary>
  )
}

// Default export
export default SafeCalculator
