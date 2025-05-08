import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../app";

export const createAdmin = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { email, password, firstName, lastName, country } = req.body;

  if (!email || !password || !firstName || !country) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Check if logged in user is admin
  if ((req as any).user.role !== "ADMIN") {
    return res.status(403).json({ error: "Unauthorized" });
  }

  // Check if email already exists
  const existingUser = await prisma.user.findFirst({
    where: { email },
  });

  if (existingUser) {
    return res.status(400).json({ error: "Email already exists" });
  }

  // Hash password and create user
  const saltPassword = 10;
  const hashedPassword = await bcrypt.hash(password, saltPassword);

  try {
    const newAdmin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName: lastName || "",
        country,
        role: "ADMIN",
        verified: true, // Admins are pre-verified
      },
    });

    res.status(201).json({
      message: "Admin created successfully",
      admin: {
        id: newAdmin.id,
        email: newAdmin.email,
        firstName: newAdmin.firstName,
        lastName: newAdmin.lastName,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
