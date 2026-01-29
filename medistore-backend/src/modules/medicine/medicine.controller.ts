import { NextFunction, Request, Response } from "express";
import { medicineService } from "./medicine.service";
import { UserType } from "../../types";
import sortingAndPagination, {
  IOptionsResult,
} from "../../helper/sortingAndPagination";

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
    const options = sortingAndPagination(req.query);

    const filters = {
      search: req.query.search as string,
      price: req.query.price as string,
      stock: req.query.stock as string,
      manufacturer: req.query.manufacturer as string,
      category: req.query.category as string,
    };

    const data = await medicineService.getMedicinesHandler(filters, options);

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
