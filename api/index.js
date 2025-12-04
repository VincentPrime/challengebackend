import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import sequelize from "../config/db.js";
import authRoutes from "../Routes/authRoutes.js";
import historyRoutes from "../Routes/historyRoutes.js";
import cors from "cors";

dotenv.config();

const app = express();

const allowedOrigins = ["http://localhost:5173"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(new Error("CORS error"), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "superscrete",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60, secure: false, httpOnly: true, sameSite: "lax" },
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/history", historyRoutes);

// Connect to DB once per serverless instance
let isDbConnected = false;
const initDb = async () => {
  if (!isDbConnected) {
    try {
      await sequelize.authenticate(); // safer than sync
      console.log("Database connected!");
      isDbConnected = true;
    } catch (err) {
      console.error("DB connection failed:", err);
    }
  }
};

// Serverless handler
const handler = async (req, res) => {
  await initDb();
  return app(req, res);
};

// ✅ This is key for Vercel
export default handler;
