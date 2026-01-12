import React from 'react'
import ReactDOM from 'react-dom/client'
import SafeCalculator from './files/calculator_frontend_react.jsx'
import './styles/calculator.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div className="app">
      <h1>React Calculator</h1>
      <SafeCalculator showHistory={true} />
    </div>
  </React.StrictMode>
)
