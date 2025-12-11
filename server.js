import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDB from "./config.js";
import routeIndex from "./routes.js";

const app = express();

// Allowed frontend URLs
const allowedOrigins = [
  "http://localhost:5173",
  "https://transaction-tracking-frontend.vercel.app"
];

// Manual CORS Middleware (100% fix)
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Important: stop OPTIONS preflight here
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database
connectDB();

// Routes
app.use("/", routeIndex);

// Start
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
