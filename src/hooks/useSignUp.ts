import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { signUpUser } from "@/services/auth.service" // Import the new service

export const useSignUp = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSignUp = async (name: string, email: string, password: string, confirmPassword: string) => {
    setIsLoading(true)
    setError("")
    setSuccess("")

    // Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    try {
      await signUpUser(name, email, password)
      setSuccess("Account created successfully! Signing you in...")

      // Auto sign in after successful signup
      setTimeout(async () => {
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        })

        if (result?.error) {
          setError("Account created but failed to sign in. Please try signing in manually.")
        } else {
          router.push("/dashboard")
          router.refresh()
        }
      }, 1500)
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during sign-up.")
      console.error("Sign-up error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return { handleSignUp, isLoading, error, success, setError, setSuccess }
}