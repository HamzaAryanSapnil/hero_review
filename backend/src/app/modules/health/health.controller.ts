import type { Request, Response } from "express";

const health = (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    uptime: Number(process.uptime().toFixed(2)),
    timestamp: new Date().toISOString(),
  });
};

export const HealthController = {
  health,
};
