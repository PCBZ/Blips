import express from "express";
import { register, login, logout, getUserInfo } from "../controllers/authController.js";
import { authenticateToken } from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authenticateToken,  getUserInfo);

export default router;