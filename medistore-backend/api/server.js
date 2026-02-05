var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import express6 from "express";
import cors from "cors";

// src/config/index.ts
import dotenv from "dotenv";
dotenv.config();
var config = {
  server: {
    port: process.env.PORT || 8e3
  },
  urls: {
    frontend_url: process.env.FRONTEND_URL || "",
    backend_url: process.env.BACKEND_URL || "",
    neon_db_url: process.env.DATABASE_URL || ""
  },
  auth: {
    better_auth_sec: process.env.BETTER_AUTH_SECRET || "",
    better_auth_url: process.env.BETTER_AUTH_URL || ""
  },
  google_credentials: {
    client_id: process.env.CLIENT_ID || "",
    client_secret: process.env.CLIENT_SECRET || ""
  },
  node_mailer: {
    google_account: process.env.GOOGLE_ACC || "",
    google_pass: process.env.GOOGLE_PASS || ""
  }
};
var config_default = config;

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/lib/prisma.ts
import { PrismaNeon } from "@prisma/adapter-neon";

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config2 = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": 'enum UserRole {\n  ADMIN\n  CUSTOMER\n  SELLER\n}\n\nenum UserStatus {\n  BAN\n  UNBAN\n}\n\nmodel User {\n  id            String     @id\n  name          String\n  email         String\n  emailVerified Boolean    @default(false)\n  image         String?\n  role          UserRole   @default(CUSTOMER)\n  status        UserStatus @default(UNBAN)\n  createdAt     DateTime   @default(now())\n  updatedAt     DateTime   @updatedAt\n  sessions      Session[]\n  accounts      Account[]\n  medicine      Medicine[]\n  reviews       Review[]\n  order         Order[]\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel Category {\n  id       String     @id @default(uuid())\n  name     String     @db.VarChar(50)\n  medicine Medicine[]\n\n  @@map("category")\n}\n\nmodel Medicine {\n  id           String      @id @default(uuid())\n  name         String      @db.VarChar(50)\n  price        Int         @default(0)\n  stock        Int         @default(0)\n  manufacturer String\n  category     Category    @relation(fields: [categoryId], references: [id])\n  categoryId   String\n  reviews      Review[]\n  user         User        @relation(fields: [userId], references: [id])\n  userId       String\n  createdAt    DateTime    @default(now())\n  updatedAt    DateTime    @updatedAt\n  orderItems   OrderItem[]\n\n  @@index([userId])\n  @@map("medicine")\n}\n\nmodel Order {\n  id         String      @id @default(uuid())\n  totalPrice Int         @default(0)\n  status     OrderStatus @default(PLACED)\n  address    String\n  user       User        @relation(fields: [userId], references: [id])\n  userId     String\n  createdAt  DateTime    @default(now())\n  updatedAt  DateTime    @updatedAt\n  orderItems OrderItem[]\n\n  @@index([userId])\n  @@map("order")\n}\n\nenum OrderStatus {\n  PLACED\n  PROCESSING\n  SHIPPED\n  DELIVERED\n  CANCELLED\n}\n\nmodel OrderItem {\n  id              String   @id @default(uuid())\n  order           Order    @relation(fields: [orderId], references: [id])\n  orderId         String\n  medicine        Medicine @relation(fields: [medicineId], references: [id])\n  medicineId      String\n  priceAtPurchase Int      @default(0)\n  quantity        Int      @default(0)\n  createdAt       DateTime @default(now())\n  updatedAt       DateTime @updatedAt\n\n  @@index([orderId])\n  @@map("orderitem")\n}\n\nmodel Review {\n  id         String   @id @default(uuid())\n  rating     Int      @default(0)\n  comment    String\n  medicine   Medicine @relation(fields: [medicineId], references: [id])\n  user       User     @relation(fields: [userId], references: [id])\n  userId     String\n  medicineId String\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([userId])\n  @@map("review")\n}\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config2.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"UserRole"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"medicine","kind":"object","type":"Medicine","relationName":"MedicineToUser"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"medicine","kind":"object","type":"Medicine","relationName":"CategoryToMedicine"}],"dbName":"category"},"Medicine":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Int"},{"name":"stock","kind":"scalar","type":"Int"},{"name":"manufacturer","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToMedicine"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"reviews","kind":"object","type":"Review","relationName":"MedicineToReview"},{"name":"user","kind":"object","type":"User","relationName":"MedicineToUser"},{"name":"userId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"MedicineToOrderItem"}],"dbName":"medicine"},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"totalPrice","kind":"scalar","type":"Int"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"address","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"OrderToUser"},{"name":"userId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"OrderToOrderItem"}],"dbName":"order"},"OrderItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderItem"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"medicine","kind":"object","type":"Medicine","relationName":"MedicineToOrderItem"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"priceAtPurchase","kind":"scalar","type":"Int"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"orderitem"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"medicine","kind":"object","type":"Medicine","relationName":"MedicineToReview"},{"name":"user","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"userId","kind":"scalar","type":"String"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"review"}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config2.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config2);
}

// generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AnyNull: () => AnyNull2,
  CategoryScalarFieldEnum: () => CategoryScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  JsonNull: () => JsonNull2,
  MedicineScalarFieldEnum: () => MedicineScalarFieldEnum,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullsOrder: () => NullsOrder,
  OrderItemScalarFieldEnum: () => OrderItemScalarFieldEnum,
  OrderScalarFieldEnum: () => OrderScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  QueryMode: () => QueryMode,
  ReviewScalarFieldEnum: () => ReviewScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.3.0",
  engine: "9d6ad21cbbceab97458517b147a6a09ff43aa735"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  User: "User",
  Session: "Session",
  Account: "Account",
  Verification: "Verification",
  Category: "Category",
  Medicine: "Medicine",
  Order: "Order",
  OrderItem: "OrderItem",
  Review: "Review"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  emailVerified: "emailVerified",
  image: "image",
  role: "role",
  status: "status",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CategoryScalarFieldEnum = {
  id: "id",
  name: "name"
};
var MedicineScalarFieldEnum = {
  id: "id",
  name: "name",
  price: "price",
  stock: "stock",
  manufacturer: "manufacturer",
  categoryId: "categoryId",
  userId: "userId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var OrderScalarFieldEnum = {
  id: "id",
  totalPrice: "totalPrice",
  status: "status",
  address: "address",
  userId: "userId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var OrderItemScalarFieldEnum = {
  id: "id",
  orderId: "orderId",
  medicineId: "medicineId",
  priceAtPurchase: "priceAtPurchase",
  quantity: "quantity",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ReviewScalarFieldEnum = {
  id: "id",
  rating: "rating",
  comment: "comment",
  userId: "userId",
  medicineId: "medicineId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var adapter = new PrismaNeon({ connectionString: config_default.urls.neon_db_url });
var prisma = new PrismaClient({ adapter });

// src/lib/sendEmail.ts
import nodemailer from "nodemailer";
var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  // Use true for port 465, false for port 587
  auth: {
    user: config_default.node_mailer.google_account,
    pass: config_default.node_mailer.google_pass
  }
});
var sendEmail = async ({
  user,
  url,
  subject,
  title,
  buttonText
}) => {
  try {
    const brandName = "MediStore Pharmecy";
    await transporter.sendMail({
      from: `${brandName} <${config_default.node_mailer.google_account}>`,
      to: user.email,
      subject: `${subject} - ${brandName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #000; color: #fff; border-radius: 10px;">
          <h2 style="color: #fbbf24;">${title}</h2>
          <p>Hi ${user.name || "User"},</p>
          <p>Please click the button below to proceed.</p>
          <a href="${url}" style="background: #fbbf24; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; margin: 20px 0;">
            ${buttonText}
          </a>
          <p style="font-size: 11px; color: #666;">If you did not request this, please ignore this email.</p>
        </div>
      `
    });
  } catch (error) {
    throw Error("MAIL_SERVICE_TEMPORARILY_UNAVAILABLE");
  }
};

