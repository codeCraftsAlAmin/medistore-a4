import { prisma } from "../lib/prisma";

const categories = [
  { name: "Antibiotics" },
  { name: "Pain Relief" },
  { name: "Diabetes Care" },
  { name: "First Aid" },
  { name: "Vitamins" },
  { name: "Personal Care" },
  { name: "Digestive Health" },
  { name: "Baby Care" },
];

async function seedCategory() {
  await prisma.category.createMany({
    data: categories,
    skipDuplicates: true, // prevents error if you run the script twice
  });
}

seedCategory();
