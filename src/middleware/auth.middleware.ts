import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../app";

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded: any = jwt.verify(
      token as string,
      process.env.JWT_SECRET as string
    );

    if (!decoded.email) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findFirst({
      where: {
        email: decoded.email,
      },
    });

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    (req as any).user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Unauthorized" });
  }
};

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!(req as any).user || (req as any).user.role !== "ADMIN") {
    return res.status(403).json({ error: "Access denied" });
  }
  next();
};
