import { AuthController } from "@/controllers/auth-controller";
import { TodoController } from "@/controllers/todo-controller";
import { getDatabase } from "@/database/sqlite";
import { errorMiddleware } from "@/middlewares/error-middleware";
import { SqliteSessionRepository } from "@/repositories/sqlite-session-repository";
import { SqliteTodoRepository } from "@/repositories/sqlite-todo-repository";
import { SqliteUserRepository } from "@/repositories/sqlite-user-repository";
import { createIndexRoutes } from "@/routes/index-routes";
import { AuthService } from "@/services/auth-service";
import { TodoService } from "@/services/todo-service";
import cookieParser from "cookie-parser";
import express from "express";

export function createApp() {
  const app = express();
  const database = getDatabase();

  const userRepository = new SqliteUserRepository(database);
  const sessionRepository = new SqliteSessionRepository(database);
  const todoRepository = new SqliteTodoRepository(database);

  const authService = new AuthService(userRepository, sessionRepository);
  const todoService = new TodoService(todoRepository);

  const authController = new AuthController(authService);
  const todoController = new TodoController(todoService);

  app.use(express.json());
  app.use(cookieParser());
  app.use("/api/v1", createIndexRoutes(authController, todoController, authService));
  app.use(errorMiddleware);

  return app;
}
