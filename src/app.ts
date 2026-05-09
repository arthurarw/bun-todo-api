import { errorMiddleware } from "@/middlewares/error-middleware";
import { createIndexRoutes } from "@/routes/index-routes";
import cookieParser from "cookie-parser";
import express from "express";

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());
  app.use("/api/v1", createIndexRoutes());
  app.use(errorMiddleware);

  return app;
}
