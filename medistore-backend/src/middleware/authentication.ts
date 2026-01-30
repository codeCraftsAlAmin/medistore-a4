import { NextFunction, Request, Response } from "express";
import { auth } from "../lib/auth";

export enum UserRole {
  ADMIN = "ADMIN",
  CUSTOMER = "CUSTOMER",
  SELLER = "SELLER",
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: string;
        emailVerified: boolean;
      };
    }
  }
}

const authMiddleware = (...role: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const session = await auth.api.getSession({
      headers: req.headers as any,
    });

    // if session not found
    if (!session) {
      res.status(404).json({
        ok: false,
        message: "You are not authorized!!",
      });
    }

    // email is not verified
    if (!session?.user.emailVerified) {
      res.status(403).json({
        ok: false,
        message: "Email verification is required, please verify your email",
      });
    }

    req.user = {
      id: session?.user.id as string,
      email: session?.user.email as string,
      name: session?.user.name as string,
      role: session?.user.role as string,
      emailVerified: session?.user.emailVerified as boolean,
    };

    // if roel is incorect
    if (role.length && !role.includes(req.user?.role as UserRole)) {
      res.status(403).json({
        ok: false,
        message:
          "Forbidden!! You don't have the permission to access this resources",
      });
    }

    if (session?.user.status === "BAN") {
      throw new Error(
        "Your account has been suspended by the administration. Please contact support for further assistance.",
      );
    }

    next();
  };
};

export default authMiddleware;
