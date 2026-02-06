import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

export default function errorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (res.headersSent) {
    return next();
  }

  let statusCode = 500;
  let errMessage = "Internal server error";

  //   prisma validation error (wrong data type)
  if (error instanceof Prisma.PrismaClientInitializationError) {
    statusCode = 400;
    errMessage =
      "Validation Error: Please check your input fields and data types";
  }

  // prisma known req errors
  else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        statusCode = 409;
        errMessage = `A record with this ${error.meta?.target} already exists`;
        break;

      case "P2025":
        statusCode = 404;
        errMessage = "The requested record was not found";
        break;

      case "P2003":
        statusCode = 404;
        errMessage =
          "Foreign key constraint failed. Ensure related IDs are correct";
        break;

      default:
        statusCode = 400;
        errMessage = `Database Error: ${error.code}`;
    }
  }

  //   custom errors
  else if (error instanceof Error) {
    errMessage = error.message;
  }

  res.status(statusCode).json({
    ok: false,
    message: errMessage,
  });
}
