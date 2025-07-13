// src/hooks/auth/useUsers.ts
import { useQuery } from "@tanstack/react-query";
import { User } from "@/types";
import { fetchUsersApi } from "@/lib/api-clients/user-api"; // Import the API function

const USERS_QUERY_KEY = "users";

export const useUsers = () => {
  return useQuery<User[], Error>({
    queryKey: [USERS_QUERY_KEY],
    queryFn: fetchUsersApi, // Use the imported API function
  });
};