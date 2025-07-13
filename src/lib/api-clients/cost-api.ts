// src/lib/api-clients/cost-api.ts
import { Cost, CreateCostPayload, UpdateCostPayload } from "@/types";

const handleApiResponse = async (res: Response, errorMessage: string) => {
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || errorMessage);
  }
  return res.json();
};

// --- API Functions for Cost ---

export const fetchCostsApi = async (): Promise<Cost[]> => {
  const res = await fetch("/api/costs");
  return handleApiResponse(res, "Failed to fetch costs");
};

export const fetchCostApi = async (id: string): Promise<Cost> => {
  const res = await fetch(`/api/costs/${id}`);
  return handleApiResponse(res, "Failed to fetch cost");
};

export const createCostApi = async (newCost: CreateCostPayload): Promise<Cost> => {
  const res = await fetch("/api/costs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newCost),
  });
  return handleApiResponse(res, "Failed to create cost");
};

export const updateCostApi = async ({ id, payload }: { id: string; payload: UpdateCostPayload }): Promise<Cost> => {
  const res = await fetch(`/api/costs/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleApiResponse(res, "Failed to update cost");
};

export const deleteCostApi = async (id: string): Promise<{ message: string }> => {
  const res = await fetch(`/api/costs/${id}`, { method: "DELETE" });
  return handleApiResponse(res, "Failed to delete cost");
};