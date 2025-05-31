"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { getAuthToken, getUserData, setAuthToken, setUserData, removeAuthToken, removeUserData } from "@/lib/api"

interface AuthContextType {
  user: any | null
  token: string | null
  login: (token: string, userData: any) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing auth on mount
    const existingToken = getAuthToken()
    const existingUser = getUserData()

    if (existingToken && existingUser) {
      setToken(existingToken)
      setUser(existingUser)
    }

    setIsLoading(false)
  }, [])

  const login = (newToken: string, userData: any) => {
    setToken(newToken)
    setUser(userData)
    setAuthToken(newToken)
    setUserData(userData)
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    removeAuthToken()
    removeUserData()
  }

  return <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
