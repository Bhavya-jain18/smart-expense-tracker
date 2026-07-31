import { Link, NavLink } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import { useLogout } from '../hooks/useLogout'

const Navbar = () => {
  const { user } = useAuthContext()
  const { logout } = useLogout()
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const storedMode = localStorage.getItem('theme')
    if (storedMode === 'dark') {
      document.documentElement.classList.add('dark')
      setDarkMode(true)
    }
  }, [])

  const toggleTheme = () => {
    const nextMode = !darkMode
    setDarkMode(nextMode)
    localStorage.setItem('theme', nextMode ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', nextMode)
  }

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link to="/" className="brand-link">
          <span className="brand-mark">SE</span>
          <span>Smart Expense</span>
        </Link>

        <div className="topbar-actions">
          <button type="button" className="theme-toggle" onClick={toggleTheme}>
            {darkMode ? 'Light' : 'Dark'}
          </button>
          {user ? (
            <>
              <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Dashboard</NavLink>
              <NavLink to="/add-expense" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Add Expense</NavLink>
              <NavLink to="/history" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>History</NavLink>
              <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Profile</NavLink>
              <button type="button" className="ghost-button" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Log in</NavLink>
              <NavLink to="/signup" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Sign up</NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
