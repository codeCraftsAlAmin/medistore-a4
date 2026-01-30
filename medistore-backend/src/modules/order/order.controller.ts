import { NextFunction, Request, Response } from "express";
import { UserType } from "../../types";
import { orderService } from "./order.service";
import { OrderStatus } from "../../../generated/prisma/enums";

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

    res.status(200).json({
      ok: true,
      message: "Orders retrieved successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const data = await orderService.updateOrderHandler(
      id as string,
      status as OrderStatus,
      req.user as UserType,
    );

    res.status(200).json({
      ok: true,
      message: "Orders updated successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const orderController = {
  createOrder,
  getOrder,
  updateOrder,
};
