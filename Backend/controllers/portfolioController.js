const { Portfolio, Holding, Transaction } = require("../models/model.js");
const { getStockPrice } = require("../services/marketData");

// GET portfolio summary
const getPortfolio = async (req, res) => {
  const userId = req.user.id;

  try {
    const portfolio = await Portfolio.findOne({ user_id: userId });
    if (!portfolio) {
      return res.status(404).json({ error: "Portfolio not found." });
    }

    const cashBalance = portfolio.cash_balance;

    // Fetch holdings
    const holdingsData = await Holding.find({ user_id: userId }).sort({
      symbol: 1,
    });

    // Fetch live prices for every holding in parallel
    const holdings = await Promise.all(
      holdingsData.map(async (h) => {
        const currentPrice = (await getStockPrice(h.symbol)) || h.avg_price;
        const marketValue = currentPrice * h.quantity;
        const gainLoss = (currentPrice - h.avg_price) * h.quantity;

        return {
          symbol: h.symbol,
          quantity: h.quantity,
          avgPrice: h.avg_price,
          currentPrice,
          marketValue,
          gainLoss,
        };
      }),
    );

    const holdingsValue = holdings.reduce((sum, h) => sum + h.marketValue, 0);

    return res.json({
      cashBalance,
      holdingsValue,
      totalValue: cashBalance + holdingsValue,
      holdings,
    });
  } catch (err) {
    console.error("Portfolio fetch error:", err);
    return res.status(500).json({ error: "Could not load portfolio." });
  }
};

// GET transaction history
const getTransactions = async (req, res) => {
  const userId = req.user.id;

  try {
    const transactions = await Transaction.find({ user_id: userId })
      .sort({ created_at: -1 })
      .limit(100);

    return res.json({ transactions });
  } catch (err) {
    console.error("Transaction history error:", err);
    return res
      .status(500)
      .json({ error: "Could not load transaction history." });
  }
};

const createPortfolio = async (req, res) => {
  const userId = req.user.id;

  try {
    // Check if portfolio already exists
    let portfolio = await Portfolio.findOne({ user_id: userId });
    if (portfolio) {
      return res.status(400).json({ error: "Portfolio already exists." });
    }

    // Create new portfolio with starting cash
    portfolio = new Portfolio({
      user_id: userId,
      cash_balance: process.env.STARTING_CASH || 100000,
    });

    await portfolio.save();
    return res.json(portfolio);
  } catch (err) {
    console.error("Portfolio creation error:", err);
    return res.status(500).json({ error: "Could not create portfolio." });
  }
};

module.exports = { getPortfolio, getTransactions, createPortfolio };
