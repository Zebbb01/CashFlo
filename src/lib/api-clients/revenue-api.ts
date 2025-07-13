// src/lib/api-clients/revenue-api.ts
import { Revenue, CreateRevenuePayload, UpdateRevenuePayload } from "@/types";

const handleApiResponse = async (res: Response, errorMessage: string) => {
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || errorMessage);
  }
  return res.json();
};

// --- API Functions for Revenue ---

export const fetchRevenuesApi = async (): Promise<Revenue[]> => {
  const res = await fetch("/api/revenues");
  return handleApiResponse(res, "Failed to fetch revenues");
};

export const fetchRevenueApi = async (id: string): Promise<Revenue> => {
  const res = await fetch(`/api/revenues/${id}`);
  return handleApiResponse(res, "Failed to fetch revenue");
};

export const createRevenueApi = async (newRevenue: CreateRevenuePayload): Promise<Revenue> => {
  const res = await fetch("/api/revenues", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newRevenue),
  });
  return handleApiResponse(res, "Failed to create revenue");
};

export const updateRevenueApi = async ({ id, payload }: { id: string; payload: UpdateRevenuePayload }): Promise<Revenue> => {
  const res = await fetch(`/api/revenues/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleApiResponse(res, "Failed to update revenue");
};

export const deleteRevenueApi = async (id: string): Promise<{ message: string }> => {
  const res = await fetch(`/api/revenues/${id}`, { method: "DELETE" });
  return handleApiResponse(res, "Failed to delete revenue");
};