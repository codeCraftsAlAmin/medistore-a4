import { NextFunction, Request, Response } from "express";
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
      message: "Data created successfully",
      result,
    });
  } catch (error) {
    next(error);
  }
};

export const medicineController = { createMedicine };
