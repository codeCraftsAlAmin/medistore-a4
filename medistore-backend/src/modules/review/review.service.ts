import { prisma } from "../../lib/prisma";
import { ReviewType, UserType } from "../../types";

const createReviewHandler = async (
  payload: ReviewType,
  id: string,
  user: UserType,
) => {
  const { rating, comment } = payload;
  const findMedicine = await prisma.medicine.findUnique({
    where: {
      id: id,
    },
  });

  if (!findMedicine) {
    throw new Error("Medicine not found");
  }

  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5 stars");
  }

  const data = await prisma.review.create({
    data: {
      rating: rating,
      comment: comment,
      userId: user.id,
      medicineId: id,
    },
  });

  return data;
};

const getReviewsHandler = async () => {
  const data = await prisma.review.findMany({
    include: {
      medicine: {
        select: {
          id: true,
          name: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return data;
};

const deleteReviewHandler = async (id: string, user: UserType) => {
  const findReview = await prisma.review.findUnique({
    where: {
      id: id,
    },
  });

  if (!findReview) {
    throw new Error("Review not found");
  }

  if (findReview.userId !== user.id) {
    throw new Error(
      "Forbidden!!. you are not authorized to delete this review",
    );
  }

  const data = await prisma.review.delete({
    where: { id: id },
  });

  return data;
};

export const reviewService = {
  createReviewHandler,
  getReviewsHandler,
  deleteReviewHandler,
};
