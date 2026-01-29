import { NextFunction, Request, Response } from "express";
import { reviewService } from "./review.service";
import { UserType } from "../../types";

const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const data = await reviewService.createReviewHandler(
      req.body,
      id as string,
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

const getReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await reviewService.getReviewsHandler();

    res.status(201).json({
      ok: true,
      message: "Data retrived successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const deleteReviews = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    await reviewService.deleteReviewHandler(id as string, req.user as UserType);

    res.status(201).json({
      ok: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const reviewController = {
  createReview,
  getReviews,
  deleteReviews,
};