// src/lib/auth.ts
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  // additional fields
  user: {
    additionalFields: {
      role: {
        type: ["ADMIN", "CUSTOMER", "SELLER"],
        required: false,
        defaultValue: "CUSTOMER"
      },
      status: {
        type: ["BAN", "UNBAN"],
        required: false,
        defaultValue: "UNBAN"
      }
    }
  },
  trustedOrigins: [config_default.urls.frontend_url],
  // # email and password verification
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        user,
        url,
        subject: "Reset your password",
        title: "Password reset request",
        buttonText: "Reset Password"
      });
    },
    onPasswordReset: async ({ user }, request) => {
      console.log(`Password for user ${user.email} has been reset.`);
    }
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        user,
        url,
        subject: "Verify your account",
        title: "Welcome to mediStore",
        buttonText: "Verify Email"
      });
    }
  },
  // # gmail verification
  socialProviders: {
    google: {
      prompt: "select_account",
      accessType: "offline",
      clientId: config_default.google_credentials.client_id,
      clientSecret: config_default.google_credentials.client_secret
    }
  }
});

// src/app.ts
import { toNodeHandler } from "better-auth/node";

// src/middleware/notFound.ts
function notFound(req, res) {
  res.status(404).json({
    ok: false,
    message: "Router not found",
    path: req.path,
    date: Date()
  });
}

// src/middleware/errorHandler.ts
function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next();
  }
  let statusCode = 500;
  let errMessage = "Internal server error";
  if (error instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    statusCode = 400;
    errMessage = "Validation Error: Please check your input fields and data types";
  } else if (error instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        statusCode = 409;
        errMessage = `A record with this ${error.meta?.target} already exists`;
        break;
      case "P2025":
        statusCode = 404;
        errMessage = "The requested record was not found";
        break;
      case "P2003":
        statusCode = 404;
        errMessage = "Foreign key constraint failed. Ensure related IDs are correct";
        break;
      default:
        statusCode = 400;
        errMessage = `Database Error: ${error.code}`;
    }
  } else if (error instanceof Error) {
    errMessage = error.message;
  }
  res.status(statusCode).json({
    ok: false,
    message: errMessage
  });
}

// src/modules/medicine/medicine.routes.ts
import express from "express";

// src/modules/medicine/medicine.service.ts
var createMedicineHandler = async (payload, user) => {
  const { name, price, stock, manufacturer, category } = payload;
  if (!category) {
    throw new Error("Category name is require to create a medicine!!");
  }
  const findCategory = await prisma.category.findFirst({
    where: {
      name: category
    }
  });
  if (!findCategory) {
    throw new Error("Category not found, please create it first");
  }
  const data = await prisma.medicine.create({
    data: {
      name,
      price: Number(price),
      stock: Number(stock),
      manufacturer,
      category: {
        connect: { id: findCategory.id }
      },
      user: {
        connect: { id: user?.id }
      }
    }
  });
  return data;
};
var getMedicinesHandler = async (filtersParams, options, user) => {
  const { search, price, stock, manufacturer, category } = filtersParams;
  const { page, limit, skipPage, sortBy, sortOrder } = options;
  const conditions = [];
  if (search) {
    conditions.push({
      name: {
        contains: search,
        mode: "insensitive"
      }
    });
  }
  if (price) {
    conditions.push({
      price: {
        gte: Number(price)
      }
    });
  }
  if (stock) {
    conditions.push({
      stock: {
        gte: Number(stock)
      }
    });
  }
  if (manufacturer) {
    conditions.push({
      manufacturer: {
        contains: manufacturer,
        mode: "insensitive"
      }
    });
  }
  if (category) {
    conditions.push({
      category: {
        name: {
          contains: category,
          mode: "insensitive"
        }
      }
    });
  }
  const data = await prisma.medicine.findMany({
    where: {
      AND: conditions.length > 0 ? conditions : []
    },
    // paginations
    skip: Number(skipPage) || 0,
    take: Number(limit) || 5,
    // sorting
    orderBy: sortBy && sortOrder ? {
      [sortBy]: sortOrder
    } : { createdAt: "desc" },
    include: {
      orderItems: {
        select: {
          quantity: true
        }
      },
      category: { select: { name: true } },
      _count: {
        select: { reviews: true }
      }
    }
  });
  const total = await prisma.medicine.count({
    where: {
      AND: conditions.length > 0 ? conditions : {}
    }
  });
  return {
    data,
    paginations: {
      page,
      limit,
      totalMedicine: total,
      totalPage: Math.ceil(total / (limit || 5))
    }
  };
};
var updateMedicineHandler = async (id, payload, user) => {
  const findMedicine2 = await prisma.medicine.findUnique({
    where: { id }
  });
  if (!findMedicine2) {
    throw new Error("Medicine not found");
  }
  if (findMedicine2.userId !== user.id) {
    throw new Error(
      "Forbidden!!. You are not authorized to update this resources"
    );
  }
  const categoryInfo = await prisma.category.findFirst({
    where: {
      name: payload.category
    }
  });
  if (!categoryInfo) {
    throw new Error("Category doesn't exist with this id ");
  }
  const data = await prisma.medicine.update({
    where: {
      id
    },
    data: {
      name: payload.name,
      price: payload.price,
      stock: payload.stock,
      manufacturer: payload.manufacturer,
      categoryId: categoryInfo?.id
    }
  });
  return data;
};
var deleteMedicineHandler = async (id, user) => {
  const findMedicine2 = await prisma.medicine.findUnique({
    where: { id }
  });
  if (!findMedicine2) {
    throw new Error("Medicine not found");
  }
  if (findMedicine2.userId !== user.id) {
    throw new Error(
      "Forbidden!!. You are not authorized to update this resources"
    );
  }
  const orderWithMedicine = await prisma.orderItem.count({
    where: { medicineId: findMedicine2.id }
  });
  if (orderWithMedicine > 0) {
    throw new Error("Cannot delete medicine with active order history.");
  }
  await prisma.medicine.delete({
    where: {
      id
    }
  });
};
var finMedicineHandler = async (id) => {
  const findMedicine2 = await prisma.medicine.findUnique({
    where: { id }
  });
  if (!findMedicine2) {
    throw new Error("Medicine not found");
  }
  const data = await prisma.medicine.findUnique({
    where: {
      id
    }
  });
  return data;
};
var medicineService = {
  createMedicineHandler,
  getMedicinesHandler,
  updateMedicineHandler,
  deleteMedicineHandler,
  finMedicineHandler
};

