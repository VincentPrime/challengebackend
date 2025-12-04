import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import authRoutes from "./Routes/authRoutes.js";
import historyRoutes from "./Routes/historyRoutes.js";
import cors from "cors";

dotenv.config();

const app = express();
const isProduction = process.env.NODE_ENV === "production";
const PORT = process.env.PORT || 4000;

app.set("trust proxy", 1);

// Add your frontend URL when deployed
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5000",
  "https://your-frontend.onrender.com", // <-- add this later
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key-change-this-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
    },
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/history", historyRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});
