import prisma from "../models/prismaClient.js";
import path from "path";
import fs from "fs";

const uploadsDir = path.resolve("uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

export const getBlips = async (req, res) => {
  const { userId } = req.query;
  try {
    const blips = await prisma.blip.findMany({
      where: userId ? { userId: Number(userId) } : {},
      orderBy: { updatedAt: "desc" },
      include: {
        user: {
          select: { id: true, username: true },
        },
      },
    });
    res.status(200).json(blips);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBlip = async (req, res) => {
  try {
    const blip = await prisma.blip.findUnique({
      where: { id: Number(req.params.id) },
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
    res.status(500).json({ error: error.message });
  }
};

export const createBlip = async (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ error: "Content cannot be empty." });
  }

  try {
    const imageUrl = req.file ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` : null;

    const newBlip = await prisma.blip.create({
      data: {
        content,
        imageUrl,
        userId: req.userId,
      },
    });
    res.status(201).json(newBlip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateBlip = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const userId = req.userId;

  try {
    const existingBlip = await prisma.blip.findUnique({ where: { id: Number(id) } });
    if (!existingBlip) {
      return res.status(404).json({ error: "Blip not found." });
    }
    if (existingBlip.userId !== userId) {
      return res.status(403).json({ error: "You are not allowed to edit this blip." });
    }

    const imageUrl = req.file ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` : existingBlip.imageUrl;

    if (req.file && existingBlip.imageUrl) {
      const oldImagePath = path.join("uploads", path.basename(existingBlip.imageUrl));
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
    const updatedBlip = await prisma.blip.update({
      where: { id: Number(id) },
      data: { content, imageUrl },
      include: {
        user: {
          select: { id: true, username: true },
        },
      },
    });
    res.status(200).json(updatedBlip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteBlip = async (req, res) => {
  const { id } = req.params;
  const { content, imageUrl } = req.body;
  const userId = req.userId;

  try {
    const existingBlip = await prisma.blip.findUnique({ where: { id: Number(id) } });
    if (!existingBlip) {
      return res.status(404).json({ error: "Blip not found." });
    }
    if (existingBlip.userId !== userId) {
      return res.status(403).json({ error: "You are not allowed to delete this blip." });
    }
    if (existingBlip.imageUrl) {
      const oldImagePath = path.join("uploads", path.basename(existingBlip.imageUrl));
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
    await prisma.comment.deleteMany({
      where: { blipId: Number(id) },
    });
    await prisma.blip.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};