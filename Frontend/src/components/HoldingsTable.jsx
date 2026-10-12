export default function HoldingsTable({ holdings }) {
  if (!holdings || holdings.length === 0) {
    return <p>You don't own any stocks yet. Use the trade panel to buy your first share.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Symbol</th>
          <th>Shares</th>
          <th>Avg price</th>
          <th>Current</th>
          <th>Market value</th>
          <th>Gain/loss</th>
        </tr>
      </thead>
      <tbody>
        {holdings.map((h) => (
          <tr key={h.symbol}>
            <td>{h.symbol}</td>
            <td>{h.quantity}</td>
            <td>${h.avgPrice.toFixed(2)}</td>
            <td>${h.currentPrice.toFixed(2)}</td>
            <td>${h.marketValue.toFixed(2)}</td>
            <td className={h.gainLoss >= 0 ? 'positive' : 'negative'}>
              {h.gainLoss >= 0 ? '+' : ''}
              ${h.gainLoss.toFixed(2)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
