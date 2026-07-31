import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiTrendingUp, FiShield, FiClock, FiUsers } from 'react-icons/fi'

const Landing = () => {
  return (
    <div className="landing-page">
      <section className="hero-section">
        <div className="hero-copy">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="eyebrow">Smart Expense Tracker</p>
            <h1>Track spending, stay on budget, and get intelligent insights.</h1>
            <p className="hero-description">
              Manage every expense in one polished dashboard with category analytics, budget progress, and rule-based AI insights.
            </p>
            <div className="hero-actions">
              <Link className="primary-button" to="/signup">Start free</Link>
              <Link className="secondary-button" to="/login">I already have an account</Link>
            </div>
          </motion.div>
        </div>
        <motion.div className="hero-visual" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
          <div className="hero-card">
            <div className="hero-card-header">
              <span>Monthly budget</span>
              <strong>£2,500</strong>
            </div>
            <div className="hero-card-body">
              <div className="stat-block">
                <span>Spent</span>
                <strong>£1,490</strong>
              </div>
              <div className="stat-block">
                <span>Remaining</span>
                <strong>£1,010</strong>
              </div>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '60%' }} />
            </div>
          </div>
        </motion.div>
      </section>

      <section className="feature-grid">
        <div className="feature-card">
          <FiShield className="feature-icon" />
          <h3>Secure login</h3>
          <p>JWT authentication and user-specific expense data keep your records safe.</p>
        </div>
        <div className="feature-card">
          <FiTrendingUp className="feature-icon" />
          <h3>Smart analytics</h3>
          <p>Get category trends, budget alerts, and spending insights powered by intelligent rules.</p>
        </div>
        <div className="feature-card">
          <FiClock className="feature-icon" />
          <h3>Fast capture</h3>
          <p>Quickly add daily expenses with category, payment method, notes, and date support.</p>
        </div>
        <div className="feature-card">
          <FiUsers className="feature-icon" />
          <h3>Personal dashboard</h3>
          <p>Stay organized with a clean dashboard, expense history, and profile controls.</p>
        </div>
      </section>

      <section className="testimonial-section">
        <h2>Built for modern budgets</h2>
        <div className="testimonial-grid">
          <article className="testimonial-card">
            <p>“Smart Expense Tracker helped me spot overspending at the weekend and save more each month.”</p>
            <strong>– Maya R.</strong>
          </article>
          <article className="testimonial-card">
            <p>“The dashboard is crisp, responsive, and the AI insights are genuinely useful.”</p>
            <strong>– Jason K.</strong>
          </article>
          <article className="testimonial-card">
            <p>“I love how easy it is to track categories and stay within budget without manual spreadsheets.”</p>
            <strong>– Priya S.</strong>
          </article>
        </div>
      </section>

      <footer className="landing-footer">
        <p>Smart Expense Tracker © 2026 · Crafted for clearer spending</p>
      </footer>
    </div>
  )
}

export default Landing
