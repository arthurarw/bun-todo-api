import type { ITodoRepository } from "@/contracts/todo-repository";
import type { TodoEntity } from "@/entities/todo-entity";
import { TodoService } from "@/services/todo-service";
import { describe, expect, it } from "bun:test";

describe("TodoService", () => {
  it("deve criar tarefa com status pending por padrão", () => {
    const repository: ITodoRepository = {
      create: (input) =>
        ({
          ...input,
          description: input.description ?? null,
          status: "pending",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }) as TodoEntity,
      findByUserId: () => [],
      updateStatus: () => null,
      deleteByIdAndUserId: () => false
    };

    const service = new TodoService(repository);
    const todo = service.create({ userId: "user-1", title: "Estudar Bun" });

    expect(todo.user_id).toBe("user-1");
    expect(todo.title).toBe("Estudar Bun");
    expect(todo.status).toBe("pending");
  });

  it("deve lançar erro quando tarefa não existir ao atualizar status", () => {
    const repository: ITodoRepository = {
      create: () => {
        throw new Error("Não utilizado");
      },
      findByUserId: () => [],
      updateStatus: () => null,
      deleteByIdAndUserId: () => false
    };

    const service = new TodoService(repository);

    expect(() => service.updateStatus("todo-1", "user-1", "completed")).toThrow("Tarefa não encontrada.");
  });
});
