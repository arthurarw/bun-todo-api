import type { ITodoRepository } from "@/contracts/todo-repository";
import { AppError } from "@/errors/app-error";
import { StatusCodes } from "http-status-codes";

export class DeleteTodoUseCase {
  constructor(private readonly todoRepository: ITodoRepository) {}

  execute(id: string, userId: string): void {
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
