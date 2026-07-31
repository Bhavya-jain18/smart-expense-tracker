const mongoose = require('mongoose')

const Schema = mongoose.Schema

const expenseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    amount: {
      type: Number,
      required: true,
      min: [0, 'Amount must be a positive number']
    },
    category: {
      type: String,
      required: true,
      trim: true,
      enum: [
        'Food',
        'Travel',
        'Shopping',
        'Bills',
        'Rent',
        'Entertainment',
        'Education',
        'Medical',
        'Investment',
        'Others'
      ]
    },
    paymentMethod: {
      type: String,
      required: true,
      trim: true,
      enum: ['Cash', 'Card', 'UPI', 'Online', 'Other']
    },
    date: {
      type: Date,
      required: true,
      default: Date.now
    },
    notes: {
      type: String,
      trim: true,
      default: ''
    },
    createdBy: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Expense', expenseSchema)
