// src/hooks/useAppMutation.ts
import { useMutation, useQueryClient, UseMutationOptions, QueryKey } from "@tanstack/react-query";

/**
 * A generic custom hook for TanStack Query mutations with built-in invalidation capabilities.
 * @template TData The type of the data returned by the mutation.
 * @template TError The type of the error thrown by the mutation.
 * @template TVariables The type of the variables passed to the mutation function.
 * @template TContext The type of the context for the mutation.
 * @param options Options for the useMutation hook, extended with `invalidateKeysOnSuccess`.
 */
interface AppMutationOptions<TData, TError, TVariables, TContext> extends UseMutationOptions<TData, TError, TVariables, TContext> {
  /**
   * An array of QueryKeys to invalidate on successful mutation.
   * These keys will be invalidated *before* any custom `onSuccess` callback is run.
   */
  invalidateKeysOnSuccess?: QueryKey[];
}

export const useAppMutation = <TData = unknown, TError = unknown, TVariables = void, TContext = unknown>(
  options?: AppMutationOptions<TData, TError, TVariables, TContext>
) => {
  const queryClient = useQueryClient();

  // Store the original onSuccess callback to call it after invalidation
  const originalOnSuccess = options?.onSuccess;

  return useMutation({
    ...options,
    onSuccess: (data, variables, context) => {
      // Invalidate specified queries
      if (options?.invalidateKeysOnSuccess) {
        options.invalidateKeysOnSuccess.forEach(key => queryClient.invalidateQueries({ queryKey: key }));
      }
      // Call the original onSuccess callback
      originalOnSuccess?.(data, variables, context);
    },
  });
};