import { NextFunction, Request, Response } from "express";
import { userService } from "./user.service";
import { UserRole, UserStatus } from "../../../generated/prisma/enums";
import sortingAndPagination from "../../helper/sortingAndPagination";
import { UserType } from "../../types";

const geteUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = {
      search: req.query.search as string,
      role: req.query.role as UserRole,
      status: req.query.status as UserStatus,
    };

    const options = sortingAndPagination(req.query);
    const data = await userService.getUsersHandler(
      filters,
      options,
      req.user as UserType,
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

const updateStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const data = await userService.updateStatusHandler(
      id as string,
      status as UserStatus,
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

const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const user = req.user;
    const data = await userService.manageProfileHandler(
      id as string,
      name as string,
      user as UserType,
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

export const userController = {
  geteUsers,
  updateStatus,
  updateProfile,
};
