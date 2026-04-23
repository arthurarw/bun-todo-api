import { AppError } from "@/errors/app-error";
import type { TodoService } from "@/services/todo-service";
import { successResponse } from "@/utils/http-response";
import { createTodoSchema, updateTodoStatusSchema } from "@/validations/todo-schemas";
import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export class TodoController {
  constructor(private readonly todoService: TodoService) { }

  create = (request: Request, response: Response, next: NextFunction): void => {
    try {
      const user = this.requireUser(request);
      const payload = createTodoSchema.parse(request.body);

      const todo = this.todoService.create({
        userId: user.id,
        title: payload.title,
        description: payload.description
      });

      response.status(201).json(successResponse("Tarefa criada com sucesso.", { todo }));
    } catch (error) {
      next(error);
    }
  };

  list = (request: Request, response: Response, next: NextFunction): void => {
    try {
      const user = this.requireUser(request);
      const todos = this.todoService.listByUser(user.id);
      response.status(200).json(successResponse("Tarefas listadas com sucesso.", { todos }));
    } catch (error) {
      next(error);
    }
  };

  updateStatus = (request: Request, response: Response, next: NextFunction): void => {
    try {
      const user = this.requireUser(request);
      const params = request.params as { id?: string };
      if (!params.id) {
        throw new AppError({
          statusCode: StatusCodes.BAD_REQUEST,
          code: "TODO_ID_REQUIRED",
          message: "ID da tarefa é obrigatório."
        });
      }

      const payload = updateTodoStatusSchema.parse(request.body);
      const todo = this.todoService.updateStatus(params.id, user.id, payload.status);
      response.status(200).json(successResponse("Status da tarefa atualizado com sucesso.", { todo }));
    } catch (error) {
      next(error);
    }
  };

  delete = (request: Request, response: Response, next: NextFunction): void => {
    try {
      const user = this.requireUser(request);
      const params = request.params as { id?: string };
      if (!params.id) {
        throw new AppError({
          statusCode: StatusCodes.BAD_REQUEST,
          code: "TODO_ID_REQUIRED",
          message: "ID da tarefa é obrigatório."
        });
      }

      this.todoService.delete(params.id, user.id);
      response.status(200).json(successResponse("Tarefa removida com sucesso.", null));
    } catch (error) {
      next(error);
    }
  };

  private requireUser(request: Request): NonNullable<Request["user"]> {
    if (!request.user) {
      throw new AppError({
        statusCode: StatusCodes.UNAUTHORIZED,
        code: "UNAUTHORIZED",
        message: "Autenticação necessária."
      });
    }

    return request.user;
  }
}
