import { useAuthContext } from './useAuthContext'
import { useExpensesContext } from './useExpensesContext'

export const useLogout = () => {
  const { dispatch } = useAuthContext()
  const { dispatch: expensesDispatch } = useExpensesContext()

  const logout = () => {
    localStorage.removeItem('user')
    dispatch({ type: 'LOGOUT' })
    expensesDispatch({ type: 'SET_EXPENSES', payload: [] })
    expensesDispatch({ type: 'SET_ANALYTICS', payload: null })
  }

  return { logout }
}
