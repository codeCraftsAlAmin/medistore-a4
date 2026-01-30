import express from "express";
import authMiddleware, { UserRole } from "../../middleware/authentication";
import { userController } from "./user.controller";

const router = express.Router();

// get users -- admin, seller, customer
router.get("/users/", authMiddleware(UserRole.ADMIN), userController.geteUsers);

// manage user role-- admin
router.put(
  "/users/:id",
  authMiddleware(UserRole.ADMIN),
  userController.updateStatus,
);

// mange own profile
router.put(
  "/profile/me/:id",
  authMiddleware(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.SELLER),
  userController.updateProfile,
);

export const userRouter = router;
