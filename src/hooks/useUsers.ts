// src/hooks/useUsers.ts
import { useQuery } from "@tanstack/react-query";
import { User } from "@/types"; // Assuming your User type is defined here

const USERS_QUERY_KEY = "users";

// API function to fetch all users
const fetchUsers = async (): Promise<User[]> => {
  const res = await fetch("/api/users"); // Assuming you have an API endpoint for fetching users
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to fetch users");
  }
  return res.json();
};

// Custom hook to use in components
export const useUsers = () => {
  return useQuery<User[], Error>({
    queryKey: [USERS_QUERY_KEY],
    queryFn: fetchUsers,
  });
};
