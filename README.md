# Smart Expense Tracker with AI Insights

A polished MERN expense tracker with secure auth, user-specific expenses, budget tracking, analytics, and AI-style insights.

## Features

- JWT-based signup, login, and protected routes
- User-specific expense management
- Monthly budget tracking with alerts
- Search, filters, sort, and pagination for expense history
- Dashboard analytics with category totals and rule-based insights
- Responsive React UI with a modern SaaS aesthetic

## Tech stack

- Frontend: React, React Router, Axios, Chart.js, Framer Motion, React Hot Toast, React Icons
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, dotenv

## Getting started

1. Copy `backend/.env.example` to `backend/.env` and configure your values.
2. Install dependencies:
   - `npm install --prefix backend`
   - `npm install --prefix frontend`
3. Start the app:
   - `npm --prefix backend run dev`
   - `npm --prefix frontend run dev`

The backend will run on `http://localhost:4000` by default and the frontend on `http://localhost:5173`.
