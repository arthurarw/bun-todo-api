import type { ITodoRepository } from "@/contracts/todo-repository";
import { TodoStatusEnum, type TodoEntity, type TodoStatus } from "@/entities/todo-entity";
import { AppError } from "@/errors/app-error";
import { StatusCodes } from "http-status-codes";

export class UpdateTodoStatusUseCase {
  constructor(private readonly todoRepository: ITodoRepository) {}

  execute(id: string, userId: string, status: TodoStatus): TodoEntity {
    const todo = this.todoRepository.findById(id, userId);
    if (!todo) {
      throw new AppError({
        statusCode: StatusCodes.NOT_FOUND,
        code: "TODO_NOT_FOUND",
        message: "Tarefa não encontrada."
      });
    }

    if (todo.status === TodoStatusEnum.Completed) {
      throw new AppError({
        statusCode: StatusCodes.BAD_REQUEST,
        code: "TODO_COMPLETED",
        message: "Tarefa já foi concluída."
      });
    }

    const updated = this.todoRepository.updateStatus(id, userId, status);
    if (!updated) {
      throw new AppError({
        statusCode: StatusCodes.NOT_FOUND,
        code: "TODO_NOT_FOUND",
        message: "Tarefa não encontrada."
      });
    }

    return updated;
  }
}
