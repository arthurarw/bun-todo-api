export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export function successResponse<T>(message: string, data: T): ApiSuccess<T> {
  return {
    success: true,
    message,
    data
  };
}
