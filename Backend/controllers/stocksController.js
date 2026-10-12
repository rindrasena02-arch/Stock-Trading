const { getStockPrice, searchSymbols } = require("../services/marketData");

// GET stock price
const getPrice = async (req, res) => {
  try {
    const price = await getStockPrice(req.params.symbol);
    if (!price) {
      return res.status(404).json({ error: "Symbol not found." });
    }
    return res.json({ symbol: req.params.symbol.toUpperCase(), price });
  } catch (err) {
    console.error("Stock price error:", err);
    return res.status(500).json({ error: "Could not fetch stock price." });
  }
};

// Search stock symbols
const searchStocks = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json({ results: [] });

    const results = await searchSymbols(q);
    return res.json({ results });
  } catch (err) {
    console.error("Stock search error:", err);
    return res.status(500).json({ error: "Could not search symbols." });
  }
};

module.exports = { getPrice, searchStocks };
