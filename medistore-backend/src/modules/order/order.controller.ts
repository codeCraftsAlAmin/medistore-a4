import { NextFunction, Request, Response } from "express";
import { UserType } from "../../types";
import { orderService } from "./order.service";

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { address, items } = req.body;

    const data = await orderService.createOrderHandler(
      address,
      items,
      req.user as UserType,
    );

    res.status(201).json({
      ok: true,
      message: "Order placed successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await orderService.getOrderHandler(req.user as UserType);

    res.status(201).json({
      ok: true,
      message: "Orders retrieved successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const orderController = {
  createOrder,
  getOrder,
};
