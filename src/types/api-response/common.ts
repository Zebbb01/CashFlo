// src/types/api-response/common.ts

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  status: number;
  error?: string;
}

export interface ErrorResponse {
  message: string;
}