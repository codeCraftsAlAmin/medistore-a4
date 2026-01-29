import express from "express";
import authMiddleware, { UserRole } from "../../middleware/authentication";
import { orderController } from "./order.controller";

const router = express.Router();

// create order -- customer
router.post(
  "/order/",
  authMiddleware(UserRole.CUSTOMER),
  orderController.createOrder,
);

// get orders -- customer, admin
router.get(
  "/order/",
  authMiddleware(UserRole.CUSTOMER),
  orderController.getOrder,
);

export const orderRouter = router;