// src/helper/sortingAndPagination.ts
function sortingAndPagination(payload) {
  const page = Number(payload.page) || 1;
  const limit = Number(payload.limit) || 5;
  const sortBy = payload.sortBy || "createdAt";
  const sortOrder = payload.sortOrder || "desc";
  const skipPage = (page - 1) * limit || 0;
  return {
    page,
    sortBy,
    limit,
    sortOrder,
    skipPage
  };
}
var sortingAndPagination_default = sortingAndPagination;

// src/modules/medicine/medicine.controller.ts
var createMedicine = async (req, res, next) => {
  try {
    const data = await medicineService.createMedicineHandler(
      req.body,
      req.user
    );
    res.status(201).json({
      ok: true,
      message: "Data created successfully",
      data
    });
  } catch (error) {
    next(error);
  }
};
var getMedicines = async (req, res, next) => {
  try {
    const options = sortingAndPagination_default(req.query);
    const filters = {
      search: req.query.search,
      price: req.query.price,
      stock: req.query.stock,
      manufacturer: req.query.manufacturer,
      category: req.query.category
    };
    const data = await medicineService.getMedicinesHandler(
      filters,
      options,
      req.user
    );
    res.status(200).json({
      ok: true,
      message: "Data retrived successfully",
      data
    });
  } catch (error) {
    next(error);
  }
};
var updateMedicine = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await medicineService.updateMedicineHandler(
      id,
      req.body,
      req.user
    );
    res.status(200).json({
      ok: true,
      message: "Data updated successfully",
      data
    });
  } catch (error) {
    next(error);
  }
};
var deleteMedicine = async (req, res, next) => {
  try {
    const { id } = req.params;
    await medicineService.deleteMedicineHandler(
      id,
      req.user
    );
    res.status(200).json({
      ok: true,
      message: "Data deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};
var findMedicine = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await medicineService.finMedicineHandler(id);
    res.status(200).json({
      ok: true,
      message: "Data retrived successfully",
      data
    });
  } catch (error) {
    next(error);
  }
};
var medicineController = {
  createMedicine,
  getMedicines,
  updateMedicine,
  deleteMedicine,
  findMedicine
};

// src/middleware/authentication.ts
var authMiddleware = (...role) => {
  return async (req, res, next) => {
    const session = await auth.api.getSession({
      headers: req.headers
    });
    if (!session) {
      return res.status(404).json({
        ok: false,
        message: "You are not authorized!!"
      });
    }
    if (!session?.user.emailVerified) {
      return res.status(403).json({
        ok: false,
        message: "Email verification is required, please verify your email"
      });
    }
    req.user = {
      id: session?.user.id,
      email: session?.user.email,
      name: session?.user.name,
      role: session?.user.role,
      emailVerified: session?.user.emailVerified
    };
    if (role.length && !role.includes(req.user?.role)) {
      return res.status(403).json({
        ok: false,
        message: "Forbidden!! You don't have the permission to access this resources"
      });
    }
    if (session?.user.status === "BAN") {
      throw new Error(
        "Your account has been suspended by the administration. Please contact support for further assistance."
      );
    }
    next();
  };
};
var authentication_default = authMiddleware;

// src/modules/medicine/medicine.routes.ts
var router = express.Router();
router.post(
  "/medicine",
  authentication_default("SELLER" /* SELLER */),
  medicineController.createMedicine
);
router.get(
  "/medicine",
  medicineController.getMedicines
);
router.put(
  "/medicine/:id",
  authentication_default("SELLER" /* SELLER */),
  medicineController.updateMedicine
);
router.delete(
  "/medicine/:id",
  authentication_default("SELLER" /* SELLER */),
  medicineController.deleteMedicine
);
router.get("/medicine/:id", medicineController.findMedicine);
var medicineRouter = router;

// src/modules/review/review.route.ts
import express2 from "express";

// src/modules/review/review.service.ts
var createReviewHandler = async (payload, id, user) => {
  const { rating, comment } = payload;
  const findMedicine2 = await prisma.medicine.findUnique({
    where: {
      id
    }
  });
  if (!findMedicine2) {
    throw new Error("Medicine not found");
  }
  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5 stars");
  }
  const data = await prisma.review.create({
    data: {
      rating,
      comment,
      userId: user.id,
      medicineId: id
    }
  });
  return data;
};
var getReviewsHandler = async () => {
  const data = await prisma.review.findMany({
    include: {
      medicine: {
        select: {
          id: true,
          name: true
        }
      },
      user: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });
  return data;
};
var deleteReviewHandler = async (id, user) => {
  const findReview = await prisma.review.findUnique({
    where: {
      id
    }
  });
  if (!findReview) {
    throw new Error("Review not found");
  }
  if (findReview.userId !== user.id) {
    throw new Error(
      "Forbidden!!. you are not authorized to delete this review"
    );
  }
  const data = await prisma.review.delete({
    where: { id }
  });
  return data;
};
var reviewService = {
  createReviewHandler,
  getReviewsHandler,
  deleteReviewHandler
};

// src/modules/review/review.controller.ts
var createReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await reviewService.createReviewHandler(
      req.body,
      id,
      req.user
    );
    res.status(201).json({
      ok: true,
      message: "Review created successfully",
      data
    });
  } catch (error) {
    next(error);
  }
};
var getReviews = async (req, res, next) => {
  try {
    const data = await reviewService.getReviewsHandler();
    res.status(201).json({
      ok: true,
      message: "Reviews retrived successfully",
      data
    });
  } catch (error) {
    next(error);
  }
};
var deleteReviews = async (req, res, next) => {
  try {
    const { id } = req.params;
    await reviewService.deleteReviewHandler(id, req.user);
    res.status(201).json({
      ok: true,
      message: "Review deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};
var reviewController = {
  createReview,
  getReviews,
  deleteReviews
};

// src/modules/review/review.route.ts
var router2 = express2.Router();
router2.post(
  "/review/:id",
  authentication_default("CUSTOMER" /* CUSTOMER */),
  reviewController.createReview
);
router2.get(
  "/review/",
  authentication_default("CUSTOMER" /* CUSTOMER */, "ADMIN" /* ADMIN */),
  reviewController.getReviews
);
router2.delete(
  "/review/:id",
  authentication_default("CUSTOMER" /* CUSTOMER */),
  reviewController.deleteReviews
);
var reviewRouter = router2;

// src/modules/order/order.route.ts
import express3 from "express";

// src/modules/order/order.service.ts
var createOrderHandler = async (address, items, user) => {
  return await prisma.$transaction(async (tx) => {
    let calculateTotalPrice = 0;
    let orderItemsData = [];
    for (const item of items) {
      const medicine = await tx.medicine.findUnique({
        where: { id: item.medicineId }
      });
      if (!medicine) {
        throw new Error(`Medicine with ID ${item.medicineId} not found`);
      }
      if (medicine.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${medicine.name}`);
      }
      await tx.medicine.update({
        where: { id: medicine.id },
        data: { stock: medicine.stock - item.quantity }
      });
      const itemTotal = medicine.price * item.quantity;
      calculateTotalPrice += itemTotal;
      orderItemsData.push({
        medicineId: medicine.id,
        quantity: item.quantity,
        priceAtPurchase: medicine.price
        // saving the price at the moment
      });
    }
    const newOrder = await tx.order.create({
      data: {
        userId: user.id,
        address,
        totalPrice: calculateTotalPrice,
        status: "PLACED",
        // create related order item
        orderItems: {
          create: orderItemsData
        }
      },
      include: {
        orderItems: true
      }
    });
    return newOrder;
  });
};
var getOrderHandler = async (user) => {
  let orderInfo = {};
  if (user.role === "CUSTOMER") {
    orderInfo = await prisma.order.findMany({
      where: {
        userId: user.id
      },
      include: {
        orderItems: {
          select: {
            quantity: true,
            medicine: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });
  }
  if (user.role === "SELLER") {
    orderInfo = await prisma.order.findMany({
      where: {
        orderItems: {
          some: {
            medicine: {
              userId: user.id
            }
          }
        }
      },
      include: {
        user: { select: {
          name: true,
          email: true
        } },
        orderItems: {
          include: {
            medicine: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });
  }
  if (user.role === "ADMIN") {
    orderInfo = await prisma.order.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });
  }
  return orderInfo;
};
var updateOrderHandler = async (orderId, status, user) => {
  const findOrder = await prisma.order.findFirst({
    where: {
      id: orderId,
      orderItems: {
        some: {
          medicine: {
            userId: user.id
          }
        }
      }
    }
  });
  if (!findOrder) {
    throw new Error(
      "Order not found or you don't have permission to update it"
    );
  }
  if (user.role === "SELLER" && status === "CANCELLED") {
    throw new Error("Seller can not change this status");
  }
  if (user.role === "SELLER" && findOrder.status === "CANCELLED") {
    throw new Error("Seller can not update cancelled order this status");
  }
  const data = await prisma.order.update({
    where: {
      id: orderId
    },
    data: {
      status
    }
  });
  return data;
};
var cancleOrderHandler = async (orderId, user) => {
  const findOrder = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId: user.id
    },
    include: {
      orderItems: true
    }
  });
  if (!findOrder) {
    throw new Error("Order not found");
  }
  if (findOrder.status !== "PLACED") {
    throw new Error(
      "Cannot cancel this order. It has already been processed or shipped"
    );
  }
  return await prisma.$transaction(async (tx) => {
    for (const item of findOrder.orderItems) {
      await tx.medicine.update({
        where: {
          id: item.medicineId
        },
        data: {
          stock: { increment: item.quantity }
        }
      });
    }
    await tx.order.update({
      where: {
        id: orderId
      },
      data: {
        status: "CANCELLED"
      }
    });
  });
};
var orderService = {
  createOrderHandler,
  getOrderHandler,
  updateOrderHandler,
  cancleOrderHandler
};

// src/modules/order/order.controller.ts
var createOrder = async (req, res, next) => {
  try {
    const { address, items } = req.body;
    const data = await orderService.createOrderHandler(
      address,
      items,
      req.user
    );
    res.status(201).json({
      ok: true,
      message: "Order placed successfully",
      data
    });
  } catch (error) {
    next(error);
  }
};
var getOrder = async (req, res, next) => {
  try {
    const data = await orderService.getOrderHandler(req.user);
    res.status(200).json({
      ok: true,
      message: "Orders retrieved successfully",
      data
    });
  } catch (error) {
    next(error);
  }
};
var updateOrder = async (req, res, next) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    const data = await orderService.updateOrderHandler(
      id,
      status,
      req.user
    );
    res.status(200).json({
      ok: true,
      message: "Orders updated successfully",
      data
    });
  } catch (error) {
    next(error);
  }
};
var cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await orderService.cancleOrderHandler(
      id,
      req.user
    );
    res.status(200).json({
      ok: true,
      message: "Orders cancelled successfully",
      data
    });
  } catch (error) {
    next(error);
  }
};
var orderController = {
  createOrder,
  getOrder,
  updateOrder,
  cancelOrder
};

// src/modules/order/order.route.ts
var router3 = express3.Router();
router3.post(
  "/order/",
  authentication_default("CUSTOMER" /* CUSTOMER */),
  orderController.createOrder
);
router3.get(
  "/order/",
  authentication_default("CUSTOMER" /* CUSTOMER */, "SELLER" /* SELLER */, "ADMIN" /* ADMIN */),
  orderController.getOrder
);
router3.put(
  "/order/:id",
  authentication_default("SELLER" /* SELLER */),
  orderController.updateOrder
);
router3.put(
  "/cancel/order/:id",
  authentication_default("CUSTOMER" /* CUSTOMER */),
  orderController.cancelOrder
);
var orderRouter = router3;

// src/modules/user/user.route.ts
import express4 from "express";

// src/modules/user/user.service.ts
var getUsersHandler = async (filtersParams, options, user) => {
  const { search, role, status } = filtersParams;
  const { page, limit, skipPage, sortBy, sortOrder } = options;
  const conditions = [];
  conditions.push({
    id: {
      not: user.id
    }
  });
  if (search) {
    conditions.push({
      name: {
        contains: search,
        mode: "insensitive"
      }
    });
  }
  if (role) {
    conditions.push({
      role
    });
  }
  if (status) {
    conditions.push({
      status
    });
  }
  const data = await prisma.user.findMany({
    where: {
      AND: conditions.length > 0 ? conditions : []
    },
    // paginations
    skip: Number(skipPage) || 0,
    take: Number(limit) || 5,
    // sorting
    orderBy: sortBy && sortOrder ? {
      [sortBy]: sortOrder
    } : { createdAt: "desc" }
  });
  const total = await prisma.user.count({
    where: {
      AND: conditions.length > 0 ? conditions : {}
    }
  });
  return {
    data,
    paginations: {
      page,
      limit,
      totalUser: total,
      totalPage: Math.ceil(total / (limit || 5))
    }
  };
};
var updateStatusHandler = async (userId, status) => {
  if (!userId) {
    throw new Error("User not found");
  }
  const data = await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      status
    }
  });
  return data;
};
var manageProfileHandler = async (id, name, email, user) => {
  if (!id) {
    throw new Error("User not found with this ID");
  }
  if (id !== user.id) {
    throw new Error("You are not authorized to update this profile");
  }
  const data = await prisma.user.update({
    where: {
      id
    },
    data: {
      name,
      email
    }
  });
  return data;
};
var userService = {
  getUsersHandler,
  updateStatusHandler,
  manageProfileHandler
};

// src/modules/user/user.controller.ts
var geteUsers = async (req, res, next) => {
  try {
    const filters = {
      search: req.query.search,
      role: req.query.role,
      status: req.query.status
    };
    const options = sortingAndPagination_default(req.query);
    const data = await userService.getUsersHandler(
      filters,
      options,
      req.user
    );
    res.status(200).json({
      ok: true,
      message: "Data retrived successfully",
      data
    });
  } catch (error) {
    next(error);
  }
};
var updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const data = await userService.updateStatusHandler(
      id,
      status
    );
    res.status(200).json({
      ok: true,
      message: "Data updated successfully",
      data
    });
  } catch (error) {
    next(error);
  }
};
var updateProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    const user = req.user;
    const data = await userService.manageProfileHandler(
      id,
      name,
      email,
      user
    );
    res.status(200).json({
      ok: true,
      message: "Data updated successfully",
      data
    });
  } catch (error) {
    next(error);
  }
};
var userController = {
  geteUsers,
  updateStatus,
  updateProfile
};

// src/modules/user/user.route.ts
var router4 = express4.Router();
router4.get("/users/", authentication_default("ADMIN" /* ADMIN */), userController.geteUsers);
router4.put(
  "/users/:id",
  authentication_default("ADMIN" /* ADMIN */),
  userController.updateStatus
);
router4.put(
  "/profile/me/:id",
  authentication_default("ADMIN" /* ADMIN */, "CUSTOMER" /* CUSTOMER */, "SELLER" /* SELLER */),
  userController.updateProfile
);
var userRouter = router4;

// src/modules/category/category.route.ts
import express5 from "express";

// src/modules/category/category.service.ts
var createCategoryHandler = async (name) => {
  const findCategory = await prisma.category.findFirst({
    where: {
      name
    }
  });
  if (findCategory) {
    throw new Error("Category already exists");
  }
  const data = await prisma.category.create({
    data: {
      name
    }
  });
  return data;
};
var geCategoriesHandler = async (search) => {
  const data = await prisma.category.findMany({
    where: search ? {
      name: {
        contains: search,
        mode: "insensitive"
      }
    } : {},
    include: {
      _count: {
        select: { medicine: true }
      }
    }
  });
  return data;
};
var updateCategoryHandler = async (id, name) => {
  if (!id) {
    throw new Error("Category not found");
  }
  const data = await prisma.category.update({
    where: {
      id
    },
    data: {
      name
    }
  });
  return data;
};
var deleteCategoryHandler = async (id) => {
  if (!id) {
    throw new Error("Category not found");
  }
  const checkMedicine = await prisma.medicine.count({
    where: {
      categoryId: id
    }
  });
  if (checkMedicine > 0) {
    throw new Error(
      `Cannot delete category. There are ${checkMedicine} medicines assigned to it. Please reassign or delete them first.`
    );
  }
  await prisma.category.delete({
    where: {
      id
    }
  });
};
var categoryService = {
  geCategoriesHandler,
  updateCategoryHandler,
  deleteCategoryHandler,
  createCategoryHandler
};

// src/modules/category/category.controller.ts
var getCategories = async (req, res, next) => {
  try {
    const { search } = req.query;
    const data = await categoryService.geCategoriesHandler(search);
    res.status(200).json({
      ok: true,
      message: "Data retrieved successfully",
      data
    });
  } catch (error) {
    next(error);
  }
};
var createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const data = await categoryService.createCategoryHandler(name);
    res.status(201).json({
      ok: true,
      message: "Category created successfully",
      data
    });
  } catch (error) {
    next(error);
  }
};
var updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const data = await categoryService.updateCategoryHandler(
      id,
      name
    );
    res.status(200).json({
      ok: true,
      message: "Data updated successfully",
      data
    });
  } catch (error) {
    next(error);
  }
};
var deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    await categoryService.deleteCategoryHandler(id);
    res.status(200).json({
      ok: true,
      message: "Data deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};
var categoryController = {
  getCategories,
  updateCategory,
  deleteCategory,
  createCategory
};

// src/modules/category/category.route.ts
var router5 = express5.Router();
router5.get(
  "/categories/",
  authentication_default("ADMIN" /* ADMIN */, "SELLER" /* SELLER */),
  categoryController.getCategories
);
router5.post(
  "/category/",
  authentication_default("ADMIN" /* ADMIN */),
  categoryController.createCategory
);
router5.put(
  "/category/:id",
  authentication_default("ADMIN" /* ADMIN */),
  categoryController.updateCategory
);
router5.delete(
  "/category/:id",
  authentication_default("ADMIN" /* ADMIN */),
  categoryController.deleteCategory
);
var categoryRouter = router5;

// src/app.ts
var app = express6();
app.use(express6.json());
app.use(express6.urlencoded({ extended: true }));
app.use(
  cors({
    origin: config_default.urls.frontend_url,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
  })
);
app.all("/api/auth/*splat", toNodeHandler(auth));
app.get("/", (req, res) => {
  res.status(200).json({
    ok: true,
    message: "Server has created successfully"
  });
});
app.use("/api", medicineRouter);
app.use("/api", reviewRouter);
app.use("/api", orderRouter);
app.use("/api", userRouter);
app.use("/api", categoryRouter);
app.use(notFound);
app.use(errorHandler);
var app_default = app;

// src/server.ts
var port = config_default.server.port;
if (process.env.NODE_ENV !== "production") {
  async function main() {
    try {
      await prisma.$connect();
      console.log("Successfully connected ~\u{1F389}");
      app_default.listen(port, () => {
        console.log(`Server is running on ~\u{1F680} http://localhost:${port}`);
      });
    } catch (error) {
      console.log("Something went wrong", error);
      process.exit(1);
    }
  }
  main();
}
var server_default = app_default;
export {
  server_default as default
};
