const axios = require("axios");

const BASE_URL = "https://finnhub.io/api/v1";

// Returns the current price for a symbol, or null if not found.
async function getStockPrice(symbol) {
  try {
    const { data } = await axios.get(`${BASE_URL}/quote`, {
      params: {
        symbol: symbol.toUpperCase(),
        token: process.env.FINNHUB_API_KEY,
      },
    });

    // Finnhub returns 0 for every field if the symbol doesn't exist.
    if (!data || data.c === 0) return null;

    return data.c; // current price
  } catch (err) {
    console.error("Market data error:", err.message);
    return null;
  }
}

// Basic symbol search/autocomplete for the frontend search box.
async function searchSymbols(query) {
  try {
    const { data } = await axios.get(`${BASE_URL}/search`, {
      params: { q: query, token: process.env.FINNHUB_API_KEY },
    });
    return (data.result || []).slice(0, 10);
  } catch (err) {
    console.error("Symbol search error:", err.message);
    return [];
  }
}

module.exports = { getStockPrice, searchSymbols };
