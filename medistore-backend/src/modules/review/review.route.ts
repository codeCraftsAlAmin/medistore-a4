import express from "express";
import { reviewController } from "./review.controller";
import authMiddleware, { UserRole } from "../../middleware/authentication";

const router = express.Router();

// review medicine -- customer
router.post(
  "/review/:id",
  authMiddleware(UserRole.CUSTOMER),
  reviewController.createReview,
);

// get reviews -- customer
router.get(
  "/review/",
  authMiddleware(UserRole.CUSTOMER, UserRole.ADMIN),
  reviewController.getReviews,
);

// delete review -- customer
router.delete(
  "/review/:id",
  authMiddleware(UserRole.CUSTOMER),
  reviewController.deleteReviews,
);

export const reviewRouter = router;
