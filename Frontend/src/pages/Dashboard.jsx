import { useEffect, useState, useCallback } from "react";
import { api } from "../api";
import HoldingsTable from "../components/HoldingsTable";
import TradePanel from "../components/TradePanel";

export default function Dashboard() {
  const [portfolio, setPortfolio] = useState(null);
  const [error, setError] = useState("");
  const [symbols, setSymbols] = useState([]);
  const [search, setSearch] = useState("");

  // Load portfolio (auto-create if missing)
  const loadPortfolio = useCallback(async () => {
    try {
      const data = await api.getPortfolio();
      if (!data) {
        const newPortfolio = await api.createPortfolio();
        setPortfolio(newPortfolio);
        setError("");
        return;
      }
      setPortfolio(data);
      setError("");
    } catch (err) {
      if (err.message.includes("Portfolio not found")) {
        try {
          const newPortfolio = await api.createPortfolio();
          setPortfolio(newPortfolio);
          setError("");
        } catch (createErr) {
          setError(createErr.message || "Failed to create portfolio");
        }
      } else {
        setError(err.message || "Failed to load portfolio");
      }
    }
  }, []);

  // Load available stock symbols
  const loadSymbols = useCallback(async () => {
    try {
      const data = await api.searchAllStocks();
      setSymbols(data);
    } catch (err) {
      console.error("Failed to load symbols:", err);
    }
  }, []);

  useEffect(() => {
    loadPortfolio();
    loadSymbols();
  }, [loadPortfolio, loadSymbols]);

  if (error) {
    return <div className="container">{error}</div>;
  }

  if (!portfolio) {
    return <div className="container">Loading portfolio…</div>;
  }

  // Filter symbols by search input
  const filteredSymbols = symbols.filter((s) =>
    s.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="container">
      {/* Portfolio summary */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          marginBottom: 20,
        }}
      >
        <div className="card">
          <p className="stat-label">Portfolio value</p>
          <p className="stat-value">${portfolio.totalValue.toFixed(2)}</p>
        </div>
        <div className="card">
          <p className="stat-label">Cash balance</p>
          <p className="stat-value">${portfolio.cashBalance.toFixed(2)}</p>
        </div>
        <div className="card">
          <p className="stat-label">Holdings value</p>
          <p className="stat-value">${portfolio.holdingsValue.toFixed(2)}</p>
        </div>
      </div>

      {/* Holdings + Trade Panel */}
      <div className="grid" style={{ gridTemplateColumns: "1.4fr 1fr" }}>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Your holdings</h3>
          <HoldingsTable holdings={portfolio.holdings} />
        </div>
        <TradePanel onTradeComplete={loadPortfolio} />
      </div>

      {/* Available stock symbols */}
      <div className="card" style={{ marginTop: 20 }}>
        <h3 style={{ marginTop: 0 }}>Available Stock Symbols</h3>
        <input
          type="text"
          placeholder="Search symbol..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginBottom: "10px", padding: "5px", width: "100%" }}
        />
        {filteredSymbols.length > 0 ? (
          <ul style={{ columns: 3 }}>
            {filteredSymbols.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        ) : (
          <p>No symbols available.</p>
        )}
      </div>
    </div>
  );
}
