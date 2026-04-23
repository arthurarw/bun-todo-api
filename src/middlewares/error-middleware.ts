import { AppError } from "@/errors/app-error";
import type { ApiError } from "@/utils/http-response";
import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";

export function errorMiddleware(
  error: unknown,
  _request: Request,
  response: Response<ApiError>,
  _next: NextFunction
): Response<ApiError> {
  if (error instanceof ZodError) {
    return response.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Dados de entrada inválidos.",
        details: error.issues
      }
    });
  }

  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details
      }
    });
  }

  return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Erro interno do servidor."
    }
  });
}
