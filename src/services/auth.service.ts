export const signUpUser = async (name: string, email: string, password: string) => {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || "Failed to create account")
  }

  return data
}