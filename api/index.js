import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import pkg from "@prisma/client";
import morgan from "morgan";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

export const authenticateToken = (req, res, next) => {
  const token = req.cookies.token; // Assumes you're storing the token in cookies
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }
  console.log("*****************");
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.userId; // Attach the decoded user information to the request
    next(); // Pass control to the next middleware/route handler
  } catch (err) {
    return res.status(403).json({ error: "Invalid token." });
  }
};

// POST /api/auth/register - Register a new user
app.get("/ping", (req, res) => {
  res.send("pong");
});

app.post("/api/auth/register", async (req, res) => {
  const { username, email, password } = req.body;

  // Validate input
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required.' });
  }

  try {
    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email is already in use.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    // Generate JWT token
    const token = jwt.sign({ userId: newUser.id, username: newUser.username }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.cookie('token', token, {httpOnly: true, maxAge: 3600000})

    // Send the token to the user
    res.status(201).json({
      message: 'User created successfully!',
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while creating the user.' });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(400).json({ error: 'Cannot find user.' });
    }
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return res.status(400).json({ error: 'password incorrect.' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.cookie('token', token, {httpOnly: true, maxAge: 3600000})

    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
    };
    res.status(200).json({
      message: "Logged in successfully",
      user: userData
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while logging in.' });
  }
});

app.post("/api/auth/logout", async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

app.get("/api/blips", async (req, res) => {
  try {
    const blips = await prisma.blip.findMany({
      orderBy: {
        updatedAt: "desc", // Sort blips by updatedAt in descending order
      },
      include: {
        user: {
          select: { id: true, username: true },
        },
      },
    });
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json(blips);
  } catch (error) {
    console.error("Error fetching blips:", error);
    res.status(500).json({ error: "Failed to fetch blips." });
  }
});

app.post("/api/blips", authenticateToken, async (req, res) => {
  const { content, imageUrl } = req.body;

  if (!content) {
    return res.status(400).json({ error: "Content cannot be empty." });
  }

  try {
    const newBlip = await prisma.blip.create({
      data: {
        content,
        imageUrl: imageUrl || null,
        userId: req.userId, // Use user info from middleware
      },
    });
    res.status(201).json(newBlip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create blip." });
  }
});

app.get("/api/blips/:id", async (req, res) => {
  try {
    const blip = await prisma.blip.findUnique({
      where: { id: parseInt(req.params.id, 10) },
      include: {
        user: {
          select: { id: true, username: true },
        },
      },
    });

    if (!blip) {
      return res.status(404).json({ error: "Blip not found" });
    }
    res.status(200).json(blip);
  } catch (error) {
    console.error("Error fetching blip:", error);
    res.status(500).json({ error: "Failed to fetch blip." });
  }
});

// Update a blip by ID
app.put("/api/blips/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { content, imageUrl } = req.body;
  const userId = req.userId;

  try {
    const existingBlip = await prisma.blip.findUnique({
      where: { id: Number(id) },
    });
    if (!existingBlip) {
      return res.status(404).json({ error: "Blip not found." });
    }
    console.log("existingBlip.userId", existingBlip.userId);
    console.log("userId", userId);
    if (existingBlip.userId !== userId) {
      return res.status(403).json({ error: "You are not allowed to edit this blip." });
    }

    const updatedBlip = await prisma.blip.update({
      where: { id: parseInt(id) },
      data: { content, imageUrl },
      include: {
        user: {
          select: { id: true, username: true },
        },
      },
    });
    res.status(200).json(updatedBlip);
  } catch (error) {
    console.error("Error updating blip:", error);
    res.status(500).json({ error: "Failed to update the blip." });
  }
});

app.delete("/api/blips/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { content, imageUrl } = req.body;
  const userId = req.userId;

  try {
    const existingBlip = await prisma.blip.findUnique({
      where: { id: Number(id) },
    });
    if (!existingBlip) {
      return res.status(404).json({ error: "Blip not found." });
    }
    console.log("existingBlip.userId", existingBlip.userId);
    console.log("userId", userId);
    if (existingBlip.userId !== userId) {
      return res.status(403).json({ error: "You are not allowed to edit this blip." });
    }

    const deletedBlip = await prisma.blip.delete({
      where: { id: Number(id) }
    });
    res.status(200).json(deletedBlip);
  } catch (error) {
    console.error("Error updating blip:", error);
    res.status(500).json({ error: "Failed to update the blip." });
  }
});


app.listen(8000, () => {
  console.log("Server running on http://localhost:8000 🎉 🚀");
});
  