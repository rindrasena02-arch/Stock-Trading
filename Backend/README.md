# SB Stocks — paper trading web app

A full-stack paper trading app: register, get virtual cash, buy/sell real
US stocks at live prices, and track your portfolio's performance.

## Stack
- **Frontend:** React + Vite, React Router
- **Backend:** Node.js + Express
- **Database:** PostgreSQL
- **Market data:** Finnhub (free tier)

## Project structure
```
sb-stocks/
  backend/
    routes/        auth, trade, portfolio, stocks
    services/       marketData.js (Finnhub wrapper)
    middleware/     auth.js (JWT check)
    schema.sql      database tables
    server.js       app entrypoint
  frontend/
    src/
      pages/         Login, Register, Dashboard
      components/    HoldingsTable, TradePanel
      context/       AuthContext (login state)
      api.js         talks to the backend
```

## 1. Get a free market data API key
Sign up at https://finnhub.io — the free tier is enough for this project.

## 2. Set up the database
```bash
createdb sbstocks
psql -d sbstocks -f backend/schema.sql
```

## 3. Run the backend
```bash
cd backend
cp .env.example .env
# edit .env: set DATABASE_URL, JWT_SECRET, FINNHUB_API_KEY
npm install
npm run dev
```
API runs at http://localhost:5000

## 4. Run the frontend
```bash
cd frontend
npm install
npm run dev
```
App runs at http://localhost:5173

## How it works
1. **Register/login** — creates a user with a hashed password and a portfolio
   pre-loaded with $100,000 virtual cash (see `STARTING_CASH` in `.env`).
2. **Buy/sell** — the backend always fetches the *live* price server-side
   before executing a trade, never trusting a price from the browser. Each
   trade is one atomic database transaction, so cash, holdings, and the
   transaction log always stay in sync.
3. **Dashboard** — pulls your holdings, prices them live, and shows total
   portfolio value, cash balance, and per-stock gain/loss.

## Where to go next
- Add price history charts (Finnhub has a candles endpoint)
- Add a stock search/autocomplete page using `GET /api/stocks/search`
- Add pagination to transaction history
- Add password reset / email verification
- Deploy: frontend → Vercel/Netlify, backend → Render/Railway, database →
  a managed Postgres instance (e.g. Supabase, Neon, Railway)
