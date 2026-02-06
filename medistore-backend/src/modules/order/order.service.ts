import { OrderStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { UserType } from "../../types";

type OrderItemsInput = {
  medicineId: string;
  quantity: number;
};

const createOrderHandler = async (
  address: string,
  items: OrderItemsInput[],
  user: UserType,
) => {
  // handle a transiction
  return await prisma.$transaction(async (tx) => {
    // declare initial price and data
    let calculateTotalPrice = 0;
    let orderItemsData = [];

    // loop each item to check stock and calculate price
    for (const item of items) {
      // find the medicine
      const medicine = await tx.medicine.findUnique({
        where: { id: item.medicineId },
      });

      if (!medicine) {
        throw new Error(`Medicine with ID ${item.medicineId} not found`);
      }

      if (medicine.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${medicine.name}`);
      }

      //   deduct the stock
      await tx.medicine.update({
        where: { id: medicine.id },
        data: { stock: medicine.stock - item.quantity },
      });

      // calculate the price for item
      const itemTotal = medicine.price * item.quantity;
      calculateTotalPrice += itemTotal;

      // prepare the data for orderItem table
      orderItemsData.push({
        medicineId: medicine.id,
        quantity: item.quantity,
        priceAtPurchase: medicine.price, // saving the price at the moment
      });
    }

    // create the order
    const newOrder = await tx.order.create({
      data: {
        userId: user.id,
        address: address,
        totalPrice: calculateTotalPrice,
        status: "PLACED",
        // create related order item
        orderItems: {
          create: orderItemsData,
        },
      },
      include: {
        orderItems: true,
      },
    });

    return newOrder;
  });
};

const getOrderHandler = async (user: UserType) => {
  let orderInfo: any = {};

  // for customer
  if (user.role === "CUSTOMER") {
    orderInfo = await prisma.order.findMany({
      where: {
        userId: user.id,
      },
      include: {
        orderItems: {
          select: {
            quantity: true,
            medicine: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  // for seller
  if (user.role === "SELLER") {
    orderInfo = await prisma.order.findMany({
      where: {
        orderItems: {
          some: {
            medicine: {
              userId: user.id,
            },
          },
        },
      },
      include: {
        user: {select: {
          name: true,
          email: true
        }},
        orderItems: {
          include: {
            medicine: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }

  // for admin
  if (user.role === "ADMIN") {
    orderInfo = await prisma.order.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
  }

  return orderInfo;
};

const updateOrderHandler = async (
  orderId: string,
  status: OrderStatus,
  user: UserType,
) => {
  // seller's order
  const findOrder = await prisma.order.findFirst({
    where: {
      id: orderId,
      orderItems: {
        some: {
          medicine: {
            userId: user.id,
          },
        },
      },
    },
  });

  if (!findOrder) {
    throw new Error(
      "Order not found or you don't have permission to update it",
    );
  }

  if (user.role === "SELLER" && status === "CANCELLED") {
    throw new Error("Seller can not change this status");
  }

  if (user.role === "SELLER" && findOrder.status === "CANCELLED") {
    throw new Error("Seller can not update cancelled order this status");
  }

  // update the order
  const data = await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      status: status,
    },
  });

  return data;
};

const cancleOrderHandler = async (orderId: string, user: UserType) => {
  // ensure the order begins from exact customer
  const findOrder = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId: user.id,
    },
    include: {
      orderItems: true,
    },
  });

  if (!findOrder) {
    throw new Error("Order not found");
  }
  // can only cancel in PLACED
  if (findOrder.status !== "PLACED") {
    throw new Error(
      "Cannot cancel this order. It has already been processed or shipped",
    );
  }

  // restore stock
  return await prisma.$transaction(async (tx) => {
    for (const item of findOrder.orderItems) {
      await tx.medicine.update({
        where: {
          id: item.medicineId,
        },
        data: {
          stock: { increment: item.quantity },
        },
      });
    }

    // update status
    await tx.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: "CANCELLED",
      },
    });
  });
};

export const orderService = {
  createOrderHandler,
  getOrderHandler,
  updateOrderHandler,
  cancleOrderHandler,
};
