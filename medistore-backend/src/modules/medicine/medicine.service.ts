import { prisma } from "../../lib/prisma";
import { MedicineType, UserType } from "../../types";

const createMedicine = async (payload: MedicineType, user: UserType) => {
  const { name, price, stock, category } = payload;

  if (!category) {
    throw new Error("Category name is require to create a medicine!!");
  }

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
      }
    },
  });

  return result;
};

export const medicineService = { createMedicine };
