const { Portfolio, Holding, Transaction } = require("../models/model.js");
const { getStockPrice } = require("../services/marketData");

// Buy Stocks
const buyStock = async (req, res) => {
  const userId = req.user.id;
  const { symbol, quantity } = req.body;

  if (!symbol || !quantity || quantity <= 0) {
    return res
      .status(400)
      .json({ error: "Symbol and a positive quantity are required." });
  }

  try {
    const currentPrice = await getStockPrice(symbol);
    if (!currentPrice) {
      return res
        .status(404)
        .json({ error: `Could not find price for ${symbol}.` });
    }

    const totalCost = currentPrice * quantity;

    // Find portfolio
    const portfolio = await Portfolio.findOne({ user_id: userId });
    if (!portfolio)
      return res.status(404).json({ error: "Portfolio not found." });

    if (portfolio.cash_balance < totalCost) {
      return res.status(400).json({ error: "Insufficient virtual funds." });
    }

    // Deduct cash
    portfolio.cash_balance -= totalCost;
    portfolio.updated_at = Date.now();
    await portfolio.save();

    // Update or create holding
    let holding = await Holding.findOne({
      user_id: userId,
      symbol: symbol.toUpperCase(),
    });
    if (holding) {
      const newQuantity = holding.quantity + quantity;
      holding.avg_price =
        (holding.avg_price * holding.quantity + currentPrice * quantity) /
        newQuantity;
      holding.quantity = newQuantity;
      await holding.save();
    } else {
      holding = new Holding({
        user_id: userId,
        symbol: symbol.toUpperCase(),
        quantity,
        avg_price: currentPrice,
      });
      await holding.save();
    }

    // Record transaction
    const transaction = new Transaction({
      user_id: userId,
      symbol: symbol.toUpperCase(),
      type: "BUY",
      quantity,
      price: currentPrice,
      total: totalCost,
    });
    await transaction.save();

    return res.json({
      message: "Purchase successful.",
      symbol: symbol.toUpperCase(),
      quantity,
      pricePerShare: currentPrice,
      totalCost,
      remainingCash: portfolio.cash_balance,
    });
  } catch (err) {
    console.error("Buy stock error:", err);
    return res
      .status(500)
      .json({ error: "Something went wrong processing your order." });
  }
};

// Sell Stocks
const sellStock = async (req, res) => {
  const userId = req.user.id;
  const { symbol, quantity } = req.body;

  if (!symbol || !quantity || quantity <= 0) {
    return res
      .status(400)
      .json({ error: "Symbol and a positive quantity are required." });
  }

  try {
    const currentPrice = await getStockPrice(symbol);
    if (!currentPrice) {
      return res
        .status(404)
        .json({ error: `Could not find price for ${symbol}.` });
    }

    // Find holding
    const holding = await Holding.findOne({
      user_id: userId,
      symbol: symbol.toUpperCase(),
    });
    const ownedQuantity = holding ? holding.quantity : 0;

    if (ownedQuantity < quantity) {
      return res
        .status(400)
        .json({ error: `You only own ${ownedQuantity} shares of ${symbol}.` });
    }

    const totalProceeds = currentPrice * quantity;
    const remainingQuantity = ownedQuantity - quantity;

    if (remainingQuantity === 0) {
      await Holding.deleteOne({
        user_id: userId,
        symbol: symbol.toUpperCase(),
      });
    } else {
      holding.quantity = remainingQuantity;
      await holding.save();
    }

    // Update portfolio cash
    const portfolio = await Portfolio.findOne({ user_id: userId });
    portfolio.cash_balance += totalProceeds;
    portfolio.updated_at = Date.now();
    await portfolio.save();

    // Record transaction
    const transaction = new Transaction({
      user_id: userId,
      symbol: symbol.toUpperCase(),
      type: "SELL",
      quantity,
      price: currentPrice,
      total: totalProceeds,
    });
    await transaction.save();

    return res.json({
      message: "Sale successful.",
      symbol: symbol.toUpperCase(),
      quantity,
      pricePerShare: currentPrice,
      totalProceeds,
    });
  } catch (err) {
    console.error("Sell stock error:", err);
    return res
      .status(500)
      .json({ error: "Something went wrong processing your order." });
  }
};

module.exports = { buyStock, sellStock };
