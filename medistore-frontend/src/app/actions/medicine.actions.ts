"use server";

import { medicineService } from "@/app/service/medicine.service";
import { revalidatePath } from "next/cache";

export async function createMedicineAction(formData: any) {
  const result = await medicineService.createMedicine(formData);

  if (!result.error) {
    revalidatePath("/medicine"); // This refreshes the table instantly
    revalidatePath("/");
  }

  return result;
}
