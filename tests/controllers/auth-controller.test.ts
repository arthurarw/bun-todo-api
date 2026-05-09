import { describe, expect, it, mock } from "bun:test";
import type { Request } from "express";
import { createMockResponse } from "../helpers/http-mocks";

const loginExecute = mock(async () => ({
  token: "session-token",
  user: {
    id: "user-1",
    email: "john@doe.com",
    created_at: "",
    updated_at: ""
  }
}));

mock.module("@/factories/auth.factory", () => ({
  makeRegisterUseCase: () => ({ execute: mock(async () => ({ token: "", user: {} })) }),
  makeLoginUserUseCase: () => ({ execute: loginExecute }),
  makeLogoutUserUseCase: () => ({ execute: mock(() => undefined) }),
  makeGetSessionUserUseCase: () => ({ execute: mock(async () => null) })
}));

const { AuthController } = await import("@/controllers/auth-controller");

describe("AuthController", () => {
  it("deve efetuar login e setar cookie", async () => {
    const controller = new AuthController();

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
    expect(loginExecute).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledTimes(0);
  });
});
