import type { ITodoRepository } from "@/contracts/todo-repository";
import type { TodoEntity } from "@/entities/todo-entity";

export class ListTodosUseCase {
  constructor(private readonly todoRepository: ITodoRepository) {}

  execute(userId: string): TodoEntity[] {
    return this.todoRepository.findByUserId(userId);
  }
}
