import { NavLink } from 'react-router-dom'
import { FiHome, FiPlusCircle, FiClock, FiUser } from 'react-icons/fi'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: FiHome },
  { to: '/add-expense', label: 'Add Expense', icon: FiPlusCircle },
  { to: '/history', label: 'Expense History', icon: FiClock },
  { to: '/profile', label: 'Profile', icon: FiUser }
]

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="brand-card">
        <div className="brand-icon">SE</div>
        <div>
          <h1>Smart Expense</h1>
          <p>AI insights for every spend</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Icon className="sidebar-icon" />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar
