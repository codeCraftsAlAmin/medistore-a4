import { NextFunction, Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { connect } from "node:http2";

const createMedicine = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, price, stock, category, ...rest } = req.body;

    const user = req.user;

    const isCategory = await prisma.category.findFirst({
      where: {
        name: category as string,
      },
    });

    if (!isCategory) {
      throw new Error("Category not found, please create it first");
    }

    const result = await prisma.medicine.create({
      data: {
        name,
        price: Number(price),
        stock: Number(stock),
        category: {
          connect: { id: isCategory.id },
        },
        user: {
          connect: { id: user?.id },
        },
        ...rest,
      },
    });

    res.status(200).json({
      ok: true,
      message: "Everthing is fine in medicine route",
      result,
    });
  } catch (error) {
    next(error);
  }
};

export const medicineController = { createMedicine };
