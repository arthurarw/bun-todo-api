import type { CreateTodoInput, ITodoRepository } from "@/contracts/todo-repository";
import { TodoStatusEnum, type TodoEntity, type TodoStatus } from "@/entities/todo-entity";
import type { Database } from "bun:sqlite";

export class SqliteTodoRepository implements ITodoRepository {
  constructor(private readonly database: Database) { }

  create(input: CreateTodoInput): TodoEntity {
    const now = new Date().toISOString();
    this.database
      .query(
        `
        INSERT INTO todos (id, user_id, title, description, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, 'pending', ?, ?)
      `
      )
      .run(input.id, input.user_id, input.title, input.description, now, now);

    const todo = this.database
      .query(
        "SELECT id, user_id, title, description, status, created_at, updated_at FROM todos WHERE id = ?"
      )
      .get(input.id) as TodoEntity | null;

    if (!todo) {
      throw new Error("Falha ao criar tarefa.");
    }

    return todo;
  }

  findByUserId(userId: string): TodoEntity[] {
    return this.database
      .query(
        `
        SELECT id, user_id, title, description, status, created_at, updated_at, completed_at
        FROM todos
        WHERE user_id = ?
        ORDER BY created_at DESC
      `
      )
      .all(userId) as TodoEntity[];
  }


  findById(id: string, userId: string): TodoEntity | null {
    return this.database
      .query(
        `
        SELECT id, user_id, title, description, status, created_at, updated_at, completed_at
        FROM todos
        WHERE id = ? AND user_id = ?
      `
      )
      .get(id, userId) as TodoEntity | null;
  }

  updateStatus(id: string, userId: string, status: TodoStatus): TodoEntity | null {
    const now = new Date().toISOString();
    const completedAt = status === TodoStatusEnum.Completed ? now : null;

    this.database
      .query("UPDATE todos SET status = ?, updated_at = ?, completed_at = ? WHERE id = ? AND user_id = ?")
      .run(status, now, completedAt, id, userId);

    const todo = this.database
      .query(
        `
        SELECT id, user_id, title, description, status, created_at, updated_at, completed_at
        FROM todos
        WHERE id = ? AND user_id = ?
      `
      )
      .get(id, userId) as TodoEntity | null;

    return todo ?? null;
  }

  deleteByIdAndUserId(id: string, userId: string): boolean {
    const result = this.database.query("DELETE FROM todos WHERE id = ? AND user_id = ?").run(id, userId) as {
      changes?: number;
    };

    return (result.changes ?? 0) > 0;
  }
}
