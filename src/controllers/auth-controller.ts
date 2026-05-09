import { env } from "@/config/env";
import { makeLoginUserUseCase, makeLogoutUserUseCase, makeRegisterUseCase } from "@/factories/auth.factory";
import { successResponse } from "@/utils/http-response";
import { loginSchema, registerSchema } from "@/validations/auth-schemas";
import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export class AuthController {
  register = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const payload = registerSchema.parse(request.body);
      const useCase = makeRegisterUseCase();
      const result = await useCase.execute(payload);

      this.attachSessionCookie(response, result.token);
      response.status(StatusCodes.CREATED).json(successResponse(result.user));
    } catch (error) {
      next(error);
    }
  };

  login = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const payload = loginSchema.parse(request.body);
      const useCase = makeLoginUserUseCase();
      const result = await useCase.execute(payload);

      this.attachSessionCookie(response, result.token);
      response.status(StatusCodes.OK).json(successResponse(result.user));
    } catch (error) {
      next(error);
    }
  };

  logout = (request: Request, response: Response, next: NextFunction): void => {
    try {
      if (request.sessionToken) {
        const useCase = makeLogoutUserUseCase();
        useCase.execute(request.sessionToken);
      }

      response.clearCookie(env.COOKIE_NAME);
      response.status(StatusCodes.NO_CONTENT).json(successResponse(null));
    } catch (error) {
      next(error);
    }
  };

  me = (request: Request, response: Response): void => {
    response.status(StatusCodes.OK).json(successResponse(request.user));
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
