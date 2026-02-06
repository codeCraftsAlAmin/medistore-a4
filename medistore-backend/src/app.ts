import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";
import notFound from "./middleware/notFound";
import errorHandler from "./middleware/errorHandler";
import { medicineRouter } from "./modules/medicine/medicine.routes";
import { reviewRouter } from "./modules/review/review.route";
import { orderRouter } from "./modules/order/order.route";
import { userRouter } from "./modules/user/user.route";
import { categoryRouter } from "./modules/category/category.route";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  config.urls.frontend_url,
  config.urls.backend_url,
  "http://localhost:3000",
  "http://localhost:5000",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {

      if (!origin) return callback(null, true);

      // check if origin is in allowedOrigins or matches Vercel pattern
      const isAllowed =
        allowedOrigins.includes(origin) ||
        /^https:\/\/medistore-.*\.vercel\.app$/.test(origin) ||
        /^https:\/\/.*\.vercel\.app$/.test(origin); // any vercel deployment

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
  }),
);
app.all("/api/auth/*splat", toNodeHandler(auth));

// base route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    ok: true,
    message: "Server has created successfully",
  });
});

// medicine route
app.use("/api", medicineRouter);

// review route
app.use("/api", reviewRouter);

// order route
app.use("/api", orderRouter);

// user route
app.use("/api", userRouter);

// category route
app.use("/api", categoryRouter);

// handle errors
app.use(notFound);
app.use(errorHandler);

export default app;
