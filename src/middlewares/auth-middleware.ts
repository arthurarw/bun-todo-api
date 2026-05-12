import { env } from "@/config/env";
import { AppError } from "@/errors/app-error";
import { makeGetSessionUserUseCase } from "@/factories/auth.factory";
import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export async function authMiddleware(request: Request, _response: Response, next: NextFunction): Promise<void> {
  try {
    const token = request.cookies[env.COOKIE_NAME] as string | undefined;
    if (!token) {
      throw new AppError({
        statusCode: StatusCodes.UNAUTHORIZED,
        code: "UNAUTHORIZED",
        message: "Autenticação necessária."
      });
    }

    const useCase = makeGetSessionUserUseCase();
    const user = await useCase.execute(token);
    request.user = user;
    request.sessionToken = token;

    next();
  } catch (error) {
    next(error);
  }
}
