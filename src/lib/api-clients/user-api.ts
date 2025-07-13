// src/lib/api-clients/user-api.ts
import { User } from "@/types"; // Assuming your User type is defined here

// Helper function for consistent API response handling
const handleApiResponse = async (res: Response, errorMessage: string) => {
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || errorMessage);
  }
  return res.json();
};

export const fetchUsersApi = async (): Promise<User[]> => {
  const res = await fetch("/api/users"); // Assuming you have an API endpoint for fetching users
  return handleApiResponse(res, "Failed to fetch users");
};

// Add other user-related API functions here as needed (e.g., fetchUserById, updateUserApi)
// export const fetchUserByIdApi = async (id: string): Promise<User> => {
//   const res = await fetch(`/api/users/${id}`);
//   return handleApiResponse(res, "Failed to fetch user by ID");
// };