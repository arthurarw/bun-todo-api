import type { ISessionRepository } from "@/contracts/session-repository";
import type { IUserRepository } from "@/contracts/user-repository";
import { AppError } from "@/errors/app-error";
import { StatusCodes } from "http-status-codes";
import { verifyJwt } from "../../utils/jwt.helper";
import { type PublicUser, toPublicUser } from "./session.helper";

export class GetSessionUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly sessionRepository: ISessionRepository
  ) { }

  async execute(sessionToken: string): Promise<PublicUser> {
    let userId: string;

    try {
      const payload = await verifyJwt(sessionToken);
      userId = payload.sub;
    } catch {
      throw new AppError({
        statusCode: StatusCodes.UNAUTHORIZED,
        code: "UNAUTHORIZED",
        message: "Token inválido."
      });
    }

    const session = this.sessionRepository.findByToken(sessionToken);
    if (!session) {
      throw new AppError({
        statusCode: StatusCodes.UNAUTHORIZED,
        code: "UNAUTHORIZED",
        message: "Sessão inválida ou revogada."
      });
    }

    const user = this.userRepository.findById(userId);
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
