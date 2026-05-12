import type { ISessionRepository } from "@/contracts/session-repository";
import type { IUserRepository } from "@/contracts/user-repository";
import { AppError } from "@/errors/app-error";
import { StatusCodes } from "http-status-codes";
import { v7 as uuidv7 } from "uuid";
import { type AuthSessionOutput, createSession } from "./session.helper";

export interface RegisterInput {
  email: string;
  password: string;
}

export class RegisterUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly sessionRepository: ISessionRepository
  ) {}

  async execute(input: RegisterInput): Promise<AuthSessionOutput> {
    const existingUser = this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new AppError({
        statusCode: StatusCodes.CONFLICT,
        code: "USER_ALREADY_EXISTS",
        message: "Já existe uma conta com este e-mail."
      });
    }

    const passwordHash = await Bun.password.hash(input.password);
    const user = this.userRepository.create({
      id: uuidv7(),
      email: input.email,
      password_hash: passwordHash
    });

    return await createSession(this.sessionRepository, user);
  }
}
