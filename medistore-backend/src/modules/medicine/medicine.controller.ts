import { NextFunction, Request, Response } from "express";
import { medicineService } from "./medicine.service";
import { UserType } from "../../types";

const createMedicine = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await medicineService.createMedicineHandler(
      req.body,
      req.user as UserType,
    );

    res.status(201).json({
      ok: true,
      message: "Data created successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getMedicines = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { search, price, stock, manufacturer } = req.query;

    const data = await medicineService.getMedicinesHandler(
      search as string,
      price as string,
      stock as string,
      manufacturer as string,
    );

    res.status(200).json({
      ok: true,
      message: "Data retrived successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const updateMedicine = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const data = await medicineService.updateMedicineHandler(
      id as string,
      req.body,
      req.user as UserType,
    );

    res.status(200).json({
      ok: true,
      message: "Data updated successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const deleteMedicine = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    await medicineService.deleteMedicineHandler(
      id as string,
      req.user as UserType,
    );

    res.status(200).json({
      ok: true,
      message: "Data deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const findMedicine = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const data = await medicineService.finMedicineHandler(id as string);

    res.status(200).json({
      ok: true,
      message: "Data retrived successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const medicineController = {
  createMedicine,
  getMedicines,
  updateMedicine,
  deleteMedicine,
  findMedicine,
};
