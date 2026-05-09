import type { ITodoRepository } from "@/contracts/todo-repository";
import type { TodoEntity } from "@/entities/todo-entity";
import { CreateTodoUseCase } from "@/use-cases/todo/create-todo.use-case";
import { UpdateTodoStatusUseCase } from "@/use-cases/todo/update-todo-status.use-case";
import { describe, expect, it } from "bun:test";

describe("CreateTodoUseCase", () => {
  it("deve criar tarefa com status pending por padrão", () => {
    const repository: ITodoRepository = {
      create: (input) =>
        ({
          ...input,
          description: input.description ?? null,
          status: "pending",
          completed_at: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }) as TodoEntity,
      findByUserId: () => [],
      updateStatus: () => null,
      deleteByIdAndUserId: () => false,
      findById: () => null
    };

    const useCase = new CreateTodoUseCase(repository);
    const todo = useCase.execute({ userId: "user-1", title: "Estudar Bun" });

    expect(todo.user_id).toBe("user-1");
    expect(todo.title).toBe("Estudar Bun");
    expect(todo.status).toBe("pending");
  });
});

describe("UpdateTodoStatusUseCase", () => {
  it("deve lançar erro quando tarefa não existir ao atualizar status", () => {
    const repository: ITodoRepository = {
      create: () => {
        throw new Error("Não utilizado");
      },
      findByUserId: () => [],
      updateStatus: () => null,
      deleteByIdAndUserId: () => false,
      findById: () => null
    };

    const useCase = new UpdateTodoStatusUseCase(repository);

    expect(() => useCase.execute("todo-1", "user-1", "completed")).toThrow("Tarefa não encontrada.");
  });
});
