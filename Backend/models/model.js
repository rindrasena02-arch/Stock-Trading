const mongoose = require("mongoose");

// Stock Users
const stockUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 100,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 150,
  },
  password: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Portfolios
const portfolioSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StockUser",   // ✅ reference StockUser instead of User
    unique: true,
  },
  cash_balance: {
    type: Number,
    default: 100000.0,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Holdings
const holdingSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StockUser",   // ✅ reference StockUser
      required: true,
    },
    symbol: {
      type: String,
      required: true,
      maxlength: 10,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    avg_price: {
      type: Number,
      default: 0,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: {
          user_id: 1,
          symbol: 1,
        },
      },
    ],
  },
);

// Transactions
const transactionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StockUser",   // ✅ reference StockUser
    required: true,
  },
  symbol: {
    type: String,
    required: true,
    maxlength: 10,
  },
  type: {
    type: String,
    enum: ["BUY", "SELL"],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// ✅ Models
const StockUser = mongoose.model("StockUser", stockUserSchema); // collection: stockusers
const Portfolio = mongoose.model("Portfolio", portfolioSchema); // collection: portfolios
const Holding = mongoose.model("Holding", holdingSchema);       // collection: holdings
const Transaction = mongoose.model("Transaction", transactionSchema); // collection: transactions

module.exports = { StockUser, Portfolio, Holding, Transaction };
