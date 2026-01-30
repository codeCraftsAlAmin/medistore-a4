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

// get orders -- customer, admin, seller
router.get(
  "/order/",
  authMiddleware(UserRole.CUSTOMER, UserRole.SELLER, UserRole.ADMIN),
  orderController.getOrder,
);

// update order status -- seller
router.put(
  "/order/:id",
  authMiddleware(UserRole.CUSTOMER, UserRole.SELLER),
  orderController.updateOrder,
);

export const orderRouter = router;
