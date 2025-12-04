import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import sequelize from "../config/db.js";
import authRoutes from "../Routes/authRoutes.js";
import historyRoutes from "../Routes/historyRoutes.js";
import cors from "cors";

dotenv.config();

const app = express();

// ✅ Allow all origins for local testing & deployed frontend
app.use(
  cors({
    origin: true, // dynamically allow all origins
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors()); // handle preflight

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "superscrete",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60,
      secure: false, // set true if using https in production
      httpOnly: true,
      sameSite: "lax",
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
      console.log("Database connected!");
      isDbConnected = true;
    } catch (err) {
      console.error("DB connection failed:", err);
    }
  }
};

// ✅ Vercel serverless handler
const handler = async (req, res) => {
  await initDb();
  return app(req, res);
};

export default handler;
