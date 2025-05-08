import { Request, Response } from "express";
import { prisma } from "../app";
import { ApiError } from "../middleware/error.middleware";
import { HttpStatusCode } from "../types/http.enum";

export const sendMessage = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { message, recipientId } = req.body;
  if (!message || !recipientId) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      error: "Missing message or recipientId",
    });
  }

  try {
    // Check if the recipient exists
    const recipient = await prisma.user.findUnique({
      where: {
        id: recipientId,
      },
    });
    if (!recipient) {
      return res.status(HttpStatusCode.NOT_FOUND).json({
        error: "Recipient not found",
      });
    }

    const userMessage = await prisma.directMessage.create({
      data: {
        content: message,
        senderId: (req as any).user.id,
        recipientId: recipientId,
      },
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({ error: "Server error" });
  }
};

export const getMessages = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { recipientId } = req.params;
  if (!recipientId) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      error: "Missing recipientId",
    });
  }

  try {
    const messages = await prisma.directMessage.findMany({
      where: {
        recipientId: recipientId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(HttpStatusCode.OK).json(messages);
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      error: "Server error",
    });
  }
};

