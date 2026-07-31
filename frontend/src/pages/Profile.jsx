import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useAuthContext } from '../hooks/useAuthContext'
import api from '../services/api'

const Profile = () => {
  const navigate = useNavigate()
  const { user, dispatch } = useAuthContext()
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' })
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    try {
      await api.post('/user/logout')
    } catch (error) {
      console.error(error)
    } finally {
      localStorage.removeItem('token')
      dispatch({ type: 'LOGOUT' })
      navigate('/login')
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.patch('/user/update-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      })
      toast.success('Password updated')
      setPasswords({ currentPassword: '', newPassword: '' })
    } catch (err) {
      toast.error(err.response?.data?.error || 'Unable to update password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Profile</p>
          <h2>Account settings</h2>
        </div>
      </div>

      <div className="profile-grid">
        <div className="page-card">
          <h3>Profile details</h3>
          <div className="profile-info">
            <p><strong>Name</strong> {user?.name || 'User'}</p>
            <p><strong>Email</strong> {user?.email}</p>
            <p><strong>Budget</strong> £{user?.budget || 0}</p>
          </div>
        </div>

        <div className="page-card">
          <h3>Change password</h3>
          <form onSubmit={handlePasswordChange} className="stacked-form">
            <label>
              Current Password
              <input type="password" value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} />
            </label>
            <label>
              New Password
              <input type="password" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} />
            </label>
            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? 'Updating...' : 'Update password'}
            </button>
          </form>
        </div>
      </div>

      <div className="page-card">
        <h3>Session</h3>
        <button type="button" className="secondary-button" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  )
}

export default Profile
