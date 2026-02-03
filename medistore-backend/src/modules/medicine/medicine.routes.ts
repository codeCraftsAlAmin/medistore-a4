import express from "express";
import { medicineController } from "./medicine.controller";
import authentication, { UserRole } from "../../middleware/authentication";

const router = express.Router();

// create medicine -- seller
router.post(
  "/medicine",
  authentication(UserRole.SELLER),
  medicineController.createMedicine,
);

// get medicines -- everyone
router.get(
  "/medicine",
  // authentication(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.SELLER),
  medicineController.getMedicines,
);

// update medicines -- seller
router.put(
  "/medicine/:id",
  authentication(UserRole.SELLER),
  medicineController.updateMedicine,
);

// delete medicines -- seller
router.delete(
  "/medicine/:id",
  authentication(UserRole.SELLER),
  medicineController.deleteMedicine,
);

// find medicine -- everyone
router.get("/medicine/:id", medicineController.findMedicine);

export const medicineRouter = router;
