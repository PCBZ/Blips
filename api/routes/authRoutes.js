import express from "express";
import { register, login, logout, getUserInfo, uploadAvatar } from "../controllers/authController.js";
import { authenticateToken, uploadSingle } from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authenticateToken,  getUserInfo);
router.put("/upload-avatar", authenticateToken, uploadSingle, uploadAvatar);

export default router;