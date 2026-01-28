import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";

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

export default app;
