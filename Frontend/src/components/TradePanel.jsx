import { useState } from 'react';
import { api } from '../api';

export default function TradePanel({ onTradeComplete }) {
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const runTrade = async (action) => {
    setError('');
    setMessage('');
    if (!symbol) {
      setError('Enter a stock symbol.');
      return;
    }
    setLoading(true);
    try {
      const fn = action === 'buy' ? api.buyStock : api.sellStock;
      const result = await fn({ symbol: symbol.toUpperCase(), quantity: Number(quantity) });
      setMessage(result.message);
      onTradeComplete?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>Trade</h3>
      <label>Symbol</label>
      <input
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        placeholder="e.g. AAPL"
      />
      <label style={{ marginTop: 12, display: 'block' }}>Quantity</label>
      <input
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="buy" disabled={loading} onClick={() => runTrade('buy')}>
          Buy
        </button>
        <button className="sell" disabled={loading} onClick={() => runTrade('sell')}>
          Sell
        </button>
      </div>
      {message && <p className="positive">{message}</p>}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}
