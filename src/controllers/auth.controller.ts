import { Request, Response } from "express";
import { prisma } from "../app";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import verficationEmail from "../services/verficationEmail";

/**
 *
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - country
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: First name of the user
 *               lastName:
 *                 type: string
 *                 description: Last name of the user
 *               email:
 *                 type: string
 *                 description: Email address of the user
 *               country:
 *                 type: string
 *                 description: Country of the user
 *               password:
 *                 type: string
 *                 description: Password of the user
 *     responses:
 *       201:
 *         description: User created successfully
 *      400 :
 *         description: Invalid input or email already exists
 *       500:
 *         description: Internal server error
 */

// TODO : Add the correct return type here
export const userRegister = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { email, password, firstName, lastName, country } = req.body;
  // check all the fields are present
  if (!email || !password || !firstName || !country) {
    return res.status(400).json({ error: "Missing fields" });
  }

  //   check if email already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (existingUser) {
    return res.status(400).json({ error: "Email already exists" });
  }

  //   hased password
  const saltPassword = 10;
  const hashedPassword = await bcrypt.hash(password, saltPassword);

  //   create a verification token
  const token = jwt.sign(
    { email, firstName },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "1d",
    }
  );

  const userLastName = lastName ? lastName : "";

  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName: userLastName,
        country,
        verificationToken: token,
      },
    });

    // TODO : Send verification email
    await verficationEmail({
      email,
      subject: "Verify your email",
      link: token,
    });

    res.status(201).json({
      message:
        "User registered successfully. Please check your email for verification.",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// TODO : Add the correct return type here
export const verifyEmail = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { token } = req.query;
  if (!token) {
    return res.status(400).json({ error: "Missing token" });
  }
  const decoded: any = jwt.verify(
    token as string,
    process.env.JWT_SECRET as string
  );

  if (!decoded.email) {
    return res.status(400).json({ error: "Invalid token" });
  }

  const user = await prisma.user.findFirst({
    where: {
      email: decoded.email,
    },
  });

  if (!user) {
    return res.status(400).json({ error: "Invalid token" });
  }

  await prisma.user.update({
    where: {
      email: decoded.email,
    },
    data: {
      verified: true,
    },
  });

  res.status(200).json({
    message: "Email verified successfully",
  });
};

// TODO : Add the correct return type here
export const login = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(400).json({ error: "Invalid email or password" });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return res.status(400).json({ error: "Invalid email or password" });
  }

  const token = jwt.sign(
    { email: user.email },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "1d",
    }
  );

  res.status(200).json({
    message: "Login successful",
    token,
  });
};

export const refreshToken = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ error: "Missing token" });
  }

  const decoded: any = jwt.verify(
    token as string,
    process.env.JWT_SECRET as string
  );

  if (!decoded.email) {
    return res.status(400).json({ error: "Invalid token" });
  }

  const user = await prisma.user.findFirst({
    where: {
      email: decoded.email,
    },
  });

  if (!user) {
    return res.status(400).json({ error: "Invalid token" });
  }

  const userAuthToken = jwt.sign(
    { email: user.email },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "1d",
    }
  );

  res.status(200).json({
    message: "Token refreshed successfully",
    userAuthToken,
  });
};

export const updateUser = async (req: Request, res: Response): Promise<any> => {
  const { firstName, lastName, country } = req.body;
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: (req as any).user.id,
      },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid token" });
    }

    const fName = firstName ? firstName : user.firstName;
    const lName = lastName ? lastName : user.lastName;
    const countryCode = country ? country : user.country;

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        firstName: fName,
        lastName: lName,
        country: countryCode,
      },
    });

    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: updatedUser.id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        country: updatedUser.country,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: (req as any).user.email,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        country: true,
        role: true,
        createdAt: true,
      },
    });

    res.status(200).json({
      message: "User retrieved successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
