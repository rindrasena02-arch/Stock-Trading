const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("sb_token");

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Something went wrong.");
  return data;
}

export const api = {
  register: (body) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  getPortfolio: () => request("/portfolio"),
  getTransactions: () => request("/portfolio/transactions"),
  buyStock: (body) =>
    request("/trade/buy", { method: "POST", body: JSON.stringify(body) }),
  sellStock: (body) =>
    request("/trade/sell", { method: "POST", body: JSON.stringify(body) }),
  searchStocks: (q) => request(`/stocks/search?q=${encodeURIComponent(q)}`),

  // ✅ new method
  createPortfolio: () => request("/portfolio", { method: "POST" }),
  searchAllStocks: () => request("/stocks/all"),
};
