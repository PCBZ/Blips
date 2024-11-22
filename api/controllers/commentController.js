import prisma from "../models/prismaClient.js";

export const getComments = async (req, res) => {
  const { blipid } = req.query;
  if (!blipid) {
    return res.status(400).json({ error: "Blip ID is required." });
  }
  try {
    const comments = await prisma.comment.findMany({
      where: { blipId: Number(blipid) },
      orderBy: { updatedAt: "desc" },
      include: {
        user: {
          select: { id: true, username: true },
        },
      },
    });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createComment = async (req, res) => {
  const { blipId, content } = req.body;
  const userId = req.userId;

  if (!blipId || !content) {
    return res.status(400).json({ error: "Blip ID and content are required." });
  }
  try {
    const existingBlip = await prisma.blip.findUnique({ where: { id: Number(blipId) } });
    if (!existingBlip) {
      return res.status(404).json({ error: "Blip not found." });
    }

    const newComment = await prisma.comment.create({
      data: {
        content,
        userId,
        blipId: Number(blipId),
      },
      include: {
        user: {
          select: { id: true, username: true },
        },
      },
    });

    res.status(200).json(newComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateComment = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const userId = req.userId;

  if (!id || !content) {
    return res.status(400).json({ error: "Comment ID and content are required." });
  }

  try {
    const existingComment = await prisma.comment.findUnique({ where: { id: Number(id) } });
    if (!existingComment) {
      return res.status(404).json({ error: "Comment not found." });
    }
    if (existingComment.userId !== userId) {
      return res.status(403).json({ error: "You are not allowed to edit this comment." });
    }

    const updatedComment = await prisma.comment.update({
      where: { id: Number(id) },
      data: { content },
      include: {
        user: {
          select: { id: true, username: true },
        },
      },
    });
    res.status(201).json(updatedComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteComment = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  if (!id) {
    return res.status(400).json({ error: "Comment ID is required." });
  }

  try {
    const existingComment = await prisma.comment.findUnique({ where: { id: Number(id) } });
    if (!existingComment) {
      return res.status(404).json({ error: "Comment not found." });
    }
    if (existingComment.userId !== userId) {
      return res.status(403).json({ error: "You are not allowed to delete this comment." });
    }
    await prisma.comment.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};