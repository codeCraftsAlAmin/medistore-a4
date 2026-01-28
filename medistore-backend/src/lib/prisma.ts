import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../../generated/prisma/client";
import config from "../config";

const adapter = new PrismaNeon({ connectionString: config.urls.neon_db_url });
export const prisma = new PrismaClient({ adapter });
