import { describe, expect, it, mock } from "bun:test";
import type { Request } from "express";
import { createMockResponse } from "../helpers/http-mocks";

const todoMock = {
  id: "todo-1",
  user_id: "user-1",
  title: "Nova tarefa",
  description: null,
  status: "pending",
  completed_at: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

const createExecute = mock(() => todoMock);

mock.module("@/factories/todo.factory", () => ({
  makeCreateTodoUseCase: () => ({ execute: createExecute }),
  makeListTodosUseCase: () => ({ execute: mock(() => [todoMock]) }),
  makeUpdateTodoStatusUseCase: () => ({ execute: mock(() => todoMock) }),
  makeDeleteTodoUseCase: () => ({ execute: mock(() => undefined) })
}));

const { TodoController } = await import("@/controllers/todo-controller");

describe("TodoController", () => {
  it("deve criar tarefa e retornar 201", () => {
    const controller = new TodoController();

    const request = {
      user: {
        id: "user-1",
        email: "john@doe.com",
        created_at: "",
        updated_at: ""
      },
      body: {
        title: "Nova tarefa"
      }
    } as unknown as Request;
    const response = createMockResponse();
    const next = mock(() => undefined);

    controller.create(request, response, next);

    expect(response.statusCode).toBe(201);
    expect(createExecute).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledTimes(0);
  });
});
