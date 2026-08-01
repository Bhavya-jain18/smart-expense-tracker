import { Link, Navigate, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useLogin } from '../hooks/useLogin'
import { useAuthContext } from '../hooks/useAuthContext'
import { toast } from 'react-hot-toast'

const Login = () => {
  const { user } = useAuthContext()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, isLoading, error } = useLogin()
  const navigate = useNavigate()

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const success = await login(email, password)
    if (success) {
      toast.success('Welcome back!')
      navigate('/dashboard')
    }
  }

  return (
    <div className="auth-shell">
      <motion.form
        className="auth-card"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        whileHover={{ y: -4, scale: 1.01 }}
      >
        <h2>Welcome back</h2>
        <p>Log in to access your expense dashboard.</p>

        <label>Email</label>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
        />

        <label>Password</label>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
        />

        <button type="submit" className="primary-button" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>
        {error && <div className="form-error">{error}</div>}
        <p className="auth-footer">
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </motion.form>
    </div>
  )
}

export default Login
