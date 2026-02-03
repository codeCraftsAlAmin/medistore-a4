import { NextFunction, Request, Response } from "express";
import { categoryService } from "./category.service";

const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { search } = req.query;
    const data = await categoryService.geCategoriesHandler(search as string);

    res.status(200).json({
      ok: true,
      message: "Data retrieved successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name } = req.body;
    const data = await categoryService.createCategoryHandler(name as string);

    res.status(201).json({
      ok: true,
      message: "Category created successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const data = await categoryService.updateCategoryHandler(
      id as string,
      name as string,
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

const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    await categoryService.deleteCategoryHandler(id as string);

    res.status(200).json({
      ok: true,
      message: "Data deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const categoryController = {
  getCategories,
  updateCategory,
  deleteCategory,
  createCategory,
};
