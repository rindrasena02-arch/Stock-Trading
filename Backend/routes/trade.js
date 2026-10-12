const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const { buyStock, sellStock } = require("../controllers/tradeController");

// Buy route
router.post("/buy", protect, buyStock);

// Sell route
router.post("/sell", protect, sellStock);

module.exports = router;
