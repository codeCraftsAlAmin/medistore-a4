import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";
import notFound from "./middleware/notFound";
import errorHandler from "./middleware/errorHandler";
import { medicineRouter } from "./modules/medicine/medicine.routes";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(
  cors({
    origin: config.urls.frontend_url,
    credentials: true,
  }),
);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    ok: true,
    message: "Server has created successfully",
  });
});

// medicine route
app.use("/api", medicineRouter);

// handle errors
app.use(notFound);
app.use(errorHandler);

export default app;
