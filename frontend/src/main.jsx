import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ExpenseContextProvider } from './context/ExpenseContext'
import { AuthContextProvider } from './context/AuthContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContextProvider>
      <ExpenseContextProvider>
        <App />
      </ExpenseContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
)
