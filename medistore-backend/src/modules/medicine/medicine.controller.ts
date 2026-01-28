import { NextFunction, Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { connect } from "node:http2";
import { medicineService } from "./medicine.service";
import { UserType } from "../../types";

const createMedicine = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await medicineService.createMedicine(
      req.body,
      req.user as UserType,
    );

    res.status(200).json({
      ok: true,
      message: "Everthing is fine in medicine route",
      result,
    });
  } catch (error) {
    next(error);
  }
};

export const medicineController = { createMedicine };
