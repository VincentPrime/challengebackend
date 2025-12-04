import express from 'express';
import { createHistory, getHistory, bulkDeleteHistory } from "../Controller/historyController.js";
import { isAuthenticated } from "../Middleware/authmiddleware.js";

const router = express.Router();

router.post("/", isAuthenticated, createHistory);
router.get("/", isAuthenticated, getHistory);
router.post("/bulk-delete", isAuthenticated, bulkDeleteHistory);

export default router;