import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config.js";
import routeIndex from "./routes.js";

const app = express();

// Allowed frontend URLs
const allowedOrigins = [
  "http://localhost:5173",
  "https://transaction-tracking-frontend-pink.vercel.app",
];

// ✅ FINAL CORS CONFIG (withCredentials supported)
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("❌ Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", routeIndex);

// Start server only after DB is connected
const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ Database connected successfully");

    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
};

startServer();
