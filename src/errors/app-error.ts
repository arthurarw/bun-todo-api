export interface AppErrorOptions {
  statusCode: number;
  code: string;
  message: string;
  details?: unknown;
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(options: AppErrorOptions) {
    super(options.message);
    this.statusCode = options.statusCode;
    this.code = options.code;
    this.details = options.details;
  }
}
