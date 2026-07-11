import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import blipRoutes from "./routes/blipRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000", credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/blips", blipRoutes);
app.use("/api/comments", commentRoutes);

app.get("/api/news", async (req, res) => {
  try {
    const response = await fetch(
      `https://gnews.io/api/v4/top-headlines?country=us&lang=en&max=10&token=${process.env.NEWS_API_KEY}`
    );
    const data = await response.json();
    res.json(data);
  } catch {
    res.status(500).json({ articles: [] });
  }
});


export default app;