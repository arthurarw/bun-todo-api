import { env } from "@/config/env";
import type { ISessionRepository } from "@/contracts/session-repository";
import type { IUserRepository } from "@/contracts/user-repository";
import type { UserEntity } from "@/entities/user-entity";
import { AppError } from "@/errors/app-error";
import { StatusCodes } from "http-status-codes";
import { v7 as uuidv7 } from "uuid";

export interface RegisterInput {
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthSessionOutput {
  token: string;
  user: Pick<UserEntity, "id" | "email" | "created_at" | "updated_at">;
}

export class AuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly sessionRepository: ISessionRepository
  ) { }

  async register(input: RegisterInput): Promise<AuthSessionOutput> {
    const existingUser = this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new AppError({
        statusCode: StatusCodes.CONFLICT,
        code: "USER_ALREADY_EXISTS",
        message: "Já existe uma conta com este e-mail."
      });
    }

    const passwordHash = await Bun.password.hash(input.password);
    const createdUser = this.userRepository.create({
      id: uuidv7(),
      email: input.email,
      password_hash: passwordHash
    });

    return this.createSessionForUser(createdUser);
  }

  async login(input: LoginInput): Promise<AuthSessionOutput> {
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

    return this.createSessionForUser(user);
  }

  logout(sessionToken: string): void {
    this.sessionRepository.deleteByToken(sessionToken);
  }

  getUserBySessionToken(sessionToken: string): Pick<UserEntity, "id" | "email" | "created_at" | "updated_at"> {
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

    return this.toPublicUser(user);
  }

  private createSessionForUser(user: UserEntity): AuthSessionOutput {
    const token = uuidv7();
    const expiresAt = new Date(Date.now() + env.SESSION_TTL_HOURS * 60 * 60 * 1000).toISOString();

    this.sessionRepository.create({
      id: uuidv7(),
      user_id: user.id,
      token,
      expires_at: expiresAt
    });

    return {
      token,
      user: this.toPublicUser(user)
    };
  }

  private toPublicUser(user: UserEntity): Pick<UserEntity, "id" | "email" | "created_at" | "updated_at"> {
    return {
      id: user.id,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at
    };
  }
}
