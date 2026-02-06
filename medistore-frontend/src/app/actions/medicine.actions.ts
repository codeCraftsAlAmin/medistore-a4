"use server";

import { medicineService } from "@/app/service/medicine.service";
import { userService } from "@/app/service/user.service";
import { revalidatePath } from "next/cache";

export async function createMedicineAction(formData: any) {
  const result = await medicineService.createMedicine(formData);

  if (!result.error) {
    // Refresh the inventory and main pages
    revalidatePath("/seller/inventory");
    revalidatePath("/medicine");
    revalidatePath("/");
  }

  return result;
}

export async function getCurrentUserAction() {
  const { data: sessionData } = await userService.getSession();
  return sessionData?.user || null;
}

export async function updateStockAction(item: any, newStock: number) {
  const payload = {
    name: item.name,
    price: item.price,
    stock: newStock,
    manufacturer: item.manufacturer,
    category: item.category?.name || item.category,
  };

  const res = await medicineService.updateMedicine(
    item.id || item._id,
    payload,
  );

  if (!res.error) {
    revalidatePath("/seller/inventory");
    revalidatePath("/medicine");
  }
  return res;
}

export async function updateMedicineNameAction(
  medicineId: string,
  newName: string,
) {
  const currentMedicine = await medicineService.getMedicineById(medicineId);
  if (currentMedicine.error || !currentMedicine.data) {
    return { data: null, error: { message: "Medicine not found" } };
  }

  const medicine = currentMedicine.data;
  const payload = {
    name: newName,
    price: medicine.price,
    stock: medicine.stock,
    manufacturer: medicine.manufacturer,
    category: medicine.category?.name || medicine.category,
  };

  const result = await medicineService.updateMedicine(medicineId, payload);

  if (!result.error) {
    revalidatePath("/seller/inventory");
    revalidatePath("/medicine");
  }

  return result;
}

export async function deleteMedicineAction(medicineId: string) {
  const result = await medicineService.deleteMedicine(medicineId);

  if (!result.error) {
    revalidatePath("/seller/inventory");
    revalidatePath("/medicine");
  }
  return result;
}
