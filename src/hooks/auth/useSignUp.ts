import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { signUpUser } from "@/lib/services/auth.service" // Import the new service

export const useSignUp = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignUp = async (name: string, email: string, password: string, confirmPassword: string) => {
    setIsLoading(true); // Start loading for the entire process
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      // Step 1: Sign up the user
      await signUpUser(name, email, password);
      setSuccess("Account created successfully! Signing you in...");

      // Step 2: Auto sign in after a short delay (for UX)
      await new Promise(resolve => setTimeout(resolve, 1500)); // Wait for success message to be seen

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Account created but failed to sign in. Please try signing in manually.");
        setSuccess(""); // Clear success as auto-signin failed
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during sign-up.");
      console.error("Sign-up error:", err);
    } finally {
      setIsLoading(false); // End loading only after entire process
    }
  };

  return { handleSignUp, isLoading, error, success, setError, setSuccess };
}