// import express from "express";
// import session from "express-session";
// import dotenv from "dotenv";
// import sequelize from "./config/db.js";
// import authRoutes from "./Routes/authRoutes.js";
// import historyRoutes from "./Routes/historyRoutes.js";
// import cors from "cors";

// dotenv.config();
// const app = express();

// // Middleware
// const allowedOrigins = ["http://localhost:5173"];
// app.use(cors({ origin: allowedOrigins, credentials: true }));
// app.use(express.json());
// app.use(session({
//   secret: process.env.SESSION_SECRET || "superscrete",
//   resave: false,
//   saveUninitialized: false,
//   cookie: { maxAge: 1000*60*60, secure: false, httpOnly: true, sameSite: "lax" }
// }));

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/history", historyRoutes);

// // DB
// const startServer = async () => {
//   try {
//     await sequelize.sync();
//     app.listen(4000, () => console.log("Local server running on http://localhost:4000"));
//   } catch (err) {
//     console.error(err);
//   }
// };

// startServer();
