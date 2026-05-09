import type { ISessionRepository } from "@/contracts/session-repository";
import type { IUserRepository } from "@/contracts/user-repository";
import type { SessionEntity } from "@/entities/session-entity";
import type { UserEntity } from "@/entities/user-entity";
import { RegisterUseCase } from "@/use-cases/auth/register.use-case";
import { describe, expect, it } from "bun:test";

describe("RegisterUseCase", () => {
  it("deve impedir registro de e-mail duplicado", async () => {
    const existingUser: UserEntity = {
      id: "user-1",
      email: "john@doe.com",
      password_hash: "hash",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const userRepository: IUserRepository = {
      create: () => existingUser,
      findByEmail: () => existingUser,
      findById: () => existingUser
    };

    const sessionRepository: ISessionRepository = {
      create: (input) =>
        ({
          ...input,
          created_at: new Date().toISOString()
        }) as SessionEntity,
      findByToken: () => null,
      deleteByToken: () => undefined
    };

    const useCase = new RegisterUseCase(userRepository, sessionRepository);

    await expect(useCase.execute({ email: "john@doe.com", password: "12345678" })).rejects.toThrow(
      "Já existe uma conta com este e-mail."
    );
  });
});
