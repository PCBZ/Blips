import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../models/prismaClient.js";

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required.' });
  }

  try {
    if (await prisma.user.findUnique({ where: { email } })) {
      return res.status(400).json({ error: 'Email is already in use.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.cookie('token', token, {httpOnly: true, maxAge: 3600000})

    res.status(201).json({
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Cannot find user.' });
    }
    if (!await bcrypt.compare(password, user.password)) {
      return res.status(400).json({ error: 'password incorrect.' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.cookie('token', token, {httpOnly: true, maxAge: 3600000})

    const userData = {
      id: user.id,
      email: user.email,
      username: user.username,
      avatarUrl: user.avatarUrl,
    };
    res.status(200).json(userData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(204).send();
};

export const getUserInfo = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { 
      id: req.userId 
    },
    select: { 
      id: true, 
      email: true, 
      username: true,
      avatarUrl: true,
    },
  });
  res.json(user);
};

export const uploadAvatar = async (req, res) => {
  const userId = req.userId;
  const avatarUrl = req.file ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` : null;

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl },
      select: { id: true, email: true, username: true, avatarUrl: true },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};