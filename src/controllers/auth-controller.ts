import { env } from "@/config/env";
import type { AuthService } from "@/services/auth-service";
import { successResponse } from "@/utils/http-response";
import { loginSchema, registerSchema } from "@/validations/auth-schemas";
import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export class AuthController {
  constructor(private readonly authService: AuthService) { }

  register = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const payload = registerSchema.parse(request.body);
      const result = await this.authService.register(payload);

      this.attachSessionCookie(response, result.token);
      response.status(StatusCodes.CREATED).json(successResponse("Usuário registrado com sucesso.", { user: result.user }));
    } catch (error) {
      next(error);
    }
  };

  login = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const payload = loginSchema.parse(request.body);
      const result = await this.authService.login(payload);

      this.attachSessionCookie(response, result.token);
      response.status(200).json(successResponse("Login efetuado com sucesso.", { user: result.user }));
    } catch (error) {
      next(error);
    }
  };

  logout = (request: Request, response: Response, next: NextFunction): void => {
    try {
      if (request.sessionToken) {
        this.authService.logout(request.sessionToken);
      }

      response.clearCookie(env.COOKIE_NAME);
      response.status(StatusCodes.OK).json(successResponse("Logout efetuado com sucesso.", null));
    } catch (error) {
      next(error);
    }
  };

  me = (request: Request, response: Response): void => {
    response.status(StatusCodes.OK).json(successResponse("Usuário autenticado.", { user: request.user }));
  };

  private attachSessionCookie(response: Response, token: string): void {
    response.cookie(env.COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: env.NODE_ENV === "production",
      maxAge: env.SESSION_TTL_HOURS * 60 * 60 * 1000
    });
  }
}
