import { prisma } from "../../lib/prisma";

const geCategoriesHandler = async (search: string) => {
  const data = await prisma.category.findMany({
    where: search
      ? {
          name: {
            contains: search,
            mode: "insensitive",
          },
        }
      : {},
    include: {
      _count: {
        select: { medicine: true },
      },
    },
  });
  return data;
};

const updateCategoryHandler = async (id: string, name: string) => {
  if (!id) {
    throw new Error("Category not found");
  }

  const data = await prisma.category.update({
    where: {
      id: id,
    },
    data: {
      name: name,
    },
  });
  return data;
};

const deleteCategoryHandler = async (id: string) => {
  if (!id) {
    throw new Error("Category not found");
  }

  // check if medicine exits in this category
  const checkMedicine = await prisma.medicine.count({
    where: {
      categoryId: id,
    },
  });

  if (checkMedicine > 0) {
    throw new Error(
      `Cannot delete category. There are ${checkMedicine} medicines assigned to it. Please reassign or delete them first.`,
    );
  }

  await prisma.category.delete({
    where: {
      id: id,
    },
  });
};

export const categoryService = {
  geCategoriesHandler,
  updateCategoryHandler,
  deleteCategoryHandler,
};
