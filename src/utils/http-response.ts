export interface ApiSuccess<T> {
  data: T;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export function successResponse<T>(data: T): ApiSuccess<T> {
  return {
    data
  };
}
