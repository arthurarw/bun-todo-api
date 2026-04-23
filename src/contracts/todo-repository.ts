import type { TodoEntity, TodoStatus } from "@/entities/todo-entity";

export interface CreateTodoInput {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
}

export interface ITodoRepository {
  create(input: CreateTodoInput): TodoEntity;
  findByUserId(userId: string): TodoEntity[];
  updateStatus(id: string, userId: string, status: TodoStatus): TodoEntity | null;
  deleteByIdAndUserId(id: string, userId: string): boolean;
  findById(id: string, userId: string): TodoEntity | null;
}
