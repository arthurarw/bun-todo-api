import type { ITodoRepository } from "@/contracts/todo-repository";
import type { TodoEntity, TodoStatus } from "@/entities/todo-entity";
import { AppError } from "@/errors/app-error";
import { StatusCodes } from "http-status-codes";
import { v7 as uuidv7 } from "uuid";

export interface CreateTodoInput {
  userId: string;
  title: string;
  description?: string;
}

export class TodoService {
  constructor(private readonly todoRepository: ITodoRepository) { }

  create(input: CreateTodoInput): TodoEntity {
    return this.todoRepository.create({
      id: uuidv7(),
      user_id: input.userId,
      title: input.title,
      description: input.description ?? null
    });
  }

  listByUser(userId: string): TodoEntity[] {
    return this.todoRepository.findByUserId(userId);
  }

  updateStatus(id: string, userId: string, status: TodoStatus): TodoEntity {
    const todo = this.todoRepository.updateStatus(id, userId, status);
    if (!todo) {
      throw new AppError({
        statusCode: StatusCodes.NOT_FOUND,
        code: "TODO_NOT_FOUND",
        message: "Tarefa não encontrada."
      });
    }

    return todo;
  }

  delete(id: string, userId: string): void {
    const removed = this.todoRepository.deleteByIdAndUserId(id, userId);
    if (!removed) {
      throw new AppError({
        statusCode: StatusCodes.NOT_FOUND,
        code: "TODO_NOT_FOUND",
        message: "Tarefa não encontrada."
      });
    }
  }
}
