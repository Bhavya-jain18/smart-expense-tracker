require('dotenv').config({ silent: true })

const dns = require('dns')
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const { MongoMemoryServer } = require('mongodb-memory-server')
const expenseRoutes = require('./routes/expenses')
const userRoutes = require('./routes/user')
const analyticsRoutes = require('./routes/analytics')

if (dns && dns.setServers) {
  dns.setServers(['8.8.8.8', '1.1.1.1'])
}

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
})
app.use(limiter)

app.get('/', (req, res) => {
  res.json({ status: 'Smart Expense Tracker API', uptime: process.uptime() })
})

app.use('/api/expenses', expenseRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/user', userRoutes)

app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({ error: err.message || 'Server error' })
})

const connectToDatabase = async () => {
  const configuredUri = process.env.MONGO_URI

  if (configuredUri) {
    try {
      await mongoose.connect(configuredUri)
      console.log(`Connected to MongoDB at ${configuredUri}`)
      return
    } catch (error) {
      console.warn('Primary MongoDB connection failed, falling back to an in-memory instance:', error.message)
    }
  }

  const mongoServer = await MongoMemoryServer.create()
  const uri = mongoServer.getUri()
  process.env.MONGO_URI = uri
  await mongoose.connect(uri)
  console.log(`Connected to in-memory MongoDB at ${uri}`)
}

connectToDatabase()
  .then(() => {
    const port = process.env.PORT || 4000
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`)
    })
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error)
  })
