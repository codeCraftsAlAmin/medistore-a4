import express from "express";
import authMiddleware, { UserRole } from "../../middleware/authentication";
import { categoryController } from "./category.controller";

const router = express.Router();

// get categories -- admin
router.get(
  "/categories/",
  authMiddleware(UserRole.ADMIN),
  categoryController.getCategories,
);

// get categories -- admin
router.put(
  "/category/:id",
  authMiddleware(UserRole.ADMIN),
  categoryController.updateCategory,
);

// get categories -- admin
router.delete(
  "/category/:id",
  authMiddleware(UserRole.ADMIN),
  categoryController.deleteCategory,
);

export const categoryRouter = router;
