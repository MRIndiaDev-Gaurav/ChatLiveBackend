import { Request, Response, NextFunction } from "express";
import { HttpStatusCode } from "../types/http.enum";

export const errorHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(500).json({ error: "Internal Server Error" });
};

class BaseError extends Error {
  public readonly name: string;
  public readonly httpCode: HttpStatusCode;
  public readonly isOperational: boolean;

  constructor(
    name: string,
    httpCode: HttpStatusCode,
    isOperational: boolean,
    description: string
  ) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = name;
    this.httpCode = httpCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this);
  }
}

export class ApiError extends BaseError {
  constructor(
    name = "",
    httpCode = HttpStatusCode.INTERNAL_SERVER,
    isOperational = true,
    description = "internal server error"
  ) {
    super(name, httpCode, isOperational, description);
  }
}
