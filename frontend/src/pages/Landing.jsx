import { Link, Navigate, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useSignup } from '../hooks/useSignup'
import { useAuthContext } from '../hooks/useAuthContext'
import { toast } from 'react-hot-toast'

const Signup = () => {
  const { user } = useAuthContext()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signup, isLoading, error } = useSignup()
  const navigate = useNavigate()

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const success = await signup(email, password)
    if (success) {
      toast.success('Account created successfully')
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
        <h2>Create your account</h2>
        <p>Secure signup for personalized expense tracking.</p>

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
          minLength={8}
        />

        <button type="submit" className="primary-button" disabled={isLoading}>
          {isLoading ? 'Creating account...' : 'Sign up'}
        </button>
        {error && <div className="form-error">{error}</div>}
        <p className="auth-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </motion.form>
    </div>
  )
}

export default Signup
