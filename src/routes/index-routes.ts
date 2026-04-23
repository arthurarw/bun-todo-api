import type { AuthController } from "@/controllers/auth-controller";
import type { TodoController } from "@/controllers/todo-controller";
import { createAuthRoutes } from "@/routes/auth-routes";
import { createTodoRoutes } from "@/routes/todo-routes";
import type { AuthService } from "@/services/auth-service";
import { Router } from "express";
import { StatusCodes } from "http-status-codes";

export function createIndexRoutes(
  authController: AuthController,
  todoController: TodoController,
  authService: AuthService
): Router {
  const router = Router();

  router.get("/health", (_request, response) => {
    response.status(StatusCodes.OK).json({
      data: {
        status: "ok"
      }
    });
  });

  router.use("/auth", createAuthRoutes(authController, authService));
  router.use("/todos", createTodoRoutes(todoController, authService));

  return router;
}
