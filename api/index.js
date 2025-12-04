import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import sequelize from "../config/db.js";
import authRoutes from "../Routes/authRoutes.js";
import historyRoutes from "../Routes/historyRoutes.js";
import cors from "cors";

dotenv.config();

const app = express();

// ✅ CORS Configuration - Allow localhost and production domains
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5000",
  // Add your production frontend URL here when you deploy
  // "https://your-frontend-domain.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or Postman)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["set-cookie"],
  })
);

// Handle preflight requests
app.options("*", cors());

app.use(express.json());

// ⚠️ WARNING: Sessions don't work well in Vercel serverless
// Consider using JWT tokens instead for production
app.use(
  session({
    secret: process.env.SESSION_SECRET || "superscrete",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60,
      secure: process.env.NODE_ENV === 'production', // true in production
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' for cross-origin
    },
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/history", historyRoutes);

// Connect to DB once per serverless instance
let isDbConnected = false;
const initDb = async () => {
  if (!isDbConnected) {
    try {
      await sequelize.authenticate();
      console.log("✅ Database connected!");
      isDbConnected = true;
    } catch (err) {
      console.error("❌ DB connection failed:", err);
      throw err;
    }
  }
};

// ✅ Vercel serverless handler
const handler = async (req, res) => {
  try {
    await initDb();
    return app(req, res);
  } catch (error) {
    console.error("❌ Handler error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

export default handler;