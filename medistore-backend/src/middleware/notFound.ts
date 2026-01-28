import { Request, Response } from "express";

export default function notFound(req: Request, res: Response) {
  res.status(404).json({
    ok: false,
    message: "Router not found",
    path: req.path,
    date: Date(),
  });
}
