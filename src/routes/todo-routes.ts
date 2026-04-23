import type { TodoController } from "@/controllers/todo-controller";
import { createAuthMiddleware } from "@/middlewares/auth-middleware";
import type { AuthService } from "@/services/auth-service";
import { Router } from "express";

export function createTodoRoutes(todoController: TodoController, authService: AuthService): Router {
  const router = Router();
  const authMiddleware = createAuthMiddleware(authService);

  router.use(authMiddleware);
  router.post("/", todoController.create);
  router.get("/", todoController.list);
  router.patch("/:id/status", todoController.updateStatus);
  router.delete("/:id", todoController.delete);

  return router;
}
