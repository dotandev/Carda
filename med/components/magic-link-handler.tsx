"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

export function MagicLinkHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()

  useEffect(() => {
    const token = searchParams.get("token")

    if (token) {
      try {
        // Decode the JWT token to get user info
        const payload = JSON.parse(atob(token.split(".")[1]))
        const { walletAddress, role, email, id } = payload

        // Create user object
        const userData = {
          _id: id,
          walletAddress,
          role,
          email,
        }

        // Log the user in
        login(token, userData)

        // Redirect to appropriate dashboard
        router.push(`/dashboard/${role}`)
      } catch (error) {
        console.error("Invalid magic link token:", error)
        router.push("/auth/patient?error=invalid_token")
      }
    }
  }, [searchParams, login, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Verifying your magic link...</p>
      </div>
    </div>
  )
}
