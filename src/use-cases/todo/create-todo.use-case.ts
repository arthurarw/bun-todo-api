import type { ITodoRepository } from "@/contracts/todo-repository";
import type { TodoEntity } from "@/entities/todo-entity";
import { v7 as uuidv7 } from "uuid";

export interface CreateTodoInput {
  userId: string;
  title: string;
  description?: string;
}

export class CreateTodoUseCase {
  constructor(private readonly todoRepository: ITodoRepository) {}

  execute(input: CreateTodoInput): TodoEntity {
    return this.todoRepository.create({
      id: uuidv7(),
      user_id: input.userId,
      title: input.title,
      description: input.description ?? null
    });
  }
}
