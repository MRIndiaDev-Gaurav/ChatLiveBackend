import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import dotenv from "dotenv";
import { createLogger, format, transports } from "winston";
import http from "http";
import { PrismaClient } from "@prisma/client";
import authRouter from "./routes/userAuth";
import userRouter from "./routes/users-chat";
import groupRouter from "./routes/groups";
import adminRouter from "./routes/admin";
import docsRouter from "./docs";
import { errorHandler } from "./middleware/error.middleware";
dotenv.config();
const app = express();
export const prisma = new PrismaClient();

http.createServer(app).listen(process.env.PORT || 3000);
console.log("I am listening on port 3000");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
app.use(errorHandler);

// Create a logger
const logger = createLogger({
  level: "info",
  format: format.json(),
  transports: [
    new transports.File({ filename: "error.log", level: "error" }),
    new transports.File({ filename: "combined.log" }),
    new transports.Console(),
  ],
});

// Log errors
logger.info("Info message");
logger.error("Error message");
logger.warn("Warning message");

// Create routers
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/groups", groupRouter);
app.use("/api/admin", adminRouter);
// Swagger documentation routes
app.use("/api/docs", docsRouter);
