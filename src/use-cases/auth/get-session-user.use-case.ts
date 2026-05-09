import type { ISessionRepository } from "@/contracts/session-repository";
import type { IUserRepository } from "@/contracts/user-repository";
import { AppError } from "@/errors/app-error";
import { StatusCodes } from "http-status-codes";
import { type PublicUser, toPublicUser } from "./session.helper";

export class GetSessionUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly sessionRepository: ISessionRepository
  ) { }

  execute(sessionToken: string): PublicUser {
    const session = this.sessionRepository.findByToken(sessionToken);
    if (!session) {
      throw new AppError({
        statusCode: StatusCodes.UNAUTHORIZED,
        code: "UNAUTHORIZED",
        message: "Sessão inválida."
      });
    }

    if (new Date(session.expires_at).getTime() <= Date.now()) {
      this.sessionRepository.deleteByToken(sessionToken);
      throw new AppError({
        statusCode: StatusCodes.UNAUTHORIZED,
        code: "SESSION_EXPIRED",
        message: "Sessão expirada."
      });
    }

    const user = this.userRepository.findById(session.user_id);
    if (!user) {
      throw new AppError({
        statusCode: StatusCodes.UNAUTHORIZED,
        code: "UNAUTHORIZED",
        message: "Usuário da sessão não encontrado."
      });
    }

    return toPublicUser(user);
  }
}
