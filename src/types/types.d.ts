declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

interface User {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  password: string;
  role: "USER" | "ADMIN";
  verified: boolean;
  verificationToken: string | null;
  createdAt: Date;
  updatedAt: Date;
}
