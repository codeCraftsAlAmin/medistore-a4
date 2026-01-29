import { UserRole } from "../../generated/prisma/enums";

export interface UserType {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  emailVerified: boolean;
}
