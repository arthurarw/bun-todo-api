import { AuthController } from "@/controllers/auth-controller";
import type { AuthService } from "@/services/auth-service";
import { describe, expect, it, mock } from "bun:test";
import type { Request } from "express";
import { createMockResponse } from "../helpers/http-mocks";

describe("AuthController", () => {
  it("deve efetuar login e setar cookie", async () => {
    const authService = {
      login: mock(async () => ({
        token: "session-token",
        user: {
          id: "user-1",
          email: "john@doe.com",
          created_at: "",
          updated_at: ""
        }
      }))
    } as unknown as AuthService;

    const controller = new AuthController(authService);
    const request = {
      body: {
        email: "john@doe.com",
        password: "12345678"
      }
    } as unknown as Request;
    const response = createMockResponse();
    const next = mock(() => undefined);

    await controller.login(request, response, next);

    expect(response.statusCode).toBe(200);
    expect(response.cookieCalls?.length).toBe(1);
    expect(next).toHaveBeenCalledTimes(0);
  });
});
