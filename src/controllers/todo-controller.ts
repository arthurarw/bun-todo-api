import { AppError } from "@/errors/app-error";
import { makeCreateTodoUseCase, makeDeleteTodoUseCase, makeListTodosUseCase, makeUpdateTodoStatusUseCase } from "@/factories/todo.factory";
import { successResponse } from "@/utils/http-response";
import { createTodoSchema, findByIdSchema, updateTodoStatusSchema } from "@/validations/todo-schemas";
import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export class TodoController {
  create = (request: Request, response: Response, next: NextFunction): void => {
    try {
      const user = this.requireUser(request);
      const payload = createTodoSchema.parse(request.body);
      const useCase = makeCreateTodoUseCase();

      const todo = useCase.execute({
        userId: user.id,
        title: payload.title,
        description: payload.description
      });

      response.status(StatusCodes.CREATED).json(successResponse(todo));
    } catch (error) {
      next(error);
    }
  };

  list = (request: Request, response: Response, next: NextFunction): void => {
    try {
      const user = this.requireUser(request);
      const useCase = makeListTodosUseCase();
      const todos = useCase.execute(user.id);
      response.status(StatusCodes.OK).json(successResponse(todos));
    } catch (error) {
      next(error);
    }
  };

  updateStatus = (request: Request, response: Response, next: NextFunction): void => {
    try {
      const user = this.requireUser(request);
      const { id } = findByIdSchema.parse(request.params);
      const payload = updateTodoStatusSchema.parse(request.body);
      const useCase = makeUpdateTodoStatusUseCase();
      const todo = useCase.execute(id, user.id, payload.status);
      response.status(StatusCodes.OK).json(successResponse(todo));
    } catch (error) {
      next(error);
    }
  };

  delete = (request: Request, response: Response, next: NextFunction): void => {
    try {
      const user = this.requireUser(request);
      const { id } = findByIdSchema.parse(request.params);

      const useCase = makeDeleteTodoUseCase();
      useCase.execute(id, user.id);
      response.status(StatusCodes.OK).json(successResponse(null));
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
