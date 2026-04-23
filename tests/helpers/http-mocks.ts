import type { Response } from "express";

export interface MockResponse extends Partial<Response> {
  statusCode?: number;
  body?: unknown;
  cookieCalls?: Array<{ name: string; value: string; options?: unknown }>;
  clearCookieCalls?: string[];
}

export function createMockResponse(): Response & MockResponse {
  const response: MockResponse = {
    cookieCalls: [],
    clearCookieCalls: []
  };

  response.status = ((code: number) => {
    response.statusCode = code;
    return response as Response;
  }) as Response["status"];

  response.json = ((payload: unknown) => {
    response.body = payload;
    return response as Response;
  }) as Response["json"];

  response.cookie = ((name: string, value: string, options?: unknown) => {
    response.cookieCalls?.push({ name, value, options });
    return response as Response;
  }) as Response["cookie"];

  response.clearCookie = ((name: string) => {
    response.clearCookieCalls?.push(name);
    return response as Response;
  }) as Response["clearCookie"];

  return response as Response & MockResponse;
}
