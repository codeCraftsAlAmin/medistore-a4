import { User } from "../../../generated/prisma/client";
import { UserRole, UserStatus } from "../../../generated/prisma/enums";
import { IOptionsResult } from "../../helper/sortingAndPagination";
import { prisma } from "../../lib/prisma";
import { UserType } from "../../types";

const getUsersHandler = async (
  filtersParams: {
    search: string;
    role: UserRole;
    status: UserStatus;
  },
  options: IOptionsResult,
  user: UserType,
) => {
  const { search, role, status } = filtersParams;
  const { page, limit, skipPage, sortBy, sortOrder } = options;

  const conditions: any[] = [];

  //   shows all users except admin id
  conditions.push({
    id: {
      not: user.id,
    },
  });

  // search by name-- partial searching
  if (search) {
    conditions.push({
      name: {
        contains: search,
        mode: "insensitive",
      },
    });
  }

  // filter by role
  if (role) {
    conditions.push({
      role: role,
    });
  }

  // filter by status
  if (status) {
    conditions.push({
      status: status,
    });
  }

  const data = await prisma.user.findMany({
    where: {
      AND: conditions.length > 0 ? conditions : [],
    },

    // paginations
    skip: Number(skipPage) || 0,
    take: Number(limit) || 5,

    // sorting
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : { createdAt: "desc" },
  });

  // total items
  const total = await prisma.user.count({
    where: {
      AND: conditions.length > 0 ? conditions : {},
    },
  });

  return {
    data,
    paginations: {
      page,
      limit,
      totalUser: total,
      totalPage: Math.ceil(total / (limit || 5)),
    },
  };
};

const updateStatusHandler = async (userId: string, status: UserStatus) => {
  if (!userId) {
    throw new Error("User not found");
  }

  const data = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      status: status,
    },
  });

  return data;
};

const manageProfileHandler = async (
  id: string,
  name: string,
  user: UserType,
) => {
  if (!id) {
    throw new Error("User not found with this ID");
  }

  if (id !== user.id) {
    throw new Error("You are not authorized to update this profile");
  }

  const data = await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      name: name,
    },
  });

  return data;
};

export const userService = {
  getUsersHandler,
  updateStatusHandler,
  manageProfileHandler,
};
