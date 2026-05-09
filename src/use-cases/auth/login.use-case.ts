import type { ISessionRepository } from "@/contracts/session-repository";
import type { IUserRepository } from "@/contracts/user-repository";
import { AppError } from "@/errors/app-error";
import { StatusCodes } from "http-status-codes";
import { type AuthSessionOutput, createSession } from "./session.helper";

export interface LoginInput {
  email: string;
  password: string;
}

export class LoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly sessionRepository: ISessionRepository
  ) {}

  async execute(input: LoginInput): Promise<AuthSessionOutput> {
    const user = this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new AppError({
        statusCode: StatusCodes.UNAUTHORIZED,
        code: "INVALID_CREDENTIALS",
        message: "E-mail ou senha inválidos."
      });
    }

    const isValidPassword = await Bun.password.verify(input.password, user.password_hash);
    if (!isValidPassword) {
      throw new AppError({
        statusCode: StatusCodes.UNAUTHORIZED,
        code: "INVALID_CREDENTIALS",
        message: "E-mail ou senha inválidos."
      });
    }

    return createSession(this.sessionRepository, user);
  }
}
