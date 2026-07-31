import { useState } from 'react'
import api from '../services/api'
import { useAuthContext } from './useAuthContext'

export const useSignup = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { dispatch } = useAuthContext()

  const signup = async (email, password) => {
    setIsLoading(true)
    setError(null)
    let success = false

    try {
      const response = await api.post('/user/signup', { email, password })
      const user = response.data
      localStorage.setItem('user', JSON.stringify(user))
      dispatch({ type: 'LOGIN', payload: user })
      success = true
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to sign up')
    } finally {
      setIsLoading(false)
    }

    return success
  }

  return { signup, isLoading, error }
}
