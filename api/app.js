import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import blipRoutes from "./routes/blipRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/blips", blipRoutes);
app.use("/api/comments", commentRoutes);

export default app;