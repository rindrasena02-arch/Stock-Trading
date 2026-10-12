require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.js");
const tradeRoutes = require("./routes/trade");
const portfolioRoutes = require("./routes/portfolio");
const stockRoutes = require("./routes/stocks");

const app = express();

const connectdb = require("./config/dbConnection.js");
connectdb();

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/trade", tradeRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/stocks", stockRoutes);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("SB Stocks API running on port" + PORT);
});
