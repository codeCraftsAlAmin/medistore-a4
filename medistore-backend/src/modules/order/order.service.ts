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
  let whereConditions: any = {};

  if (user.role === "CUSTOMER") {
    // customer views own purches history
    whereConditions: {
      userId: user.id;
    }
  }
  // seller view order and contain medicine
  else if (user.role === "SELLER") {
    whereConditions: {
      orderItems: {
        some: {
          medicine: {
            userId: user.id;
          }
        }
      }
    }
  }

  //   admin can see all orders
  const data = await prisma.order.findMany({
    where: whereConditions,
    include: {
      // show who bought it
      user: {
        select: { name: true, email: true },
      },
      //   show items
      orderItems: {
        include: {
          medicine: {
            select: { name: true, manufacturer: true, userId: true },
          },
        },
        orderBy: {
          createdAt: "desc", // newest order at the top
        },
      },
    },
  });

  return data;
};

export const orderService = {
  createOrderHandler,
  getOrderHandler,
};
