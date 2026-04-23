import { env } from "@/config/env";
import { AppError } from "@/errors/app-error";
import type { AuthService } from "@/services/auth-service";
import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export function createAuthMiddleware(authService: AuthService) {
  return function authMiddleware(request: Request, _response: Response, next: NextFunction): void {
    const token = request.cookies[env.COOKIE_NAME] as string | undefined;
    if (!token) {
      throw new AppError({
        statusCode: StatusCodes.UNAUTHORIZED,
        code: "UNAUTHORIZED",
        message: "Autenticação necessária."
      });
    }

    const user = authService.getUserBySessionToken(token);
    request.user = user;
    request.sessionToken = token;

    next();
  };
}
