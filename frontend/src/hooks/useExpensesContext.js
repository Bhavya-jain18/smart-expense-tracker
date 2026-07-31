import { useContext } from 'react'
import { ExpenseContext } from '../context/ExpenseContext'

export const useExpensesContext = () => {
  const context = useContext(ExpenseContext)

  if (!context) {
    throw new Error('useExpensesContext must be used inside an ExpenseContextProvider')
  }

  return context
}
