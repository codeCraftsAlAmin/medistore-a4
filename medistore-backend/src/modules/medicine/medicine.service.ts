import { prisma } from "../../lib/prisma";
import { MedicineType, UserType } from "../../types";

const createMedicineHandler = async (payload: MedicineType, user: UserType) => {
  const { name, price, stock, manufacturer, category } = payload;

  if (!category) {
    throw new Error("Category name is require to create a medicine!!");
  }

  const findCategory = await prisma.category.findFirst({
    where: {
      name: category,
    },
  });

  if (!findCategory) {
    throw new Error("Category not found, please create it first");
  }

  const data = await prisma.medicine.create({
    data: {
      name,
      price: Number(price),
      stock: Number(stock),
      manufacturer,
      category: {
        connect: { id: findCategory.id },
      },
      user: {
        connect: { id: user?.id },
      },
    },
  });

  return data;
};

const getMedicinesHandler = async (
  search: string,
  price: string,
  stock: string,
  manufacturer: string,
) => {
  const conditions: any[] = [];

  // search by name-- partial searching
  if (search) {
    conditions.push({
      name: {
        contains: search,
        mode: "insensitive",
      },
    });
  }

  // filter by price
  if (price) {
    conditions.push({
      price: {
        gte: Number(price),
      },
    });
  }

  // filter by stock
  if (stock) {
    conditions.push({
      stock: {
        gte: Number(stock),
      },
    });
  }

  // filter by manufacturer
  if (manufacturer) {
    conditions.push({
      manufacturer: {
        contains: manufacturer,
        mode: "insensitive",
      },
    });
  }

  const data = await prisma.medicine.findMany({
    where:
      conditions.length > 0
        ? {
            AND: conditions,
          }
        : {},
  });

  return data;
};

const updateMedicineHandler = async (
  id: string,
  payload: MedicineType,
  user: UserType,
) => {
  const findMedicine = await prisma.medicine.findUnique({
    where: { id: id },
  });

  if (!findMedicine) {
    throw new Error("Medicine not found");
  }

  if (findMedicine.userId !== user.id) {
    throw new Error(
      "Forbidden!!. You are not authorized to update this resources",
    );
  }

  const categoryInfo = await prisma.category.findFirst({
    where: {
      name: payload.category,
    },
  });

  if (!categoryInfo) {
    throw new Error("Category doesn't exist with this id ");
  }

  const data = await prisma.medicine.update({
    where: {
      id: id,
    },
    data: {
      name: payload.name,
      price: payload.price,
      stock: payload.stock,
      manufacturer: payload.manufacturer,
      categoryId: categoryInfo?.id,
    },
  });

  return data;
};

const deleteMedicineHandler = async (id: string, user: UserType) => {
  const findMedicine = await prisma.medicine.findUnique({
    where: { id: id },
  });

  if (!findMedicine) {
    throw new Error("Medicine not found");
  }

  if (findMedicine.userId !== user.id) {
    throw new Error(
      "Forbidden!!. You are not authorized to update this resources",
    );
  }

  await prisma.medicine.delete({
    where: {
      id: id,
    },
  });
};

const finMedicineHandler = async (id: string) => {
  const findMedicine = await prisma.medicine.findUnique({
    where: { id: id },
  });

  if (!findMedicine) {
    throw new Error("Medicine not found");
  }

  const data = await prisma.medicine.findUnique({
    where: {
      id: id,
    },
  });

  return data;
};

export const medicineService = {
  createMedicineHandler,
  getMedicinesHandler,
  updateMedicineHandler,
  deleteMedicineHandler,
  finMedicineHandler,
};
