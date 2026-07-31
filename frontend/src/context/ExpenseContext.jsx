import { createContext, useReducer } from 'react'

export const ExpenseContext = createContext()

export const expensesReducer = (state, action) => {
  switch (action.type) {
    case 'SET_EXPENSES':
      return { ...state, expenses: action.payload }
    case 'ADD_EXPENSE':
      return { ...state, expenses: [action.payload, ...(state.expenses || [])] }
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map((expense) =>
          expense._id === action.payload._id ? action.payload : expense
        )
      }
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter((expense) => expense._id !== action.payload._id)
      }
    case 'SET_ANALYTICS':
      return { ...state, analytics: action.payload }
    default:
      return state
  }
}

export const ExpenseContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(expensesReducer, { expenses: [], analytics: null })

  return (
    <ExpenseContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ExpenseContext.Provider>
  )
}
