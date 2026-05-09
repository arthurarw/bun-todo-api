import { TodoController } from "@/controllers/todo-controller";
import { authMiddleware } from "@/middlewares/auth-middleware";
import { Router } from "express";

export function createTodoRoutes(): Router {
  const router = Router();
  const todoController = new TodoController();

  router.use(authMiddleware);
  router.post("/", todoController.create);
  router.get("/", todoController.list);
  router.patch("/:id/status", todoController.updateStatus);
  router.delete("/:id", todoController.delete);

  return router;
}
