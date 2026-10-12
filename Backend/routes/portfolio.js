const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const {
  getPortfolio,
  getTransactions,
  createPortfolio,
} = require("../controllers/portfolioController");

// Portfolio summary
router.get("/", protect, getPortfolio);
router.post("/", protect, createPortfolio);
// Transaction history
router.get("/transactions", protect, getTransactions);

module.exports = router;
