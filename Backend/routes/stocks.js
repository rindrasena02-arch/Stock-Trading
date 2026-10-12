const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const { getPrice, searchStocks } = require("../controllers/stocksController");

// GET /api/stocks/price/:symbol
router.get("/price/:symbol", protect, getPrice);

// GET /api/stocks/search?q=appl
router.get("/search", protect, searchStocks);

// ✅ NEW: list all available stock symbols
router.get("/all", protect, async (req, res) => {
  try {
    // If you have a DB collection of stocks, query it here:
    // const symbols = await Stock.find().distinct("symbol");

    // For now, return a static list
    const symbols = [
      "AAPL",
      "GOOG",
      "MSFT",
      "TSLA",
      "INFY",
      "TCS",
      "RELIANCE",
      "HDFCBANK",
    ];
    res.json(symbols);
  } catch (err) {
    console.error("Symbols fetch error:", err);
    res.status(500).json({ error: "Could not load symbols" });
  }
});

module.exports = router;
