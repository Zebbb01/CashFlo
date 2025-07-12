// src/types/payload/bank.ts

export interface CreateBankPayload {
  name: string;
}

export interface UpdateBankPayload {
  name?: string;
}