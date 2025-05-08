import { Request, Response } from "express";
import { prisma } from "../app";
export const createGroup = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { name, description } = req.body;
  const userId = (req as any).user.id;

  try {
    const group = await prisma.group.create({
      data: {
        name,
        description,
        createdById: userId,
        // Add to the user to group relationship
        GroupMember: {
          create: {
            userId: userId,
          },
        },
      },
      include: {
        GroupMember: true,
      },
    });

    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getAllGroup = async (
  req: Request,
  res: Response
): Promise<any> => {
  const userId = (req as any).user.id;

  try {
    const groups = await prisma.group.findMany({});
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const joinGroup = async (req: Request, res: Response): Promise<any> => {
  const { groupId } = req.params;
  const userId = (req as any).user.id;

  try {
    const group = await prisma.group.findUnique({
      where: {
        id: groupId,
      },
    });

    if (!group) {
      return res.status(400).json({ error: "Invalid group" });
    }

    const groupMember = await prisma.groupMember.findFirst({
      where: {
        groupId: groupId,
        userId: userId,
      },
    });

    if (groupMember) {
      return res.status(400).json({ error: "Already a member" });
    }

    await prisma.groupMember.create({
      data: {
        groupId: groupId,
        userId: userId,
      },
    });

    res.status(200).json({
      message: "Joined group successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const leaveGroup = async (req: Request, res: Response): Promise<any> => {
  const { groupId } = req.params;
  const userId = (req as any).user.id;

  try {
    const groupMember = await prisma.groupMember.findFirst({
      where: {
        groupId: groupId,
        userId: userId,
      },
    });

    if (!groupMember) {
      return res.status(400).json({ error: "Not a member" });
    }

    await prisma.groupMember.delete({
      where: {
        userId_groupId: {
          userId: userId,
          groupId: groupId,
        },
      },
    });
    res.status(200).json({
      message: "Left group successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
