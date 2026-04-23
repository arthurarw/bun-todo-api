import { TodoController } from "@/controllers/todo-controller";
import type { TodoService } from "@/services/todo-service";
import { describe, expect, it, mock } from "bun:test";
import type { Request } from "express";
import { createMockResponse } from "../helpers/http-mocks";

describe("TodoController", () => {
  it("deve criar tarefa e retornar 201", () => {
    const todoService = {
      create: mock(() => ({
        id: "todo-1",
        user_id: "user-1",
        title: "Nova tarefa",
        description: null,
        status: "pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }))
    } as unknown as TodoService;

    const controller = new TodoController(todoService);
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
    expect(next).toHaveBeenCalledTimes(0);
  });
});
