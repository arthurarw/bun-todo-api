import { createAuthRoutes } from "@/routes/auth-routes";
import { createTodoRoutes } from "@/routes/todo-routes";
import { Router } from "express";
import { StatusCodes } from "http-status-codes";

export function createIndexRoutes(): Router {
  const router = Router();

  router.get("/health", (_request, response) => {
    response.status(StatusCodes.OK).json({
      data: {
        status: "ok"
      }
    });
  });

  router.use("/auth", createAuthRoutes());
  router.use("/todos", createTodoRoutes());

  return router;
}
