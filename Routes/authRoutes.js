import express from 'express';
import { signup,login,logout,checkauth } from "../Controller/authController.js";


const router = express.Router();

router.post("/signup", signup );
router.post("/login",login);
router.post("/logout",logout)
router.get("/me", checkauth)
export default router;