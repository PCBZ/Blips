import express from "express";
import { register, login, logout, getUserInfo, uploadAvatar } from "../controllers/authController.js";
import { requireAuth, uploadSingle } from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", requireAuth,  getUserInfo);
router.put("/upload-avatar", requireAuth, uploadSingle, uploadAvatar);

export default router;