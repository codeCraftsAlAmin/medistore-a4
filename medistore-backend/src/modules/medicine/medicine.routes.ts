import express from "express";
import { medicineController } from "./medicine.controller";
import authentication, { UserRole } from "../../middleware/authentication";

const router = express.Router();

router.post(
  "/medicine",
  authentication(UserRole.SELLER, UserRole.ADMIN),
  medicineController.createMedicine,
);

export const medicineRouter = router;
